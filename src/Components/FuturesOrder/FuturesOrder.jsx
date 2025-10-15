import React from "react";
import OrderBookTabs from "../Tab/OrderBookTabs";
import TabsItems from "../Tab/TabsItems";

export default function FuturesOrder() {
  return (
    <div>
      <div className="flex flex-col">
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
                style={{ width: "calc(100% - 2rem)" }}>
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
                style={{ width: "calc(100% - 2rem)" }}>
                Hide Other Contracts
              </label>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-4 text-xs">
            <table className="w-full table-fixed appearance-none break-words break-all">
              <thead className="h-10 text-nowrap">
                <tr className="border-border-border1 table-row h-14 border-b font-normal">
                  <th
                    className="mb-[1px] w-[180px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Futures
                  </th>
                  <th
                    className="mb-[1px] w-36 pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Size
                  </th>
                  <th
                    className="mb-[1px] w-[188px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Unrealized PnL|% (L)
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Entry Price
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Breack Even Price
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Mark Price
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Liq. Price
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Margin Ratio
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Margin
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    Position PnL
                  </th>
                  <th
                    className="mb-[1px] pt-[11px] pb-2.5 text-start"
                    colSpan={1}
                    rowSpan={1}>
                    TP/SL
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
