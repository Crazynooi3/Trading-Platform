import React, { useState, useEffect } from "react";
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
import Chart from "../../Share/Chart/Chart";
import SelectCurrency from "../../Share/Tab/SelectCurrency";
import FuturesOrder from "../FuturesOrder/FuturesOrder";
import { VolumeProvider } from "../../../Utilities/Context/VolumeContext";
import Trick from "../../Share/Trick/Trick";
import ShortLongTrigger from "../../Share/Chart/ShortLongTrigger";
import { AggregationProvider } from "../../../Utilities/Context/AggregationContext";
export default function FuturesMainContent() {
  return (
    <AggregationProvider>
      <div className="grid grid-flow-row grid-cols-12 grid-rows-8">
        <div className="col-span-8 row-span-6 text-white">
          {/* Trick */}
          <div className="flex h-16 items-center pr-4 pl-2">
            {/* Left */}
            <Trick />
            {/* right */}
            <div></div>
          </div>

          <Chart symbol={"BTCUSDT"} />
        </div>
        <VolumeProvider>
          <div className="border-border-border1 col-span-2 row-span-6 border-l text-white xl:h-[650px]">
            <OrderBookTabs tab1="Order Book" tab2="Trades" />
            <OrderBookHeader />
            <OrderBook />
            <ShortLongTrigger />
          </div>
        </VolumeProvider>
        <div className="border-border-border1 col-span-2 row-span-6 border-l text-white">
          <ElTabs />
          <FuturesMarginTabs />
          <TabTextWrapper />
          <OrderPlace />
          <SpotSlider />
          <TPSL />
          <OpenPosition />
        </div>

        <div className="text-text-text0 border-border-border1 col-span-10 row-span-2 border-t">
          <FuturesOrder />
        </div>
        <div className="text-text-text0 border-border-border1 col-span-2 row-span-2 border-t border-l">
          5
        </div>
      </div>
    </AggregationProvider>
  );
}
