import React, { useState } from "react";
import OrderBookTabs from "./OrderBookTabs";

export default function SelectCurrency() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeSort, setActiveSort] = useState("None");
  return (
    <div className="absolute top-14 z-10 hidden cursor-auto transition-all group-hover:block before:absolute before:-top-14 before:h-[60px] before:w-[430px] before:content-[''] hover:block">
      <div className="bg-base-base6 border-border-border1 h-[600px] min-h-[580px] w-[430px] rounded-lg border p-4">
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
            tab2="USDT-M Futures"
            tab3="USDC Futures"
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
        <div>
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-0.5">
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

            <div className="flex items-center gap-0.5">
              <span>Last</span>
              <img
                src="./../../../public/ShortIcons.png"
                alt=""
                className="h-3 w-3 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-0.5">
              <span>Change</span>
              <img
                src="./../../../public/ShortIcons.png"
                alt=""
                className="h-3 w-3 cursor-pointer"
              />
            </div>
          </div>
          <ul>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
