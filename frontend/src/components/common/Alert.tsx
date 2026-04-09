import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "error" | "success";
  icon?: string;
  className?: string;
}

export default function Alert({
  children,
  variant = "info",
  icon,
  className = "",
}: AlertProps) {
  const variantClasses = {
    info: "bg-primary-container text-on-primary-container",
    warning:
      "bg-surface-container text-on-surface-variant border-l-4 border-error",
    error: "bg-error-container text-on-error-container",
    success: "bg-tertiary-fixed text-on-tertiary",
  };

  const defaultIconComponents = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle2,
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${variantClasses[variant]} ${className}`}
    >
      {!icon &&
        (() => {
          const IconComponent = defaultIconComponents[variant];
          return (
            <IconComponent className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
          );
        })()}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <div className="text-sm font-medium leading-tight">{children}</div>
    </div>
  );
}
