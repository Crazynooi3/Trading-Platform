import React from "react";
import ElTabs from "../../Share/Tab/ElTabs";
import TabTextWrapper from "../../Share/Tab/TabTextWrapper";
import FuturesMarginTabs from "../../Share/Tab/FuturesMarginTabs";
import OrderPlace from "../Ordering/OrderPlace";
import SpotSlider from "../../Share/Sliders/SpotSlider";
import OrderBook from "../OrderBook/OrderBook";

export default function FuturesMainContent() {
  return (
    <div className="grid h-lvh grid-cols-10">
      <div className="col-span-6 text-white">1</div>
      <div className="col-span-2 h-lvh text-white">
        <OrderBook />
      </div>
      <div className="border-border-border1 col-span-2 border-l text-white">
        <ElTabs />
        <FuturesMarginTabs />
        <TabTextWrapper />
        <OrderPlace />
        <SpotSlider />
      </div>
    </div>
  );
}
