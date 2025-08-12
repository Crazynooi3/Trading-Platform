import { AdvancedChart } from "react-tradingview-embed";

const Chart = (props) => {
  return (
    <div className="h-[calc(100%-64px)]">
      <AdvancedChart
        widgetProps={{
          theme: "dark",
          symbol: `BINANCE:${props.symbol}`,
          interval: "1H",
          height: "100%",

          // Add other widget properties as needed
        }}
      />
    </div>
  );
};

export default Chart;
