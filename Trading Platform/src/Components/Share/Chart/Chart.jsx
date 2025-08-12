import { AdvancedChart } from "react-tradingview-embed";

const Chart = (props) => {
  return (
    <div className="custom-height h-[calc(100vh-64px)]">
      <AdvancedChart
        widgetProps={{
          theme: "dark",
          symbol: `BINANCE:${props.symbol}`,
          interval: "1H",
          height: "100%",
        }}
      />
      <style jsx>{`
        .custom-height {
          height: calc(100% - 64px) !important;
        }
      `}</style>
    </div>
  );
};

export default Chart;
