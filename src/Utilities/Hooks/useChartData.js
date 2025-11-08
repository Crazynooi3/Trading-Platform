import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PROXY_URL = "http://localhost:3001/api/ompfinex";

// تابع اصلی دریافت داده
const fetchBars = async ({ symbol, resolution, from, to }) => {
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
  throw new Error("API response is not valid");
};

// هوک برای datafeed اصلی
export const useChartData = (symbol, resolution, from, to, enabled = true) => {
  return useQuery({
    queryKey: ["chartData", symbol, resolution, from, to],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
    staleTime: 2 * 60 * 1000, // 2 دقیقه fresh
    gcTime: 5 * 60 * 1000, // 5 دقیقه در کش
    retry: 1,
    enabled: enabled && !!symbol && !!resolution,
  });
};

// هوک برای real-time data
export const useRealtimeChartData = (symbol, resolution) => {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 300; // 5 دقیقه قبل

  return useQuery({
    queryKey: ["realtimeChartData", symbol, resolution],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
    refetchInterval: 10000, // هر 10 ثانیه
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 2 * 60 * 1000,
    enabled: !!symbol && !!resolution,
  });
};
