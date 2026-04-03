import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Student {
  id: string;
  name: string;
  email: string;
  gpa: number;
  program: string;
  enrollmentYear: number;
  status: "active" | "graduated" | "suspended";
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  enrollment: number;
}

export interface DataState {
  students: Student[];
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  students: [],
  courses: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStudents,
  setCourses,
  addStudent,
  updateStudent,
  deleteStudent,
  setLoading,
  setError,
} = dataSlice.actions;

export default dataSlice.reducer;
