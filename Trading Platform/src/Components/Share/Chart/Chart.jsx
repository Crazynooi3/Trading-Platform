import { AdvancedChart } from "react-tradingview-embed";

const MyChartComponent = () => {
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

export default MyChartComponent;
