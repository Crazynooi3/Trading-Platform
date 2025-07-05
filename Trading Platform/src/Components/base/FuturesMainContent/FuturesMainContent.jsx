import React from "react";
import ElTabs from "../../Share/Tab/ElTabs";
import TabTextWrapper from "../../Share/Tab/TabTextWrapper";
import FuturesMarginTabs from "../../Share/Tab/FuturesMarginTabs";

export default function FuturesMainContent() {
  return (
    <div className="grid h-screen grid-cols-10">
      <div className="col-span-6 text-white">1</div>
      <div className="col-span-2 text-white">2</div>
      <div className="border-border-border1 col-span-2 border-l text-white">
        <ElTabs />
        <FuturesMarginTabs />
        <div className="">
          <TabTextWrapper />
        </div>
      </div>
    </div>
  );
}
