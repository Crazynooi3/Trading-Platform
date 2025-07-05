import React from "react";

export default function FuturesMarginTabs() {
  return (
    <div className="flex h-12 items-center justify-between px-4 text-sm">
      <div className="flex items-center justify-between">
        <span>Cross</span>
        <img
          src="./../../../public/ArrowDropDown.svg"
          className="ml-1 -rotate-90"
          alt=""
          width={"16px"}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#838a97]">Leverage</span>
        <span className="ml-1">10X</span>
        <img
          src="./../../../public/ArrowDropDown.svg"
          className="ml-1 -rotate-90"
          alt=""
          width={"16px"}
        />
      </div>
    </div>
  );
}
