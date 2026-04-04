import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./authSlice";

export interface SystemUser extends User {
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive" | "pending";
  department?: string;
  phone?: string;
}

export interface UsersState {
  allUsers: SystemUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  allUsers: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Fetch users request
    fetchUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Fetch users success
    fetchUsersSuccess: (state, action: PayloadAction<SystemUser[]>) => {
      state.allUsers = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Fetch users failure
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create user
    createUserSuccess: (state, action: PayloadAction<SystemUser>) => {
      state.allUsers.push(action.payload);
      state.error = null;
    },

    // Update user
    updateUserSuccess: (state, action: PayloadAction<SystemUser>) => {
      const index = state.allUsers.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.allUsers[index] = action.payload;
      }
      state.error = null;
    },

    // Delete user
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter(
        (user) => user.id !== action.payload
      );
      state.error = null;
    },

    // Set users
    setUsers: (state, action: PayloadAction<SystemUser[]>) => {
      state.allUsers = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  setUsers,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;
