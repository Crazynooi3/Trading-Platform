import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import * as Func from "./../../Utilities/Funections";
import OrderInput from "../Input/OrderInput";

export default function OrderPlace() {
  const [orderType, setOrderType] = useState("Market");
  const { base, quote } = useParams();
  const orderTypeHandler = (e) => {
    setOrderType(e.target.innerHTML);
  };
  return (
    <div className="mt-4 px-4">
      <div className="flex items-center justify-between text-sm">
        <div className="space-x-4">
          <span
            className={`${orderType === "Market" && "!text-text-text1"} text-text-text3 hover:!text-text-text1 cursor-pointer`}
            onClick={(e) => orderTypeHandler(e)}>
            Market
          </span>
          <span
            className={`${orderType === "Limit" && "!text-text-text1"} text-text-text3 hover:!text-text-text1 cursor-pointer`}
            onClick={(e) => orderTypeHandler(e)}>
            Limit
          </span>
          <span
            className={`${orderType === "Trigger Order" && "!text-text-text1"} text-text-text3 hover:!text-text-text1 cursor-pointer`}
            onClick={(e) => orderTypeHandler(e)}>
            Trigger Order
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 text-white">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </div>
      {orderType === "Market" && <OrderInput text="Size" detail={base} />}
      {orderType === "Limit" && (
        <>
          <OrderInput text="Price" detail={quote} />
          <OrderInput text="Size" detail={base} />
        </>
      )}

      {/* <OrderInput text="Size" detail=" XRP" /> */}
    </div>
  );
}
