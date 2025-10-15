export async function fetchMarkets() {
  const API_BASE_URL = "https://api.ompfinex.com/v1/market";
  const token = "";
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch markets");
  const json = await response.json();
  return json.data;
}

export async function fetchOrderBook(SymbolID, limit) {
  const API_BASE_URL = `https://api.ompfinex.com/v1/market/${SymbolID}/depth?limit=${limit}`;
  const token = "";
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}
