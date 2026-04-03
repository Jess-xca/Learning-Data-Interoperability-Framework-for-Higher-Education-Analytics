import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

// Student thunks
export const fetchStudents = createAsyncThunk(
  "data/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/students");
      const data = response.data;
      // Handle both direct array and wrapped {data: [...]} responses
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch students";
      return rejectWithValue(message);
    }
  },
);

export const createStudent = createAsyncThunk(
  "data/createStudent",
  async (studentData: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await api.post("/students", studentData);
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create student";
      return rejectWithValue(message);
    }
  },
);

export const updateStudent = createAsyncThunk(
  "data/updateStudent",
  async (
    { id, data }: { id: string; data: Record<string, unknown> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update student";
      return rejectWithValue(message);
    }
  },
);

export const deleteStudent = createAsyncThunk(
  "data/deleteStudent",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/students/${id}`);
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete student";
      return rejectWithValue(message);
    }
  },
);

// Program thunks
export const fetchPrograms = createAsyncThunk(
  "data/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/programs");
      const data = response.data;
      // Handle both direct array and wrapped {data: [...]} responses
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch programs";
      return rejectWithValue(message);
    }
  },
);

// Course thunks
export const fetchCourses = createAsyncThunk(
  "data/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses");
      const data = response.data;
      // Handle both direct array and wrapped {data: [...]} responses
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch courses";
      return rejectWithValue(message);
    }
  },
);

export const createCourse = createAsyncThunk(
  "data/createCourse",
  async (courseData: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create course";
      return rejectWithValue(message);
    }
  },
);

// Analytics thunks
export const fetchAnalytics = createAsyncThunk(
  "data/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics/summary");
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch analytics";
      return rejectWithValue(message);
    }
  },
);

export const fetchReports = createAsyncThunk(
  "data/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports");
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch reports";
      return rejectWithValue(message);
    }
  },
);
