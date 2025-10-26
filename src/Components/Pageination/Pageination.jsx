import React from "react";

export default function Pageination({ pages, currentPage = 1, setCurentPage }) {
  return (
    <div className="mt-5 flex items-center justify-center">
      <nav
        aria-label="Pagination"
        className="isolate inline-flex -space-x-px rounded-md">
        {/* Current: "z-10 text-white focus-visible:outline-2 focus-visible:outline-offset-2 bg-fill-fill3 focus-visible:outline-indigo-500", Default: "inset-ring focus:outline-offset-0 text-gray-200 inset-ring-gray-700 hover:bg-white/5" */}
        {Array.from({ length: pages }, (_, index) => {
          const pageNumber = index + 1;
          const isCurrent = pageNumber === currentPage;

          return (
            <a
              key={pageNumber}
              onClick={() => setCurentPage(pageNumber)}
              aria-current={isCurrent ? "page" : undefined}
              //   className="bg-fill-fill3 relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              className={
                isCurrent
                  ? "bg-fill-fill3 relative z-10 inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  : "relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
              }>
              {pageNumber}
            </a>
          );
        })}
        {/* <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
          2
        </a>
        <a
          href="#"
          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0 md:inline-flex">
          3
        </a>
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700 focus:outline-offset-0">
          ...
        </span>
        <a
          href="#"
          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0 md:inline-flex">
          8
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
          9
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
          10
        </a> */}
      </nav>
    </div>
  );
}
