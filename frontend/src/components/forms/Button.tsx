import React from "react";
import { Loader } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: string | React.ReactNode;
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
    "font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-primary text-on-primary hover:shadow-xl hover:shadow-primary/30",
    secondary:
      "bg-secondary text-on-secondary hover:shadow-xl hover:shadow-secondary/30",
    tertiary:
      "bg-tertiary text-on-tertiary hover:shadow-xl hover:shadow-tertiary/30",
    danger:
      "bg-error text-on-error hover:shadow-xl hover:shadow-error/30",
    ghost: "text-primary hover:bg-primary/5 rounded-xl",
    outline: "bg-transparent border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-[10px] h-9 uppercase tracking-widest",
    md: "px-6 py-2.5 text-xs h-11 uppercase tracking-widest",
    lg: "px-8 py-3.5 text-sm h-14 uppercase tracking-widest",
    xl: "px-10 py-4 text-base h-16 uppercase tracking-[0.2em]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      {icon && !isLoading && (
        typeof icon === "string" ? (
          <span className="material-symbols-outlined text-lg">{icon}</span>
        ) : (
          <div className="flex items-center">{icon}</div>
        )
      )}
      {isLoading && (
        <Loader className="w-5 h-5 animate-spin" />
      )}
      {children}
    </button>
  );
}
