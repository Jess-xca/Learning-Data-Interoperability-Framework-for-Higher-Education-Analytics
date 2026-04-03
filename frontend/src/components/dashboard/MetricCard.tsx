import { Card } from "../common";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  icon?: string;
  accentColor?: "primary" | "success" | "secondary" | "error";
  className?: string;
}

const accentBorder = {
  primary: "border-l-4 border-primary",
  success: "border-l-4 border-on-tertiary-container",
  secondary: "border-l-4 border-secondary",
  error: "border-l-4 border-error",
};

const iconBg = {
  primary: "bg-primary-fixed/30 text-primary",
  success: "bg-tertiary-container/10 text-on-tertiary-container",
  secondary: "bg-secondary-container/30 text-secondary",
  error: "bg-error-container/30 text-error",
};

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  accentColor = "primary",
  className = "",
}: MetricCardProps) {
  return (
    <Card className={`${accentBorder[accentColor]} ${className}`}>
      <div className="text-xs font-bold uppercase text-on-surface-variant tracking-widest mb-4">
        {label}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-black text-primary">{value}</p>
        {icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg[accentColor]}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trend.direction === "up" ? "text-on-tertiary-container" : "text-error"}`}>
          <span className="material-symbols-outlined text-sm">
            {trend.direction === "up" ? "trending_up" : "trending_down"}
          </span>
          {trend.direction === "up" ? "+" : "-"}{Math.abs(trend.value)}% YoY
        </div>
      )}
    </Card>
  );
}
