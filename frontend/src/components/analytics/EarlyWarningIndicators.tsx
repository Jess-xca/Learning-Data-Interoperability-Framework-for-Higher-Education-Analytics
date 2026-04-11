import React from 'react';
import { Card } from '..';
import { AlertTriangle, TrendingDown, LogOut, BookMarked } from 'lucide-react';

interface WarningIndicator {
  id: string;
  type: 'grade-drop' | 'low-engagement' | 'attendance-issue' | 'assessment-failure';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  studentCount: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  affectedStudents: string[];
}

const mockWarnings: WarningIndicator[] = [
  {
    id: 'warn-001',
    type: 'grade-drop',
    severity: 'critical',
    title: 'Sudden Grade Decline',
    description: 'Students showing >15% GPA drop compared to previous term',
    studentCount: 18,
    trend: 'increasing',
    affectedStudents: ['STU042', 'STU089', 'STU156', 'STU203', ...Array(14).fill('...')],
  },
  {
    id: 'warn-002',
    type: 'low-engagement',
    severity: 'high',
    title: 'Low Platform Engagement',
    description: 'Students with <30% weekly engagement in course materials',
    studentCount: 34,
    trend: 'increasing',
    affectedStudents: ['STU015', 'STU047', 'STU112', 'STU178', ...Array(30).fill('...')],
  },
  {
    id: 'warn-003',
    type: 'attendance-issue',
    severity: 'high',
    title: 'Attendance Pattern Issues',
    description: 'Students missing 3+ classes in the last 2 weeks',
    studentCount: 12,
    trend: 'stable',
    affectedStudents: ['STU028', 'STU091', 'STU134', 'STU267'],
  },
  {
    id: 'warn-004',
    type: 'assessment-failure',
    severity: 'medium',
    title: 'Assessment Failures',
    description: 'Students failing quizzes/exams (score <60%) consistently',
    studentCount: 26,
    trend: 'decreasing',
    affectedStudents: ['STU063', 'STU145', 'STU189', 'STU245', ...Array(22).fill('...')],
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'high':
      return 'bg-orange-50 border-orange-200 text-orange-700';
    case 'medium':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700';
  }
};

const getWarningIcon = (type: string) => {
  switch (type) {
    case 'grade-drop':
      return <TrendingDown className="w-5 h-5" />;
    case 'low-engagement':
      return <BookMarked className="w-5 h-5" />;
    case 'attendance-issue':
      return <LogOut className="w-5 h-5" />;
    case 'assessment-failure':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
};

const getTrendIcon = (trend: string) => {
  if (trend === 'increasing') return '📈';
  if (trend === 'decreasing') return '📉';
  return '─';
};

export const EarlyWarningIndicators: React.FC = () => {
  const totalAtRisk = mockWarnings.reduce((sum, w) => sum + w.studentCount, 0);
  const criticalWarnings = mockWarnings.filter((w) => w.severity === 'critical').length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-slate-800">Early Warning Indicators</h3>
        </div>
        <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
          {totalAtRisk} at risk
        </span>
      </div>

      {/* Critical Alert Banner */}
      {criticalWarnings > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-700">
            ⚠️ {criticalWarnings} critical warning{criticalWarnings !== 1 ? 's' : ''} require immediate attention
          </p>
        </div>
      )}

      {/* Warning List */}
      <div className="space-y-4">
        {mockWarnings.map((warning) => (
          <div
            key={warning.id}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${getSeverityColor(
              warning.severity,
            )}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5">{getWarningIcon(warning.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{warning.title}</h4>
                  <span className="text-lg">{getTrendIcon(warning.trend)}</span>
                </div>
                <p className="text-sm opacity-90">{warning.description}</p>
              </div>
            </div>

            {/* Student Count and Severity Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">
                  {warning.studentCount} student{warning.studentCount !== 1 ? 's' : ''} affected
                </span>
                <span className="text-xs opacity-75">({Math.round((warning.studentCount / 784) * 100)}% of cohort)</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                {warning.severity}
              </span>
            </div>

            {/* Affected Students Preview */}
            <div className="bg-white/40 rounded p-2">
              <div className="flex flex-wrap gap-1">
                {warning.affectedStudents.slice(0, 5).map((student, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/60 px-2 py-1 rounded font-mono"
                    title={student !== '...' ? `Student ID: ${student}` : ''}
                  >
                    {student}
                  </span>
                ))}
                {warning.studentCount > 5 && (
                  <span className="text-xs bg-white/60 px-2 py-1 rounded font-semibold">
                    +{warning.studentCount - 5} more
                  </span>
                )}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="mt-3 pt-3 border-t border-black/10">
              <p className="text-xs opacity-75">
                Trend:{' '}
                <span className="font-semibold">
                  {warning.trend === 'increasing'
                    ? '⬆️ Increasing'
                    : warning.trend === 'decreasing'
                      ? '⬇️ Decreasing'
                      : '➡️ Stable'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View action plan for all warnings →
        </button>
      </div>
    </Card>
  );
};
