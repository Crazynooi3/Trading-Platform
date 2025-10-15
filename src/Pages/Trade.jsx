import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FuturesMainContent from "../Components/FuturesMainContent/FuturesMainContent";
import { getMarketDataFromServer } from "../ReduxConfig/entities/marketDatas";
import { getMarketOrdersFromServer } from "../ReduxConfig/entities/marketOrderbook";
import * as Func from "../Utilities/Funections";
import Notice from "../Components/Notice/Notice";

export default function Trade() {
  const marketDataSelector = useSelector((state) => state.marketsDatas);
  const { symbolID } = useSelector((state) => state.symbolIDPrecision);
  const { rPriceAg } = useSelector((state) => state.webSocketMessage);
  const dispatch = useDispatch();
  // ---------------------
  const [lastPrice, setLastPrice] = useState("");
  const { base, quote } = useParams();

  useEffect(() => {
    if (rPriceAg && rPriceAg.length > 0 && symbolID) {
      const lastPriceData = rPriceAg.filter((data) => data.m === symbolID);
      if (lastPriceData.length > 0) {
        setLastPrice(Number(lastPriceData[0].price));
      }
    }
    document.title = `${base} / ${quote} | ${Number(
      lastPrice / 10,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, [rPriceAg, symbolID]);

  useEffect(() => {
    dispatch(getMarketDataFromServer());
  }, []);

  useEffect(() => {
    dispatch(Func.findCurrencyIDAction(base, quote, marketDataSelector.data));
    if (symbolID) {
      dispatch(getMarketOrdersFromServer(symbolID));
    }
  }, [marketDataSelector.loading, symbolID, base, quote]);

  return (
    <>
      <Notice />
      <FuturesMainContent />
      <Outlet />
    </>
  );
}
