import React, { useCallback, useState } from "react";
import { ToastContext } from "./toastContextValue";
import type { ToastType, Toast } from "./toastContextValue";
export { useToast } from "./toastContextValue";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, duration: number = 3000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
