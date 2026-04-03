import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container active:scale-95 shadow-md",
    secondary:
      "bg-surface-container-low text-primary border border-outline-variant/30 hover:bg-surface-container active:scale-95",
    danger:
      "bg-error text-on-error hover:bg-error-container active:scale-95 shadow-md",
    ghost: "text-primary hover:bg-surface-container-low",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-6 py-2.5 text-base h-10",
    lg: "px-8 py-3 text-base h-12",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      {icon && !isLoading && (
        <span className="material-symbols-outlined text-lg">{icon}</span>
      )}
      {isLoading && (
        <span className="material-symbols-outlined text-lg animate-spin">
          progress_activity
        </span>
      )}
      {children}
    </button>
  );
}
