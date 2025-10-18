import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getCompletOrder = createAsyncThunk(
  "completOrder/getCompletOrder",
  async (symbolID, { rejectWithValue }) => {
    try {
      const API_BASE_URL = `https://api.ompfinex.com/v1/market/${symbolID}/order/completed`;
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

const orderCompletSlice = createSlice({
  name: "completOrder",
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompletOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCompletOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderData } = orderCompletSlice.actions;
export default orderCompletSlice.reducer;
