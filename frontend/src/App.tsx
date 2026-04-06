import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "./components";
import { LoginPage, RegistrationPage, PasswordResetPage, PrivacyPolicyPage } from "./components/pages";
import { appRoutes } from "./routes/routes";
import { useAppSelector } from "./hooks/useRedux";

function AppLayout() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    navigate(`/${id === "dashboard" ? "" : id}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeNav={activeNav} onNavClick={handleNavClick} />
      <Header />
      <Routes>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        
        {/* Authentication Routes */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
          </>
        ) : (
          <Route path="/*" element={<AppLayout />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
