// AggregationContext.js
import { createContext, useContext, useState } from "react";

const AggregationContext = createContext();

export function AggregationProvider({ children }) {
  const [steper, setSteper] = useState(0);

  return (
    <AggregationContext.Provider value={{ steper, setSteper }}>
      {children}
    </AggregationContext.Provider>
  );
}

export function useAggregation() {
  const context = useContext(AggregationContext);
  if (!context) {
    throw new Error(
      "useAggregation must be used within an AggregationProvider",
    );
  }
  return context;
}
