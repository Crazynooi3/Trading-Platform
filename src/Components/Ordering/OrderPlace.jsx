import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddOrder } from "../../Utilities/Hooks/useAddOrder";
import SpotSlider from "../Sliders/SpotSlider";
import OrderInput from "../Input/OrderInput";
import SpotBtn from "../Btn/SpotBtn";
import * as Func from "./../../Utilities/Funections";
import TPSL from "./TPSL";
import Tooltip from "../Tooltip/Tooltip";
import { toast } from "react-toastify";
import { getUserWallet } from "../../ReduxConfig/entities/userWallet";
import { Slider } from "antd";

export default function OrderPlace() {
  const dispatch = useDispatch();
  const { symbolID, precision } = useSelector(
    (state) => state.symbolIDPrecision,
  );
  const userTokenSelector = useSelector((state) => state.userToken);
  const { base, quote } = useParams();
  const userWalletSelector = useSelector((state) => state.userWallet);
  // --------------
  const [sliderPercent, setSliderPercent] = useState(0);
  const [userBalanceBase, setUserBalanceBase] = useState([]);
  const [userBalanceQuote, setUserBalanceQuote] = useState([]);
  const [avaibleBalanceBase, setAvaibleBalanceBase] = useState(null);
  const [avaibleBalanceQuote, setAvaibleBalanceQuote] = useState(null);
  const [orderType, setOrderType] = useState(
    localStorage.getItem("orderType") || "Market",
  );
  const [inputSizeValue, setInputSizeValue] = useState("");
  const [inputPriceValue, setInputPriceValue] = useState("");
  const [lastPrice, setLastPrice] = useState(0);
  const [isShowSizeTooltip, setIsShowTooltip] = useState(false);
  const [isShowSizeTooltipPrice, setIsShowTooltipPrice] = useState(false);
  const [sizeUnit, setSizeUnit] = useState(base);
  const { mutate: addOrder, isPending: isAddingOrder } = useAddOrder();

  useEffect(() => {
    const lastPriceStr = document.querySelector("#lastPrice");
    if (lastPriceStr) {
      if (parseFloat(lastPriceStr.textContent.replace(/,/g, "")) > 0) {
        setLastPrice(parseFloat(lastPriceStr.textContent.replace(/,/g, "")));
      }
    }
  }, [sliderPercent, inputSizeValue]);

  const quoteIRR = Func.irtToIrr(quote);
  useEffect(() => {
    setUserBalanceBase(Func.currencyBalance(userWalletSelector.data, base));
    if (quoteIRR === "IRR") {
      setUserBalanceQuote(
        Func.currencyBalance(userWalletSelector.data, quoteIRR),
      );
    } else {
      setUserBalanceQuote(
        Func.currencyBalance(userWalletSelector.data, quoteIRR),
      );
    }
    setAvaibleBalanceBase(
      Number(userBalanceBase?.balance) -
        Number(userBalanceBase?.blocked_balance),
    );
    setAvaibleBalanceQuote(
      quoteIRR === "IRR"
        ? (Number(userBalanceQuote?.balance) -
            Number(userBalanceQuote?.blocked_balance)) /
            10
        : Number(userBalanceQuote?.balance) -
            Number(userBalanceQuote?.blocked_balance),
    );
  }, [userWalletSelector, base, quote]);

  const clearInputs = () => {
    setInputPriceValue("");
    setInputSizeValue("");
  };

  const addUserOrderHandlerBuy = (amount, price, type, execution) => {
    const balance = avaibleBalanceQuote;
    const unit = sizeUnit === base ? "base" : "quote";
    const trueAmount = Func.calculateVol(
      amount,
      balance,
      "buy",
      lastPrice,
      unit,
    );

    const truePrice = quote === "IRT" ? price * 10 : price;

    if (execution === "Market" && !amount) {
      setIsShowTooltip(true);
      return;
    }
    if (execution === "Limit" && !amount) {
      setIsShowTooltip(true);
      return;
    }
    if (execution === "Limit" && !price) {
      setIsShowTooltipPrice(true);
      return;
    }
    if (execution === "Market" && amount) {
      addOrder(
        {
          token: userTokenSelector.token,
          marketID: symbolID,
          amount: trueAmount,
          type,
          execution: "MARKET",
        },
        {
          onSuccess: (response) => {
            const orderId = response.data.id;
            dispatch(getUserWallet(userTokenSelector.token));
            toast.success("سفارش خرید مارکت با موفقیت ثبت شد", {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
          onError: (error) => {
            const errorMessage =
              error.data?.message ||
              error.message ||
              "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
        },
      );
    }
    if (execution === "Limit" && amount && price) {
      addOrder(
        {
          token: userTokenSelector.token,
          marketID: symbolID,
          amount: trueAmount,
          price: truePrice,
          type,
          execution: "LIMIT",
        },
        {
          onSuccess: (response) => {
            const orderId = response.data.id;
            dispatch(getUserWallet(userTokenSelector.token));
            toast.success("سفارش خرید لیمیت با موفقیت ثبت شد", {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
            setInputPriceValue("");
            setInputSizeValue("");
          },
          onError: (error) => {
            const errorMessage =
              error.data?.message ||
              error.message ||
              "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
        },
      );
    }
  };
  const addUserOrderHandlerSell = (amount, price, type, execution) => {
    const balance = avaibleBalanceBase;
    const unit = sizeUnit === base ? "base" : "quote";
    const trueAmount = Func.calculateVol(
      amount,
      balance,
      "sell",
      lastPrice,
      unit,
    );
    const truePrice = quote === "IRT" ? price * 10 : price;

    if (execution === "Market" && !amount) {
      setIsShowTooltip(true);
      return;
    }
    if (execution === "Limit" && !amount) {
      setIsShowTooltip(true);
      return;
    }
    if (execution === "Limit" && !price) {
      setIsShowTooltipPrice(true);
      return;
    }
    if (execution === "Market" && amount) {
      addOrder(
        {
          token: userTokenSelector.token,
          marketID: symbolID,
          amount: trueAmount,
          type,
          execution: "MARKET",
        },
        {
          onSuccess: (response) => {
            const orderId = response.data.id;
            dispatch(getUserWallet(userTokenSelector.token));
            toast.success("سفارش فروش مارکت با موفقیت ثبت شد", {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
          onError: (error) => {
            const errorMessage =
              error.data?.message ||
              error.message ||
              "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
        },
      );
    }
    if (execution === "Limit" && amount && price) {
      addOrder(
        {
          token: userTokenSelector.token,
          marketID: symbolID,
          amount: trueAmount,
          price: truePrice,
          type,
          execution: "LIMIT",
        },
        {
          onSuccess: (response) => {
            const orderId = response.data.id;
            dispatch(getUserWallet(userTokenSelector.token));
            toast.success("سفارش فروش لیمیت با موفقیت ثبت شد", {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
            setInputPriceValue("");
            setInputSizeValue("");
          },
          onError: (error) => {
            const errorMessage =
              error.data?.message ||
              error.message ||
              "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000,
              rtl: true,
              className: "toast",
            });
          },
        },
      );
    }
  };
  const orderTypeHandler = (e) => {
    setIsShowTooltip(false);
    setIsShowTooltipPrice(false);
    localStorage.setItem("orderType", e.target.innerHTML);
    setOrderType(localStorage.getItem("orderType"));
  };
  const formatter = (value) => `${value}%`;
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
              position={"-top-3 "}
            />
            <OrderInput
              text="Size"
              detail={sizeUnit}
              dropDown={true}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              inputSizeValue={inputSizeValue}
              setInputSizeValue={setInputSizeValue}
              precision={precision}
              setIsShowTooltip={setIsShowTooltip}
              setSizeUnit={setSizeUnit}
            />
          </>
        )}
        {orderType === "Limit" && (
          <>
            <Tooltip
              title={"Please enter the price"}
              isShow={isShowSizeTooltipPrice}
              position={"-top-3 "}
            />
            <OrderInput
              text="Price"
              detail={quote}
              dropDown={false}
              setSizeUnit={setSizeUnit}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              inputPriceValue={inputPriceValue}
              setInputPriceValue={setInputPriceValue}
              precision={precision}
              lastPrice={lastPrice}
              setIsShowTooltipPrice={setIsShowTooltipPrice}
            />
            <Tooltip
              title={"Please enter the size"}
              isShow={isShowSizeTooltip}
              position={"top-10 "}
            />
            <OrderInput
              text="Size"
              detail={sizeUnit}
              dropDown={true}
              setSizeUnit={setSizeUnit}
              sliderPercent={sliderPercent}
              setSliderPercent={setSliderPercent}
              setInputSizeValue={setInputSizeValue}
              inputSizeValue={inputSizeValue}
              precision={precision}
              setIsShowTooltip={setIsShowTooltip}
            />
          </>
        )}
      </div>
      <div className="px-7 py-4">
        <Slider
          value={sliderPercent}
          onChange={setSliderPercent}
          min={0}
          max={100}
          step={1}
          marks={{
            0: "0%",
            25: "25%",
            50: "50%",
            75: "75%",
            100: "100%",
          }}
          tipFormatter={formatter}
        />
      </div>
      <TPSL />
      <div className="mx-4 mt-4">
        <div className="flex items-center gap-2">
          <SpotBtn
            title={`Buy ${base}`}
            className={
              "bg-green-green2 text-text-text0 hover:bg-green-green3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold"
            }
            onclick={() => {
              addUserOrderHandlerBuy(
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
            onclick={() => {
              addUserOrderHandlerSell(
                inputSizeValue,
                inputPriceValue,
                "sell",
                orderType,
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
