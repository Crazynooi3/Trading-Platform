import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  loading: false,
  error: null,
};

const userTokenSlice = createSlice({
  name: "user-token",
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = null;
      state.error = null;
    },
    addToken: (state, action) => {
      state.token = action.payload;
      state.error = null;
    },
  },
});

export const { addToken, clearToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;
