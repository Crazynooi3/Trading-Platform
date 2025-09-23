import React, { useState, useEffect, useRef, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GetMarketOrders } from "../../../Utilities/API/GetMarketOrders";
import { useAggregation } from "../../../Utilities/Context/AggregationContext";
import { useVolume } from "../../../Utilities/API/VolumeContext";

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

  // دیباگ: چاپ maxPrice و orders
  // console.log(
  //   "maxPrice (rial):",
  //   maxPriceRial,
  //   "minPrice (rial):",
  //   minPriceRial,
  //   "step (toman):",
  //   step,
  //   "isAsk:",
  //   isAsk,
  // );
  console.log("Input orders:", orders);

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
    ([price, volume]) => [price, volume.toFixed(2)],
  );

  // سورتینگ بر اساس isAsk
  aggregatedList.sort((a, b) => (isAsk ? a[0] - b[0] : b[0] - a[0]));

  // حداکثر 20 آیتم
  aggregatedList = aggregatedList.slice(0, 20);

  // دیباگ: چاپ خروجی نهایی
  console.log("Aggregated output (rial):", aggregatedList);

  return aggregatedList;
};

export default function OrderBook() {
  // States
  const [marketOrders, setMarketOrders] = useState({});
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const { steper } = useAggregation();
  const [hoveredIndexAsk, setHoveredIndexAsk] = useState(null);
  const [hoveredIndexBid, setHoveredIndexBid] = useState(null);
  const { setTotalVolumes } = useVolume();

  // Fix scroll side in sell list
  const sellListRef = useRef(null);
  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, [askOrders, steper]);

  // GetMarketOrder
  async function fetchOrders(limit) {
    try {
      const url = `https://api.ompfinex.com/v1/market/9/depth?limit=${limit}`;
      const orders = await GetMarketOrders(url);
      setMarketOrders(orders);
      setBidOrders(orders.data.bids);
      setAskOrders(orders.data.asks);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  // WebSocket setup
  const socketUrl = "wss://stream.ompfinex.com/stream";
  const [messageHistory, setMessageHistory] = useState([]);
  const [publicMarketPrice, setPublicMarketPrice] = useState({});
  const [lastMessageOrder, setLastMessageOrder] = useState();
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("WebSocket connection opened");
      sendMessage(
        JSON.stringify({
          connect: {
            name: "js",
          },
          id: 1,
        }),
      );
    },
    onClose: () => console.log("WebSocket connection closed"),
    onError: (error) => console.error("WebSocket error:", error),
  });

  useEffect(() => {
    fetchOrders("2000");
    sendMessage(
      JSON.stringify({
        subscribe: {
          channel: "public-market:r-depth-9",
        },
        id: 2,
      }),
    );
  }, []);

  // Updater order with WebSocket
  const updateOrderbook = (currentOrders, updates, isAsk = true) => {
    // currentOrders: array of [price (string/number), volume (string)]
    // updates: array of [price (string), volume (string)]
    // تبدیل currentOrders به Map برای جستجوی سریع: price (number) => volume (number)
    const orderMap = new Map();
    currentOrders.forEach((order) => {
      const price = parseFloat(order[0]);
      const volume = parseFloat(order[1]);
      if (!isNaN(price) && !isNaN(volume)) {
        orderMap.set(price, volume);
      }
    });

    // اعمال آپدیت‌ها
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
      volume.toFixed(2),
    ]);
  };

  // Log incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        if (lastMessage.data === "{}") {
          sendMessage("{}");
        } else {
          setLastMessageOrder(JSON.parse(lastMessage.data));
        }
        const messageData = JSON.parse(lastMessage.data);
        if (messageData.push) {
          let MarketPrice = messageData.push.pub.data.data;
          setPublicMarketPrice(MarketPrice);
          // console.log(publicMarketPrice);
        }
        setMessageHistory((prev) => prev.concat(lastMessage));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        console.log("Raw message:", lastMessage.data);
      }
    }

    if (lastMessageOrder) {
      console.log(lastMessageOrder);
      const data = lastMessageOrder.push?.pub?.data;
      if (data) {
        const aUpdates = data.a || []; // asks updates
        const bUpdates = data.b || []; // bids updates

        // آپدیت asks
        const newAskOrders = updateOrderbook(askOrders, aUpdates, true);
        setAskOrders(newAskOrders);

        // آپدیت bids
        const newBidOrders = updateOrderbook(bidOrders, bUpdates, false);
        setBidOrders(newBidOrders);
      }
    }
  }, [lastMessage]);

  const askOrdersAggregated = useMemo(
    () => aggregateOrders(askOrders, steper, true),
    [askOrders, steper],
  );
  const bidOrdersAggregated = useMemo(
    () => aggregateOrders(bidOrders, steper, false),
    [bidOrders, steper],
  );

  // محاسبه حداکثر حجم کل برای لیست تجمیعی
  const maxTotalVolumeAsk = useMemo(() => {
    if (askOrdersAggregated.length === 0) return 0;
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
    return askOrdersAggregated
      .reduce((sum, order) => sum + parseFloat(order[1]), 0)
      .toFixed(2);
  }, [askOrdersAggregated]);

  const totalVolumeBid = useMemo(() => {
    return bidOrdersAggregated
      .reduce((sum, order) => sum + parseFloat(order[1]), 0)
      .toFixed(2);
  }, [bidOrdersAggregated]);

  useEffect(() => {
    setTotalVolumes({ ask: totalVolumeAsk, bid: totalVolumeBid });
  }, [totalVolumeAsk, totalVolumeBid]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

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
                    {(askOrder[0] / 10).toLocaleString("en-US")}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {(askOrder[1] * 1).toLocaleString("en-US")}
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
          <span className="text-success-success1 mr-2 text-lg">2.2571</span>
          <span className="text-text-text4 text-sm underline">2.2571</span>
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
                    {(bidOrder[0] / 10).toLocaleString("en-US")}
                  </span>
                  <span className="w-full py-0.5 text-end text-xs">
                    {(bidOrder[1] * 1).toLocaleString("en-US")}
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
