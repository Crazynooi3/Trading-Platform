import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrder } from "../API/addOrder";

export function useAddOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, marketID, amount, price, type, execution }) => {
      const requestBody = {
        amount,
        type,
        execution, // uppercase نگه دار (از handler می‌آد)
      };

      // Normalize case برای چک: toUpperCase()
      const upperExecution = execution.toUpperCase();

      if (upperExecution === "LIMIT") {
        if (!price) {
          throw new Error("Price is required for Limit orders");
        }
        requestBody.price = price;
      } else if (upperExecution === "MARKET") {
        requestBody.price = null; // اختیاری، اما برای clarity
      }
      // اگر execution دیگه‌ای باشه (مثل Trigger)، handle کن یا error بده

      return addOrder(token, marketID, requestBody);
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["orders", marketID] }); // اگر refetch می‌خوای، uncomment کن
    },
    onError: (error) => {
      console.error("Error adding order:", error);
    },
    retry: 1,
  });
}
