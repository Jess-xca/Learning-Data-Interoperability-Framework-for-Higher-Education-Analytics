import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}

export default function FormField({
  label,
  error,
  required = false,
  children,
  helperText,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-secondary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-on-surface-variant">{helperText}</p>
      )}
    </div>
  );
}
