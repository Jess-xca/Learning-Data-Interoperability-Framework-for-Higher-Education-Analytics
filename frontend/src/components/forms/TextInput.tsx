import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: string;
}

export default function TextInput({
  label,
  error,
  helperText,
  icon,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-1 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            {icon}
          </span>
        )}
        <input
          className={`w-full h-9 ${icon ? "pl-6" : "pl-3"} pr-3 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 rounded-t text-xs transition-all font-medium shadow-sm ${
            error ? "border-error focus:border-error" : ""
          } ${className || ""}`}
          {...props}
        />
      </div>
      {error && <p className="text-[9px] text-error font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-[9px] text-on-surface-variant">{helperText}</p>
      )}
    </div>
  );
}
