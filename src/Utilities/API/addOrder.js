async function addOrder(token, marketID, amount, price, type, execution) {
  const url = `https://api.ompfinex.com/v1/market/${marketID}/order`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        price,
        type,
        execution,
      }),
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

export { addOrder };
