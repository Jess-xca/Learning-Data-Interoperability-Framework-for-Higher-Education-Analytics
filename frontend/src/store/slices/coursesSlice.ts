import { createSlice } from "@reduxjs/toolkit";
import { fetchCourses, createCourse } from "../thunks/dataThunks";

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  enrollment: number;
}

export interface CoursesState {
  data: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  data: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = coursesSlice.actions;

export default coursesSlice.reducer;
