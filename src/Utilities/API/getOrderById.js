export async function getOrderById(orderId, token) {
  const url = `https://api.ompfinex.com/v1/user/order/${orderId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Status: ${response.status}`);
  return response.json();
}
