import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const SessionManager = () => {
  const { state, updateActivity, logout } = useAuth();

  useEffect(() => {
    if (!state.isAuthenticated) return;

    const handleActivity = () => {
      updateActivity();
    };

    // Listen for user activity
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousemove", handleActivity);

    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
    };
  }, [state.isAuthenticated, updateActivity]);

  // Check for session timeout
  useEffect(() => {
    if (!state.isAuthenticated || !state.lastActivity) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastActivityTime = (state.lastActivity as Date).getTime();
      const elapsed = now - lastActivityTime;

      if (elapsed > state.sessionTimeout) {
        logout();
        alert("Your session has expired. Please login again.");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity, state.sessionTimeout, logout]);

  return null;
};
