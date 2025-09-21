import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GetMarketOrders } from "../../../Utilities/API/GetMarketOrders";

const calculateTotalVolume = (price, volume) => (price / 10) * volume;
export default function OrderBook() {
  // Stats
  const [marketOrders, setMarketOrders] = useState({});
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);

  // console.log(bidOrders);
  // console.log(askOrders);

  // Fix scroll side in sell list
  const sellListRef = useRef(null);
  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, [askOrders]);

  // GetMarketOrder
  async function fetchOrders() {
    try {
      const url = "https://api.ompfinex.com/v1/market/9/depth?limit=200";
      const orders = await GetMarketOrders(url);
      setMarketOrders(orders);
      setBidOrders(orders.data.bids);
      setAskOrders(orders.data.asks);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  const maxTotalVolumeAsk = useMemo(() => {
    if (!askOrders || askOrders.length === 0) return 0;
    const totals = askOrders.map((order) =>
      calculateTotalVolume(order[0], order[1]),
    );
    return Math.max(...totals);
  }, [askOrders]);

  const maxTotalVolumeBid = useMemo(() => {
    if (!bidOrders || bidOrders.length === 0) return 0;
    const totals = bidOrders.map((order) =>
      calculateTotalVolume(order[0], order[1]),
    );
    return Math.max(...totals);
  }, [bidOrders]);

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
        // Assuming the message is in JSON format
        const messageData = JSON.parse(lastMessage.data);
        // console.log("Received WebSocket message:", messageData);
        if (messageData.push) {
          let MarketPrice = messageData.push.pub.data.data;
          setPublicMarketPrice(MarketPrice);
          console.log(publicMarketPrice);
        }
        setMessageHistory((prev) => prev.concat(lastMessage));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        console.log("Raw message:", lastMessage.data);
      }
    }
  }, [lastMessage]);

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
            ref={sellListRef}
            className="hide-scrollbar flex h-full w-full flex-col-reverse justify-start overflow-y-scroll text-nowrap"
          >
            {askOrders.map((askOrder, index) => {
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
                  className="relative flex h-5 w-full items-center justify-between px-4"
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
          <ul className="hide-scrollbar flex h-full w-full flex-col justify-start overflow-y-scroll text-nowrap">
            {bidOrders.map((bidOrder, index) => {
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
                  key={index}
                  className="relative flex h-5 w-full items-center justify-between px-4"
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
