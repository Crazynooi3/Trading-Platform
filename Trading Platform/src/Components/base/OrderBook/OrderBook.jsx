import { useState, useEffect, useRef, useMemo } from "react";
import { useAggregation } from "../../../Utilities/Context/AggregationContext";
import { useVolume } from "../../../Utilities/Context/VolumeContext";
import { useOrderBook } from "../../../Utilities/Hooks/useOrderBook";
// import { useWebSocketData } from "../../../Utilities/Context/WebSocketProvider";
import { useMarkets } from "../../../Utilities/Hooks/useMarket";
import { useParams } from "react-router-dom";
import useInitialWebSocket from "../../../Utilities/Hooks/useWebSocket";

// فانکشن helper برای محاسبه حجم کل
const calculateTotalVolume = (price, volume) => (price / 10) * volume;

// فانکشن جدید برای تجمیع سفارش‌ها بر اساس step
const aggregateOrders = (orders, step, isAsk = true) => {
  if (step <= 1) {
    // سورت بر اساس isAsk، بدون تغییر قیمت
    const sortedOrders = [...orders].sort((a, b) =>
      isAsk ? a[0] - b[0] : b[0] - a[0],
    );
    return sortedOrders.slice(0, 20);
  }

  const aggregatedMap = new Map();

  // پیدا کردن max/min قیمت (به ریال)
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

    // منطق رندینگ روی تومان
    let aggregatedPriceTomani;
    if (isAsk) {
      aggregatedPriceTomani = Math.ceil(originalPriceTomani / step) * step;
      // محدود کردن به سرخط (روی تومان)
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
    ([price, volume]) => [
      price,
      volume,
      // .toFixed(perecision)
    ],
  );

  // سورتینگ بر اساس isAsk
  aggregatedList.sort((a, b) => (isAsk ? a[0] - b[0] : b[0] - a[0]));

  // حداکثر 20 آیتم
  aggregatedList = aggregatedList.slice(0, 20);

  // دیباگ: چاپ خروجی نهایی
  // console.log("Aggregated output (rial):", aggregatedList);

  return aggregatedList;
};

export default function OrderBook() {
  // States
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const { steper } = useAggregation();
  const [perecision, setPerecision] = useState(2);
  const [lastPrice, setLastPrice] = useState(0);
  const [USDTPrice, setUSDPTrice] = useState(0);
  const [hoveredIndexAsk, setHoveredIndexAsk] = useState(null);
  const [hoveredIndexBid, setHoveredIndexBid] = useState(null);
  const { setTotalVolumes } = useVolume();
  const { base, quote } = useParams();
  const [symbolID, setSymbolID] = useState();
  const {
    data: orderBookData,
    isLoading: isLoadingOrderBook,
    error: orderBookError,
  } = useOrderBook(symbolID, "2000");

  const { data: marketData } = useMarkets();
  const { readyState, lastMessage, sendMessage } =
    useInitialWebSocket(symbolID);

  // console.log(marketData);

  useEffect(() => {
    if (orderBookData) {
      setAskOrders(orderBookData.asks);
      setBidOrders(orderBookData.bids);
      findLastPrice();
      findUSDTPrice();
    }
  }, [orderBookData]);

  function unSubWebSocket(channelID, ID) {
    sendMessage(
      JSON.stringify({
        unsubscribe: {
          channel: `public-market:r-depth-${channelID}`,
        },
        id: ID,
      }),
    );
  }
  function subWebSocket(channelID, ID) {
    setTimeout(() => {
      sendMessage(
        JSON.stringify({
          subscribe: {
            channel: `public-market:r-depth-${channelID}`,
          },
          id: ID,
        }),
      );
    }, 1000);
  }

  const oldSymbolID = useRef(null);
  const currentID = useRef(2);

  useEffect(() => {
    return () => {
      if (oldSymbolID.current && readyState === WebSocket.OPEN) {
        unSubWebSocket(oldSymbolID.current, currentID.current + 1);
      }
    };
  }, [readyState]);

  useEffect(() => {
    if (symbolID && readyState === WebSocket.OPEN) {
      currentID.current += 1;

      if (oldSymbolID.current && oldSymbolID.current !== symbolID) {
        unSubWebSocket(oldSymbolID.current, currentID.current);
        currentID.current += 1;
      }

      subWebSocket(symbolID, currentID.current);
      // console.log("Subscribed to:", symbolID, "with ID:", currentID.current);
      oldSymbolID.current = symbolID;
    }
  }, [symbolID, readyState, sendMessage]);

  function irtToIrr(quote) {
    let quoteType = quote === "IRT" ? "IRR" : "USDT";
    return quoteType;
  }
  function findCurrencyID(base, quote) {
    if (marketData && base && quote) {
      const currency = marketData.find(
        (currency) =>
          currency.base_currency.id === base &&
          currency.quote_currency.id === irtToIrr(quote),
      );
      if (currency) {
        setSymbolID(currency.id);
        setPerecision(currency.quote_currency_precision);
      } else {
        console.error(`Currency not found for base: ${base}, quote: ${quote}`);
      }
    }
  }

  function findLastPrice() {
    const market = marketData.find((market) => market.id === symbolID);
    setLastPrice(market?.last_price || 0);
  }
  function findUSDTPrice() {
    const market = marketData.find(
      (market) =>
        market.base_currency.id === base && market.quote_currency.id === "USDT",
    );

    setUSDPTrice(base != "USDT" ? market?.last_price || 0 : "");
  }

  useEffect(() => {
    setBidOrders([]);
    setAskOrders([]);
    setAUpdate([]);
    setBUpdate([]);
    findCurrencyID(base, quote);
  }, [base, quote, marketData, perecision]);

  // Fix scroll side in sell list
  const sellListRef = useRef(null);
  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, [steper]);

  // WebSocket setup
  const [aUpdate, setAUpdate] = useState([]);
  const [bUpdate, setBUpdate] = useState([]);

  // Updater order with WebSocket
  const updateOrderbook = (currentOrders, updates, isAsk = true) => {
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
          orderMap.delete(price); // حذف اگر حجم 0 باشه
        } else {
          orderMap.set(price, volume); // اضافه یا آپدیت
        }
      }
    });

    // تبدیل Map به آرایه مرتب‌شده
    let sortedOrders = Array.from(orderMap.entries()).sort((a, b) => {
      return isAsk ? a[0] - b[0] : b[0] - a[0]; // asks: ascending, bids: descending
    });

    // خروجی نهایی: [price (string), volume (string با toFixed(2))]
    return sortedOrders.map(([price, volume]) => [
      price.toString(),
      volume,
      // .toFixed(perecision),
    ]);
  };

  // Log incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage?.data) return; // early return اگه data نباشه

    let parsed;
    try {
      parsed = JSON.parse(lastMessage.data); // حالا parsed داخل try
      const channel = parsed?.push?.channel;
      const marketId = channel ? channel.split("r-depth-")[1] : 0;
      if (channel === "public-market:r-price-ag") {
        let lastPriceWeb = parsed.push.pub.data.data.filter(
          (data) => data.m === symbolID,
        );
        setLastPrice(Number(lastPriceWeb[0].price));
      }

      if (Object.keys(parsed).length > 0 && parsed.push) {
        const filteredAUpdate = parsed.push.pub.data.a.filter(
          (update) => parseFloat(update[1]) > 0,
        );
        const filteredBUpdate = parsed.push.pub.data.b.filter(
          (update) => parseFloat(update[1]) > 0,
        );
        const channelName = parsed.push.channel;

        if (Number(marketId) === symbolID) {
          setAUpdate(filteredAUpdate);
          setBUpdate(filteredBUpdate);

          const newAskOrders = updateOrderbook(
            askOrders,
            filteredAUpdate,
            true,
          );
          setAskOrders(newAskOrders);

          const newBidOrders = updateOrderbook(
            bidOrders,
            filteredBUpdate,
            false,
          );
          setBidOrders(newBidOrders);
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      return;
    }
  }, [lastMessage]);

  const askOrdersAggregated = useMemo(() => {
    if (!askOrders || askOrders.length === 0) return [];
    return aggregateOrders(askOrders, steper, true);
  }, [askOrders, steper]);

  const bidOrdersAggregated = useMemo(() => {
    if (!bidOrders || bidOrders.length === 0) return [];
    return aggregateOrders(bidOrders, steper, false);
  }, [bidOrders, steper]);

  // محاسبه حداکثر حجم کل برای لیست تجمیعی
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
    // .toFixed(perecision);
  }, [askOrdersAggregated]);

  const totalVolumeBid = useMemo(() => {
    return bidOrdersAggregated.reduce(
      (sum, order) => sum + parseFloat(order[1]),
      0,
    );
    // .toFixed(perecision);
  }, [bidOrdersAggregated]);

  useEffect(() => {
    setTotalVolumes({ ask: totalVolumeAsk, bid: totalVolumeBid });
  }, [totalVolumeAsk, totalVolumeBid]);

  console.log(marketData);
  console.log(perecision);

  return (
    <>
      <div className="mt-1 h-[calc(100%-9.2rem)]">
        {/* Sell part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul
            onMouseLeave={() => setHoveredIndexAsk(null)}
            ref={sellListRef}
            className="hide-scrollbar relative flex h-full w-full flex-col-reverse justify-start overflow-y-scroll text-nowrap"
          >
            {hoveredIndexAsk !== null && (
              <span
                className="bg-fill-fill1 absolute bottom-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexAsk + 1) * 20}px`,
                }}
              ></span>
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
                  onMouseEnter={() => setHoveredIndexAsk(index)}
                >
                  <span className="text-danger-danger1 w-full text-start text-xs font-medium">
                    {(askOrder[0] / 10).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: perecision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {askOrder[1].toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: perecision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {totalVolume.toLocaleString("en-US")}
                  </span>
                  <span
                    className="bg-danger-danger4 absolute right-0 -z-10 h-[calc(100%-2px)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></span>
                </li>
              );
            })}
          </ul>
        </div>
        {/* LastPrice */}
        <div className="flex h-10 w-full items-center px-4">
          <span className="text-success-success1 mr-2 text-lg">
            {Number(lastPrice / 10).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: perecision,
            })}
          </span>
          <span className="text-text-text4 text-sm underline underline-offset-4">
            {Number(USDTPrice).toLocaleString("en-US")}
          </span>
        </div>
        {/* Buy part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul
            onMouseLeave={() => setHoveredIndexBid(null)}
            className="hide-scrollbar relative flex h-full w-full flex-col justify-start overflow-y-scroll text-nowrap"
          >
            {hoveredIndexBid !== null && (
              <span
                className="bg-fill-fill1 absolute top-0 left-0 -z-20 w-full"
                style={{
                  height: `${(hoveredIndexBid + 1) * 20}px`,
                }}
              ></span>
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
                  className="border-fill-fill3 relative flex max-h-5 w-full cursor-pointer items-center justify-between border-dashed px-4 hover:border-b"
                >
                  <span className="text-success-success1 w-full text-start text-xs font-medium">
                    {(bidOrder[0] / 10).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: perecision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {bidOrder[1].toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: perecision,
                    })}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {totalVolume.toLocaleString("en-US")}
                  </span>
                  <span
                    className="bg-success-success4 absolute right-0 -z-10 h-[calc(100%-2px)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></span>
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
