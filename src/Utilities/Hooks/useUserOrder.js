import { useQuery } from "@tanstack/react-query";
import { GetUserOrder } from "../API/userOrder";

export function useUserOrderPolling(token, status, market_id = null) {
  return useQuery({
    queryKey: ["userOrder", status, market_id],
    queryFn: () => {
      return GetUserOrder(token, status, market_id);
    },
    refetchInterval: 5000,
    enabled: !!token && !!status, // explicit
    retry: 1, // اختیاری: ۱ بار retry
  });
}
