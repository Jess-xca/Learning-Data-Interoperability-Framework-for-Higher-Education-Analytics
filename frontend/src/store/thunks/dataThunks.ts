import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

// Student thunks
export const fetchStudents = createAsyncThunk(
  "data/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch students");
    }
  }
);

export const createStudent = createAsyncThunk(
  "data/createStudent",
  async (studentData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/students", studentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create student");
    }
  }
);

export const updateStudent = createAsyncThunk(
  "data/updateStudent",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update student");
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "data/deleteStudent",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/students/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete student");
    }
  }
);

// Program thunks
export const fetchPrograms = createAsyncThunk(
  "data/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/programs");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch programs");
    }
  }
);

// Course thunks
export const fetchCourses = createAsyncThunk(
  "data/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch courses");
    }
  }
);

export const createCourse = createAsyncThunk(
  "data/createCourse",
  async (courseData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create course");
    }
  }
);

// Analytics thunks
export const fetchAnalytics = createAsyncThunk(
  "data/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics/summary");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch analytics");
    }
  }
);

export const fetchReports = createAsyncThunk(
  "data/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch reports");
    }
  }
);
