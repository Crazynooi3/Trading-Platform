// hooks/useChartData.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PROXY_URL = "http://localhost:3001/api/ompfinex";

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

// هوک اصلی با قابلیت refetch شرطی
export const useChartData = (symbol, resolution, from, to, options = {}) => {
  const {
    enabled = true,
    refetchCondition = null, // شرط custom برای refetch
    staleTime = 2 * 60 * 1000, // 2 دقیقه
    gcTime = 5 * 60 * 1000, // 5 دقیقه
  } = options;

  return useQuery({
    queryKey: ["chartData", symbol, resolution, from, to, refetchCondition],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
    staleTime,
    gcTime,
    retry: 1,
    enabled: enabled && !!symbol && !!resolution,
    // refetch فقط وقتی که داده stale باشه و enabled باشه
    refetchOnMount: "always", // یا true/false
  });
};

// هوک برای real-time با refetch interval داینامیک
export const useRealtimeChartData = (
  symbol,
  resolution,
  refetchInterval = 15000,
) => {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 300;

  return useQuery({
    queryKey: ["realtimeChartData", symbol, resolution],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
    refetchInterval, // میتونه داینامیک تغییر کنه
    refetchIntervalInBackground: true,
    staleTime: 0, // همیشه stale باشه تا refetch بشه
    gcTime: 2 * 60 * 1000,
    enabled: !!symbol && !!resolution,
  });
};

// هوک برای زمانی که می‌خواهید فقط وقتی داده واقعاً تغییر کرد refetch بشه
export const useSmartChartData = (
  symbol,
  resolution,
  from,
  to,
  triggerRefetch = false,
) => {
  return useQuery({
    queryKey: ["smartChartData", symbol, resolution, from, to, triggerRefetch],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
    staleTime: Infinity, // داده همیشه fresh در نظر گرفته میشه مگر اینکه force بشه
    gcTime: 10 * 60 * 1000,
    enabled: !!symbol && !!resolution,
    // فقط وقتی refetch میشه که triggerRefetch تغییر کنه
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
