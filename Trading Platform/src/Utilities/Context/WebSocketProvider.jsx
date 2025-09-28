import { createContext, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
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
      sendMessage(
        JSON.stringify({
          subscribe: {
            channel: "public-market:r-depth-9",
          },
          id: 2,
        }),
      );
    },
    onError: (error) => console.error("WebSocket error:", error),
  });

  useEffect(() => {
    if (lastMessage?.data === "{}") {
      sendMessage("{}");
    }
  }, [lastMessage]);

  return (
    <WebSocketContext.Provider value={{ lastMessage, sendMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketData() {
  return useContext(WebSocketContext);
}
