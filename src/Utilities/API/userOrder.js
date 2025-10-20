async function GetUserOrder(token, status, market_id) {
  const url = market_id
    ? `https://api.ompfinex.com/v2/user/order?status=${status}&market_id=${market_id}`
    : `https://api.ompfinex.com/v2/user/order?status=${status}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching market data:", error.message);
    throw error;
  }
}

export { GetUserOrder };
