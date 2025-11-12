import React, { useState } from "react";
import OrderBookTabs from "../Tab/OrderBookTabs";
import * as Func from "./../../Utilities/Funections";
import { useUserOrderPolling } from "../../Utilities/Hooks/useUserOrder";
import { useDispatch, useSelector } from "react-redux";
import { DeleteUserOrder } from "../../Utilities/API/DeleteOrder";
import { getUserWallet } from "../../ReduxConfig/entities/userWallet";
import Pageination from "../pageination/pageination";
import "./index.css";
import { toast } from "react-toastify";
import { Slider } from "antd";

export default function FuturesOrder() {
  const dispatch = useDispatch();

  const [currentPage, setCurentPage] = useState(1);
  const userTokenSelector = useSelector((state) => state.userToken);
  const {
    data: pendingOrder,
    isLoading,
    error,
    refetch,
  } = useUserOrderPolling(userTokenSelector.token, "PENDING");
  const {
    data: completedOrder,
    isLoading: isLoadingComp,
    isFetching,
    errorComp,
  } = useUserOrderPolling(
    userTokenSelector.token,
    "COMPLETED",
    null,
    currentPage,
  );

  const [activeTab, setActiveTab] = useState("Open Order");

  const orderCansleHandler = (orderID) => {
    DeleteUserOrder(userTokenSelector.token, orderID).then((res) => {
      if (res.status === "OK") {
        refetch();
        dispatch(getUserWallet(userTokenSelector.token));
        toast.success("سفارش لغو شد", {
          position: "top-center",
          autoClose: 5000,
          rtl: true,
          className: "toast",
        });
      }
    });
  };

  return (
    <div>
      <div className="flex h-full flex-col">
        <div className="border-border-border1 flex w-full items-center justify-between border-b">
          <div className="flex h-10 items-center px-2">
            <OrderBookTabs
              title={"Open Order"}
              state={activeTab}
              setState={setActiveTab}
            />
            <OrderBookTabs
              title={"Order History"}
              state={activeTab}
              setState={setActiveTab}
            />
            <OrderBookTabs
              title={"Trade History"}
              state={activeTab}
              setState={setActiveTab}
            />
          </div>
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

        <div className="custom-scrollbar mx-4 max-h-[260px] flex-1 overflow-y-scroll text-xs">
          {activeTab === "Open Order" && (
            <table className="w-full appearance-none break-words break-all">
              <thead className="relative h-10 text-nowrap">
                <tr className="border-border-border1 bg-base-base1 sticky top-0 z-10 table-row h-14 border-b font-normal">
                  <th className="mb-[1px] w-[180px] pt-[11px] pb-2.5 pl-2 text-start">
                    Time
                  </th>
                  <th className="mb-[1px] w-[180px] pt-[11px] pb-2.5 text-start">
                    Tradeing Pairs
                  </th>
                  <th className="mb-[1px] w-36 pt-[11px] pb-2.5 text-start">
                    Type
                  </th>
                  <th className="mb-[1px] w-[188px] pt-[11px] pb-2.5 text-start">
                    Order Type
                  </th>
                  <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                    Trigger Price
                  </th>
                  <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                    Order Size
                  </th>
                  <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                    Completed
                  </th>
                  <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                    Completed Rate
                  </th>
                  <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                    Not Completed
                  </th>
                  <th className="mb-[1px] pt-[11px] pr-2 pb-2.5 text-end">
                    Action
                  </th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingOrder?.status === "OK" &&
                  pendingOrder.data.map((order) => {
                    const orderType =
                      String(order.type).charAt(0).toUpperCase() +
                      String(order.type).slice(1).toLowerCase();
                    const [dateStr, fullTime] = order.created_at.split(" ");
                    const time = fullTime.split(".")[0];

                    const [gy, gm, gd] = dateStr.split("-").map(Number); // [2025, 10, 21]
                    const [jy, jm, jd] = Func.gregorianToJalali(gy, gm, gd);
                    const jalaliDate = Func.formatJalaliDate(jy, jm, jd); // "1404-08-29"
                    const tehranTime = Func.formatTimeToTehran(
                      order.created_at,
                    );

                    return (
                      <tr className="hover:bg-fill-fill1 h-14">
                        <td className="pl-2">
                          {jalaliDate}
                          <br />
                          {tehranTime}
                        </td>
                        <td>
                          {" "}
                          {order.market.base_currency.id} /{" "}
                          {order.market.quote_currency.id === "IRR"
                            ? "IRT"
                            : order.market.quote_currency.id}
                        </td>
                        <td>
                          {orderType === "Buy" ? (
                            <span class="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
                              {orderType} Order
                            </span>
                          ) : (
                            <span class="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20">
                              {orderType} Order
                            </span>
                          )}
                        </td>
                        <td>{order.execution} Order</td>
                        <td>
                          {Number(order.price / 10).toLocaleString("en-US")}
                        </td>
                        <td>
                          {order.amount} {order.market.base_currency.id}
                        </td>
                        <td>
                          {order.completed_amount}{" "}
                          {order.market.base_currency.id}
                        </td>
                        <td>
                          <Slider
                            className="fixed-width-slider"
                            value={
                              (100 * order.completed_amount) / order.amount
                            }
                            marks={false}
                            styles={{
                              track: { backgroundColor: "green " },
                              rail: { backgroundColor: "green" },
                              handle: { display: "none" },
                            }}
                            min={0}
                            max={100}
                          />
                          {(100 * order.completed_amount) / order.amount} %
                        </td>
                        <td>
                          {order.amount - order.completed_amount}{" "}
                          {order.market.base_currency.id}
                        </td>
                        <td className="pr-2 text-end">
                          <button
                            className="bg-fill-fill4 hover:bg-fill-fill6 border-fill-fill2 cursor-pointer rounded-sm border-[0.01px] p-2"
                            onClick={() => orderCansleHandler(order.id)}>
                            Cansle Order
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
          {activeTab === "Order History" && (
            <div className="relative">
              <table className="w-full appearance-none break-words break-all">
                <thead className="relative h-10 text-nowrap">
                  <tr className="border-border-border1 bg-base-base1 sticky top-0 z-10 table-row h-14 border-b font-normal">
                    <th className="mb-[1px] w-[180px] pt-[11px] pb-2.5 pl-2 text-start">
                      Time
                    </th>
                    <th className="mb-[1px] w-[180px] pt-[11px] pb-2.5 text-start">
                      Tradeing Pairs
                    </th>
                    <th className="mb-[1px] w-36 pt-[11px] pb-2.5 text-start">
                      Type
                    </th>
                    <th className="mb-[1px] w-[188px] pt-[11px] pb-2.5 text-start">
                      Order Type
                    </th>
                    <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                      Trigger Price
                    </th>
                    <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                      Order Size
                    </th>
                    <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                      Completed
                    </th>
                    <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                      Completed Rate
                    </th>
                    <th className="mb-[1px] pt-[11px] pb-2.5 text-start">
                      Not Completed
                    </th>
                    <th className="mb-[1px] pt-[11px] pr-2 pb-2.5 text-end">
                      Action
                    </th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrder?.status === "OK" &&
                    completedOrder.data.map((order) => {
                      const orderType =
                        String(order.type).charAt(0).toUpperCase() +
                        String(order.type).slice(1).toLowerCase();
                      const [dateStr, fullTime] = order.created_at.split(" ");
                      const time = fullTime.split(".")[0];

                      const [gy, gm, gd] = dateStr.split("-").map(Number); // [2025, 10, 21]
                      const [jy, jm, jd] = Func.gregorianToJalali(gy, gm, gd);
                      const jalaliDate = Func.formatJalaliDate(jy, jm, jd); // "1404-08-29"
                      const tehranTime = Func.formatTimeToTehran(
                        order.created_at,
                      );

                      return (
                        <tr className="hover:bg-fill-fill1 h-14">
                          <td className="pl-2">
                            {jalaliDate}
                            <br />
                            {tehranTime}
                          </td>
                          <td>
                            {" "}
                            {order.market.base_currency.id} /{" "}
                            {order.market.quote_currency.id === "IRR"
                              ? "IRT"
                              : order.market.quote_currency.id}
                          </td>
                          <td>
                            {orderType === "Buy" ? (
                              <span class="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
                                {orderType} Order
                              </span>
                            ) : (
                              <span class="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20">
                                {orderType} Order
                              </span>
                            )}
                          </td>
                          <td>{order.execution} Order</td>
                          <td>
                            {Number(order.price / 10).toLocaleString("en-US")}
                          </td>
                          <td>
                            {Math.ceil(order.amount)}{" "}
                            {order.market.base_currency.id}
                          </td>
                          <td>
                            {Math.ceil(order.completed_amount)}{" "}
                            {order.market.base_currency.id}
                          </td>
                          <td>
                            {Math.ceil(
                              (100 * order.completed_amount) / order.amount,
                            )}{" "}
                            %
                          </td>
                          <td>
                            {order.amount - order.completed_amount}{" "}
                            {order.market.base_currency.id}
                          </td>
                          <td className="pr-2 text-end"></td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {/* {isFetching && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                </div>
              )} */}
            </div>
          )}
          <div></div>
        </div>
        {completedOrder?.total_pages > 1 && activeTab === "Order History" && (
          <Pageination
            pages={completedOrder?.total_pages}
            setCurentPage={setCurentPage}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
}
