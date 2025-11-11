import axios from "axios";
import { useChartData } from "./../../../Utilities/Hooks/useChartData";

export const getBars = (symbol, resolution, from, to) => {
  const { data, isLoading, error } = useChartData(symbol, resolution, from, to);

  if (isLoading) return null;
  if (error) {
    console.error("❌ Error fetching data:", error);
    return null;
  }
  return data;
};

export const getBarsDirect = async (symbol, resolution, from, to) => {
  try {
    const PROXY_URL = "http://localhost:3001/api/ompfinex";
    const response = await axios.get(`${PROXY_URL}/udf/real/history`, {
      params: { symbol, resolution, from, to, countback: 1000 },
      timeout: 10000,
    });

    if (response.data && response.data.s === "ok") {
      return {
        t: response.data.t,
        o: response.data.o.map((price) => parseFloat(price)),
        h: response.data.h.map((price) => parseFloat(price)),
        l: response.data.l.map((price) => parseFloat(price)),
        c: response.data.c.map((price) => parseFloat(price)),
        v: response.data.v.map((volume) => parseFloat(volume)),
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return null;
  }
};
