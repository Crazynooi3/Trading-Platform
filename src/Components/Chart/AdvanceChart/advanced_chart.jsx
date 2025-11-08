import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library";
import Datafeed from "./datafeed_custom";

const TVChartContainer = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    localStorage.removeItem("tradingview.chartproperties");
    localStorage.removeItem("tradingview.chartsettings");
    sessionStorage.removeItem("tradingview.*");
    const widgetOptions = {
      symbol: "USDTIRT",
      datafeed: Datafeed,
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      interval: "5",
      locale: "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        "symbol_search_hot_key",
      ],
      enabled_features: [],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      supports_marks: false,
      supports_timescale_marks: false,
      theme: "dark",
      overrides: {
        "mainSeriesProperties.statusViewStyle.showInterval": true,
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
      },
    };

    const tvWidget = new widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  }, []);

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
