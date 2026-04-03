import { useToast } from "../../context/ToastContext";
import type { Toast, ToastType } from "../../context/toastContextValue";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const bgColorMap: Record<ToastType, string> = {
    success: "bg-tertiary-fixed text-on-tertiary-fixed",
    error: "bg-error text-on-error",
    warning: "bg-warning bg-opacity-90 text-on-surface",
    info: "bg-primary text-on-primary",
  };

  const iconMap: Record<ToastType, string> = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
        <div
          key={toast.id}
          className={`${bgColorMap[toast.type]} rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg animate-in slide-in-from-right-5 max-w-sm`}
        >
          <span className="material-symbols-outlined text-lg">
            {iconMap[toast.type]}
          </span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-lg opacity-70 hover:opacity-100 transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
