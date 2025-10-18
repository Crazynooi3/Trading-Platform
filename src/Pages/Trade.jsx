import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FuturesMainContent from "../Components/FuturesMainContent/FuturesMainContent";
import { getMarketDataFromServer } from "../ReduxConfig/entities/marketDatas";
import { getMarketOrdersFromServer } from "../ReduxConfig/entities/marketOrderbook";
import WebSocketHandler from "./../Components/OrderBook/WebSocketHandler";
import * as Func from "../Utilities/Funections";
import Notice from "../Components/Notice/Notice";

export default function Trade() {
  const marketDataSelector = useSelector((state) => state.marketsDatas);
  const { symbolID } = useSelector((state) => state.symbolIDPrecision);
  const dispatch = useDispatch();
  // ---------------------
  const { base, quote } = useParams();

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
      <WebSocketHandler symbolID={symbolID} />
      <Notice />
      <FuturesMainContent />
      <Outlet />
    </>
  );
}
