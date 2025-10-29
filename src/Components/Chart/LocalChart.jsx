import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CrosshairMode,
  LineStyle,
  ColorType,
  CandlestickSeries, // برای v5
  HistogramSeries, // برای volume
  LineSeries, // برای MA
  createSeriesMarkers, // جدید: برای markers در v5
} from "lightweight-charts";

export default function localChart({
  ohlcData,
  orders,
  timeframe = "1h",
  symbol = "USDT/IRT",
}) {
  const chartContainerRef = useRef();
  const [chart, setChart] = useState(null);

  // داده‌های نمونه OHLC (Unix time)
  const defaultOhlcData = [
    {
      time: 1730140800,
      open: 108000,
      high: 108500,
      low: 107800,
      close: 108200,
      volume: 1000,
    },
    {
      time: 1730141100,
      open: 108200,
      high: 108600,
      low: 108100,
      close: 108400,
      volume: 1500,
    },
    {
      time: 1730141400,
      open: 108400,
      high: 108700,
      low: 108300,
      close: 108600,
      volume: 1200,
    },
    {
      time: 1730141700,
      open: 108600,
      high: 109000,
      low: 108500,
      close: 108800,
      volume: 1800,
    },
    // ... بیشتر اضافه کن یا از API
  ];

  // سفارشات نمونه
  const defaultOrders = [
    {
      id: 123,
      type: "buy",
      price: 108200,
      amount: 0.5,
      created_at: "2025-10-28T11:01:33Z",
    },
    {
      id: 456,
      type: "sell",
      price: 108600,
      amount: 0.2,
      created_at: "2025-10-28T12:15:20Z",
    },
  ];

  const finalOhlcData = ohlcData || defaultOhlcData;
  const finalOrders = orders || defaultOrders;

  useEffect(() => {
    if (chartContainerRef.current && finalOhlcData.length > 0) {
      const newChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: ColorType.Solid, color: "#000000" }, // تم dark
          textColor: "#d1d4dc",
        },
        grid: {
          vertLines: { color: "#334158" },
          horzLines: { color: "#334158" },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        // فیکس: enable zoom/pan
        handleScroll: {
          mouseWheel: true, // zoom با چرخ موس
          pressedMouseMove: true, // pan با drag موس
          vertTouchDrag: true, // pan عمودی touch
          horzTouchDrag: true, // pan افقی touch
        },
        rightPriceScale: {
          borderColor: "#1e222d",
        },
        timeScale: {
          borderColor: "#1e222d",
          timeVisible: true,
          secondsVisible: false,
          // فیکس: تنظیمات برای pan/zoom بهتر
          rightOffset: 20, // فضای خالی راست برای pan
          barSpacing: 3, // فاصله کندل‌ها (برای zoom بهتر)
          lockVisibleTimeRangeOnResize: true, // حفظ zoom بعد resize
          rightBarStaysOnScroll: true, // آخرین کندل ثابت بمونه
        },
        localization: {
          locale: "fa-IR", // برای پارسی
        },
      });

      // ... (سری‌های candlestick, volume, maSeries همون‌طور که قبلاً بود)

      // آپدیت داده‌ها
      candlestickSeries.setData(
        finalOhlcData.map((d) => ({
          time: d.time,
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
        })),
      );

      volumeSeries.setData(
        finalOhlcData.map((d) => ({
          time: d.time,
          value: parseFloat(d.volume),
          color: d.close >= d.open ? "#26a69a" : "#ef5350",
        })),
      );

      // ... (MA20 همون‌طور)

      // Markers همون‌طور (createSeriesMarkers)

      // فیکس: auto-fit به داده‌ها برای initial zoom/pan
      newChart.timeScale().fitContent();

      // Resize listener
      const handleResize = () => {
        newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
        newChart.timeScale().fitContent(); // re-fit بعد resize
      };
      window.addEventListener("resize", handleResize);

      setChart(newChart);

      return () => {
        window.removeEventListener("resize", handleResize);
        newChart.remove();
      };
    }
  }, [finalOhlcData, finalOrders]);

  // تغییر تایم‌فریم (فعلاً console)
  const changeTimeframe = (tf) => {
    console.log("Switch to timeframe:", tf); // بعداً fetch واقعی
  };

  return (
    <div className="w-full">
      <div className="flex justify-between bg-gray-800 p-2 text-white">
        <h3>
          {symbol} - {timeframe}
        </h3>
        <div>
          <button
            onClick={() => changeTimeframe("1m")}
            className="mx-1 rounded bg-blue-500 px-2 py-1">
            1m
          </button>
          <button
            onClick={() => changeTimeframe("5m")}
            className="mx-1 rounded bg-blue-500 px-2 py-1">
            5m
          </button>
          <button
            onClick={() => changeTimeframe("1h")}
            className="mx-1 rounded bg-blue-500 px-2 py-1">
            1h
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
}
