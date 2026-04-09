import React from "react";

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "secondary" | "primary";
  title: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg";
}

export default function FormCard({
  children,
  className = "",
  variant = "primary",
  title,
  subtitle,
  maxWidth = "md",
}: FormCardProps) {
  const gradientMap = {
    secondary: "linear-gradient(135deg, #545f72 0%, #193657 100%)",
    primary: "linear-gradient(135deg, #6a4c93 0%, #1d3557 100%)",
  };

  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <section
      className={`col-span-1 md:col-span-7 bg-surface-container-lowest p-3 md:p-5 flex flex-col justify-center relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: gradientMap[variant] }}
      />
      <div className={`relative z-10 ${maxWidthMap[maxWidth]} mx-auto w-full`}>
        <header className="mb-4">
          <div className="flex items-center gap-2 md:hidden mb-2">
            <span className="material-symbols-outlined text-primary text-lg">
              school
            </span>
            <span className="text-xs font-extrabold text-primary tracking-tight">
              Academic Curator
            </span>
          </div>
          <h3 className="text-base font-bold tracking-tight text-primary">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-on-surface-variant mt-1">
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
