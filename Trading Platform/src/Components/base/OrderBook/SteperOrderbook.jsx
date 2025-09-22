import React, { useEffect, useState } from "react";
import { useAggregation } from "../../../Utilities/Context/AggregationContext";

export default function SteperOrderbook({ startOfSteper }) {
  useEffect(() => {
    setSteper(startOfSteper);
  }, []);
  const { steper, setSteper } = useAggregation();
  return (
    <div className="group relative flex w-fit cursor-pointer items-center justify-end gap-1">
      <span className="text-xs">{steper}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        class="text-fill-fill3 group-hover:text-text-text0 size-3 transition-all delay-200 group-hover:rotate-180"
      >
        <path
          fill="currentColor"
          d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
        ></path>
      </svg>
      <span className="bg-fill-fill2 border-fill-fill3 trans invisible absolute top-5 z-30 origin-top scale-y-0 rounded-lg border opacity-0 transition-all delay-100 duration-200 group-hover:visible group-hover:scale-y-100 group-hover:opacity-100">
        <ul className="space-y-1 text-center text-sm">
          <li
            className="hover:bg-fill-fill3 cursor-pointer px-2 py-1"
            onClick={(e) => setSteper(e.target.innerHTML)}
          >
            {startOfSteper * 1}
          </li>
          <li
            className="hover:bg-fill-fill3 cursor-pointer px-2 py-1"
            onClick={(e) => setSteper(e.target.innerHTML)}
          >
            {startOfSteper * 10}
          </li>
          <li
            className="hover:bg-fill-fill3 cursor-pointer px-2 py-1"
            onClick={(e) => setSteper(e.target.innerHTML)}
          >
            {startOfSteper * 100}
          </li>
          <li
            className="hover:bg-fill-fill3 cursor-pointer px-2 py-1"
            onClick={(e) => setSteper(e.target.innerHTML)}
          >
            {startOfSteper * 1000}
          </li>
        </ul>
      </span>
    </div>
  );
}
