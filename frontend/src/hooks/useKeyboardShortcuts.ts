import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { logout } from "../store/slices/authSlice";

interface KeyboardShortcuts {
  [key: string]: (e?: KeyboardEvent) => void;
}

/**
 * Hook for managing keyboard event listeners
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const shortcuts: KeyboardShortcuts = {
      // Alt + D: Go to Dashboard
      "alt+d": () => {
        if (isAuthenticated) navigate("/");
      },
      // Alt + S: Go to Students
      "alt+s": () => {
        if (isAuthenticated) navigate("/students");
      },
      // Alt + C: Go to Courses
      "alt+c": () => {
        if (isAuthenticated) navigate("/courses");
      },
      // Alt + P: Go to Programs
      "alt+p": () => {
        if (isAuthenticated) navigate("/programs");
      },
      // Alt + R: Go to Reports
      "alt+r": () => {
        if (isAuthenticated) navigate("/reports");
      },
      // Alt + L: Logout
      "alt+l": () => {
        dispatch(logout());
        navigate("/login");
      },
      // Ctrl + K: Open search (can be extended)
      "ctrl+k": (e?: KeyboardEvent) => {
        if (e) e.preventDefault();
        // Dispatch search focus event or open search modal
        console.log("Search shortcut triggered");
      },
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers = [
        e.ctrlKey && "ctrl",
        e.altKey && "alt",
        e.shiftKey && "shift",
      ]
        .filter(Boolean)
        .join("+");

      const key = e.key.toLowerCase();
      const combination = modifiers ? `${modifiers}+${key}` : key;

      if (shortcuts[combination]) {
        const handler = shortcuts[combination];
        if (handler) handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthenticated, navigate, dispatch]);
}
