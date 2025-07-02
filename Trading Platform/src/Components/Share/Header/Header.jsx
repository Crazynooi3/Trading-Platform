import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div
      id="header_wrapper"
      className="bg-base-base1 border-border-border1 mb-1 flex h-16 items-center border-b px-4"
    >
      <div id="header_wrapper_left" className="flex items-center">
        {/* Logo */}
        <div>
          <Link to={"/"}>
            <img
              src="./../../../public/icon-logo-dark.BxrnKizC.svg"
              alt=""
              width={"104px"}
            />
          </Link>
        </div>
        {/* Spacer */}
        <div className="bg-border-border1 mx-6 h-4 w-[1px]"></div>
        {/* Menu left */}
        <div>
          <ul className="flex items-center justify-between">
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Buy Crypto
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Market
                </span>
                {/* <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div> */}
              </li>
            </Link>
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/FireIcon.svg"
                    alt=""
                    width={"12px"}
                    className="mr-1"
                  />
                </div>
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Derivatives
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Copy Trading
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Reward Hub
                </span>
                {/* <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div> */}
              </li>
            </Link>
            <Link to={"/"}>
              <li className="mr-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  More
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
          </ul>
        </div>
      </div>
      <div className="h-full flex-1"></div>
      <div
        id="header_wrapper_right"
        className="border-border-border1 bg-fill-fill8 flex h-12 items-center rounded-xl border px-6"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div>
          <ul className="flex items-center">
            <Link>
              <li className="bg-gray-gray10 ml-5 flex h-8 min-w-20 items-center justify-center rounded-lg px-3 font-semibold">
                <span>Deposit</span>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="ml-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Assets
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="ml-5 flex items-center justify-center gap-1">
                <span className="hover:text-primary-primary3 peer duration-700l font-bold text-white transition delay-150">
                  Order
                </span>
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <img
                    src="./../../../public/ArrowDropDown.svg"
                    alt=""
                    width={"16px"}
                  />
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="ml-5 flex items-center justify-center gap-1">
                <div className="transition delay-150 duration-700 peer-hover:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </li>
            </Link>
            <Link to={"/"}>
              <li className="ml-5 flex items-center justify-center gap-1">
                <div className="relative transition delay-150 duration-700 peer-hover:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {/* Badge */}
                  <div className="bg-error absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                    <span>18</span>
                  </div>
                </div>
              </li>
            </Link>
          </ul>
        </div>
        <div className="ml-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-white"
          >
            <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
          </svg>
        </div>
        <div className="ml-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-white"
          >
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
