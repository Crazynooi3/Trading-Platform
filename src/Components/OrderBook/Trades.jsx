import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompletOrder } from "../../ReduxConfig/entities/marketComplet";
import "./index.css";

export default function Trades() {
  const orderCompleteOrder = useSelector((state) => state.completeOrder);
  const { symbolID } = useSelector((state) => state.symbolIDPrecision);
  const { rDepth, rPriceAg, currentSymbol } = useSelector(
    (state) => state.webSocketMessage,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCompletOrder(symbolID));
  }, [symbolID, rPriceAg]);

  return (
    <>
      <div className="">
        <ul className="no-scrollbar h-[610px] w-full flex-col justify-start overflow-y-scroll p-4 text-nowrap">
          <li className="text-text-text3 sticky mb-2 flex max-h-5 justify-between text-xs">
            <span className="w-1/3">Price(USDT)</span>
            <span className="w-1/3">Size(Baby)</span>
            <span className="w-1/3 text-end">Time</span>
          </li>
          {orderCompleteOrder.data.map((order) => {
            let time = order.created_at.split(" ")[1].split(".")[0];
            return (
              <li className="mb-2 flex max-h-5 justify-between text-xs">
                <span
                  className={`${
                    order.type === "buy"
                      ? "text-success-success1"
                      : "text-danger-danger1"
                  } w-1/3`}>
                  {Number(order.price / 10).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="w-1/3">{order.amount}</span>
                <span className="w-1/3 text-end">{time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
