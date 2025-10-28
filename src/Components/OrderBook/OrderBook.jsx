import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as Func from "../../Utilities/Funections";
import { useAggregation } from "../../Utilities/Context/AggregationContext";
import { useVolume } from "../../Utilities/Context/VolumeContext";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import usePrevious from "./../../Utilities/Hooks/usePrevious.js";
import { useUserOrderPolling } from "../../Utilities/Hooks/useUserOrder.js";

const calculateTotalVolume = (price, volume) => (price / 10) * volume;

const aggregateOrders = (orders, step, isAsk = true, quote) => {
  if (step <= 1) {
    const sortedOrders = [...orders].sort((a, b) =>
      isAsk ? a[0] - b[0] : b[0] - a[0],
    );
    return sortedOrders.slice(0, 20);
  }

  const aggregatedMap = new Map();
  const multiplier = quote === "USDT" ? 1 : 10; // شرط اصلی: multiplier برای تبدیل

  let maxPriceRial = -Infinity;
  let minPriceRial = Infinity;
  orders.forEach((order) => {
    const price = order[0];
    if (price > maxPriceRial) maxPriceRial = price;
    if (price < minPriceRial) minPriceRial = price;
  });

  orders.forEach((order) => {
    const originalPriceRial = order[0];
    const volume = parseFloat(order[1]);

    const originalPriceTomani = originalPriceRial / multiplier; // شرطی: برای USDT /1

    let aggregatedPriceTomani;
    if (isAsk) {
      aggregatedPriceTomani = Math.ceil(originalPriceTomani / step) * step;
      const maxAllowedTomani =
        Math.ceil(maxPriceRial / multiplier / step) * step; // شرطی /multiplier
      if (aggregatedPriceTomani > maxAllowedTomani) {
        aggregatedPriceTomani =
          Math.floor(maxPriceRial / multiplier / step) * step;
      }
    } else {
      aggregatedPriceTomani = Math.floor(originalPriceTomani / step) * step;
      const minAllowedTomani =
        Math.floor(minPriceRial / multiplier / step) * step; // شرطی /multiplier
      if (aggregatedPriceTomani < minAllowedTomani) {
        aggregatedPriceTomani =
          Math.ceil(minPriceRial / multiplier / step) * step;
      }
    }

    const aggregatedPriceRial = aggregatedPriceTomani * multiplier; // شرطی *multiplier: برای USDT *1

    if (aggregatedMap.has(aggregatedPriceRial)) {
      const existingVolume = aggregatedMap.get(aggregatedPriceRial);
      aggregatedMap.set(aggregatedPriceRial, existingVolume + volume);
    } else {
      aggregatedMap.set(aggregatedPriceRial, volume);
    }
  });

  let aggregatedList = Array.from(aggregatedMap.entries()).map(
    ([price, volume]) => [price, volume],
  );

  aggregatedList.sort((a, b) => (isAsk ? a[0] - b[0] : b[0] - a[0]));
  aggregatedList = aggregatedList.slice(0, 20);

  return aggregatedList;
};

export default function OrderBook() {
  // States
  const marketDataSelector = useSelector((state) => state.marketsDatas);
  const marketOrderSelector = useSelector((state) => state.marketOrderbook);
  const { symbolID, precision } = useSelector(
    (state) => state.symbolIDPrecision,
  );
  const { rDepth, rPriceAg, currentSymbol } = useSelector(
    (state) => state.webSocketMessage,
  );
  const userTokenSelector = useSelector((state) => state.userToken);
  const dispatch = useDispatch();
  const {
    data: pendingOrder,
    isLoading,
    error,
    refetch,
  } = useUserOrderPolling(userTokenSelector.token, "PENDING");
  // console.log(pendingOrder);

  // -------------------------------------
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const { steper } = useAggregation();
  const [lastPrice, setLastPrice] = useState(0);
  const prevLastPrice = usePrevious(lastPrice);
  const [USDTPrice, setUSDPTrice] = useState(0);
  const [hoveredIndexAsk, setHoveredIndexAsk] = useState(null);
  const [hoveredIndexBid, setHoveredIndexBid] = useState(null);
  const [cumulativeStatsAsk, setCumulativeStatsAsk] = useState({
    sum: 0,
    avgPrice: 0,
    estimatedMargin: 0,
  });
  const [cumulativeStatsBid, setCumulativeStatsBid] = useState({
    sum: 0,
    avgPrice: 0,
    estimatedMargin: 0,
  });
  const { setTotalVolumes } = useVolume();
  const { base, quote } = useParams();
  const prevSymbolID = usePrevious();

  // Updater order with WebSocket (merge updates with current orders)
  const updateOrderbook = useCallback(
    (currentOrders, updates, isAsk = true) => {
      const orderMap = new Map();
      currentOrders.forEach((order) => {
        const price = parseFloat(order[0]);
        const volume = parseFloat(order[1]);
        if (volume <= 0) return;
        if (!isNaN(price) && !isNaN(volume)) {
          orderMap.set(price, volume);
        }
      });

      updates.forEach((update) => {
        const price = parseFloat(update[0]);
        const volume = parseFloat(update[1]);
        if (!isNaN(price) && !isNaN(volume)) {
          if (volume === 0) {
            orderMap.delete(price);
          } else {
            orderMap.set(price, volume);
          }
        }
      });

      let sortedOrders = Array.from(orderMap.entries()).sort((a, b) => {
        return isAsk ? a[0] - b[0] : b[0] - a[0];
      });

      return sortedOrders.map(([price, volume]) => [
        price.toString(),
        volume.toFixed(precision || 2), // string output
      ]);
    },
    [precision],
  );

  const calculateCumulativeStats = useCallback(
    (orders, startIndex, usdtPrice = 0) => {
      if (!orders || orders.length === 0 || startIndex < 0) {
        return { sum: 0, avgPrice: 0, estimatedMargin: 0 };
      }

      let sumVolume = 0;
      let sumPriceVolume = 0; // برای VWAP
      let sumValueTomans = 0; // total value = sum(priceTomans * volume) برای margin

      for (let i = 0; i <= startIndex; i++) {
        const priceRial = parseFloat(orders[i][0]);
        const volume = parseFloat(orders[i][1]);
        if (volume <= 0 || isNaN(priceRial) || isNaN(volume)) continue;

        const priceTomans = priceRial / 10; // normalize به تومان
        sumVolume += volume;
        sumPriceVolume += priceTomans * volume;
        sumValueTomans += priceTomans * volume; // جمع totalVolume هر اردر (priceTomans * volume)
      }

      const avgPriceTomans = sumVolume > 0 ? sumPriceVolume / sumVolume : 0;
      const avgPrice = parseFloat(avgPriceTomans.toFixed(precision || 5));

      const estimatedMargin = parseFloat(
        sumValueTomans.toFixed(precision || 5),
      ); // fix: جمع کل totalVolume ها (sumValueTomans)

      return {
        sum: sumVolume,
        avgPrice,
        estimatedMargin,
      };
    },
    [precision], // dependency روی precision (usdtPrice استفاده نمی‌شه)
  );

  useEffect(() => {
    if (rPriceAg && rPriceAg.length > 0 && symbolID) {
      const lastPriceData = rPriceAg.filter((data) => data.m === symbolID);
      if (lastPriceData.length > 0) {
        setLastPrice(Number(lastPriceData[0].price));
      }
    }
    document.title = `${base} / ${quote} | ${Number(
      lastPrice / 10,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, [rPriceAg, symbolID]);
  // Initial load from API
  useEffect(() => {
    if (
      marketOrderSelector &&
      marketOrderSelector.ask &&
      marketOrderSelector.bid
    ) {
      setAskOrders(marketOrderSelector.ask);
      setBidOrders(marketOrderSelector.bid);
    }
  }, [marketOrderSelector]);

  // Incremental updates from WebSocket rDepth
  useEffect(() => {
    if (!rDepth || !rDepth.a || !rDepth.b) return;
    const filteredAUpdate = rDepth.a.filter(([_, qty]) => parseFloat(qty) > 0);
    const filteredBUpdate = rDepth.b.filter(([_, qty]) => parseFloat(qty) > 0);
    setAskOrders((prevAskOrders) => {
      if (prevAskOrders.length === 0) return prevAskOrders; // fix: prevAskOrders نه prevAskOrders
      return updateOrderbook(prevAskOrders, filteredAUpdate, true);
    });

    setBidOrders((prevBidOrders) => {
      if (prevBidOrders.length === 0) return prevBidOrders;
      return updateOrderbook(prevBidOrders, filteredBUpdate, false);
    });
  }, [rDepth, updateOrderbook]);

  useEffect(() => {
    setLastPrice(Func.findLastPrice(marketDataSelector.data, symbolID));
    setUSDPTrice(Func.findUSDTPrice(marketDataSelector.data, base));
    if (prevSymbolID && prevSymbolID !== symbolID) {
      setBidOrders([]);
      setAskOrders([]);
    }
  }, [symbolID]);

  useEffect(() => {
    if (rPriceAg && rPriceAg.length > 0 && symbolID) {
      const lastPriceData = rPriceAg.filter((data) => data.m === symbolID);
      if (lastPriceData.length > 0) {
        setLastPrice(Number(lastPriceData[0].price));
      }
    }
  }, [rPriceAg, symbolID]);

  // Fix scroll side in sell list
  const sellListRef = useRef(null);
  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, [steper]);

  const askOrdersAggregated = useMemo(() => {
    if (!askOrders || askOrders.length === 0) return [];
    return aggregateOrders(askOrders, steper, true, quote);
  }, [askOrders, steper]);

  const bidOrdersAggregated = useMemo(() => {
    if (!bidOrders || bidOrders.length === 0) return [];
    return aggregateOrders(bidOrders, steper, false, quote);
  }, [bidOrders, steper]);

  const maxTotalVolumeAsk = useMemo(() => {
    if (askOrdersAggregated?.length === 0) return 0;
    const totals = askOrdersAggregated.map((order) =>
      calculateTotalVolume(order[0], order[1]),
    );
    return Math.max(...totals);
  }, [askOrdersAggregated]);

  const maxTotalVolumeBid = useMemo(() => {
    if (bidOrdersAggregated.length === 0) return 0;
    const totals = bidOrdersAggregated.map(
      (
        order, // fix: bidOrdersAggregated نه bidOrdersAggregated
      ) => calculateTotalVolume(order[0], order[1]),
    );
    return Math.max(...totals);
  }, [bidOrdersAggregated]);

  const totalVolumeAsk = useMemo(() => {
    return askOrdersAggregated.reduce(
      (sum, order) => sum + parseFloat(order[1]),
      0,
    );
  }, [askOrdersAggregated]);

  const totalVolumeBid = useMemo(() => {
    return bidOrdersAggregated.reduce(
      (sum, order) => sum + parseFloat(order[1]),
      0,
    );
  }, [bidOrdersAggregated]);

  useEffect(() => {
    setTotalVolumes({ ask: totalVolumeAsk, bid: totalVolumeBid });
  }, [totalVolumeAsk, totalVolumeBid, setTotalVolumes]);

  // Helper برای پیدا کردن indices سطوح ask که pending sell orders در اون‌ها قرار می‌گیرن
  const getPendingOrderIndicesAsk = () => {
    const indices = new Set();
    let orders = [];
    if (pendingOrder) {
      if (Array.isArray(pendingOrder)) {
        orders = pendingOrder;
      } else if (Array.isArray(pendingOrder.data)) {
        orders = pendingOrder.data; // اگر nested
      }
    }
    if (!orders.length || isLoading || !askOrdersAggregated.length) {
      return indices;
    }

    // فقط sell pending matching symbol
    const relevantOrders = orders.filter(
      (order) =>
        order.type === "sell" &&
        order.status === "PENDING" &&
        order.market?.id === symbolID,
    );

    relevantOrders.forEach((order) => {
      const pendingPrice = parseFloat(order.price);
      if (isNaN(pendingPrice)) return;

      // فیکس جدید: پیدا کردن بزرگ‌ترین ask price <= pendingPrice (نزدیک‌ترین پایین‌تر یا مساوی)
      let matchedIndex = -1;
      let maxAskBelow = -Infinity; // برای track max <= P
      for (let i = 0; i < askOrdersAggregated.length; i++) {
        const askPrice = askOrdersAggregated[i][0]; // price raw
        if (askPrice <= pendingPrice && askPrice > maxAskBelow) {
          maxAskBelow = askPrice;
          matchedIndex = i;
        }
      }

      // فقط اگر match پیدا شد (در محدوده <= P)، index رو اضافه کن
      if (matchedIndex >= 0) {
        indices.add(matchedIndex);
        // دیباگ: console.log(`Matched pending ${pendingPrice} to ask index ${matchedIndex} (price: ${askOrdersAggregated[matchedIndex][0]})`);
      } else {
        // دیباگ: console.log(`Pending ${pendingPrice} out of ask range (no ask <= ${pendingPrice}, min ask: ${askOrdersAggregated[0]?.[0]}) – no dot`);
      }
    });

    return indices;
  };

  // Helper برای پیدا کردن indices سطوح bid که pending buy orders در اون‌ها قرار می‌گیرن
  const getPendingOrderIndicesBid = () => {
    const indices = new Set();
    let orders = [];
    if (pendingOrder) {
      if (Array.isArray(pendingOrder)) {
        orders = pendingOrder;
      } else if (Array.isArray(pendingOrder.data)) {
        orders = pendingOrder.data; // اگر nested
      }
    }
    if (!orders.length || isLoading || !bidOrdersAggregated.length) {
      return indices;
    }

    // فقط buy pending matching symbol
    const relevantOrders = orders.filter(
      (order) =>
        order.type === "buy" &&
        order.status === "PENDING" &&
        order.market?.id === symbolID,
    );

    relevantOrders.forEach((order) => {
      const pendingPrice = parseFloat(order.price);
      if (isNaN(pendingPrice)) return;

      // پیدا کردن بزرگ‌ترین bid price <= pendingPrice (نزدیک‌ترین پایین‌تر یا مساوی)
      let matchedIndex = -1;
      let maxBidBelow = -Infinity; // برای track max <= P
      for (let i = 0; i < bidOrdersAggregated.length; i++) {
        const bidPrice = bidOrdersAggregated[i][0]; // price raw
        if (bidPrice <= pendingPrice && bidPrice > maxBidBelow) {
          maxBidBelow = bidPrice;
          matchedIndex = i;
        }
      }

      // فقط اگر match پیدا شد (در محدوده <= P)، index رو اضافه کن
      if (matchedIndex >= 0) {
        indices.add(matchedIndex);
        // دیباگ: console.log(`Matched pending buy ${pendingPrice} to bid index ${matchedIndex} (price: ${bidOrdersAggregated[matchedIndex][0]})`);
      } else {
        // دیباگ: console.log(`Pending buy ${pendingPrice} out of bid range (no bid <= ${pendingPrice}, max bid: ${bidOrdersAggregated[0]?.[0]}) – no dot`);
      }
    });

    return indices;
  };
  const pendingIndices = getPendingOrderIndicesAsk();
  const pendingIndicesBid = getPendingOrderIndicesBid();
  return (
    <>
      <div className="mt-1 h-[calc(100%-9.2rem)]">
        {/* Sell part (Ask) */}
        <div className="relative h-[calc(50%-1.25rem)]">
          {/* Tooltip for Ask */}
          {hoveredIndexAsk !== null && (
            <div
              className="bg-fill-fill2 absolute bottom-0 -left-65 min-w-60 space-y-1 rounded-sm p-3 text-xs shadow-lg"
              style={{
                bottom: `${hoveredIndexAsk < 10 ? hoveredIndexAsk * 20 + 10 : 10 * 20 + 10}px`, // از top: 0 برای index 0، +10px برای center
                // transform: "translateY(-50%)", // vertical center
              }}>
              <div className="flex items-center justify-between gap-2 text-nowrap">
                <span>Average Price:</span>
                <span>
                  ≈{" "}
                  {cumulativeStatsAsk.avgPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Sum:</span>
                <span>
                  {cumulativeStatsAsk.sum.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}{" "}
                  {base}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Estimated margin:</span>
                <span>
                  {cumulativeStatsAsk.estimatedMargin.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}{" "}
                  {quote}
                </span>
              </div>
            </div>
          )}
          <ul
            onMouseLeave={() => {
              setHoveredIndexAsk(null);
              setCumulativeStatsAsk({
                sum: 0,
                avgPrice: 0,
                estimatedMargin: 0,
              });
            }}
            ref={sellListRef}
            className="hide-scrollbar relative flex h-full w-full flex-col-reverse justify-start overflow-y-scroll text-nowrap">
            {/* Highlight for Ask */}
            {hoveredIndexAsk !== null && (
              <div
                className="bg-fill-fill1 absolute bottom-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexAsk + 1) * 20}px`,
                }}
              />
            )}
            {askOrdersAggregated.map((askOrder, index) => {
              const totalVolume = calculateTotalVolume(
                askOrder[0],
                askOrder[1],
              );
              const percentage =
                maxTotalVolumeAsk > 0
                  ? (totalVolume / maxTotalVolumeAsk) * 100
                  : 0;
              const showUserOrderDot = pendingIndices.has(index);
              return (
                <li
                  key={index}
                  className="border-fill-fill3 relative flex max-h-5 w-full cursor-pointer items-center justify-between border-dashed px-4 hover:border-t"
                  onMouseEnter={() => {
                    setHoveredIndexAsk(index);
                    const stats = calculateCumulativeStats(
                      askOrdersAggregated,
                      index,
                      USDTPrice,
                    );
                    setCumulativeStatsAsk(stats);
                  }}>
                  <span className="text-danger-danger1 w-full text-start text-xs font-medium">
                    {(askOrder[0] / 10).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: precision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {askOrder[1].toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: precision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {totalVolume.toLocaleString("en-US")}
                  </span>
                  <span
                    className="bg-danger-danger4 absolute right-0 -z-10 h-[calc(100%-2px)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}></span>
                  {showUserOrderDot && (
                    <span className="absolute left-1 h-1 w-1 rounded-full bg-amber-400"></span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {/* LastPrice */}
        <div className="flex h-10 w-full items-center px-4">
          <span
            id="lastPrice"
            className={` ${prevLastPrice >= lastPrice ? "text-danger-danger1" : "text-success-success1"} mr-2 text-lg`}>
            {Number(lastPrice / 10).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: precision,
            })}
          </span>
          <span className="text-text-text4 text-sm underline underline-offset-4">
            {USDTPrice > 0 &&
              Number(USDTPrice).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: precision,
              })}
          </span>
        </div>
        {/* Buy part (Bid) */}
        <div className="relative h-[calc(50%-1.25rem)]">
          {/* Tooltip for Bid */}
          {hoveredIndexBid !== null && (
            <div
              className="bg-fill-fill2 absolute -left-65 min-w-60 space-y-1 rounded-sm p-3 text-xs shadow-lg"
              style={{
                top: `${hoveredIndexBid < 10 ? hoveredIndexBid * 20 + 10 : 10 * 20 + 10}px`, // از top: 0 برای index 0، +10px برای center
                transform: "translateY(-50%)", // vertical center
              }}>
              <div className="flex items-center justify-between gap-2 text-nowrap">
                <span>Average Price:</span>
                <span>
                  ≈{" "}
                  {cumulativeStatsBid.avgPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Sum:</span>
                <span>
                  {cumulativeStatsBid.sum.toLocaleString("en-US", {
                    // fix: Bid
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}{" "}
                  {base}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Estimated margin:</span>
                <span>
                  {cumulativeStatsBid.estimatedMargin.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: precision,
                  })}{" "}
                  {quote}
                </span>
              </div>
            </div>
          )}
          <ul
            onMouseLeave={() => {
              setHoveredIndexBid(null);
              setCumulativeStatsBid({
                sum: 0,
                avgPrice: 0,
                estimatedMargin: 0,
              });
            }}
            className="hide-scrollbar relative flex h-full w-full flex-col justify-start overflow-y-scroll text-nowrap">
            {/* Highlight for Bid */}
            {hoveredIndexBid !== null && (
              <div
                className="bg-fill-fill1 absolute top-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexBid + 1) * 20}px`,
                }}
              />
            )}
            {bidOrdersAggregated.map((bidOrder, index) => {
              const totalVolume = calculateTotalVolume(
                bidOrder[0],
                bidOrder[1],
              );
              const percentage =
                maxTotalVolumeBid > 0
                  ? (totalVolume / maxTotalVolumeBid) * 100
                  : 0;

              const showUserOrderDot = pendingIndicesBid.has(index);
              return (
                <li
                  onMouseEnter={() => {
                    setHoveredIndexBid(index);
                    const stats = calculateCumulativeStats(
                      bidOrdersAggregated,
                      index,
                      USDTPrice,
                    ); // fix: param اضافی false حذف
                    setCumulativeStatsBid(stats);
                  }}
                  key={index}
                  className="border-fill-fill3 relative flex max-h-5 w-full cursor-pointer items-center justify-between border-dashed px-4 hover:border-b">
                  <span className="text-success-success1 w-full text-start text-xs font-medium">
                    {(bidOrder[0] / 10).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: precision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {bidOrder[1].toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: precision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {totalVolume.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: precision,
                    })}
                  </span>
                  <span
                    className="bg-success-success4 absolute right-0 -z-10 h-[calc(100%-2px)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}></span>
                  {showUserOrderDot && (
                    <span className="absolute left-1 h-1 w-1 rounded-full bg-amber-400"></span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none; /* برای IE و Edge */
            scrollbar-width: none; /* برای فایرفاکس */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* برای کروم، سافاری و سایر مرورگرهای Webkit */
          }
        `}</style>
      </div>
    </>
  );
}
