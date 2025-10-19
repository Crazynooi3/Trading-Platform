import React from "react";

export default function ElTabs({ title, state, setState }) {
  return (
    <div className="border-border-border1 flex h-10 items-center justify-between border-b px-4">
      <div className="flex h-full w-full items-center justify-between">
        {/* <div className="flex h-full items-center">
          <div className="text-text-text1 mr-5 flex h-full items-center justify-center border-b-2 font-medium">
            <span>Trade</span>
          </div>
          <div className="text-text-text3 flex h-full items-center justify-center font-medium">
            <span>Tools</span>
          </div>
        </div> */}

        <div className="flex h-full items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 text-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
            />
          </svg>

          <span className="text-xs font-medium">Use Bonuse</span>
        </div>
      </div>
    </div>
  );
}
