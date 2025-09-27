import React, { useEffect, useState } from "react";
import OrderBookTabs from "./OrderBookTabs";
import { useMarket } from "../../../Utilities/Context/MarketDataContext";

export default function SelectCurrency(props) {
  const [activeTab, setActiveTab] = useState("All");
  const [activeSort, setActiveSort] = useState("None");
  const { totalMarkets, fetchMarket, isLoding, error } = useMarket();
  useEffect(() => {
    console.log(totalMarkets);
  }, [totalMarkets]);

  const convertCurrencyCode = (currency) => {
    return currency === "IRR" ? "IRT" : currency;
  };

  const formatPrice = (last_price, quote_currency_precision) => {
    const price = parseFloat(last_price); // تبدیل به عدد
    if (isNaN(price)) return "0"; // مدیریت مقادیر نامعتبر

    if (price >= 1) {
      // برای اعداد بزرگ‌تر یا مساوی 1، با جداکننده هزارگان
      return price.toLocaleString("en-US", {
        minimumFractionDigits: quote_currency_precision,
        maximumFractionDigits: quote_currency_precision,
      });
    } else {
      // برای اعداد کوچک‌تر از 1، بدون جداکننده و با دقت مشخص‌شده
      return price.toFixed(quote_currency_precision);
    }
  };

  const onClickHandler = (e) => {
    props.selectCurrencyFunc(e);
  };

  return (
    <div className="absolute top-14 z-10 hidden cursor-auto transition-all group-hover:block before:absolute before:-top-14 before:h-[60px] before:w-[430px] before:content-[''] hover:block">
      <div className="bg-base-base6 border-border-border1 h-[615px] min-h-[580px] w-[430px] rounded-lg border p-4">
        {/* search box */}
        <div className="hover:border-gray-gray10 border-text-text4 h-8 w-full rounded-md border px-2 py-0.5">
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="w-full text-xs outline-0 placeholder:text-xs"
          />
        </div>
        {/* Tabs */}
        <div>
          <OrderBookTabs
            tab1="Favorites"
            tab2="Margin Trade"
            tab3="Spot Trade"
          />
        </div>
        <div className="my-2 flex h-9 w-full">
          <ul className="flex items-center justify-center gap-1.5">
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "All"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("All")}
            >
              <span>All</span>
            </li>
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "New"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("New")}
            >
              <span className="flex gap-0.5">
                <img
                  src="./../../../public/FireIcon.svg"
                  alt=""
                  className="h-4 w-4"
                />
                New
              </span>
            </li>
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "FX"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("FX")}
            >
              <span className="flex gap-0.5">
                <img
                  src="./../../../public/FireIcon.svg"
                  alt=""
                  className="h-4 w-4"
                />
                FX
              </span>
            </li>
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "MEME"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("MEME")}
            >
              <span className="flex gap-0.5">MEME</span>
            </li>
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "RWA"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("RWA")}
            >
              <span className="flex gap-0.5">RWA</span>
              <svg className="flex h-2.5 w-2.5">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.2 3.8A.2.2 0 0 0 3 4v1.182a.2.2 0 0 0 .06.143l2.8 2.738a.2.2 0 0 0 .28 0l2.8-2.738A.2.2 0 0 0 9 5.182V4a.2.2 0 0 0-.2-.2H3.2Z"
                  fill="currentColor"
                ></path>
              </svg>
            </li>
          </ul>
        </div>
        {/* Currency List */}
        <div className="h-full">
          <div className="mt-2 mb-1 flex w-full flex-row flex-nowrap items-center justify-between text-xs font-medium">
            <div className="flex max-w-[180px] items-center gap-0.5 pl-2">
              <span>Currency</span>
              <img
                src={
                  activeSort === "None"
                    ? "/ShortIcons.png"
                    : activeSort === "currencyUp"
                      ? "/ShortIcons-Up.png"
                      : "/ShortIcons-Down.png"
                }
                alt="Sort Icon"
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  if (activeSort === "None") {
                    setActiveSort("currencyUp");
                  } else if (activeSort === "currencyUp") {
                    setActiveSort("currencyDown");
                  } else {
                    setActiveSort("None");
                  }
                }}
              />
            </div>
            <div className="flex w-fit flex-1 items-center justify-end gap-0.5">
              <span>Last</span>
              <img
                src="./../../../public/ShortIcons.png"
                alt=""
                className="h-3 w-3 cursor-pointer"
              />
            </div>
            <div className="flex max-w-[120px] min-w-[120px] items-center justify-end gap-0.5">
              <span>Change</span>
              <img
                src="./../../../public/ShortIcons.png"
                alt=""
                className="h-3 w-3 cursor-pointer"
              />
              <img
                src="./../../../public/Swap-arrow.png"
                alt=""
                className="h-3 w-3 cursor-pointer"
              />
            </div>
          </div>
          <div className="custom-scrollbar h-[calc(100%-130px)] overflow-auto">
            <ul className="overflow-auto">
              {totalMarkets?.data?.map((currency) => {
                let base_currency = currency.base_currency.id;
                let quote_currency = convertCurrencyCode(
                  currency.quote_currency.id,
                );
                let symbol = base_currency + " / " + quote_currency;
                return (
                  <li
                    key={currency.id}
                    className="hover:bg-fill-fill1 flex h-9 cursor-pointer items-center justify-between rounded-[6px] px-2 text-nowrap"
                    onClick={() => onClickHandler(currency.id)}
                  >
                    <span className="flex w-[180px] items-center">
                      <img
                        src="./../../../public/Star-nofill.png"
                        alt="Star no fill"
                        className="mr-1 h-4 w-4 cursor-pointer"
                      />
                      <span className="min-w-[160px] text-sm font-medium uppercase">
                        {symbol}
                      </span>
                    </span>
                    <span className="flex w-full flex-1 justify-end text-end text-xs font-medium text-nowrap uppercase">
                      {formatPrice(
                        currency.last_price,
                        currency.quote_currency_precision,
                      )}
                    </span>
                    <span
                      className={` ${currency.day_change_percent > 0 ? "text-success-success1" : "text-danger-danger1"} flex max-w-[100px] min-w-[100px] justify-end text-xs font-medium uppercase`}
                    >
                      {currency.day_change_percent + "%"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar {
          overflow-y: scroll;
          scrollbar-color: transparent transparent; /* برای Firefox */
          box-sizing: content-box;
          padding-right: 4px;
        }

        .custom-scrollbar:hover {
          scrollbar-width: 4px; /* ضخامت در Firefox */
          scrollbar-color: gray transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* ضخامت اسکرول‌بار در کروم */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: gray;
          border-radius: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        /* حذف کامل فلش‌ها و دکمه‌های اسکرول */
        .custom-scrollbar::-webkit-scrollbar-button:single-button {
          display: none;
          width: 0;
          height: 0;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          display: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
