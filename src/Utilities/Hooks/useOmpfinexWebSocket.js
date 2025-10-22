// hooks/useOmpfinexWebSocket.js
import { useRef, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";

const useOmpfinexWebSocket = () => {
  const WS_URL = "wss://stream.ompfinex.com/stream";
  const currentID = useRef(1); // start from 1
  const oldSymbolID = useRef(null);
  const subscribedChannels = useRef(new Set()); // track unique channels: e.g., "public-market:r-depth-9"

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(WS_URL, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    heartbeat: true, // Library handles ping/pong automatic (default: ping every 30s, timeout 60s)
    filter: useCallback((message) => {
      // Optional: filter out non-JSON or pings to avoid unwanted lastJsonMessage updates
      try {
        JSON.parse(message.data);
        return true;
      } catch {
        return false; // Skip invalid, prevent {} default
      }
    }, []),
    onOpen: () => {
      // console.log("WebSocket opened");
      currentID.current = 1;
      subscribedChannels.current.clear(); // Reset on reconnect
      sendJsonMessage({ connect: { name: "js" }, id: currentID.current });
      currentID.current += 1;

      const priceChannel = "public-market:r-price-ag";
      if (!subscribedChannels.current.has(priceChannel)) {
        sendJsonMessage({
          subscribe: { channel: priceChannel },
          id: currentID.current,
        });
        subscribedChannels.current.add(priceChannel);
        currentID.current += 1;
      }
    },
    onClose: (event) => console.log("WebSocket closed:", event),
    onError: (error) => console.error("WebSocket error:", error),
  });

  const heartbeatRef = useRef(false);
  useEffect(() => {
    if (
      lastJsonMessage &&
      Object.keys(lastJsonMessage).length === 0 &&
      !heartbeatRef.current
    ) {
      heartbeatRef.current = true;
      sendJsonMessage({});
      setTimeout(() => {
        heartbeatRef.current = false;
      }, 100);
    }
  }, [lastJsonMessage, sendJsonMessage]);

  // Sub/Unsub functions with uniqueness
  const subWebSocket = useCallback(
    (channelID) => {
      const depthChannel = `public-market:r-depth-${channelID}`;
      if (subscribedChannels.current.has(depthChannel)) {
        // console.log(`Already subscribed to ${depthChannel}, skipping`);
        return;
      }

      // Unsub old if different
      if (oldSymbolID.current && oldSymbolID.current !== channelID) {
        const oldChannel = `public-market:r-depth-${oldSymbolID.current}`;
        if (subscribedChannels.current.has(oldChannel)) {
          currentID.current += 1;
          sendJsonMessage({
            unsubscribe: { channel: oldChannel },
            id: currentID.current,
          });
          subscribedChannels.current.delete(oldChannel);
          // console.log(`Unsubscribed from ${oldChannel}`);
        }
      }

      // Sub new (no timeout needed, sync ok unless API requires)
      setTimeout(() => {
        // Keep if API needs delay, but reduce to 100ms
        if (readyState === 1 /* WebSocket.OPEN */) {
          // Use number for readyState
          currentID.current += 1;
          sendJsonMessage({
            subscribe: { channel: depthChannel },
            id: currentID.current,
          });
          subscribedChannels.current.add(depthChannel);
          oldSymbolID.current = channelID;
          // console.log(
          //   `Subscribed to ${depthChannel} with id ${currentID.current - 1}`,
          // );
        }
      }, 100);
    },
    [readyState, sendJsonMessage],
  );

  const unSubWebSocket = useCallback(
    (channelID) => {
      const depthChannel = `public-market:r-depth-${channelID}`;
      if (subscribedChannels.current.has(depthChannel) && readyState === 1) {
        currentID.current += 1;
        sendJsonMessage({
          unsubscribe: { channel: depthChannel },
          id: currentID.current,
        });
        subscribedChannels.current.delete(depthChannel);
        // console.log(`Unsubscribed from ${depthChannel}`);
      }
    },
    [readyState, sendJsonMessage],
  );

  // Cleanup on unmount: only if not reconnecting
  useEffect(() => {
    return () => {
      if (oldSymbolID.current && readyState === 1) {
        unSubWebSocket(oldSymbolID.current);
      }
      subscribedChannels.current.clear();
    };
  }, []); // Empty deps: only on unmount, not on readyState change

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    subWebSocket,
    unSubWebSocket,
  };
};

export default useOmpfinexWebSocket;
