import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  currentSymbol: null,
  rDepth: { a: [], b: [] }, // asks (a) و bids (b): arrays of [priceStr, qtyStr]
  rPriceAg: [], // array of {price: str, v: num, m: num}
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setSymbol: (state, action) => {
      state.currentSymbol = action.payload;
      // Reset rDepth on symbol change (پاک کردن لیست قدیمی)
      state.rDepth = { a: [], b: [] };
    },
    updateDepth: (state, action) => {
      const { a: newAsks, b: newBids } = action.payload.data; // از push.pub.data
      const { u, U } = action.payload.data; // sequence برای لاگ
      // Full replace: کل array رو جایگزین کن (ساده و بدون مشکل زیاد شدن)
      state.rDepth.a = [...newAsks].sort(
        (x, y) => parseFloat(x[0]) - parseFloat(y[0]),
      ); // ascending
      state.rDepth.b = [...newBids].sort(
        (x, y) => parseFloat(y[0]) - parseFloat(x[0]),
      ); // descending

      // Optional: Filter qty=0 اگر در API باشه، اما replace خودش clean می‌کنه
      state.rDepth.a = state.rDepth.a.filter(
        ([_, qty]) => qty !== "0" && parseFloat(qty) > 0,
      );
      state.rDepth.b = state.rDepth.b.filter(
        ([_, qty]) => qty !== "0" && parseFloat(qty) > 0,
      );
    },
    updatePriceAg: (state, action) => {
      state.rPriceAg = action.payload; // full replace
    },
    addTrades: (state, action) => {
      // اگر trades، نگه دار
      state.trades = [...state.trades.slice(-9), ...action.payload];
    },
  },
});

export const { setSymbol, updateDepth, updatePriceAg, addTrades } =
  webSocketSlice.actions;
export default webSocketSlice.reducer;
