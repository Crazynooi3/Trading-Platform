import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library";
import Datafeed, { setUserHistory } from "./datafeed_custom";

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
      supports_marks: true, // فیکس: فقط true (duplicate حذف)
      supports_timescale_marks: false,
      enabled_features: ["two_character_bar_marks_labels"],
      theme: "dark",
      overrides: {
        "mainSeriesProperties.statusViewStyle.showInterval": true,
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
        "paneProperties.backgroundType": "solid", // یا "gradient" برای گرادیان
        "paneProperties.backgroundColor": "#ffff",
      },
    };

    const tvWidget = new widget(widgetOptions);

    // فرض: positions کاربر (از API بگیر)
    const userPositions = [
      {
        time: 1731091200000, // timestamp ورود (میلی‌ثانیه)
        price: 108000, // قیمت ورود
        type: "long", // یا "short"
        size: 150, // حجم
      },
      {
        time: 1731081200000, // timestamp ورود (میلی‌ثانیه)
        price: 109000, // قیمت ورود
        type: "Short", // یا "short"
        size: 1, // حجم
      },
      // ... positions دیگه
    ];

    // History معاملات بسته‌شده (فرض: از API بگیر – entry/exit points)
    const userHistory = [
      {
        time: 1762502560, // timestamp معامله (ثانیه – فیکس filter)
        price: 108000,
        type: "buy", // یا "sell" / "long" / "short"
        isEntry: true, // true برای entry، false برای exit
      },
      {
        time: 1762509760,
        price: 108800,
        type: "sell",
        isEntry: false,
      },
      // ... history دیگه
    ];
    setUserHistory(userHistory); // پاس به datafeed
    tvWidget.onChartReady(() => {
      const chart = tvWidget.activeChart();

      // Positions باز (مثل قبل، با فیکس‌های تو)
      userPositions.forEach((pos) => {
        const posType = pos.type.toLowerCase(); // normalize type
        const quantityStr =
          posType === "short" ? "-" + pos.size : pos.size.toString(); // منفی برای short
        const positionLine = chart.createPositionLine(); // ایجاد خط پوزیشن

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
            .setText(
              "Sell Order @ " + Number(pos.price).toLocaleString("en-US"),
            )
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
      });
    });

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
