import React from "react";

export default function TabTextWrapper() {
  return (
    <div className="flex h-12 w-fit items-center justify-between gap-2">
      {/* Open Tab */}
      <div className="relative h-10 w-36">
        <div className="bg-success-success1 h-full w-[80%] rounded-tl-lg rounded-bl-lg"></div>
        <div className="bg-success-success1 absolute top-0 right-1 h-full w-[47px] -skew-x-[20deg] rounded-tr-lg rounded-br-lg"></div>
        <div className="absolute top-0 flex h-full w-full items-center justify-center text-center">
          <span className="font-semibold text-white">Open</span>
        </div>
      </div>
      {/* Close Tab */}
      <div className="relative h-10 w-36">
        <div className="bg-danger-danger1 absolute top-0 right-0 h-full w-[80%] rounded-tr-lg rounded-br-lg"></div>
        <div className="bg-danger-danger1 absolute top-0 left-0 h-full w-[47px] -skew-x-[20deg] rounded-tl-lg rounded-bl-lg"></div>
        <div className="absolute top-0 flex h-full w-full items-center justify-center text-center">
          <span className="font-semibold text-white">Close</span>
        </div>
      </div>
    </div>
  );
}
