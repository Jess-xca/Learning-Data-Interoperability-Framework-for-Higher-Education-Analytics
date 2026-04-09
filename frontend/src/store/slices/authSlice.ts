import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loadPersistedAuth } from "../middleware/persistAuth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "qa" | "analyst" | "hod" | "lecturer" | "student";
  institution: string;
  department?: string;
  mfaEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Load persisted auth state
const persistedAuth = loadPersistedAuth();

// Default user for testing/development
const defaultUser: User = {
  id: "admin-001",
  email: "admin@institution.edu",
  name: "System Admin",
  role: "admin",
  institution: "AUCA",
  department: "Administration",
  mfaEnabled: false,
};

const initialState: AuthState = persistedAuth || {
  user: defaultUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions;
export default authSlice.reducer;
