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
import Chart from "../../Share/Chart/Chart";

export default function FuturesMainContent() {
  return (
    <div className="grid h-screen grid-flow-row grid-cols-10 grid-rows-8">
      <div className="col-span-6 row-span-6 text-white">
        {/* Trick */}
        <div className="flex h-16 items-center pr-4 pl-2">
          {/* Left */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="group hover:bg-fill-fill4 mr-2 flex items-center rounded-md px-2 py-1 transition-all">
                <div className="flex items-center">
                  <span className="text-xl font-medium">BTCUSDT</span>
                  <span className="text-text-text3 ml-1 text-xs font-semibold">
                    perpetual
                  </span>
                </div>
                <span className="mr-1.5 ml-3 transition-all group-hover:rotate-180">
                  <svg class="text-text-text3 h-4 w-4">
                    <path
                      d="m5.9 7 1.954 2.093a.2.2 0 0 0 .292 0L10.1 7m4.4 1a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      fill="none"
                    ></path>
                  </svg>
                </span>
              </div>
              <span className="hover:text-text-text0 mr-1.5 transition-all">
                <svg class="text-text-text3 hover:text-text-text0 h-4 w-4">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M.9 1.7c0-.11.09-.2.2-.2h4.994a.2.2 0 0 1 .09.021l1.772.886a.2.2 0 0 0 .16.009l2.408-.903a.2.2 0 0 1 .07-.013H14.9c.11 0 .2.09.2.2v11.8a.2.2 0 0 1-.2.2h-4.594a.2.2 0 0 0-.133.051l-.629.565a.2.2 0 0 1-.133.05H6.594a.2.2 0 0 1-.133-.05l-.633-.565a.2.2 0 0 0-.133-.051H1.1a.2.2 0 0 1-.2-.2V1.7Zm1.4 1a.2.2 0 0 0-.2.2v9.4c0 .11.09.2.2.2h3.853a.2.2 0 0 1 .133.05l.633.566a.2.2 0 0 0 .133.05h1.9a.2.2 0 0 0 .133-.05l.628-.565a.2.2 0 0 1 .134-.051H13.7a.2.2 0 0 0 .2-.2V2.9a.2.2 0 0 0-.2-.2h-2.888a.2.2 0 0 0-.07.013l-2.695 1.01a.2.2 0 0 1-.16-.008L5.902 2.72a.2.2 0 0 0-.09-.021H2.3Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.6 8.433a.2.2 0 0 1-.2-.2V3.1h1.2v5.133a.2.2 0 0 1-.2.2h-.8Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="ml-4">
              <span className="text-success-success1 text-2xl font-medium">
                3.0328
              </span>
            </div>
            <div className="flex items-center overflow-x-auto pr-5 pl-10">
              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
                  Market Price
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  3.0316
                </span>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
                  Index
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  3.0316
                </span>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
                  Funding Rate/Countdown
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-warning block text-xs font-medium">
                    0.0421%
                  </span>
                  <span className="text-text-text0 block text-xs font-medium">
                    02:45:15
                  </span>
                </div>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 flex cursor-help items-center gap-1 text-xs">
                  24h Change
                  <span>
                    <svg className="text-primary-primary3 h-4 w-4">
                      <path
                        d="M4.5 6V3l-2 1.5 2 1.5Z"
                        fill="none"
                        stroke="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.68 2.24A.2.2 0 0 1 5 2.4v4.2a.2.2 0 0 1-.32.16l-2.8-2.1a.2.2 0 0 1 0-.32l2.8-2.1ZM3.333 4.5 4 5V4l-.667.5Z"
                        fill="none"
                        stroke="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.5 5.1h-6V3.9h6A3.1 3.1 0 0 1 13.6 7v.4a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2V7a1.9 1.9 0 0 0-1.9-1.9Z"
                        fill="currentColor"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M11.5 10v3l2-1.5-2-1.5Z"
                        fill="currentColor"
                        stroke="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.32 13.76a.2.2 0 0 1-.32-.16V9.4a.2.2 0 0 1 .32-.16l2.8 2.1a.2.2 0 0 1 0 .32l-2.8 2.1Zm1.346-2.26L12 11v1l.666-.5Z"
                        fill="currentColor"
                        stroke="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.5 10.9h6v1.2h-6A3.1 3.1 0 0 1 2.4 9v-.4c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2V9c0 1.05.85 1.9 1.9 1.9Z"
                        fill="currentColor"
                        stroke="currentColor"
                      ></path>
                    </svg>
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-success-success1 block text-xs font-medium">
                    0.0085
                  </span>
                  <span className="text-success-success1 block text-xs font-medium">
                    +1.35%
                  </span>
                </div>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs">
                  24 High
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  3.1057
                </span>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs">
                  24 Low
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  3.1057
                </span>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs">
                  24h Valume(XRP)
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  313,656,850.6
                </span>
              </div>

              <div className="mr-4">
                <span className="text-text-text4 mb-1 block cursor-help text-xs">
                  24h Valume(USDT)
                </span>
                <span className="text-text-text0 block text-xs font-medium">
                  957,656,850.6325
                </span>
              </div>
            </div>
          </div>
          {/* right */}
          <div></div>
        </div>

        <Chart symbol={"BTCUSDT"} />
      </div>
      <div className="border-border-border1 col-span-2 row-span-6 border-l text-white">
        <OrderBookTabs />
        <OrderBookHeader />
        <OrderBook />
      </div>
      <div className="border-border-border1 col-span-2 row-span-6 border-l text-white">
        <ElTabs />
        <FuturesMarginTabs />
        <TabTextWrapper />
        <OrderPlace />
        <SpotSlider />
        <TPSL />
        <OpenPosition />
      </div>

      <div className="text-text-text0 border-border-border1 col-span-8 row-span-2 border-t">
        4
      </div>
      <div className="text-text-text0 border-border-border1 col-span-2 row-span-2 border-t border-l">
        5
      </div>
    </div>
  );
}
