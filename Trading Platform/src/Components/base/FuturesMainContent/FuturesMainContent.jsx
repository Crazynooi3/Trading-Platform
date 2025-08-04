import React from "react";
import ElTabs from "../../Share/Tab/ElTabs";
import TabTextWrapper from "../../Share/Tab/TabTextWrapper";
import FuturesMarginTabs from "../../Share/Tab/FuturesMarginTabs";
import OrderPlace from "../Ordering/OrderPlace";
import SpotSlider from "../../Share/Sliders/SpotSlider";
import OrderBook from "../OrderBook/OrderBook";
import OrderBookTabs from "../../Share/Tab/OrderBookTabs";
import OrderBookHeader from "../OrderBook/OrderBookHeader";
import TPSL from "../Ordering/TPSL";
import OpenPosition from "../OpenPosition/OpenPosition";

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
        <TPSL />
        <OpenPosition />
      </div>
    </div>
  );
}
