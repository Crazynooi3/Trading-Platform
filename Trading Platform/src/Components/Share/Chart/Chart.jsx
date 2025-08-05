import { AdvancedChart } from "react-tradingview-embed";

const Chart = () => {
  return (
    <AdvancedChart
      widgetProps={{
        theme: "dark",
        symbol: "BINANCE:BTCUSDT",
        interval: "1H",

        // Add other widget properties as needed
      }}
    />
  );
};

export default Chart;
