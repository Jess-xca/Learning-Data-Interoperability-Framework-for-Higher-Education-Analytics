import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  icon?: string;
}

const fieldClass =
  "w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none";

export default function FormInput({
  label,
  error,
  required = false,
  helperText,
  icon,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-secondary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            {icon}
          </span>
        )}
        <input
          className={`${fieldClass} ${icon ? "pl-10" : ""} ${error ? "border-error focus:border-error" : ""}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-on-surface-variant">{helperText}</p>
      )}
    </div>
  );
}
