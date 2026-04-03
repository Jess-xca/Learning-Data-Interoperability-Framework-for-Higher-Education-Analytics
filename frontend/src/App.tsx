import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "./components";
import { LoginPage } from "./components/pages";
import { appRoutes } from "./routes/routes";
import { useAppSelector } from "./hooks/useRedux";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/common/ToastContainer";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

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
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          {!isAuthenticated ? <LoginPage /> : <AppLayout />}
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
