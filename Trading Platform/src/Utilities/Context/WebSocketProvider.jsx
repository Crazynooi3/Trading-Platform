import { createContext, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [orderBookDepth, setOrderBookDepth] = useState({});
  const socketUrl = "wss://stream.ompfinex.com/stream";
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendMessage(
        JSON.stringify({
          connect: {
            name: "js",
          },
          id: 1,
        }),
      );
    },
    onError: (error) => console.error("WebSocket error:", error),
  });

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        subscribe: {
          channel: "public-market:r-depth-9",
        },
        id: 2,
      }),
    );
  }, []);
  useEffect(() => {
    if (lastMessage.data === "{}") {
      sendMessage("{}");
    } else {
      setOrderBookDepth(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  return (
    <WebSocketContext.Provider value={{ orderBookDepth }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketData() {
  return useContext(WebSocketContext);
}
