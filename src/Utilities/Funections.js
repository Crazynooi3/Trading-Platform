import {
  setSymbolIDPrecision,
  setError,
} from "../ReduxConfig/entities/symbolIDPerecision";

export function irtToIrr(quote) {
  let quoteType = quote === "IRT" ? "IRR" : "USDT";
  return quoteType;
}

export const findCurrencyIDAction = (base, quote, marketData) => (dispatch) => {
  if (marketData && base && quote) {
    const currency = marketData.find(
      (currency) =>
        currency.base_currency.id === base &&
        currency.quote_currency.id === irtToIrr(quote),
    );
    if (currency) {
      const precision = Math.max(
        currency.quote_currency_precision,
        currency.base_currency_precision,
      );
      const day_change_percent = currency.day_change_percent;
      const last_volume = currency.last_volume;
      const last_price = currency.last_price;
      const max_price = currency.max_price;
      const min_price = currency.min_price;
      dispatch(
        setSymbolIDPrecision({
          symbolID: currency.id,
          precision,
          day_change_percent,
          last_volume,
          last_price,
          max_price,
          min_price,
        }),
      );
    } else {
      const errorMsg = `Currency not found for base: ${base}, quote: ${quote}`;
      dispatch(setError(errorMsg));
      return null;
    }
  } else {
    console.warn("Missing params for findCurrencyID");
    return null;
  }
};

export function findLastPrice(marketDataSelector, symbolID) {
  const market = marketDataSelector.find((market) => market.id === symbolID);
  return market?.last_price || 0;
}

export function findUSDTPrice(marketDataSelector, base) {
  const market = marketDataSelector.find(
    (market) =>
      market.base_currency.id === base && market.quote_currency.id === "USDT",
  );
  const USDTPrice = base != "USDT" ? market?.last_price || 0 : "";
  return USDTPrice;
}

export function currencyBalance(data, symbolName) {
  const currentMarket = data.find((symbol) => {
    return symbol.currency.id === symbolName;
  });
  return currentMarket;
}

// Function برای تبدیل Gregorian به Jalali
export function gregorianToJalali(gy, gm, gd) {
  var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  var gy2 = gm > 2 ? gy + 1 : gy;
  var days =
    365 * gy +
    parseInt((gy2 + 3) / 4) -
    parseInt((gy2 + 99) / 100) +
    parseInt((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * parseInt(days / 12053);
  days %= 12053;
  jy += 4 * parseInt(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += parseInt((days - 1) / 365);
    days = (days - 1) % 365;
  } else {
    days = days;
  }
  var jm =
    days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  var jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd]; // [سال, ماه, روز]
}

// Helper برای فرمت کردن به string (مثل "1404-08-29")
export function formatJalaliDate(jy, jm, jd) {
  return `${jy.toString().padStart(4, "0")}-${jm.toString().padStart(2, "0")}-${jd.toString().padStart(2, "0")}`;
}

// Function برای فرمت زمان به timezone تهران
export function formatTimeToTehran(createdAtStr) {
  // createdAtStr رو به Date UTC تبدیل کن (Z برای UTC)
  const utcDate = new Date(createdAtStr + "Z"); // مثلاً "2025-10-21 08:19:37.172394Z"

  // فرمت به Tehran با Intl (fa-IR برای فارسی، اما فقط time می‌خوایم)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  });

  return formatter.format(utcDate); // مثلاً "11:49:37" (8:19 UTC + 3:30 = 11:49)
}

// برای محاسبه مقدار ورود به معامله در حالت درصد
export function calculateVol(input, balance, side, price, unit = "quote") {
  // Coerce to numbers if strings or invalid
  console.log(input, balance, side, price, unit);

  balance = typeof balance === "string" ? parseFloat(balance) : Number(balance);
  price = typeof price === "string" ? parseFloat(price) : Number(price);

  // اعتبارسنجی
  if (isNaN(balance) || balance < 0) {
    return NaN;
  }
  if (isNaN(price) || price <= 0) {
    return NaN;
  }
  if (!["buy", "sell"].includes(side)) {
    return NaN;
  }
  if (!["base", "quote"].includes(unit)) {
    return NaN;
  }

  // چک اینکه input درصد هست یا نه
  const isPercentage = typeof input === "string" && input.endsWith("%");

  // محاسبه مقدار ورودی (درصد یا مطلق)
  let vol;
  if (isPercentage) {
    const percentValue = parseFloat(input.slice(0, -1));
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
      return NaN;
    }
    vol = (percentValue / 100) * balance; // درصد از balance (برای buy: quote_balance, برای sell: base_balance)
  } else {
    const numericValue = parseFloat(input);
    if (isNaN(numericValue) || numericValue < 0) {
      return NaN;
    }
    vol = numericValue; // مطلق
  }

  // تبدیل به base (USDT) بر اساس side، نوع input، و unit
  let baseAmount;
  if (side === "buy") {
    if (isPercentage) {
      // برای درصد در buy: همیشه vol (IRT) / price = base
      baseAmount = vol / price;
    } else {
      // مطلق در buy
      if (unit === "quote") {
        baseAmount = vol / price; // IRT واردشده / price
      } else if (unit === "base") {
        baseAmount = vol; // USDT مستقیم
      }
    }
  } else if (side === "sell") {
    if (isPercentage) {
      // برای درصد در sell: vol (از base_balance) مستقیم base هست
      baseAmount = vol;
    } else {
      // مطلق در sell
      if (unit === "base") {
        baseAmount = vol; // USDT فروشی مستقیم
      } else if (unit === "quote") {
        baseAmount = vol / price; // IRT دریافتی / price = USDT فروشی
      }
    }
  }

  return baseAmount; // همیشه base برای API
}
