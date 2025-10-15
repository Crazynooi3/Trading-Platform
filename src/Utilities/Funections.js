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
      const max_price = currency.max_price;
      const min_price = currency.min_price;
      dispatch(
        setSymbolIDPrecision({
          symbolID: currency.id,
          precision,
          day_change_percent,
          last_volume,
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
