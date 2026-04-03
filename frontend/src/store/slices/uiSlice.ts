import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface UIState {
  sidebarOpen: boolean;
  notifications: Notification[];
  darkMode: boolean;
  language: 'en' | 'fr' | 'kn' | 'sw';
}

const initialState: UIState = {
  sidebarOpen: true,
  notifications: [],
  darkMode: false,
  language: 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'fr' | 'kn' | 'sw'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  toggleDarkMode,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;
