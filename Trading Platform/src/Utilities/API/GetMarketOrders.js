async function GetMarketOrders(Url) {
  try {
    const response = await fetch(Url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching market orders:", error.message);
    throw error;
  }
}

export { GetMarketOrders };
