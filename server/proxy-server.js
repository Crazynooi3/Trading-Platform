const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

// فعال کردن CORS
app.use(cors());
app.use(express.json());

// پروکسی برای Ompfinex API
app.get("/api/ompfinex/*", async (req, res) => {
  try {
    const originalUrl = req.originalUrl.replace("/api/ompfinex/", "");
    const targetUrl = `https://api.ompfinex.com/v2/${originalUrl}`;

    const response = await axios.get(targetUrl, {
      params: req.query,
      timeout: 10000,
      headers: {
        Origin: "https://ompfinex.com",
        Referer: "https://ompfinex.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({
      error: "Proxy error",
      message: error.message,
    });
  }
});

// سلامت سرور
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Proxy server is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
