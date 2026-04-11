import React, { useState } from 'react';
import { Card } from '..';
import { BarChart3, ArrowUp, ArrowDown } from 'lucide-react';

interface CohortData {
  name: string;
  totalStudents: number;
  avgGPA: number;
  retentionRate: number;
  completionRate: number;
  engagementScore: number;
  atRiskCount: number;
}

const mockCohorts: CohortData[] = [
  {
    name: 'Class of 2026',
    totalStudents: 284,
    avgGPA: 3.42,
    retentionRate: 94.2,
    completionRate: 89.3,
    engagementScore: 82.1,
    atRiskCount: 23,
  },
  {
    name: 'Class of 2027',
    totalStudents: 312,
    avgGPA: 3.38,
    retentionRate: 91.7,
    completionRate: 86.8,
    engagementScore: 79.4,
    atRiskCount: 38,
  },
  {
    name: 'Class of 2028',
    totalStudents: 298,
    avgGPA: 3.51,
    retentionRate: 96.1,
    completionRate: 92.2,
    engagementScore: 85.3,
    atRiskCount: 18,
  },
  {
    name: 'Class of 2029',
    totalStudents: 267,
    avgGPA: 3.45,
    retentionRate: 93.6,
    completionRate: 88.5,
    engagementScore: 81.7,
    atRiskCount: 29,
  },
];

type ComparisonMetric = 'avgGPA' | 'retentionRate' | 'completionRate' | 'engagementScore';

export const CohortComparison: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<ComparisonMetric>('avgGPA');

  const getMetricLabel = (metric: ComparisonMetric) => {
    switch (metric) {
      case 'avgGPA':
        return { label: 'Average GPA', max: 4.0, unit: '' };
      case 'retentionRate':
        return { label: 'Retention Rate', max: 100, unit: '%' };
      case 'completionRate':
        return { label: 'Completion Rate', max: 100, unit: '%' };
      case 'engagementScore':
        return { label: 'Engagement Score', max: 100, unit: '%' };
    }
  };

  const metricInfo = getMetricLabel(selectedMetric);
  const sortedCohorts = [...mockCohorts].sort(
    (a, b) => (b[selectedMetric] as number) - (a[selectedMetric] as number),
  );
  const maxValue = Math.max(...sortedCohorts.map((c) => c[selectedMetric] as number));

  const getValueTrend = (index: number, totalLength: number) => {
    if (index === 0) return 'highest';
    if (index === totalLength - 1) return 'lowest';
    return 'middle';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">Cohort Comparison</h3>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['avgGPA', 'retentionRate', 'completionRate', 'engagementScore'] as ComparisonMetric[]).map(
          (metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getMetricLabel(metric as ComparisonMetric).label}
            </button>
          ),
        )}
      </div>

      {/* Chart */}
      <div className="space-y-4 mb-6">
        {sortedCohorts.map((cohort, idx) => {
          const percentage = ((cohort[selectedMetric] as number) / maxValue) * 100;
          const trend = getValueTrend(idx, sortedCohorts.length);

          return (
            <div key={cohort.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{cohort.name}</p>
                  <p className="text-xs text-slate-600">{cohort.totalStudents} students</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-slate-800">
                    {(cohort[selectedMetric] as number).toFixed(1)}
                    {metricInfo.unit}
                  </p>
                  {trend === 'highest' && (
                    <div className="flex items-center justify-end gap-1 text-green-600 text-xs mt-1">
                      <ArrowUp className="w-3 h-3" />
                      Best
                    </div>
                  )}
                  {trend === 'lowest' && (
                    <div className="flex items-center justify-end gap-1 text-red-600 text-xs mt-1">
                      <ArrowDown className="w-3 h-3" />
                      Lowest
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    trend === 'highest'
                      ? 'bg-gradient-to-r from-green-400 to-green-500'
                      : trend === 'lowest'
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div>
          <p className="text-xs text-slate-600 mb-1">Highest Performance</p>
          <p className="font-bold text-slate-800">{sortedCohorts[0]?.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Lowest Performance</p>
          <p className="font-bold text-slate-800">{sortedCohorts[sortedCohorts.length - 1]?.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Cohort Average</p>
          <p className="font-bold text-slate-800">
            {(
              sortedCohorts.reduce((sum, c) => sum + (c[selectedMetric] as number), 0) /
              sortedCohorts.length
            ).toFixed(1)}
            {metricInfo.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Total Students</p>
          <p className="font-bold text-slate-800">{mockCohorts.reduce((sum, c) => sum + c.totalStudents, 0)}</p>
        </div>
      </div>
    </Card>
  );
};
