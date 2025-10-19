import React, { useState, useEffect } from "react";
import * as Func from "./../../Utilities/Funections";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OpenPosition() {
  const [userBalanceBase, setUserBalanceBase] = useState([]);
  const [userBalanceQuote, setUserBalanceQuote] = useState([]);
  const { base, quote } = useParams();
  const userWalletSelector = useSelector((state) => state.userWallet);
  const { symbolID, precision } = useSelector(
    (state) => state.symbolIDPrecision,
  );
  const quoteIRR = Func.irtToIrr(quote);
  useEffect(() => {
    setUserBalanceBase(Func.currencyBalance(userWalletSelector.data, base));
    setUserBalanceQuote(
      Func.currencyBalance(userWalletSelector.data, quoteIRR),
    );
  }, [userWalletSelector, base, quote]);
  return (
    <div className="mx-4 mt-4">
      <div className="flex items-center gap-2">
        {/* BTN */}
        <div className="bg- bg-green-green2 text-text-text0 hover:bg-green-green3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold">
          Buy Long
        </div>
        <div className="bg- bg bg-red-red2 text-text-text0 hover:bg-red-red3 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-semibold">
          Sell Short
        </div>
      </div>
      <div>
        {/* Detials */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs font-medium">
            Margin({base})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceBase && "----"}
              {quote === "USDT" ||
                (base === "USDT" &&
                  Number(userBalanceBase?.balance).toLocaleString("en-US", {
                    maximumFractionDigits: precision,
                  }))}
              {quote === "IRT" &&
                base != "USDT" &&
                Number(userBalanceBase?.balance / 10).toLocaleString("en-US", {
                  maximumFractionDigits: precision,
                })}{" "}
              {base}
            </span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs font-medium">
            Margin({quote})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceQuote && "----"}
              {quote === "USDT" ||
                (base === "USDT" &&
                  Number(userBalanceQuote?.balance).toLocaleString("en-US", {
                    maximumFractionDigits: precision,
                  }))}
              {quote === "IRT" &&
                base != "USDT" &&
                Number(userBalanceQuote?.balance / 10).toLocaleString("en-US", {
                  maximumFractionDigits: precision,
                })}{" "}
              {quote}
            </span>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs font-medium">
            Blocked Balance ({base})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceBase && "----"}
              {quote === "USDT" ||
                (base === "USDT" &&
                  Number(userBalanceBase?.blocked_balance).toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: precision,
                    },
                  ))}
              {quote === "IRT" &&
                base != "USDT" &&
                Number(userBalanceBase?.blocked_balance / 10).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: precision,
                  },
                )}{" "}
              {base}
            </span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs font-medium">
            Balcked Balance({quote})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceQuote && "----"}
              {quote === "USDT" ||
                (base === "USDT" &&
                  Number(userBalanceQuote?.blocked_balance).toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: precision,
                    },
                  ))}
              {quote === "IRT" &&
                base != "USDT" &&
                Number(userBalanceQuote?.blocked_balance / 10).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: precision,
                  },
                )}{" "}
              {quote}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
