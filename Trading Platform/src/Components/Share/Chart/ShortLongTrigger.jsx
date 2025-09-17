import React from "react";

export default function ShortLongTrigger() {
  return (
    <div className="mx-4 my-2 h-6">
      <div>
        <div className="flex gap-0.5">
          <div className="bg-success-success1 long-side relative h-1.5 w-1/2 overflow-hidden"></div>
          <div className="bg-danger-danger1 short-side relative h-1.5 w-1/2 overflow-hidden"></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-success-success1 text-xs">Buy : 88%</span>
          <span className="text-danger-danger1 text-xs">Sell : 12%</span>
        </div>
      </div>
    </div>
  );
}
