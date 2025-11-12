import React, { useCallback, useEffect, useRef, useState } from "react";
import { widget } from "./charting_library";
import Datafeed, {
  setSymbolsFromRedux,
  setUserHistory,
} from "./datafeed_custom";
import { useSelector } from "react-redux";
import { useUserOrderPolling } from "../../../Utilities/Hooks/useUserOrder";
import { useParams } from "react-router-dom";

const TVChartContainer = () => {
  const chartContainerRef = useRef();
  const tvWidgetRef = useRef(null);
  const chartRef = useRef(null);
  const { base, quote } = useParams();
  const marketsDatas = useSelector((state) => state.marketsDatas);
  const { symbolID, precision } = useSelector(
    (state) => state.symbolIDPrecision,
  );
  const userTokenSelector = useSelector((state) => state.userToken);
  const {
    data: pendingOrder,
    isLoading,
    error,
    refetch,
  } = useUserOrderPolling(userTokenSelector.token, "PENDING");
  const {
    data: completedOrders,
    isLoading: completedLoading,
    error: completedError,
    refetch: refetchCompleted,
  } = useUserOrderPolling(userTokenSelector.token, "COMPLETED", symbolID);
  // ---------React State----------
  const [userPositions, setUserPositions] = useState([]);
  const [positionLines, setPositionLines] = useState([]);
  // ---------Helper Func----------
  const buildUserPositions = useCallback((orders, symbol) => {
    if (!orders || !symbol) return [];
    const baseCurrency = symbol.slice(0, -3);
    const quoteCurrency = symbol.slice(-3);
    return orders
      .filter(
        (order) =>
          order.status === "PENDING" &&
          order.market.base_currency.id === baseCurrency &&
          order.market.quote_currency.id === quoteCurrency,
      )
      .map((order) => {
        const posType = order.type.toLowerCase() === "buy" ? "long" : "short";
        const timestamp = new Date(order.created_at).getTime(); // ms
        const size = parseFloat(order.amount); // حجم
        const price =
          order.market.quote_currency.id === "IRR"
            ? parseFloat(order.price) / 10
            : parseFloat(order.price);
        return {
          time: timestamp,
          price: price,
          type: posType,
          size: size,
        };
      });
  }, []);
  const buildUserHistory = useCallback((orders) => {
    if (!orders || !orders.data) return [];
    return orders.data
      .filter((order) => order.status === "COMPLETED")
      .map((order) => {
        let timestampStr = order.created_at;
        if (!timestampStr.includes("+") && !timestampStr.includes("Z")) {
          timestampStr = timestampStr.replace(/\.\d{6}/, "");

          const [datePart, timePart] = timestampStr.split(" ");
          const [year, month, day] = datePart.split("-");
          const [hourStr, minStr, secStr] = timePart.split(":");

          let hour = parseInt(hourStr);
          let min = parseInt(minStr);

          min += 30;
          if (min >= 60) {
            min -= 60;
            hour += 1;
          }
          hour += 3;
          if (hour >= 24) {
            const newDate = new Date(
              new Date(timestampStr).getTime() + 3.5 * 60 * 60 * 1000,
            ); // fallback
            timestampStr = newDate.toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:mm:ss
          } else {
            timestampStr = `${year}-${month}-${day} ${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${secStr}`;
          }
        }

        const timestamp = Math.floor(new Date(timestampStr).getTime() / 1000); // unix second UTC درست

        const price =
          order.market.quote_currency.id === "IRR"
            ? parseFloat(order.price) / 10
            : parseFloat(order.price);
        const type = order.type.toLowerCase();
        return {
          time: timestamp, // UTC درست
          price: price,
          type: type,
          isEntry: true,
          size: parseFloat(order.amount),
        };
      })
      .sort((a, b) => a.time - b.time);
  }, []);

  // ---------Use Effect update positions from pendingOrder ----------
  useEffect(() => {
    if (pendingOrder?.data && !isLoading) {
      const currentSymbol = "USDTIRR";
      const positions = buildUserPositions(pendingOrder.data, currentSymbol);
      setUserPositions(positions);
    } else if (error) {
      console.error("Error fetching pending orders:", error);
      setUserPositions([]);
    }
  }, [pendingOrder, isLoading, error, buildUserPositions]);

  // ---------useEffect update positions----------
  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    positionLines.forEach((line) => line.remove());
    setPositionLines([]);

    const newPositionLines = [];
    userPositions.forEach((pos) => {
      const posType = pos.type.toLowerCase();
      const quantityStr =
        posType === "short" ? "-" + pos.size : pos.size.toString();

      const positionLine = chartRef.current.createPositionLine();

      if (posType === "long") {
        positionLine
          .setText("Buy Order @ " + Number(pos.price).toLocaleString("en-US"))
          .setQuantity(quantityStr)
          .setPrice(pos.price)
          .setBodyBackgroundColor("#48da63")
          .setBodyBorderColor("#40404000")
          .setBodyTextColor("#000")
          .setLineColor("#48da63")
          .setQuantityBackgroundColor("rgba(0,255,0,0.5)")
          .setQuantityBorderColor("#40404000")
          .setLineWidth(0.5)
          .setLineStyle(2);
      } else if (posType === "short") {
        positionLine
          .setText("Sell Order @ " + Number(pos.price).toLocaleString("en-US"))
          .setQuantity(quantityStr)
          .setPrice(pos.price)
          .setBodyBackgroundColor("#da4848")
          .setBodyBorderColor("#40404000")
          .setBodyTextColor("#000")
          .setLineColor("#FF0000")
          .setQuantityBackgroundColor("rgba(255,0,0,0.5)")
          .setQuantityBorderColor("#40404000")
          .setLineWidth(0.5)
          .setLineStyle(2);
      }
      newPositionLines.push(positionLine);
    });
    setPositionLines(newPositionLines);
  }, [userPositions, chartRef.current]);
  // ---------useEffect update Completed Orders ----------
  useEffect(() => {
    if (completedOrders?.data && !completedLoading && symbolID) {
      const history = buildUserHistory(completedOrders);
      setUserHistory(history);
    } else if (completedError) {
      console.error("Error fetching completed orders:", completedError);
      setUserHistory([]);
    }
  }, [
    completedOrders,
    completedLoading,
    completedError,
    symbolID,
    buildUserHistory,
  ]);

  // ---------UseEffect آپدیت symbols از Redux ----------
  useEffect(() => {
    setSymbolsFromRedux(marketsDatas);
  }, [marketsDatas.data]);

  // ---------Use Effect Create Chart ----------
  useEffect(() => {
    const widgetOptions = {
      symbol: `${base + quote}`,
      datafeed: Datafeed,
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      interval: "1h",
      timezone: "Asia/Tehran",
      locale: "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        "symbol_search_hot_key",
      ],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      supports_marks: true,
      supports_timescale_marks: false,
      enabled_features: ["two_character_bar_marks_labels"],
      theme: "dark",
      overrides: {
        "mainSeriesProperties.statusViewStyle.showInterval": true,
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
        "paneProperties.backgroundType": "solid",
        "paneProperties.background": "#101112",
      },
      loading_screen: {
        backgroundColor: "#101112",
      },
    };

    const tvWidget = new widget(widgetOptions);
    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
      const chart = tvWidget.activeChart();
      chartRef.current = chart;
    });

    return () => {
      positionLines.forEach((line) => line.remove());
      setPositionLines([]);
      tvWidget.remove();
      tvWidgetRef.current = null;
      chartRef.current = null;
    };
  }, [base, quote]);

  return React.createElement("div", {
    ref: chartContainerRef,
    style: {
      height: "calc(100% - 104px)",
      width: "100%",
      minHeight: "600px",
    },
  });
};

export default TVChartContainer;
