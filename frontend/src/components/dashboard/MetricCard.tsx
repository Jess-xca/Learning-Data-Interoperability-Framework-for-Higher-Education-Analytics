import { Card } from '../common';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: string;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <Card className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            {label}
          </p>
          {icon && (
            <span className="material-symbols-outlined text-2xl text-primary/30">
              {icon}
            </span>
          )}
        </div>

        <p className="text-4xl font-bold text-primary">{value}</p>

        {trend && (
          <div className={`flex items-center gap-1 ${trend.direction === 'up' ? 'text-tertiary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-sm">
              {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            <span className="text-sm font-bold">
              {trend.direction === 'up' ? '+' : '-'}
              {Math.abs(trend.value)}% YoY
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
