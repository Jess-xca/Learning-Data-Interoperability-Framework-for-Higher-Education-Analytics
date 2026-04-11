import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Sidebar, Header, Footer } from "./components";
import {
  LoginPage,
  RegistrationPage,
  PasswordResetPage,
  PrivacyPolicyPage,
} from "./components/pages";
import { appRoutes } from "./routes/routes";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/common/ToastContainer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SessionManager } from "./components/SessionManager";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    // Map navigation ID to route path
    const routePath = id === "dashboard" ? "/dashboard" : `/${id}`;
    navigate(routePath);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Sidebar
        onNavClick={handleNavClick}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

function AppRoutes() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard when authenticated and trying to access public routes
  useEffect(() => {
    if (state.isAuthenticated) {
      const isPublicRoute =
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/reset-password";

      if (isPublicRoute) {
        // Use setTimeout to ensure routes have been re-rendered
        const timer = setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [state.isAuthenticated, location.pathname, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route
        path="/unauthorized"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <h1>Unauthorized</h1>
          </div>
        }
      />

      {!state.isAuthenticated ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
        </>
      ) : (
        <Route element={<AppLayout />}>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}
        </Route>
      )}

      {/* Catch-all: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <SessionManager />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default AppWrapper;
