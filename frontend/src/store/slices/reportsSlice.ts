import { createSlice } from "@reduxjs/toolkit";
import { fetchReports } from "../thunks/dataThunks";

export interface ReportsState {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = reportsSlice.actions;

export default reportsSlice.reducer;
