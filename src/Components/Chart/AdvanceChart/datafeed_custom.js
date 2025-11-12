import { useSelector } from "react-redux";
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

// تابع برای ساخت symbols از داده‌های marketsData
const buildSymbols = (marketsData) => {
  return marketsData.reduce((acc, market) => {
    // فقط بازارهایی که quote_currency.id === 'IRR' هستن رو در نظر بگیر
    if (market.quote_currency.id !== "IRR") return acc;

    const baseId = market.base_currency.id;
    const symbolKey = `${baseId}IRT`; // همیشه IRT برای تومان
    const baseEnglishName = market.base_currency.currency_name?.en || baseId; // از en استفاده کن

    acc[symbolKey] = {
      symbol: symbolKey,
      ticker: symbolKey,
      name: `${baseId}/IRT`,
      description: `${baseEnglishName} to Iranian Toman`,
      type: "crypto",
      session: "24x7",
      exchange: "Ompfinex",
      listed_exchange: "Ompfinex",
      timezone: "Asia/Tehran",
      minmov: 1,
      pricescale: 100, // می‌تونی بر اساس quote_currency_precision تنظیم کنی، مثلاً Math.pow(10, market.quote_currency_precision)
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };

    return acc;
  }, {});
};

// symbols اولیه (هاردکد شده برای fallback، بعداً با setSymbolsFromRedux آپدیت می‌شه)
let currentSymbols = {
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

// فانکشن برای آپدیت symbols از Redux (در کامپوننت React فراخوانی کن)
export const setSymbolsFromRedux = (marketsData) => {
  if (marketsData?.data && !marketsData.loading && !marketsData.error) {
    currentSymbols = buildSymbols(marketsData.data);
  }
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
    this.refetchTriggers = new Map();
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
            this.lastPrices.set(symbol, currentClose);
          } else {
          }
        }
      } catch (error) {
        console.error(`❌ Real-time error for ${symbol}:`, error);
      }
    };

    fetchData();
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

export const DatafeedWithReactQuery = {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData), 0);
  },

  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    const results = Object.values(currentSymbols).filter(
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
      currentSymbols[symbolName] ||
      Object.values(currentSymbols).find((s) => s.symbol === symbolName) ||
      Object.values(currentSymbols).find((s) => s.name === symbolName);

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
      const filteredHistory = userHistory
        .filter((trade) => trade.time >= from && trade.time <= to)
        .map((trade, index) => {
          let color, tooltipText, label;
          const isBuy =
            trade.type.toLowerCase() === "buy" ||
            (trade.type.toLowerCase() === "long" && trade.isEntry);
          if (isBuy) {
            color = "green";
            const pd = new PersianDate(trade.time * 1000);
            tooltipText = [
              `Buy Entry at ${trade.price.toLocaleString()}`,
              `Vol: ${trade.size?.toLocaleString() || "N/A"}`,
              `on ${toEnglishDigits(pd.format("YYYY-MM-DD HH:mm:ss"))}`,
            ];
            label = "B";
          } else {
            color = "red";
            const pd = new PersianDate(trade.time * 1000);
            tooltipText = [
              `Sell Entry at ${trade.price.toLocaleString()}`,
              `Vol: ${trade.size?.toLocaleString() || "N/A"}`,
              `on ${toEnglishDigits(pd.format("YYYY-MM-DD HH:mm:ss"))}`,
            ];
            label = "S";
          }
          return {
            id: `mark-${symbolInfo.symbol}-${index}`, // unique id
            time: trade.time, // ثانیه
            color: color, // فیکس: name رنگ
            label: label, // متن داخل circle (B/S)
            text: tooltipText, // tooltip hover
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
