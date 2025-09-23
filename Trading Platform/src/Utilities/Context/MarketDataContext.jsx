// VolumeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { GetMarket } from "../API/GetMarket";

const MarketContext = createContext();
const API_BASE_URL = "https://api.ompfinex.com/v1/market";

export function MarketProvider({ children, token }) {
  const [totalMarkets, setTotalMarkets] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMarket() {
    setIsLoading(true);
    setError(null);
    try {
      const markets = await GetMarket(API_BASE_URL, token);
      setTotalMarkets(markets);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch markets:", err);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMarket();
  }, []);

  return (
    <MarketContext.Provider
      value={{ totalMarkets, fetchMarket, isLoading, error }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
}
