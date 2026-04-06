# Developer Guide

**Version:** 1.0.0  
**Last Updated:** April 6, 2026

---

## Table of Contents

1. [Setup & Environment](#setup--environment)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Redux State Management](#redux-state-management)
6. [Component Development](#component-development)
7. [Routing & Navigation](#routing--navigation)
8. [API Integration](#api-integration)
9. [Testing](#testing)
10. [Debugging](#debugging)
11. [Performance Optimization](#performance-optimization)
12. [Deployment](#deployment)

---

## Setup & Environment

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git:** Latest version
- **Code Editor:** VS Code recommended
- **Browser:** Chrome with React/Redux DevTools

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Prototype/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs at `http://localhost:5173`

### Environment Configuration

The project uses environment variables for configuration. Current environment defaults are built into the codebase:

```typescript
// Default configuration in code
const API_BASE_URL = "http://localhost:3001";
const API_TIMEOUT = 30000;
const ENABLE_MOCK_DATA = true;
const ENABLE_REDUX_DEVTOOLS_EXTENSION = true;
```

**Note:** The application automatically uses mock data during development. No additional configuration required for initial setup.

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── pages/              # Page components (routes)
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AccreditationPage.tsx
│   │   │   ├── DataGovernancePage.tsx
│   │   │   └── ...
│   │   ├── forms/              # Form components
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/             # Reusable components
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── dashboard/          # Dashboard-specific components
│   │   └── EvidenceCollectionModal.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useRedux.ts         # Redux hooks
│   │   ├── useToast.ts         # Toast notifications
│   │   └── ...
│   ├── store/                  # Redux state management
│   │   ├── store.ts            # Store configuration
│   │   └── slices/             # Redux slices
│   │       ├── authSlice.ts
│   │       ├── accreditationSlice.ts
│   │       ├── reportingSlice.ts
│   │       └── ...
│   ├── routes/
│   │   └── routes.tsx          # Route definitions
│   ├── services/               # API and utility services
│   │   ├── api.ts              # API client
│   │   └── ...
│   ├── context/                # React context
│   │   └── ToastContext.tsx
│   ├── utils/                  # Utility functions
│   │   ├── validation.ts
│   │   └── ...
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                      # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/module-name

# Example:
git checkout -b feature/new-dashboard-widget
```

### Branch Naming Convention

- `feature/description` - New feature
- `fix/description` - Bug fix
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test addition
- `chore/description` - Build/config changes

### Making Changes

```bash
# Edit files
# ... make changes ...

# Check status
git status

# Stage changes
git add src/components/MyComponent.tsx

# Commit with descriptive message
git commit -m "feat: Add MyComponent with validation"
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Type:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code refactoring
- `test:` - Test addition/modification
- `chore:` - Build/dependency changes

**Example:**

```
feat: Add evidence collection modal to AccreditationPage

- Create EvidenceCollectionModal component
- Add form validation for title, category, file
- Integrate with accreditationSlice actions
- Add file size validation (50MB limit)

Closes #123
```

### Pushing Changes

```bash
# Push to remote
git push origin feature/new-dashboard-widget

# If branch doesn't exist on remote, use:
git push -u origin feature/new-dashboard-widget
```

### Creating Pull Request

1. Visit GitHub repository
2. Click "Compare & pull request"
3. Add title and description
4. Tag reviewers
5. Link issues (if any)
6. Request review
7. Address any feedback
8. Merge when approved

---

## Code Standards

### TypeScript

**Strict Mode (Required)**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "verbatimModuleSyntax": true
  }
}
```

**Type All Values:**

```tsx
// Good
const userCount: number = 10;
const items: string[] = ["a", "b"];
const handler = (event: React.ChangeEvent<HTMLInputElement>) => {};

// Bad - avoid any
const data: any = getUserData();
```

**Export Types:**

```tsx
// Good
export type MyType = {
  id: string;
  name: string;
};

export const MyComponent: React.FC<MyType> = ({ id, name }) => {
  // ...
};

// Bad
function MyComponent(props: any) {
  // ...
}
```

### React Component Patterns

**Functional Components (Required)**

```tsx
interface MyComponentProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default MyComponent;
```

**Avoid Class Components**
Only use React hooks, never class components.

### ESLint & Prettier

```bash
# Run linter
npm run lint

# Format code
npm run format

# Fix linting issues
npm run lint -- --fix
```

### Naming Conventions

**Components:**

```tsx
// PascalCase for components
const MyComponent: React.FC = () => {};
const UserProfile: React.FC = () => {};

// kebab-case for file names (optional)
// MyComponent.tsx
// UserProfile.tsx
```

**Variables & Functions:**

```tsx
// camelCase for variables and functions
const userData = { name: "John" };
const calculateTotal = (items: number[]) => items.reduce((a, b) => a + b, 0);

// CONSTANT_CASE for constants
const API_BASE_URL = "http://localhost:3001";
const MAX_FILE_SIZE = 50 * 1024 * 1024;
```

**React Hooks:**

```tsx
// useState
const [isOpen, setIsOpen] = useState(false);

// useEffect
useEffect(() => {
  // fetch data
}, [dependency]);

// useCallback
const handleClick = useCallback(() => {
  // handler
}, []);

// useMemo
const memoizedValue = useMemo(() => expensiveOperation(), [dependency]);
```

---

## Redux State Management

### Store Structure

```
store/
├── store.ts                 # Store configuration
└── slices/
    ├── authSlice.ts        # Authentication state
    ├── accreditationSlice.ts # Accreditation data
    ├── reportingSlice.ts    # Reporting data
    └── ...
```

### Creating a Slice

```tsx
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MyState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: MyState = {
  items: [],
  loading: false,
  error: null,
};

const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    // Synchronous actions
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addItem, removeItem, setLoading, setError } = mySlice.actions;
export default mySlice.reducer;
```

### Using Redux in Components

```tsx
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { addItem } from "../../store/slices/mySlice";

const MyComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.my.items);
  const loading = useAppSelector((state) => state.my.loading);

  const handleAdd = (item: Item) => {
    dispatch(addItem(item));
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### Redux Hooks

```tsx
// Use custom hooks (not useDispatch/useSelector directly)
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

const dispatch = useAppDispatch();
const state = useAppSelector((state) => state.slice.property);
```

---

## Component Development

### Page Component Template

```tsx
import React, { useState } from "react";
import Button from "../forms/Button";

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-10 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Page Title</h1>
        <p className="opacity-90 text-base">Page description</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 pb-10 max-w-7xl mx-auto w-full">
        {/* Tabs / Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Metric Cards */}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Page content */}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
```

### Modal Component Template

```tsx
import React, { useState } from "react";
import Button from "./forms/Button";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MyModal: React.FC<MyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validate
    // Submit
    // Call onSuccess
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-6">
          <h2 className="text-2xl font-bold">Modal Title</h2>
        </div>

        {/* Content */}
        <div className="p-8">{/* Form fields */}</div>

        {/* Footer */}
        <div className="bg-gray-100 px-8 py-6 border-t flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyModal;
```

---

## Routing & Navigation

### Routes Configuration

Located in: `src/routes/routes.tsx`

```tsx
import { AccreditationPage } from "../components/pages";

export const appRoutes: RouteObject[] = [
  { path: "/accreditation", element: <AccreditationPage /> },
  // Add new routes here
];
```

### Adding a New Page

1. **Create Component** - `src/components/pages/MyPage.tsx`
2. **Export from Index** - Add to `src/components/pages/index.ts`
3. **Add Route** - Add to `src/routes/routes.tsx`
4. **Add Navigation** - Update `src/components/layout/Sidebar.tsx`

```tsx
// Sidebar.tsx - Add to role's nav array
const navByRole: Record<User["role"], NavItem[]> = {
  admin: [
    // ... existing items
    { icon: "my_icon", label: "My Page", id: "my-page" },
  ],
  // ...
};
```

### Programmatic Navigation

```tsx
import { useNavigate } from "react-router-dom";

const MyComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/my-page");
  };

  return <button onClick={handleClick}>Go to My Page</button>;
};
```

---

## API Integration

### API Service

Located in: `src/services/api.ts`

```tsx
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Making API Calls

```tsx
import apiClient from "../services/api";

// In Redux thunk or component
const fetchData = async () => {
  try {
    const response = await apiClient.get("/api/endpoint");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
```

### Mock Data Strategy (Development)

The application includes centralized mock data factories in `src/data/mockDataFactories.ts` that are used across components:

```tsx
// Example: Mock data in Redux slices
import {
  generateMockReports,
  generateMockAuditLogs,
} from "./data/mockDataFactories";

const initialState: ReportingState = {
  reports: generateMockReports(),
  auditLogs: generateMockAuditLogs(),
};
```

**Transition to Real API:**

1. Implement backend API endpoints
2. Update `API_BASE_URL` to point to your backend server
3. Replace mock data generation with actual API calls via Redux thunks
4. Update components to handle loading/error states from Redux

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test MyComponent.test.tsx

# Generate coverage report
npm run test:coverage
```

### Component Testing Example

```tsx
// MyComponent.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders title", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<MyComponent onClose={onClose} />);
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
```

---

## Debugging

### React DevTools

1. Install React DevTools browser extension
2. Open DevTools (F12)
3. Navigate to "Components" tab
4. Inspect component tree and props

### Redux DevTools

1. Install Redux DevTools browser extension
2. Open DevTools (F12)
3. Navigate to "Redux" tab
4. View dispatched actions and state changes
5. Time-travel debug (replay actions)

### Console Logging

```tsx
// Debug Redux state
console.log("Current state:", store.getState());

// Debug component props
console.log("MyComponent props:", props);

// Debug data flow
console.log("Before dispatch:", state);
dispatch(action);
console.log("After dispatch:", getState());
```

### Network Debugging

1. Open DevTools → Network tab
2. Check API requests
3. View response data
4. Check status codes and headers

---

## Performance Optimization

### React Optimization

**Memoization:**

```tsx
import { memo } from "react";

const MyComponent = memo(({ prop1, prop2 }) => {
  return (
    <div>
      {prop1} {prop2}
    </div>
  );
});
```

**useCallback:**

```tsx
const handleClick = useCallback(() => {
  // handler
}, [dependency]);
```

**useMemo:**

```tsx
const memoizedList = useMemo(() => {
  return data.filter((item) => item.active);
}, [data]);
```

### Bundle Optimization

- **Code Splitting:** Use React.lazy for route components
- **Tree Shaking:** Avoid default exports
- **Minification:** Vite handles automatically
- **Image Optimization:** Use proper formats and sizes

### Runtime Performance

- **Lazy Loading:** Load modals/components on demand
- **Pagination:** Don't load all data at once
- **Debouncing:** Debounce search/filter inputs
- **Virtual Scrolling:** For long lists

---

## Deployment

### Production Build

```bash
# Generate production build
npm run build

# Preview production build locally
npm run preview

# Output is in dist/ directory
```

### Build Checklist

- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ No console errors
- ✅ Environment variables set
- ✅ Documentation updated
- ✅ Git commits clean

### Deployment Steps

1. **Build:** `npm run build`
2. **Test build locally:** `npm run preview`
3. **Push to repository:** `git push origin main`
4. **Deploy to hosting:** Upload `dist/` directory
5. **Verify:** Test all features on live environment

### Hosting Options

- **Netlify:** Drag and drop `dist/` folder
- **Vercel:** Connect GitHub repository
- **AWS S3:** Upload to S3 bucket
- **Docker:** Containerize application

---

## Troubleshooting

### Common Issues

**Issue:** Build fails with TypeScript errors

- **Solution:** Run `npm run lint -- --fix` to auto-fix issues

**Issue:** Styles not applying

- **Solution:** Check class names, rebuild Tailwind CSS

**Issue:** API calls not working

- **Solution:** Check API_BASE_URL, verify CORS headers

**Issue:** React DevTools not showing

- **Solution:** Reinstall extension, restart browser

---

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

---

## Support

- **Issues:** Open GitHub issue with details
- **Questions:** Check documentation or ask team
- **Code Review:** Request review on pull request

---

## Version History

| Version | Date        | Changes                 |
| ------- | ----------- | ----------------------- |
| 1.0.0   | Apr 6, 2026 | Initial developer guide |

---
