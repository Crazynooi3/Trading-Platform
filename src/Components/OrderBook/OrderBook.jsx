import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as Func from "../../Utilities/Funections";
import { useAggregation } from "../../Utilities/Context/AggregationContext";
import { useVolume } from "../../Utilities/Context/VolumeContext";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import usePrevious from "./../../Utilities/Hooks/usePrevious.js";

const calculateTotalVolume = (price, volume) => (price / 10) * volume;

const aggregateOrders = (orders, step, isAsk = true) => {
  if (step <= 1) {
    const sortedOrders = [...orders].sort((a, b) =>
      isAsk ? a[0] - b[0] : b[0] - a[0],
    );
    return sortedOrders.slice(0, 20);
  }

  const aggregatedMap = new Map();

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
    const originalPriceTomani = originalPriceRial / 10; // تبدیل به تومان

    let aggregatedPriceTomani;
    if (isAsk) {
      aggregatedPriceTomani = Math.ceil(originalPriceTomani / step) * step;
      const maxAllowedTomani = Math.ceil(maxPriceRial / 10 / step) * step;
      if (aggregatedPriceTomani > maxAllowedTomani) {
        aggregatedPriceTomani = Math.floor(maxPriceRial / 10 / step) * step;
      }
    } else {
      aggregatedPriceTomani = Math.floor(originalPriceTomani / step) * step;
      const minAllowedTomani = Math.floor(minPriceRial / 10 / step) * step;
      if (aggregatedPriceTomani < minAllowedTomani) {
        aggregatedPriceTomani = Math.ceil(minPriceRial / 10 / step) * step;
      }
    }

    const aggregatedPriceRial = aggregatedPriceTomani * 10; // برگرد به ریال

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

  // -------------------------------------
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const { steper } = useAggregation();
  const [lastPrice, setLastPrice] = useState(0);
  const prevLastPrice = usePrevious(lastPrice);
  const [USDTPrice, setUSDPTrice] = useState(0);
  const [hoveredIndexAsk, setHoveredIndexAsk] = useState(null);
  const [hoveredIndexBid, setHoveredIndexBid] = useState(null);
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
      if (prevAskOrders.length === 0) return prevAskOrders; // skip اگر initial هنوز load نشده
      return updateOrderbook(prevAskOrders, filteredAUpdate, true);
    });

    setBidOrders((prevBidOrders) => {
      if (prevBidOrders.length === 0) return prevBidOrders; // skip اگر initial هنوز load نشده
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
    return aggregateOrders(askOrders, steper, true);
  }, [askOrders, steper]);

  const bidOrdersAggregated = useMemo(() => {
    if (!bidOrders || bidOrders.length === 0) return [];
    return aggregateOrders(bidOrders, steper, false);
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
    const totals = bidOrdersAggregated.map((order) =>
      calculateTotalVolume(order[0], order[1]),
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
  }, [totalVolumeAsk, totalVolumeBid]);

  return (
    <>
      <div className="mt-1 h-[calc(100%-9.2rem)]">
        {/* Sell part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul
            onMouseLeave={() => setHoveredIndexAsk(null)}
            ref={sellListRef}
            className="hide-scrollbar relative flex h-full w-full flex-col-reverse justify-start overflow-y-scroll text-nowrap">
            {hoveredIndexAsk !== null && (
              <span
                className="bg-fill-fill1 absolute bottom-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexAsk + 1) * 20}px`,
                }}></span>
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

              return (
                <li
                  key={index}
                  className="border-fill-fill3 relative flex max-h-5 w-full cursor-pointer items-center justify-between border-dashed px-4 hover:border-t"
                  onMouseEnter={() => setHoveredIndexAsk(index)}>
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
                </li>
              );
            })}
          </ul>
        </div>
        {/* LastPrice */}
        <div className="flex h-10 w-full items-center px-4">
          <span
            className={` ${prevLastPrice >= lastPrice ? "text-danger-danger1" : "text-success-success1"} mr-2 text-lg`}>
            {Number(lastPrice / 10).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
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
        {/* Buy part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul
            onMouseLeave={() => setHoveredIndexBid(null)}
            className="hide-scrollbar relative flex h-full w-full flex-col justify-start overflow-y-scroll text-nowrap">
            {hoveredIndexBid !== null && (
              <span
                className="bg-fill-fill1 absolute top-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexBid + 1) * 20}px`,
                }}></span>
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

              return (
                <li
                  onMouseEnter={() => setHoveredIndexBid(index)}
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
