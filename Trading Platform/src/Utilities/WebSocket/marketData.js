import ReconnectingWebSocket from "reconnecting-websocket";

let socket = null;
let callbacks = []; // برای ذخیره callbackهای پیام‌ها

const webSocketService = {
  /**
   * اتصال به WebSocket
   * @param {string} url - آدرس WebSocket (پیش‌فرض: wss://stream.ompfinex.com/stream)
   * @returns {ReconnectingWebSocket} - نمونه WebSocket
   */
  connect(url = "wss://stream.ompfinex.com/stream") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected");
      return socket;
    }

    socket = new ReconnectingWebSocket(url, [], {
      // تنظیمات ReconnectingWebSocket
      maxReconnectionDelay: 10000, // حداکثر تأخیر بین تلاش‌های بازاتصال (10 ثانیه)
      minReconnectionDelay: 1000, // حداقل تأخیر (1 ثانیه)
      reconnectionDelayGrowFactor: 1.5, // ضریب افزایش تأخیر
      maxRetries: Infinity, // تلاش نامحدود برای بازاتصال
    });

    // رویداد باز شدن اتصال
    socket.onopen = () => {
      console.log("WebSocket Connected!");
    };

    // دریافت پیام از سرور
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data); // فرض می‌کنیم داده‌ها JSON هستند
        // ارسال پیام به تمام callbackهای ثبت‌شده
        callbacks.forEach((callback) => callback(message));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // مدیریت خطاها
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // مدیریت قطع اتصال
    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      // ReconnectingWebSocket به‌صورت خودکار تلاش می‌کند دوباره متصل شود
    };

    return socket;
  },

  /**
   * ارسال پیام به سرور
   * @param {Object} data - داده‌ای که باید ارسال شود
   */
  send(data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected");
    }
  },

  /**
   * اشتراک در یک کانال
   * @param {string} channel - نام کانال (مثل market-data)
   * @param {string} symbol - نماد بازار (مثل BTC/USD)
   */
  subscribe(channel, symbol) {
    this.send({
      type: "subscribe",
      channel,
      symbol,
    });
  },

  /**
   * لغو اشتراک از یک کانال
   * @param {string} channel - نام کانال
   * @param {string} symbol - نماد بازار
   */
  unsubscribe(channel, symbol) {
    this.send({
      type: "unsubscribe",
      channel,
      symbol,
    });
  },

  /**
   * ثبت callback برای دریافت پیام‌ها
   * @param {Function} callback - تابع callback برای پردازش پیام‌ها
   */
  onMessage(callback) {
    callbacks.push(callback);
  },

  /**
   * حذف callback
   * @param {Function} callback - تابع callback که باید حذف شود
   */
  offMessage(callback) {
    callbacks = callbacks.filter((cb) => cb !== callback);
  },

  /**
   * بستن اتصال WebSocket
   */
  disconnect() {
    if (socket) {
      socket.close();
      socket = null;
      callbacks = [];
      console.log("WebSocket Disconnected and Cleaned Up");
    }
  },

  /**
   * بررسی وضعیت اتصال
   * @returns {boolean} - آیا WebSocket متصل است یا خیر
   */
  isConnected() {
    return socket && socket.readyState === WebSocket.OPEN;
  },
};

export default webSocketService;
