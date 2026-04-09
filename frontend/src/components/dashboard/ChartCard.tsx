import React from "react";
import { Card } from "../common";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: ChartCardProps & { className?: string }) {
  return (
    <Card className={`glass border-none flex flex-col ${className}`}>
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h3 className="text-xl font-black text-primary tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs font-medium text-on-surface-variant mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[300px] p-6">{children}</div>
    </Card>
  );
}
