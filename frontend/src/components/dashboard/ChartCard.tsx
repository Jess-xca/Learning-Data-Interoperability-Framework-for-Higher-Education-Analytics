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
}: ChartCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary">{title}</h3>
          {subtitle && (
            <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="h-80 w-full">{children}</div>
    </Card>
  );
}
