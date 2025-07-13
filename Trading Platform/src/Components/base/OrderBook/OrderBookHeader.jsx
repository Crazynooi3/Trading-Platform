import React from "react";

export default function OrderBookHeader() {
  return (
    <>
      <div className="flex items-center px-4 pt-2.5 pb-2">
        <div className="flex w-full">
          <span className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M1 9h3v6H1V9Z" fill="#19B473" />
              <path d="M1 1h3v6H1V1Z" fill="#F53D55" />
              <path
                d="M6 1h9v2H6V1ZM6 5h9v2H6V5ZM6 9h9v2H6V9ZM6 13h9v2H6v-2Z"
                fill="#6B7280"
              />
            </svg>
          </span>
          <span className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M12 1h3v14h-3V1Z" fill="#F53D55" />
              <path d="M1 1h3v14H1V1Z" fill="#19B473" />
              <path
                d="M5 1h6v2H5V1ZM5 5h6v2H5V5ZM5 9h6v2H5V9ZM5 13h6v2H5v-2Z"
                fill="#6B7280"
              />
            </svg>
          </span>
          <span className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M1 1h3v14H1V1Z" fill="#19B473" />
              <path
                d="M6 1h9v2H6V1ZM6 5h9v2H6V5ZM6 9h9v2H6V9ZM6 13h9v2H6v-2Z"
                fill="#6B7280"
              />
            </svg>
          </span>
          <span className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M1 1h3v14H1V1Z" fill="#F53D55" />
              <path
                d="M6 1h9v2H6V1ZM6 5h9v2H6V5ZM6 9h9v2H6V9ZM6 13h9v2H6v-2Z"
                fill="#6B7280"
              />
            </svg>
          </span>
        </div>
        <div>
          <div className="flex w-full items-center gap-1">
            <span className="text-xs">0.0001</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              class="text-fill-fill3 size-3"
            >
              <path
                fill="currentColor"
                d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="text-text-text3 mt-2.5 text-xs">
        <ul className="flex w-full items-center">
          <li className="w-full px-4 text-start">Price(USDT)</li>
          <li className="w-full px-4 text-end">Size(XRP)</li>
          <li className="w-full px-4 text-end">Sum(XRP)</li>
        </ul>
      </div>
    </>
  );
}
