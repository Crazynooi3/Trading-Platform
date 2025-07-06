import React from "react";

export default function OrderInput() {
  return (
    <div className="mt-2">
      <div className="bg-fill-fill4 flex h-10 w-full items-center rounded-lg px-2.5 outline-white focus-within:outline hover:outline">
        <span className="text-text-text4 mr-1 text-sm">Size</span>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          dir="rtl"
          maxLength={5}
          className="mr-3 w-full text-xs outline-0 focus:outline-0"
        />
        <span className="flex items-center">
          <span className="mr-1 text-sm text-white">XRP</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            class="size-3 text-white"
          >
            <path
              fill="currentColor"
              d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
