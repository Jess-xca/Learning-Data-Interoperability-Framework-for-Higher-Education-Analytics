import React from "react";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const fieldClass =
  "w-full h-12 pl-4 pr-10 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none appearance-none cursor-pointer";

export default function FormSelect({
  label,
  options,
  error,
  required = false,
  helperText,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-secondary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          className={`${fieldClass} ${error ? "border-error focus:border-error" : ""}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
          <ChevronDown className="w-5 h-5" />
        </span>
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-on-surface-variant">{helperText}</p>
      )}
    </div>
  );
}
