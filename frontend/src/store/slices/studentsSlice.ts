import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchStudents,
  createStudent,
  updateStudent as updateStudentThunk,
  deleteStudent as deleteStudentThunk,
} from "../thunks/dataThunks";

export interface Student {
  id: string;
  name: string;
  email: string;
  gpa: number;
  program: string;
  enrollmentYear: number;
  status: "active" | "graduated" | "suspended";
}

export interface StudentsState {
  data: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  data: [],
  loading: false,
  error: null,
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudentOptimistic: (state, action: PayloadAction<Student>) => {
      state.data.push(action.payload);
    },
    updateStudentOptimistic: (state, action: PayloadAction<Student>) => {
      const index = state.data.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteStudentOptimistic: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((s) => s.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addStudentOptimistic,
  updateStudentOptimistic,
  deleteStudentOptimistic,
  clearError,
} = studentsSlice.actions;

export default studentsSlice.reducer;
