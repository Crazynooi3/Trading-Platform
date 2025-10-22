import React from "react";

export default function Tooltip({ title, isShow }) {
  return (
    <div className={`${isShow ? "block" : "hidden"} absolute top-0 w-full`}>
      <span className="bg-toasts-toasts1 relative -top-3 left-4/12 h-9 w-fit rounded-sm p-2 text-xs">
        {title}
        <span className="bg-toasts-toasts1 absolute -bottom-1 left-5/12 block h-2.5 w-2.5 rotate-45"></span>
      </span>
    </div>
  );
}
