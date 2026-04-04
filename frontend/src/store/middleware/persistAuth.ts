import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const AUTH_STORAGE_KEY = "auth_state";

/**
 * Middleware to persist auth state to localStorage
 */
export const persistAuthMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    // Save auth state after any auth action
    const actionObj = action as Record<string, unknown>;
    if (
      typeof actionObj === "object" &&
      actionObj !== null &&
      typeof actionObj.type === "string" &&
      actionObj.type.startsWith("auth/")
    ) {
      const state = store.getState() as RootState;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth));
    }

    return result;
  };

/**
 * Load persisted auth state from localStorage
 */
export function loadPersistedAuth() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load persisted auth:", error);
  }
  return null;
}

/**
 * Clear persisted auth state
 */
export function clearPersistedAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
