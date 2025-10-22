async function DeleteUserOrder(token, orderID) {
  const url = `https://api.ompfinex.com/v1/user/order`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: orderID }),
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

export { DeleteUserOrder };
