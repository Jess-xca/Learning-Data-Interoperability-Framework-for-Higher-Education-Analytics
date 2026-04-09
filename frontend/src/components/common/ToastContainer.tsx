import { useToast } from "../../context/useToast";
import type { Toast, ToastType } from "../../context/toastContextValue";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const bgColorMap: Record<ToastType, string> = {
    success: "bg-tertiary-fixed text-on-tertiary-fixed",
    error: "bg-error text-on-error",
    warning: "bg-warning bg-opacity-90 text-on-surface",
    info: "bg-primary text-on-primary",
  };

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5" strokeWidth={2} />,
    error: <AlertCircle className="w-5 h-5" strokeWidth={2} />,
    warning: <AlertTriangle className="w-5 h-5" strokeWidth={2} />,
    info: <Info className="w-5 h-5" strokeWidth={2} />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
        <div
          key={toast.id}
          className={`${bgColorMap[toast.type]} rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg animate-in slide-in-from-right-5 max-w-sm`}
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition"
          >
            <X className="w-4 h-4" strokeWidth={2} />
            \n{" "}
          </button>
        </div>
      ))}
    </div>
  );
}
