import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getMarketDataFromServer = createAsyncThunk(
  "marketData/getMarketDataFromServer",
  async (_, { rejectWithValue }) => {
    try {
      const API_BASE_URL = "https://api.ompfinex.com/v1/market";
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

const marketDataSlice = createSlice({
  name: "markets-datas",
  initialState,
  reducers: {
    clearmarketData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarketDataFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketDataFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMarketDataFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMarketData } = marketDataSlice.actions;
export default marketDataSlice.reducer;
