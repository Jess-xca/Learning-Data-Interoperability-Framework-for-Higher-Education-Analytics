import { createSlice } from "@reduxjs/toolkit";
import { fetchPrograms } from "../thunks/dataThunks";

export interface Program {
  id: string;
  code: string;
  name: string;
  department: string;
  totalCourses: number;
}

export interface ProgramsState {
  data: Program[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgramsState = {
  data: [],
  loading: false,
  error: null,
};

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = programsSlice.actions;

export default programsSlice.reducer;
