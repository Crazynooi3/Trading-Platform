import React from "react";

export default function OrderBookTabs({ title, state, setState }) {
  return (
    <div
      className={`text-text-text3 hover:text-text-text1 mr-5 flex h-full cursor-pointer items-center justify-center border-b-2 text-sm font-medium ${
        state === title
          ? "border-text-text1 !text-text-text1"
          : "border-transparent"
      }`}
      onClick={() => setState(title)}>
      <span>{title}</span>
    </div>
  );
}
