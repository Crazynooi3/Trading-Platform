// useMonitorOrder.js – custom hook برای polling status
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../API/getOrderById";

export function useMonitorOrder(orderId, token, marketId, enabled = false) {
  return useQuery({
    queryKey: ["getOrderById", orderId, marketId],
    queryFn: () => getOrderById(orderId, token),
    enabled: enabled && !!orderId && !!token,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 2,
    onSuccess: (data) => {
      const progress = (data.completed_amount / data.amount) * 100;
      console.log(progress);
      if (data.status === "COMPLETED") {
        console.log(data);

        // polling رو stop کن (enabled رو false کن در parent)
        // toast success: "Order filled!"
        // invalidate wallet query: queryClient.invalidateQueries(["wallet"]);
      }
    },
    onError: (error) => {
      console.error("Error monitoring order:", error);
    },
  });
}
