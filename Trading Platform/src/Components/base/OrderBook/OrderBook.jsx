import React, { useEffect, useRef } from "react";

export default function OrderBook() {
  const sellListRef = useRef(null);

  useEffect(() => {
    if (sellListRef.current) {
      sellListRef.current.scrollTop = sellListRef.current.scrollHeight;
    }
  }, []);
  return (
    <>
      <div className="mt-1 h-[calc(100%-6.5rem)]">
        {/* Sell part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul
            ref={sellListRef}
            className="hide-scrollbar flex h-full w-full flex-col-reverse justify-start overflow-y-scroll"
          >
            <li className="relative flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs font-medium">
                First Sell Order
              </span>
              <span className="w-full py-0.5 text-end text-xs">69.54K</span>
              <span className="w-full py-0.5 text-end text-xs">69.54K</span>
              <span
                className="bg-danger-danger4 absolute right-0 -z-10 h-[calc(100%-2px)]"
                style={{ width: "50%" }}
              ></span>
            </li>
            <li className="relative flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs font-medium">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span
                className="bg-danger-danger4 absolute right-0 -z-10 h-[calc(100%-2px)]"
                style={{ width: "60%" }}
              ></span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-danger-danger1 w-full text-start text-xs">
                1.1764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
          </ul>
        </div>
        {/* LastPrice */}
        <div className="flex h-10 w-full items-center px-4">
          <span className="text-success-success1 mr-2 text-lg">2.2571</span>
          <span className="text-text-text4 text-sm underline">2.2571</span>
        </div>
        {/* Buy part */}
        <div className="h-[calc(50%-1.25rem)]">
          <ul className="hide-scrollbar flex h-full w-full flex-col justify-start overflow-y-scroll">
            <li className="relative flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs font-medium">
                First Buy Order
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span
                className="bg-success-success4 absolute right-0 -z-10 h-[calc(100%-2px)]"
                style={{ width: "50%" }}
              ></span>
            </li>
            <li className="relative flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span
                className="bg-success-success4 absolute right-0 -z-10 h-[calc(100%-2px)]"
                style={{ width: "55%" }}
              ></span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
            <li className="flex h-5 w-full items-center justify-between px-4">
              <span className="text-success-success1 w-full text-start text-xs">
                2.2764
              </span>
              <span className="w-full text-end text-xs">69.54K</span>
              <span className="w-full text-end text-xs">69.54K</span>
            </li>
          </ul>
        </div>
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none; /* برای IE و Edge */
            scrollbar-width: none; /* برای فایرفاکس */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* برای کروم، سافاری و سایر مرورگرهای Webkit */
          }
        `}</style>
      </div>
    </>
  );
}
