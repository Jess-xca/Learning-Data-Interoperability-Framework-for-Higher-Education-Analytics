import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchStudents,
  createStudent,
  updateStudent as updateStudentThunk,
  deleteStudent as deleteStudentThunk,
  fetchPrograms,
  fetchCourses,
  createCourse,
  fetchAnalytics,
  fetchReports,
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

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  enrollment: number;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  department: string;
  totalCourses: number;
}

export interface DataState {
  students: Student[];
  courses: Course[];
  programs: Program[];
  analytics: any | null;
  reports: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  students: [],
  courses: [],
  programs: [],
  analytics: null,
  reports: null,
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
    setPrograms: (state, action: PayloadAction<Program[]>) => {
      state.programs = action.payload;
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchStudents
    builder.addCase(fetchStudents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createStudent
    builder.addCase(createStudent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.students.push(action.payload);
    });
    builder.addCase(createStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateStudentThunk
    builder.addCase(updateStudentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateStudentThunk.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.students.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    });
    builder.addCase(updateStudentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteStudentThunk
    builder.addCase(deleteStudentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteStudentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.students = state.students.filter((s) => s.id !== action.payload);
    });
    builder.addCase(deleteStudentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchPrograms
    builder.addCase(fetchPrograms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPrograms.fulfilled, (state, action) => {
      state.loading = false;
      state.programs = action.payload;
    });
    builder.addCase(fetchPrograms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchCourses
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createCourse
    builder.addCase(createCourse.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.courses.push(action.payload);
    });
    builder.addCase(createCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchAnalytics
    builder.addCase(fetchAnalytics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    });
    builder.addCase(fetchAnalytics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchReports
    builder.addCase(fetchReports.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    });
    builder.addCase(fetchReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setStudents,
  setCourses,
  setPrograms,
  addStudent,
  updateStudent,
  deleteStudent,
  setLoading,
  setError,
  clearError,
} = dataSlice.actions;

export default dataSlice.reducer;
