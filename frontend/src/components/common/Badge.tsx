import React from "react";

export type BadgeVariant = "primary" | "secondary" | "success" | "error" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    success: "bg-tertiary-fixed text-on-tertiary",
    error: "bg-error-container text-on-error-container",
    warning: "bg-surface-container-high text-on-surface-variant",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
