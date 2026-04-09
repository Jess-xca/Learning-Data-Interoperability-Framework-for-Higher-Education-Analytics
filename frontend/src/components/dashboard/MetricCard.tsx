import { Card } from "../common";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  icon?: string;
  accentColor?: "primary" | "success" | "secondary" | "error";
  className?: string;
}

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  accentColor = "primary",
  className = "",
}: MetricCardProps) {
  const accentGradients = {
    primary: "from-primary/20 via-primary/5 to-transparent",
    success:
      "from-tertiary-container/30 via-tertiary-container/10 to-transparent",
    secondary: "from-secondary/20 via-secondary/5 to-transparent",
    error: "from-error/20 via-error/5 to-transparent",
  };

  const iconColors = {
    primary: "bg-primary text-white shadow-primary/20",
    success: "bg-tertiary text-white shadow-tertiary/20",
    secondary: "bg-secondary text-white shadow-secondary/20",
    error: "bg-error text-white shadow-error/20",
  };

  return (
    <Card
      className={`glass border-none p-0 overflow-hidden relative group transition-all hover:scale-[1.02] ${className}`}
    >
      {/* Accent Gradient Background */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${accentGradients[accentColor]} -z-10`}
      />

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-[0.2em]">
            {label}
          </span>
          {icon && (
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${iconColors[accentColor]}`}
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-1">
          <p className="text-xl font-black text-primary tracking-tight">
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center gap-0.5 mb-0.5 text-[8px] font-black uppercase px-1 py-0.5 rounded-full ${
                trend.direction === "up"
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-error/10 text-error"
              }`}
            >
              <span className="material-symbols-outlined text-[10px] leading-none">
                {trend.direction === "up" ? "trending_up" : "trending_down"}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="w-full h-0.5 bg-surface-container mt-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              accentColor === "primary"
                ? "bg-primary"
                : accentColor === "success"
                  ? "bg-tertiary"
                  : accentColor === "secondary"
                    ? "bg-secondary"
                    : "bg-error"
            }`}
            style={{ width: "65%" }}
          />
        </div>
      </div>
    </Card>
  );
}
