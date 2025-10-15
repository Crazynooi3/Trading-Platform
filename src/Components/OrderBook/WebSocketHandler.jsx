import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useOmpfinexWebSocket from "../../Utilities/Hooks/useOmpfinexWebSocket";
import {
  updatePriceAg,
  addTrades,
  updateDepth,
  setSymbol,
} from "./../../ReduxConfig/entities/webSocket";

const WebSocketHandler = ({ symbolID }) => {
  const dispatch = useDispatch();
  const { lastJsonMessage, readyState, subWebSocket } = useOmpfinexWebSocket();
  const prevSymbolRef = useRef(null); // Track previous symbol to sub only on change

  // Sub only on symbol change or initial (not on every readyState)
  useEffect(() => {
    if (symbolID && readyState === 1) {
      // WebSocket.OPEN
      dispatch(setSymbol(symbolID));
      if (prevSymbolRef.current !== symbolID) {
        subWebSocket(symbolID);
        prevSymbolRef.current = symbolID;
      }
    }
  }, [symbolID, readyState, subWebSocket, dispatch]); // readyState kept for reconnect, but ref prevents multiple

  // Parse messages
  useEffect(() => {
    if (lastJsonMessage !== null) {
      let data;
      try {
        data =
          typeof lastJsonMessage === "string"
            ? JSON.parse(lastJsonMessage)
            : lastJsonMessage;
      } catch (error) {
        console.error("Parse error:", error);
        return;
      }

      // Handle confirm/error (از لاگ‌ها)
      if (data.id && (data.subscribe || data.unsubscribe || data.error)) {
        if (data.error) {
          console.warn("Subscription error:", data.error);
        } else {
        }
        return;
      }

      // Handle push messages
      if (data.push && data.push.pub && data.push.channel) {
        const channel = data.push.channel;
        const pubDataRaw = data.push.pub.data;
        const pubData = pubDataRaw.data || pubDataRaw;
        const offset = data.push.pub.offset;

        if (channel === "public-market:r-price-ag") {
          // Full array replace
          dispatch(updatePriceAg(pubData)); // pubData = array of {price, v, m}
        } else if (channel.includes("r-depth-")) {
          // Incremental depth update
          dispatch(updateDepth({ data: pubData })); // pubData = {u, U, a, b}
        } else if (
          channel === "public-market:trades" ||
          data.event === "trade"
        ) {
          // اگر trades، handle (اختیاری)
          const trades = Array.isArray(pubData) ? pubData : [pubData];
          dispatch(
            addTrades(
              trades.map((t) => ({
                price: t.price,
                quantity: t.quantity || t.v, // v? اگر volume
                time: t.time,
                side: t.side || "unknown",
              })),
            ),
          );
        }
      }

      // Heartbeat {} ignored (handled in hook)
    }
  }, [lastJsonMessage, dispatch]);

  return null;
};

export default WebSocketHandler;
