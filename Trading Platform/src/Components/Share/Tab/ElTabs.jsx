import React from "react";

export default function ElTabs() {
  return (
    <div className="border-border-border1 flex h-10 items-center justify-between border-b px-4">
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center">
          <div className="text-text-text1 flex h-full items-center justify-center border-b-2 px-1.5 font-medium">
            <span>Trade</span>
          </div>
          <div className="text-text-text3 flex h-full items-center justify-center px-1.5 font-medium">
            <span>Tools</span>
          </div>
        </div>
        <div className="flex h-full items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-3 text-white"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
              clip-rule="evenodd"
            />
          </svg>

          <span className="text-xs font-medium">Use Bonuse</span>
        </div>
      </div>
    </div>
  );
}
