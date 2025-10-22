import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddOrder } from "../../Utilities/Hooks/useAddOrder";
import SpotSlider from "../Sliders/SpotSlider";
import OrderInput from "../Input/OrderInput";
import SpotBtn from "../Btn/SpotBtn";
import * as Func from "./../../Utilities/Funections";
import TPSL from "./TPSL";
import Tooltip from "../Tooltip/Tooltip";

export default function OrderPlace() {
  const { symbolID, precision } = useSelector(
    (state) => state.symbolIDPrecision,
  );
  const userTokenSelector = useSelector((state) => state.userToken);
  const { base, quote } = useParams();
  // const { rPriceAg } = useSelector((state) => state.webSocketMessage);
  const userWalletSelector = useSelector((state) => state.userWallet);

  // --------------
  const [sliderPercent, setSliderPercent] = useState(0);
  const [userBalanceBase, setUserBalanceBase] = useState([]);
  const [userBalanceQuote, setUserBalanceQuote] = useState([]);

  const [orderType, setOrderType] = useState("Market");
  const [inputSizeValue, setInputSizeValue] = useState("");
  const [inputPriceValue, setInputPriceValue] = useState("");
  const [lastPrice, setLastPrice] = useState(0);
  const [isShowSizeTooltip, setIsShowTooltip] = useState(false);
  const lastPriceStr = document.querySelector("#lastPrice");
  // const lastPriceNum = parseFloat(lastPriceStr.replace(/,/g, ""));

  const orderTypeHandler = (e) => {
    setOrderType(e.target.innerHTML);
  };
  useEffect(() => {
    if (lastPriceStr) {
      if (parseFloat(lastPriceStr.textContent.replace(/,/g, "")) > 0) {
        setLastPrice(parseFloat(lastPriceStr.textContent.replace(/,/g, "")));
      }
    }
  }, [lastPriceStr]);

  const quoteIRR = Func.irtToIrr(quote);
  useEffect(() => {
    setUserBalanceBase(Func.currencyBalance(userWalletSelector.data, base));
    setUserBalanceQuote(
      Func.currencyBalance(userWalletSelector.data, quoteIRR),
    );
  }, [userWalletSelector, base, quote]);

  const clearInputs = () => {
    setInputPriceValue("");
    setInputSizeValue("");
  };
  const addUserOrderHandler = (amount, price, type, execution) => {
    console.log("execution:", execution);
    console.log("amount:", amount);
    console.log("price:", price);
    console.log("type:", type);
    if (execution === "Market" && !amount) {
      setIsShowTooltip(true);
      // setInterval(() => {
      //   setIsShowTooltip(false);
      // }, 5000);
    }
    if (
      (execution === "Limit" && !amount) ||
      (execution === "Limit" && !price)
    ) {
      setIsShowTooltip(true);
      // setInterval(() => {
      //   setIsShowTooltip(false);
      // }, 5000);
    }
    // useAddOrder(
    //   userTokenSelector.token,
    //   symbolID,
    //   amount,
    //   price,
    //   type,
    //   execution,
    // );
  };
  return (
    <>
      <div className="relative mt-4 px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="space-x-4">
            <span
              className={`${orderType === "Market" && "!text-text-text1"} text-text-text3 hover:!text-text-text1 cursor-pointer`}
              onClick={(e) => {
                orderTypeHandler(e);
                clearInputs();
              }}>
              Market
            </span>
            <span
              className={`${orderType === "Limit" && "!text-text-text1"} text-text-text3 hover:!text-text-text1 cursor-pointer`}
              onClick={(e) => {
                orderTypeHandler(e);
                clearInputs();
              }}>
              Limit
            </span>
            <span
              className={`${orderType === "Trigger Order" && "!text-text-text1"} text-text-text3 cursor-not-allowed`}>
              Trigger Order
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </div>
        {orderType === "Market" && (
          <>
            <Tooltip
              title={"Please enter the size"}
              isShow={isShowSizeTooltip}
            />
            <OrderInput
              text="Size"
              detail={base}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              inputSizeValue={inputSizeValue}
              setInputSizeValue={setInputSizeValue}
              precision={precision}
            />
          </>
        )}
        {orderType === "Limit" && (
          <>
            <Tooltip
              title={"Please enter the price"}
              isShow={isShowSizeTooltip}
            />
            <OrderInput
              text="Price"
              detail={quote}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              inputPriceValue={inputPriceValue}
              setInputPriceValue={setInputPriceValue}
              precision={precision}
              lastPrice={lastPrice}
            />
            <Tooltip
              title={"Please enter the size"}
              isShow={isShowSizeTooltip}
              // position={}
            />
            <OrderInput
              text="Size"
              detail={base}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              setInputSizeValue={setInputSizeValue}
              inputSizeValue={inputSizeValue}
              precision={precision}
            />
          </>
        )}
      </div>
      <SpotSlider
        setSliderPercent={setSliderPercent}
        sliderPercent={sliderPercent}
      />
      <TPSL />
      <div className="mx-4 mt-4">
        <div className="flex items-center gap-2">
          <SpotBtn
            title={`Buy ${base}`}
            className={
              "bg-green-green2 text-text-text0 hover:bg-green-green3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold"
            }
            onclick={() => {
              // const amount = orderType === 'Market' ?
              addUserOrderHandler(
                inputSizeValue,
                inputPriceValue,
                "buy",
                orderType,
              );
            }}
          />
          <SpotBtn
            title={`Sell ${base}`}
            className={
              "bg-red-red2 text-text-text0 hover:bg-red-red3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold"
            }
          />
        </div>
      </div>
    </>
  );
}
