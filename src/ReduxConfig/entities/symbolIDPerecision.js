import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  symbolID: null,
  precision: null,
  day_change_percent: null,
  last_volume: null,
  max_price: null,
  min_price: null,
  loading: false,
  error: null,
};

const symbolIDPrecisionSlice = createSlice({
  name: "symbolIDPrecision",
  initialState,
  reducers: {
    setSymbolIDPrecision: (state, action) => {
      state.symbolID = action.payload.symbolID;
      state.precision = action.payload.precision;
      state.day_change_percent = action.payload.day_change_percent;
      state.last_volume = action.payload.last_volume;
      state.max_price = action.payload.max_price;
      state.min_price = action.payload.min_price;
      state.loading = false;
      state.error = null;
    },
    clearSymbolData: (state) => {
      state.symbolID = null;
      state.precision = null;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSymbolIDPrecision, clearSymbolData, setError } =
  symbolIDPrecisionSlice.actions;
export default symbolIDPrecisionSlice.reducer;
