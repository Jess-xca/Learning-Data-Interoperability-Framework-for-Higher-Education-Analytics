import React from 'react';
import { Card } from '..';
import { Lightbulb, AlertCircle, ArrowUp } from 'lucide-react';

interface Insight {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  affectedStudents: number;
}

const mockInsights: Insight[] = [
  {
    category: 'Academic Performance',
    title: 'Early Semester Engagement Drop',
    description:
      'Students show 18% lower engagement in weeks 3-4 compared to week 1. This pattern historically correlates with 23% higher withdrawal rates.',
    impact: 'high',
    recommendation: 'Implement weekly check-ins and increase office hours during weeks 3-5',
    affectedStudents: 147,
  },
  {
    category: 'Support Services',
    title: 'Tutoring Effectiveness Peak',
    description:
      'Students who attend tutoring sessions in the first 2 weeks show 34% better performance than those who start later.',
    impact: 'high',
    recommendation: 'Incentivize early tutoring enrollment through messaging and outreach',
    affectedStudents: 89,
  },
  {
    category: 'Attendance Patterns',
    title: 'Friday Attendance Decline',
    description: 'Friday attendance averages 12% lower than other weekdays, affecting course engagement assessments.',
    impact: 'medium',
    recommendation: 'Review Friday scheduling and consider engagement activities on Fridays',
    affectedStudents: 204,
  },
];

export const PredictiveInsights: React.FC = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-slate-800">Predictive Insights</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          AI-Generated
        </span>
      </div>

      <div className="space-y-4">
        {mockInsights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${getImpactColor(
              insight.impact,
            )}`}
          >
            <div className="flex items-start gap-3 mb-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                    {insight.category}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">{insight.description}</p>
                <div className="bg-white/50 rounded p-2 mb-2">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    {insight.recommendation}
                  </p>
                </div>
                <p className="text-xs opacity-75">
                  Affects {insight.affectedStudents} students ({Math.round((insight.affectedStudents / 784) * 100)}%
                  of cohort)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View all insights →
        </button>
      </div>
    </Card>
  );
};
