import React from 'react';
import { Card } from '..';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  month: string;
  avgGPA: number;
  engagementScore: number;
  completionRate: number;
}

const mockTrendData: TrendData[] = [
  { month: 'Aug', avgGPA: 3.1, engagementScore: 72, completionRate: 78 },
  { month: 'Sep', avgGPA: 3.2, engagementScore: 75, completionRate: 81 },
  { month: 'Oct', avgGPA: 3.3, engagementScore: 78, completionRate: 84 },
  { month: 'Nov', avgGPA: 3.28, engagementScore: 76, completionRate: 82 },
  { month: 'Dec', avgGPA: 3.35, engagementScore: 80, completionRate: 86 },
];

export const PerformanceTrendChart: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Performance Trends</h3>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          +4.2% this semester
        </div>
      </div>

      <div className="space-y-6">
        {/* GPA Trend */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Average GPA</label>
            <span className="text-sm font-bold text-blue-600">
              {mockTrendData[mockTrendData.length - 1].avgGPA.toFixed(2)}
            </span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {mockTrendData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${(data.avgGPA / 4) * 80}px` }}
                  title={`${data.month}: ${data.avgGPA.toFixed(2)}`}
                />
                <span className="text-xs text-slate-600 mt-1">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Score Trend */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Engagement Score</label>
            <span className="text-sm font-bold text-purple-600">
              {mockTrendData[mockTrendData.length - 1].engagementScore}%
            </span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {mockTrendData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${(data.engagementScore / 100) * 80}px` }}
                  title={`${data.month}: ${data.engagementScore}%`}
                />
                <span className="text-xs text-slate-600 mt-1">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate Trend */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Completion Rate</label>
            <span className="text-sm font-bold text-green-600">
              {mockTrendData[mockTrendData.length - 1].completionRate}%
            </span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {mockTrendData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${(data.completionRate / 100) * 80}px` }}
                  title={`${data.month}: ${data.completionRate}%`}
                />
                <span className="text-xs text-slate-600 mt-1">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          📊 Data updated: Today at 3:45 PM (Based on 50 students analyzed)
        </p>
      </div>
    </Card>
  );
};
