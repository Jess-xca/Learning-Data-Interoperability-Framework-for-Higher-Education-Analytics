import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
import uiReducer from "./slices/uiSlice";
import { persistAuthMiddleware } from "./middleware/persistAuth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistAuthMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
