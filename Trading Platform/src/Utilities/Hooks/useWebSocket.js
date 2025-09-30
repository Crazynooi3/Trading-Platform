import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const useInitialWebSocket = (marketId) => {
  const WS_URL = "wss://stream.ompfinex.com/stream";

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendMessage(JSON.stringify({ connect: { name: "js" }, id: 1 }));
      //   console.log("WebSocket connected and initial connect message sent");
    },
    onClose: (event) => {
      console.log("WebSocket closed:", event);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
    // shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (
      lastJsonMessage &&
      typeof lastJsonMessage === "object" &&
      Object.keys(lastJsonMessage).length === 0
    ) {
      // فقط وقتی کل پیام دقیقا {} باشه جواب بده
      sendJsonMessage({});
      // console.log("Send {}");

      return;
    }
    // console.log(lastJsonMessage);
  }, [lastJsonMessage, sendJsonMessage]);

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
  };
};

export default useInitialWebSocket;
