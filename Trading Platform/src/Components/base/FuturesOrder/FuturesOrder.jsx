import React from "react";
import OrderBookTabs from "../../Share/Tab/OrderBookTabs";
import TabsItems from "../../Share/Tab/TabsItems";

export default function FuturesOrder() {
  return (
    <div>
      <div className="flex flex-row">
        <div className="border-border-border1 flex w-full items-center justify-between border-b">
          <TabsItems
            tab1="Positions"
            tab2="Open Orders"
            tab3="Order History"
            tab4="Position History"
            tab5="Trade History"
            tab6="Transaction History"
            tab7="Assets"
          />
          <div className="flex items-center gap-3 px-4">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="BonusOrderOnly"
                className="border-border-border2 peer h-3.5 w-3.5 appearance-none rounded-xs border checked:appearance-auto"
              />
              <label
                htmlFor="BonusOrderOnly"
                className="flex w-fit justify-between text-xs text-nowrap select-none"
                style={{ width: "calc(100% - 2rem)" }}
              >
                Bonus Order Only
              </label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="HideOtherContracts"
                className="border-border-border2 peer h-3.5 w-3.5 appearance-none rounded-xs border checked:appearance-auto"
              />
              <label
                htmlFor="HideOtherContracts"
                className="flex w-fit justify-between text-xs text-nowrap select-none"
                style={{ width: "calc(100% - 2rem)" }}
              >
                Hide Other Contracts
              </label>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
