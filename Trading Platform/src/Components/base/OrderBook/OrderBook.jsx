import React, { useState, useEffect, useRef, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GetMarketOrders } from "../../../Utilities/API/GetMarketOrders";
import { useAggregation } from "../../../Utilities/Context/AggregationContext";

// فانکشن helper برای محاسبه حجم کل
const calculateTotalVolume = (price, volume) => (price / 10) * volume;

// فانکشن جدید برای تجمیع سفارش‌ها بر اساس step
const aggregateOrders = (orders, step, isAsk = true) => {
  if (step <= 1) return orders; // بدون تجمیع اگر step=1 یا کمتر

  const aggregatedMap = new Map(); // برای جمع کردن حجم‌ها بر اساس قیمت رندشده

  orders.forEach((order) => {
    const originalPrice = order[0];
    const volume = parseFloat(order[1]);
    // رند قیمت به پایین (floor) به مضرب step
    const aggregatedPrice = Math.floor(originalPrice / step) * step;

    if (aggregatedMap.has(aggregatedPrice)) {
      const existing = aggregatedMap.get(aggregatedPrice);
      aggregatedMap.set(aggregatedPrice, [
        aggregatedPrice,
        parseFloat(existing[1] + volume).toFixed(2),
      ]);
    } else {
      aggregatedMap.set(aggregatedPrice, [aggregatedPrice, volume]);
    }
  });

  // تبدیل Map به آرایه و مرتب‌سازی
  const aggregatedList = Array.from(aggregatedMap.values());
  aggregatedList.sort((a, b) => a[0] - b[0]);
  console.log(aggregatedList);

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

  // Fix scroll side in sell list
  const sellListRef = useRef(null);
  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, [askOrders, steper]);

  // GetMarketOrder
  async function fetchOrders() {
    try {
      const url = "https://api.ompfinex.com/v1/market/9/depth?limit=200";
      const orders = await GetMarketOrders(url);
      setMarketOrders(orders);
      setBidOrders(orders.data.bids.slice(0, 20));
      setAskOrders(orders.data.asks.slice(0, 20));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  // WebSocket setup
  const socketUrl =
    "wss://stream.ompfinex.com/stream?origin=https://my.ompfinex.com";
  const [messageHistory, setMessageHistory] = useState([]);
  const [publicMarketPrice, setPublicMarketPrice] = useState({});
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
    fetchOrders();
    setTimeout(() => {
      sendMessage(
        JSON.stringify({
          subscribe: {
            channel: "public-market:r-depth-9",
          },
          id: 2,
        }),
      );
    }, 5000);
  }, []);

  // Log incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        if (lastMessage.data === "{}") {
          sendMessage("{}");
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
                    className="bg-danger-danger4 absolute right-0 -z-10 h-[calc(100%-2px)]"
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
                    className="bg-success-success4 absolute right-0 -z-10 h-[calc(100%-2px)]"
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
