import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OrderInput({
  text,
  detail,
  // -----
  sliderPercent,
  setSliderPercent,
  // -----
  inputSizeValue,
  setInputSizeValue,
  // -----
  inputPriceValue,
  setInputPriceValue,
  // -----
  precision,
  lastPrice,
  setIsShowTooltip,
  setIsShowTooltipPrice,
  setSizeUnit,
  sizeUnit,
  dropDown,
}) {
  const { base, quote } = useParams();
  const changeLastPrice = (price) => {
    if (typeof setInputPriceValue !== "function") return;
    if (quote === "IRT") {
      setInputPriceValue(price / 10);
    } else {
      setInputPriceValue(price);
    }
  };
  useEffect(() => {
    changeLastPrice(lastPrice);
  }, [sliderPercent, lastPrice, text]);

  const setSizeState = () => {
    if (typeof setInputSizeValue !== "function") return;
    if (sliderPercent > 0) {
      const size = Number(sliderPercent).toFixed() + "%";
      setInputSizeValue(size);
    } else {
      setInputSizeValue(inputSizeValue ?? "");
    }
  };
  const setPriceState = () => {
    if (typeof setInputPriceValue !== "function") return;
    if (sliderPercent > 0) {
      setInputPriceValue(Number(lastPrice));
    } else {
      setInputPriceValue(inputSizeValue ?? "");
    }
  };
  useEffect(() => {
    setSizeState();
    setPriceState();
  }, [sliderPercent]);

  return (
    <div className="mt-2">
      <div className="bg-fill-fill4 flex h-10 w-full items-center rounded-lg px-2.5 outline-white focus-within:outline hover:outline">
        <span className="text-text-text4 mr-1 text-sm text-nowrap">{text}</span>
        {text === "Size" && (
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={inputSizeValue}
            dir="rtl"
            className="mr-3 w-full text-xs outline-0 focus:outline-0"
            onChange={(e) => {
              setInputSizeValue(e.target.value);
            }}
            onClick={() => {
              setIsShowTooltip(false);
              setSliderPercent(0);
            }}
          />
        )}
        {text === "Price" && (
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={inputPriceValue}
            dir="rtl"
            className="mr-3 w-full text-xs outline-0 focus:outline-0"
            onChange={(e) => {
              setInputPriceValue(e.target.value);
            }}
            onClick={() => setIsShowTooltipPrice(false)}
          />
        )}

        <span className="group relative flex cursor-pointer items-center">
          <span className="mr-1 text-sm text-white">{detail}</span>
          {dropDown && (
            <>
              <div className="bg-fill-fill2 invisible absolute top-6 right-0 z-10 rounded-sm opacity-0 transition-all delay-150 duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                <div className="space-y-2 rounded-sm px-2 py-3">
                  <a
                    onClick={() => setSizeUnit(base)}
                    className="hover:bg-fill-fill1 block w-full rounded-sm px-3 text-center">
                    {base}
                  </a>
                  <a
                    onClick={() => setSizeUnit(quote)}
                    className="hover:bg-fill-fill1 block w-full rounded-sm px-3 text-center">
                    {quote}
                  </a>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="size-3 text-white">
                <path
                  fill="currentColor"
                  d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
                />
              </svg>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
