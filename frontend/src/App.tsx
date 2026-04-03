import { useState } from "react";
import { Sidebar, Header, MainContent } from "./components";
import { LoginPage, DashboardPage } from "./components/pages";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeNav={activeNav} onNavClick={setActiveNav} />
      <Header title="Dashboard" />

      {activeNav === "dashboard" && <DashboardPage />}

      {activeNav === "settings" && (
        <MainContent>
          <h1 className="text-4xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-lg text-on-surface-variant mb-10">
            Settings page coming soon...
          </p>
        </MainContent>
      )}

      {!["dashboard", "settings"].includes(activeNav) && (
        <MainContent>
          <h1 className="text-4xl font-bold text-primary mb-2 capitalize">
            {activeNav}
          </h1>
          <p className="text-lg text-on-surface-variant mb-10">
            {activeNav} page coming soon...
          </p>
        </MainContent>
      )}
    </div>
  );
}

export default App;
