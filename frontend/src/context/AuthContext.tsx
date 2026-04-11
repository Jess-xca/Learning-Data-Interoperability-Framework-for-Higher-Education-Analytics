import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";

export type UserRole =
  | "academic_admin"
  | "qa_officer"
  | "data_analyst"
  | "department_head"
  | "system_admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  institution: string;
  department?: string;
  role: UserRole;
  mfaEnabled: boolean;
  createdAt: Date;
}

// Demo users for testing
export const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "demo-admin",
    email: "admin@university.edu",
    password: "password123",
    fullName: "Sarah Johnson",
    institution: "University of Advanced Systems",
    department: "Academic Affairs",
    role: "academic_admin",
    mfaEnabled: false,
    createdAt: new Date(),
  },
  {
    id: "demo-qa",
    email: "qa@university.edu",
    password: "password123",
    fullName: "Michael Chen",
    institution: "University of Advanced Systems",
    department: "Quality Assurance",
    role: "qa_officer",
    mfaEnabled: false,
    createdAt: new Date(),
  },
  {
    id: "demo-analyst",
    email: "analyst@university.edu",
    password: "password123",
    fullName: "Emma Rodriguez",
    institution: "University of Advanced Systems",
    department: "Data & Analytics",
    role: "data_analyst",
    mfaEnabled: false,
    createdAt: new Date(),
  },
  {
    id: "demo-hod",
    email: "hod@university.edu",
    password: "password123",
    fullName: "Dr. James Wilson",
    institution: "University of Advanced Systems",
    department: "Computer Science",
    role: "department_head",
    mfaEnabled: false,
    createdAt: new Date(),
  },
  {
    id: "demo-sysadmin",
    email: "sysadmin@university.edu",
    password: "password123",
    fullName: "Lisa Thompson",
    institution: "University of Advanced Systems",
    department: "IT Operations",
    role: "system_admin",
    mfaEnabled: false,
    createdAt: new Date(),
  },
];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionTimeout: number; // milliseconds
  lastActivity: Date | null;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_ACTIVITY" }
  | { type: "SESSION_TIMEOUT" }
  | { type: "MFA_ENABLED"; payload: boolean };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateActivity: () => void;
  resetError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  lastActivity: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        lastActivity: new Date(),
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return initialState;
    case "UPDATE_ACTIVITY":
      return {
        ...state,
        lastActivity: new Date(),
      };
    case "SESSION_TIMEOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: "Session expired. Please login again.",
      };
    case "MFA_ENABLED":
      return {
        ...state,
        user: state.user ? { ...state.user, mfaEnabled: action.payload } : null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      try {
        const user = JSON.parse(authUser) as User;
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (err) {
        console.error("Failed to restore auth state:", err);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Mock authentication - simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check against demo users
      const demoUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password,
      );

      if (demoUser) {
        const { password: _, ...userWithoutPassword } = demoUser;
        dispatch({ type: "LOGIN_SUCCESS", payload: userWithoutPassword });
        // Store in localStorage
        localStorage.setItem("authUser", JSON.stringify(userWithoutPassword));
        localStorage.setItem("authToken", "mock_token_" + Date.now());
      } else {
        throw new Error(
          "Invalid email or password. Use demo credentials provided below.",
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: Partial<User>) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || "",
        fullName: userData.fullName || "",
        phone: userData.phone,
        institution: userData.institution || "",
        department: userData.department,
        role: userData.role || "data_analyst",
        mfaEnabled: false,
        createdAt: new Date(),
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: newUser });
      localStorage.setItem("authUser", JSON.stringify(newUser));
      localStorage.setItem("authToken", "mock_token_" + Date.now());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  }, []);

  const updateActivity = useCallback(() => {
    dispatch({ type: "UPDATE_ACTIVITY" });
  }, []);

  const resetError = useCallback(() => {
    dispatch({ type: "LOGIN_ERROR", payload: "" });
  }, []);

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateActivity,
    resetError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
