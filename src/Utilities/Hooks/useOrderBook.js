import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchOrderBook } from "../API/MarketApi";

export function useOrderBook(symbolID, limit) {
  return useQuery({
    queryKey: ["orderBook", symbolID, limit],
    queryFn: () => fetchOrderBook(symbolID, limit),
    enabled: !!symbolID,
  });
}
