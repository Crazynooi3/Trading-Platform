import { useEffect, useMemo, useState } from "react";
import OrderBookTabs from "./OrderBookTabs";
import { useMarkets } from "../../../Utilities/Hooks/useMarket";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SelectCurrency(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("All");
  const [activeSort, setActiveSort] = useState("None");
  const [searchInputValue, setSearchInputValue] = useState();
  const { data: allMarketData, isLoading, error } = useMarkets();

  // path maneger
  useEffect(() => {
    if (location.pathname === "/trade") {
      navigate("/trade/USDT/IRT");
    }
  }, [navigate]);

  const finalMarketData = useMemo(() => {
    if (activeTab === "New") {
      // ✅ اینجا دیگه async لازم نیست
      return [...allMarketData].reverse().slice(0, 10);
    }
    console.log(allMarketData);

    return allMarketData;
  }, [activeTab, allMarketData]);

  const filteredMarkets = useMemo(() => {
    // اول فقط مارکت‌های visible
    const visibleMarkets = (finalMarketData || []).filter(
      (market) => market.is_visible,
    );

    if (!searchInputValue) return visibleMarkets;

    // 🔹 نرمال‌سازی ورودی کاربر
    let search = searchInputValue.toLowerCase();
    if (search === "irt") search = "irr";

    return visibleMarkets.filter((market) => {
      const base = market.base_currency?.id?.toLowerCase() || "";
      const quote = market.quote_currency?.id?.toLowerCase() || "";

      // 🔹 نرمال‌سازی دیتا
      const normalizedQuote = quote === "irr" ? "irt" : quote;

      const enName =
        market.base_currency?.currency_name?.en?.toLowerCase() || "";
      const faName =
        market.base_currency?.currency_name?.fa?.toLowerCase() || "";
      const pair = `${base}${normalizedQuote}`; // مثل BTCIRT

      // ✅ اولویت‌ها
      if (pair === search) return true;
      if (base === search || normalizedQuote === search) return true;
      if (enName === search || faName === search) return true;

      // ✅ جستجوی جزئی
      return (
        base.includes(search) ||
        normalizedQuote.includes(search) ||
        enName.includes(search) ||
        faName.includes(search) ||
        pair.includes(search)
      );
    });
  }, [searchInputValue, finalMarketData]);

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

  const inputHandler = (event) => {
    let inputValue = event.target.value;
    setSearchInputValue(inputValue.toUpperCase());
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
            autoComplete="off"
            spellCheck="false"
            className="bold w-full text-sm font-bold outline-0 placeholder:text-xs"
            value={searchInputValue}
            onChange={(e) => inputHandler(e)}
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
                activeTab === "USDT"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("USDT")}
            >
              <span className="flex gap-0.5">
                {/* <img
                  src="./../../../public/FireIcon.svg"
                  alt=""
                  className="h-4 w-4"
                /> */}
                USDT
              </span>
            </li>
            <li
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-xs font-medium text-nowrap ${
                activeTab === "IRT"
                  ? "bg-fill-fill4 text-text-text0"
                  : "text-text-text4 bg-transparent"
              }`}
              onClick={() => setActiveTab("IRT")}
            >
              <span className="flex gap-0.5">IRT</span>
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
              {filteredMarkets?.map((currency) => {
                let base_currency = currency.base_currency.id;
                let quote_currency = convertCurrencyCode(
                  currency.quote_currency.id,
                );
                let symbol = base_currency + " / " + quote_currency;
                return (
                  <Link to={`/trade/${base_currency}/${quote_currency}`}>
                    <li
                      key={currency.id}
                      className="hover:bg-fill-fill1 flex h-9 cursor-pointer items-center justify-between rounded-[6px] px-2 text-nowrap"
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
                  </Link>
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
