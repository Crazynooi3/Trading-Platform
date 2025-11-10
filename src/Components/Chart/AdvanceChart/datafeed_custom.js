import { useSmartChartData } from "./../../../Utilities/Hooks/useChartData";
import { getBarsDirect } from "./getBars";
import PersianDate from "persian-date";

export const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
  exchanges: [
    {
      value: "Ompfinex",
      name: "Ompfinex",
      desc: "Ompfinex Exchange",
    },
  ],
  symbols_types: [
    {
      name: "crypto",
    },
  ],
  supports_search: true,
  supports_group_request: false,
  supports_marks: true,
  supports_timescale_marks: false,
  supports_time: true,
  supports_realtime: true,
};

export const symbols = {
  USDTIRT: {
    symbol: "USDTIRT",
    ticker: "USDTIRT",
    name: "USDT/IRT",
    description: "Tether to Iranian Toman",
    type: "crypto",
    session: "24x7",
    exchange: "Ompfinex",
    listed_exchange: "Ompfinex",
    timezone: "Asia/Tehran",
    minmov: 1,
    pricescale: 100,
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    supported_resolutions: configurationData.supported_resolutions,
    volume_precision: 2,
    data_status: "streaming",
  },
  BTCIRT: {
    symbol: "BTCIRT",
    ticker: "BTCIRT",
    name: "BTC/IRT",
    description: "Bitcoin to Iranian Toman",
    type: "crypto",
    session: "24x7",
    exchange: "Ompfinex",
    listed_exchange: "Ompfinex",
    timezone: "Asia/Tehran",
    minmov: 1,
    pricescale: 100,
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    supported_resolutions: configurationData.supported_resolutions,
    volume_precision: 2,
    data_status: "streaming",
  },
};
let userHistory = [];
export const setUserHistory = (history) => {
  userHistory = history;
};

function toEnglishDigits(str) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  return str.replace(/[۰-۹]/g, function (char) {
    return englishDigits[persianDigits.indexOf(char)];
  });
}
class RealTimeManager {
  constructor() {
    this.subscriptions = new Map();
    this.lastPrices = new Map(); // ذخیره آخرین قیمت‌ها
    this.refetchTriggers = new Map(); // فیکس: تعریف در constructor
  }

  subscribe(subscribeUID, symbol, resolution, onRealtimeCallback) {
    this.unsubscribe(subscribeUID);

    const fetchData = async () => {
      try {
        const to = Math.floor(Date.now() / 1000);
        const from = to - 300;
        const bars = await getBarsDirect(symbol, resolution, from, to);

        if (bars && bars.t && bars.t.length > 0) {
          const lastIndex = bars.t.length - 1;
          const currentClose = bars.c[lastIndex];
          const lastClose = this.lastPrices.get(symbol);

          // فقط اگر قیمت تغییر کرده باشه
          if (currentClose !== lastClose) {
            const latestBar = {
              time: bars.t[lastIndex] * 1000,
              open: bars.o[lastIndex],
              high: bars.h[lastIndex],
              low: bars.l[lastIndex],
              close: currentClose,
              volume: bars.v[lastIndex],
            };
            onRealtimeCallback(latestBar);
            this.lastPrices.set(symbol, currentClose); // ذخیره قیمت جدید
          } else {
          }
        }
      } catch (error) {
        console.error(`❌ Real-time error for ${symbol}:`, error);
      }
    };

    // اولین بار همیشه اجرا میشه
    fetchData();

    // تنظیم interval
    const interval = setInterval(fetchData, 1000);

    this.subscriptions.set(subscribeUID, {
      symbol,
      resolution,
      interval,
      onRealtimeCallback,
    });
  }

  unsubscribe(subscribeUID) {
    if (this.subscriptions.has(subscribeUID)) {
      const subscription = this.subscriptions.get(subscribeUID);
      clearInterval(subscription.interval);
      this.subscriptions.delete(subscribeUID);
      this.refetchTriggers.delete(subscribeUID);
    }
  }

  // تابع برای trigger کردن refetch یک subscription خاص
  triggerRefetch(subscribeUID) {
    if (this.refetchTriggers.has(subscribeUID)) {
      this.refetchTriggers.set(
        subscribeUID,
        !this.refetchTriggers.get(subscribeUID),
      );
    }
  }
}

const realTimeManager = new RealTimeManager();

// کامپوننت wrapper برای استفاده از هوک در datafeed
export const DatafeedWithReactQuery = {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData), 0);
  },

  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    const results = Object.values(symbols).filter(
      (symbol) =>
        symbol.name.toLowerCase().includes(userInput.toLowerCase()) ||
        symbol.symbol.toLowerCase().includes(userInput.toLowerCase()),
    );
    onResultReadyCallback(results);
  },

  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const symbolInfo =
      symbols[symbolName] ||
      Object.values(symbols).find((s) => s.symbol === symbolName) ||
      Object.values(symbols).find((s) => s.name === symbolName);

    if (symbolInfo) {
      onSymbolResolvedCallback(symbolInfo);
    } else {
      onResolveErrorCallback("Symbol not found: " + symbolName);
    }
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) => {
    try {
      const { from, to } = periodParams;

      // استفاده از تابع مستقیم برای داده‌های تاریخی
      const bars = await getBarsDirect(symbolInfo.symbol, resolution, from, to);

      if (bars && bars.t && bars.t.length > 0) {
        const formattedBars = bars.t.map((timestamp, index) => ({
          time: timestamp * 1000,
          open: bars.o[index],
          high: bars.h[index],
          low: bars.l[index],
          close: bars.c[index],
          volume: bars.v[index],
        }));
        onHistoryCallback(formattedBars, { noData: false });
      } else {
        onHistoryCallback([], { noData: true });
      }
    } catch (error) {
      console.error("[Datafeed] خطا در getBars:", error);
      onErrorCallback(error.message || "خطای ناشناخته");
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    realTimeManager.subscribe(
      subscribeUID,
      symbolInfo.symbol,
      resolution,
      onRealtimeCallback,
    );
  },

  unsubscribeBars: (subscribeUID) => {
    realTimeManager.unsubscribe(subscribeUID);
  },

  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    return resolutionBack === "D"
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  },

  getMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
    try {
      // فیلتر history در range from/to (trade.time ثانیه، from/to ثانیه)
      const filteredHistory = userHistory
        .filter((trade) => trade.time >= from && trade.time <= to)
        .map((trade, index) => {
          let color, shape, position, tooltipText, label;
          const isBuy =
            trade.type.toLowerCase() === "buy" ||
            (trade.type.toLowerCase() === "long" && trade.isEntry);
          if (isBuy) {
            color = "green";
            const pd = new PersianDate(trade.time * 1000);
            tooltipText = `Buy Entry at ${trade.price.toLocaleString()} on ${toEnglishDigits(pd.format("YYYY-MM-DD HH:mm:ss"))}`;
            label = "B";
          } else {
            color = "red";
            const pd = new PersianDate(trade.time * 1000);
            tooltipText = `Sell Entry at ${trade.price.toLocaleString()} on ${toEnglishDigits(pd.format("YYYY-MM-DD HH:mm:ss"))}`;
            label = "S"; // متن داخل circle
          }

          return {
            id: `mark-${symbolInfo.symbol}-${index}`, // unique id
            time: trade.time, // ثانیه
            color: color, // فیکس: name رنگ
            label: label, // متن داخل circle (B/S)
            text: [tooltipText], // tooltip hover
            minSize: 16,
            labelFontColor: "#FFFFFF", // سفید برای خوانایی
          };
        });
      onDataCallback(filteredHistory);
    } catch (error) {
      console.error("[Datafeed] خطا در getMarks:", error);
      onDataCallback([]);
    }
  },

  getTimescaleMarks: () => {},

  getServerTime: (callback) => {
    callback(Math.floor(Date.now() / 1000));
  },
};

// برای backward compatibility
export const datafeed = DatafeedWithReactQuery;
export default DatafeedWithReactQuery;
