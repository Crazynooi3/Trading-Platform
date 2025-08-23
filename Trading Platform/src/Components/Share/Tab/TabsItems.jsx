import React from "react";
import { useState } from "react";

export default function TabsItems(props) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="border-border-border1 flex h-10 items-center justify-between px-4">
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center">
          {Object.values(props).map((tab, index) => (
            <div
              key={index}
              className={`text-text-text3 hover:text-text-text0 mr-5 flex h-full cursor-pointer items-center justify-center border-b-2 text-sm font-medium text-nowrap ${
                activeTab === index
                  ? "border-text-text1 text-text-text1 !important"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(index)}
            >
              <span>{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
