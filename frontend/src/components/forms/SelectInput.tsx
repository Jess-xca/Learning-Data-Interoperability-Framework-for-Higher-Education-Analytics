import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export default function SelectInput({
  label,
  error,
  helperText,
  options,
  placeholder,
  className,
  ...props
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full h-12 pl-4 pr-10 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg transition-all font-medium appearance-none cursor-pointer ${
            error ? "border-error focus:border-error" : ""
          } ${className || ""}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled defaultValue="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
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
