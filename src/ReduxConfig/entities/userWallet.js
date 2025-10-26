import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getUserWallet = createAsyncThunk(
  "userWallet/getUserWallet",
  async (token, { rejectWithValue }) => {
    try {
      const API_BASE_URL = `https://api.ompfinex.com/v1/user/wallet`;
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

const userWalletSlice = createSlice({
  name: "userWallet",
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getUserWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderData } = userWalletSlice.actions;
export default userWalletSlice.reducer;
