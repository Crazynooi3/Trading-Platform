import React from "react";
import ElTabs from "../../Share/Tab/ElTabs";

export default function FuturesMainContent() {
  return (
    <div className="grid h-screen grid-cols-6">
      <div className="col-span-4 text-white">1</div>
      <div className="col-span-1 text-white">2</div>
      <div className="border-border-border1 col-span-1 border-l text-white">
        <ElTabs />
      </div>
    </div>
  );
}
