import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  ask: [],
  bid: [],
  loading: false,
  error: null,
};

export const getMarketOrdersFromServer = createAsyncThunk(
  "marketOrder/getMarketOrdersFromServer",
  async (symbolID, { rejectWithValue }) => {
    try {
      const API_BASE_URL = `https://api.ompfinex.com/v1/market/${symbolID}/depth?limit=2000`;
      const token = "";
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const marketOrderSlice = createSlice({
  name: "marketOrder",
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.data = [];
      state.ask = [];
      state.bid = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarketOrdersFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketOrdersFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.ask = action.payload.asks;
        state.bid = action.payload.bids;
      })
      .addCase(getMarketOrdersFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderData } = marketOrderSlice.actions;
export default marketOrderSlice.reducer;
