# Setup & Development Guide

## System Requirements

### Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ or **yarn** v3+
- **Git**: v2.30+
- **Text Editor/IDE**: VS Code (recommended) or similar
- **OS**: Windows, macOS, or Linux

### Optional Tools
- VS Code Extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Redux DevTools browser extension

---

## Project Setup

### 1. Clone or Initialize Repository

```bash
# Option A: Clone from Git
git clone <repository-url>
cd Prototype

# Option B: Initialize new project
npm create vite@latest prototype -- --template react
cd prototype
```

---

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Required Dependencies

The project will install:

**Core Framework**:
- react@18+
- react-dom@18+
- react-router-dom@6+

**State Management**:
- @reduxjs/toolkit
- react-redux

**Styling**:
- tailwindcss@3+
- tailwind-merge

**UI & Forms**:
- react-hook-form
- zod

**Visualization**:
- recharts
- plotly.js (optional for advanced charts)

**Mock API**:
- msw (mock service worker)

**Utilities**:
- axios
- date-fns
- lodash

**Localization**:
- i18next
- react-i18next

**Development**:
- vite
- @vitejs/plugin-react
- eslint
- prettier
- @testing-library/react
- vitest

---

### 3. Install Development Dependencies

```bash
npm install --save-dev \
  @vitejs/plugin-react \
  @eslint/js \
  eslint \
  eslint-plugin-react \
  prettier \
  tailwindcss \
  postcss \
  autoprefixer \
  @testing-library/react \
  @testing-library/jest-dom \
  vitest \
  msw
```

---

## Configuration Files

### 3.1 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      spacing: {
        'safe': 'var(--safe-margin)',
      },
    },
  },
  plugins: [],
}
```

---

### 3.2 vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

---

### 3.3 .env.example

```
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_MSW=true
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=debug

# Application Config
VITE_APP_NAME=Learning Data Framework
VITE_APP_VERSION=0.1.0
```

**Usage**:
```bash
# Create local .env file
cp .env.example .env

# Customize values as needed
# .env file is never committed to Git
```

---

## Mock Service Worker Setup

### 4.1 Enable MSW

Create `src/mocks/browser.js`:

```javascript
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/authHandlers';
import { dataHandlers } from './handlers/dataHandlers';
import { analyticsHandlers } from './handlers/analyticsHandlers';
import { governanceHandlers } from './handlers/governanceHandlers';

export const worker = setupWorker(
  ...authHandlers,
  ...dataHandlers,
  ...analyticsHandlers,
  ...governanceHandlers,
);
```

### 4.2 Start MSW in main.jsx

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Start Mock Service Worker
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'warn', // Log unhandled requests
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Redux Store Setup

Create `src/redux/store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    data: dataReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
```

---

## i18n Localization Setup

Create `src/i18n/i18n.js`:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import swTranslations from './locales/sw.json';
import frTranslations from './locales/fr.json';
import rwTranslations from './locales/rw.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      sw: { translation: swTranslations },
      fr: { translation: frTranslations },
      rw: { translation: rwTranslations },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

## Starting Development Server

```bash
# Start development server
npm run dev

# The app will open at http://localhost:3000
```

### Development Server Features
- Hot Module Replacement (HMR) for instant updates
- Redux DevTools integration
- MSW request logging
- Source maps for debugging

---

## Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Built files are in dist/ directory
```

---

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:ci
```

---

## Project Structure

After setup, your project should look like:

```
Prototype/
├── docs/                    # Documentation (this folder)
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── redux/              # Redux store & slices
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── mocks/              # MSW mock handlers
│   ├── i18n/               # Localization files
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css            # Global styles
├── public/
│   ├── index.html
│   └── assets/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── .gitignore
├── README.md
└── changelog.md
```

---

## Verification Steps

After setup, verify everything works:

### 1. Run Development Server
```bash
npm run dev
```
✅ Should open http://localhost:3000 without errors

### 2. Check Console
- Should see "MSW mocking enabled" message
- No 404 errors for mock API calls
- Redux DevTools should be available

### 3. Test Login Flow
- Navigate to login page
- Try dummy credentials: `demo@university.rw` / `password123`
- Should successfully authenticate and redirect to dashboard

### 4. Test Data Display
- Dashboard should display mock data (students, courses, etc.)
- Charts and tables should render without errors

---

## Git Workflow

### Initial Setup
```bash
# Configure git
git config user.name "Your Name"
git config user.email "your.email@university.rw"

# Create .gitignore (ignore node_modules, dist, .env, etc.)
# See .gitignore template below
```

### Daily Workflow
```bash
# Create feature branch
git checkout -b feature/module-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/module-name

# Create pull request for review
```

### .gitignore Template
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/dist
/build

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
/coverage
```

---

## Common Issues & Solutions

### Issue: Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind Styles Not Applying
- Ensure `tailwind.config.js` content paths are correct
- Check that CSS is imported: `import 'tailwindcss/tailwind.css'`
- Restart dev server: `npm run dev`

### Issue: MSW Requests Failing
- MSW must be started before app renders
- Check browser console for MSW warnings
- Verify mock handlers are defined correctly

---

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run test            # Run tests
npm run test:coverage   # Tests with coverage

# Database (future)
npm run db:seed         # Seed dummy data
npm run db:reset        # Reset database
npm run db:migrate      # Run migrations
```

---

## Next Steps

1. ✅ Complete project setup
2. ⏳ Generate dummy data (see DUMMY_DATA_SCHEMA.md)
3. ⏳ Build base component library (see COMPONENT_LIBRARY.md)
4. ⏳ Implement authentication module
5. ⏳ Create dashboard layouts
6. ⏳ Implement data integration UI
7. ⏳ Build analytics dashboards

---

## Support & Resources

- **Documentation**: `/docs` folder
- **Component Library**: See `COMPONENT_LIBRARY.md`
- **API Mocks**: See `API_MOCKS.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Tasks**: Track progress in `TASKS.md`

---

**Last Updated**: April 3, 2026
