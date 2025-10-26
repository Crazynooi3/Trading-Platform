import React, { useState, useEffect } from "react";
import * as Func from "./../../Utilities/Funections";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SpotBtn from "../Btn/SpotBtn";

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
      <div>
        {/* Detials */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-text-text3 w-full text-xs font-medium">
            Balance ({base})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceBase && "----"}
              {Number(userBalanceBase?.balance).toLocaleString("en-US", {
                maximumFractionDigits: precision,
                roundingMode: "floor",
              })}{" "}
              {base}
            </span>
          </span>
          <span className="text-text-text3 w-full text-end text-xs font-medium">
            Balance ({quote})
            <br />
            <span className="text-text-text0 text-xs font-medium">
              {!userBalanceQuote && "----"}
              {quote === "USDT" &&
                Number(userBalanceQuote?.balance).toLocaleString("en-US", {
                  maximumFractionDigits: precision,
                  roundingMode: "floor",
                })}
              {quote === "IRT" &&
                Number(userBalanceQuote?.balance / 10).toLocaleString("en-US", {
                  maximumFractionDigits: precision,
                  roundingMode: "floor",
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
              {Number(userBalanceBase?.blocked_balance).toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: precision,
                  roundingMode: "floor",
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
              {quote === "USDT" &&
                Number(userBalanceQuote?.blocked_balance).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: precision,
                    roundingMode: "floor",
                  },
                )}
              {quote === "IRT" &&
                Number(userBalanceQuote?.blocked_balance / 10).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: precision,
                    roundingMode: "floor",
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
