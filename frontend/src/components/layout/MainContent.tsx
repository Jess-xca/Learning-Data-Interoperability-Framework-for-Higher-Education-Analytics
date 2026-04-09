import React from "react";

interface MainContentProps {
  children: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
}

export default function MainContent({
  children,
  maxWidth = "full",
}: MainContentProps) {
  const maxWidthClass = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div className="pt-20 min-h-screen bg-slate-50/50 transition-all duration-300">
      <div
        className={`${maxWidthClass} mx-auto px-4 py-4 md:px-8 md:py-6 w-full`}
      >
        {children}
      </div>
    </div>
  );
}
