import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { Sidebar, Header, Footer } from "./components";
import {
  LoginPage,
  RegistrationPage,
  PasswordResetPage,
  PrivacyPolicyPage,
} from "./components/pages";
import { appRoutes } from "./routes/routes";
import { useAppSelector } from "./hooks/useRedux";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/common/ToastContainer";

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

function Routes_() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard only if user is on public routes while authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      (location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/reset-password")
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />

      {!isAuthenticated ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
        </>
      ) : (
        <Route element={<AppLayout />}>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      )}
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes_ />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
