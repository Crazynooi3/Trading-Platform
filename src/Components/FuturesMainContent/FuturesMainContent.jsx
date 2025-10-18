import React, { useState, useEffect } from "react";
import ElTabs from "../Tab/ElTabs";
import TabTextWrapper from "../Tab/TabTextWrapper";
import FuturesMarginTabs from "../Tab/FuturesMarginTabs";
import OrderPlace from "../Ordering/OrderPlace";
import SpotSlider from "../Sliders/SpotSlider";
import OrderBook from "../OrderBook/OrderBook";
import OrderBookTabs from "../Tab/OrderBookTabs";
import OrderBookHeader from "../OrderBook/OrderBookHeader";
import TPSL from "../Ordering/TPSL";
import OpenPosition from "../OpenPosition/OpenPosition";
import Chart from "../Chart/Chart";
import SelectCurrency from "../Tab/SelectCurrency";
import FuturesOrder from "../FuturesOrder/FuturesOrder";
import { VolumeProvider } from "../../Utilities/Context/VolumeContext";
import Trick from "../Trick/Trick";
import ShortLongTrigger from "../Chart/ShortLongTrigger";
import { AggregationProvider } from "../../Utilities/Context/AggregationContext";
import Trades from "../OrderBook/Trades";
export default function FuturesMainContent() {
  const [activeTab, setActiveTab] = useState("Order Book");
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

          <Chart />
        </div>
        <VolumeProvider>
          <div className="border-border-border1 col-span-2 row-span-6 border-l text-white xl:h-[650px]">
            <div className="border-border-border1 flex h-10 items-center justify-between border-b px-4">
              <div className="flex h-full w-full items-center justify-between">
                <div className="flex h-full items-center">
                  <OrderBookTabs
                    title="Order Book"
                    state={activeTab}
                    setState={setActiveTab}
                  />
                  <OrderBookTabs
                    title="Trades"
                    state={activeTab}
                    setState={setActiveTab}
                  />
                </div>
              </div>
            </div>
            {activeTab === "Order Book" && (
              <>
                <OrderBookHeader />
                <OrderBook />
                <ShortLongTrigger />
              </>
            )}
            {activeTab === "Trades" && <Trades />}
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
