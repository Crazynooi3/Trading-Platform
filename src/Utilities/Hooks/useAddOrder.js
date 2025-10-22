import { useQuery } from "@tanstack/react-query";
import { addOrder } from "../API/addOrder";

export function useAddOrder(token, marketID, amount, price, type, execution) {
  return useQuery({
    queryKey: ["addOrder", marketID],
    queryFn: () => {
      return addOrder(token, marketID, amount, price, type, execution);
    },
    staleTime: 60_000,
    enabled: !!token && !!marketID,
    retry: 1,
  });
}
