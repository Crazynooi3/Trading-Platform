export async function addOrder(token, marketID, requestBody) {
  const url = `https://api.ompfinex.com/v1/market/${marketID}/order`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // همیشه body رو parse کن، حتی اگر !ok
    const data = await response.json(); // این خط رو بیرون if بذار

    if (!response.ok) {
      // error رو با جزئیات پر کن: status, data (مثل message از API)
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.status = response.status; // status رو اضافه کن
      error.data = data; // body response (مثل { message: 'Insufficient balance' })
      throw error; // حالا error غنی‌تره
    }

    return data; // موفقیت
  } catch (error) {
    console.error("Error adding order:", error); // حالا error کامل‌تره
    throw error; // re-throw برای React Query
  }
}
