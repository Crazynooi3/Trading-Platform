import React from "react";

export default function OrderBookTabs() {
  return (
    <div className="border-border-border1 flex h-10 items-center justify-between border-b px-4">
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center">
          <div className="text-text-text1 mr-5 flex h-full items-center justify-center border-b-2 font-medium">
            <span>Order Book</span>
          </div>
          <div className="text-text-text3 flex h-full items-center justify-center font-medium">
            <span>Trades</span>
          </div>
        </div>
      </div>
    </div>
  );
}
