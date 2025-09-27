import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../API/MarketApi";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    staleTime: 60_000,
  });
}
