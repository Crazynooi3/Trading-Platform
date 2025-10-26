import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FuturesMainContent from "../Components/FuturesMainContent/FuturesMainContent";
import { getMarketDataFromServer } from "../ReduxConfig/entities/marketDatas";
import { getMarketOrdersFromServer } from "../ReduxConfig/entities/marketOrderbook";
import WebSocketHandler from "./../Components/OrderBook/WebSocketHandler";
import * as Func from "../Utilities/Funections";
import Notice from "../Components/Notice/Notice";
import { getUserWallet } from "../ReduxConfig/entities/userWallet";

export default function Trade() {
  const marketDataSelector = useSelector((state) => state.marketsDatas);
  const userTokenSelector = useSelector((state) => state.userToken);

  const { symbolID } = useSelector((state) => state.symbolIDPrecision);
  const dispatch = useDispatch();
  // ---------------------
  const { base, quote } = useParams();

  // useEffect(() => {
  //   const tokenToSend = userTokenSelector.token || "";
  //   dispatch(getMarketDataFromServer(tokenToSend));
  //   dispatch(getUserWallet(tokenToSend));
  // }, [userTokenSelector.token, dispatch]);

  useEffect(() => {
    const tokenToSend = userTokenSelector?.token || "";
    dispatch(getMarketDataFromServer(tokenToSend));
    if (tokenToSend) {
      dispatch(getUserWallet(tokenToSend));
    }
    const interval = setInterval(() => {
      if (tokenToSend) {
        dispatch(getUserWallet(tokenToSend));
      }
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [userTokenSelector?.token, dispatch]);

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
