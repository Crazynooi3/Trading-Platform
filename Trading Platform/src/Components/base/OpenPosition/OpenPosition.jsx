import React from "react";

export default function OpenPosition() {
  return (
    <div className="mx-4 mt-4">
      <div className="flex items-center gap-2">
        {/* BTN */}
        <div className="bg- bg-green-green2 text-text-text0 hover:bg-green-green3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold">
          Buy Long
        </div>
        <div className="bg- bg bg-red-red2 text-text-text0 hover:bg-red-red3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold">
          Sell Short
        </div>
      </div>
      <div>
        {/* Detials */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs">
            Liq. Price
            <br />
            <span className="text-text-text0 text-sm">0.0</span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs">
            Liq. Price
            <br />
            <span className="text-text-text0 text-sm">0.0</span>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs">
            Margin(USDT)
            <br />
            <span className="text-text-text0 text-sm">5.8</span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs">
            Margin(USDT)
            <br />
            <span className="text-text-text0 text-sm">5.8</span>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs">
            Max Long(BTC)
            <br />
            <span className="text-text-text0 text-sm">0.001</span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs">
            Max Long(BTC)
            <br />
            <span className="text-text-text0 text-sm">0.001</span>
          </span>
        </div>
      </div>
    </div>
  );
}
