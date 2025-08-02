import React from "react";
import ElTabs from "../../Share/Tab/ElTabs";
import TabTextWrapper from "../../Share/Tab/TabTextWrapper";
import FuturesMarginTabs from "../../Share/Tab/FuturesMarginTabs";
import OrderPlace from "../Ordering/OrderPlace";
import SpotSlider from "../../Share/Sliders/SpotSlider";
import OrderBook from "../OrderBook/OrderBook";
import OrderBookTabs from "../../Share/Tab/OrderBookTabs";
import OrderBookHeader from "../OrderBook/OrderBookHeader";

export default function FuturesMainContent() {
  return (
    <div className="grid grid-cols-10">
      <div className="col-span-6 text-white">1</div>
      <div className="border-border-border1 col-span-2 border-l text-white">
        <OrderBookTabs />
        <OrderBookHeader />
        <OrderBook />
      </div>
      <div className="border-border-border1 col-span-2 border-l text-white">
        <ElTabs />
        <FuturesMarginTabs />
        <TabTextWrapper />
        <OrderPlace />
        <SpotSlider />
        {/* TP/SL Component */}
        <div className="border-border-border1 mx-4 my-3 flex h-8 items-center border-t border-b">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="TP/SL"
              className="border-border-border2 h-3 w-3 appearance-none rounded-xs border"
            />
            <label htmlFor="TP/SL" className="text-xs">
              TP/SL
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
