import React from "react";
import { AdvancedChart } from "react-tradingview-embed";
import { useParams } from "react-router-dom";
const Chart = () => {
  const { base, quote } = useParams();
  const correctQuote = () => {
    if (quote === "IRT" && base != "USDT") {
      return "USDT";
    }
    if (quote === "IRT" && base === "USDT") {
      return "USD";
    }
    return quote;
  };

  return (
    <>
      {/* {console.log("chart")} */}
      <div className="custom-height h-[calc(100vh-64px)]">
        <AdvancedChart
          widgetProps={{
            theme: "dark",
            symbol: `${base}${correctQuote()}`,
            interval: "1H",
            height: "90%",
          }}
        />
        <style jsx>{`
          .custom-height {
            height: calc(100% - 64px) !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default React.memo(Chart);
