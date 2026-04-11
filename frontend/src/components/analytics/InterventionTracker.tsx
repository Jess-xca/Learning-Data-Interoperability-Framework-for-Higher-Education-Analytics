import React, { useState } from 'react';
import { Card } from '..';
import { CheckCircle2, Clock, XCircle, Zap } from 'lucide-react';

interface InterventionRecord {
  id: string;
  studentId: string;
  studentName: string;
  interventionType: string;
  status: 'completed' | 'in-progress' | 'failed';
  startDate: string;
  endDate?: string;
  effectiveness: number; // 0-100
  notes: string;
}

const mockInterventions: InterventionRecord[] = [
  {
    id: 'int-001',
    studentId: 'STU001',
    studentName: 'Alex Johnson',
    interventionType: 'Academic Tutoring',
    status: 'completed',
    startDate: '2026-03-15',
    endDate: '2026-04-10',
    effectiveness: 87,
    notes: 'Improved GPA from 2.1 to 2.8 in supported courses',
  },
  {
    id: 'int-002',
    studentId: 'STU002',
    studentName: 'Sam Martinez',
    interventionType: 'Study Skills Workshop',
    status: 'completed',
    startDate: '2026-03-20',
    endDate: '2026-04-05',
    effectiveness: 72,
    notes: 'Student reports better time management',
  },
  {
    id: 'int-003',
    studentId: 'STU003',
    studentName: 'Jordan Lee',
    interventionType: 'Counseling Session',
    status: 'in-progress',
    startDate: '2026-04-01',
    effectiveness: 0,
    notes: 'Addressing personal challenges affecting academics',
  },
  {
    id: 'int-004',
    studentId: 'STU004',
    studentName: 'Taylor Smith',
    interventionType: 'Tech Support Program',
    status: 'completed',
    startDate: '2026-02-28',
    endDate: '2026-03-28',
    effectiveness: 95,
    notes: 'Student now proficient with required software',
  },
  {
    id: 'int-005',
    studentId: 'STU005',
    studentName: 'Morgan Davis',
    interventionType: 'Peer Mentoring',
    status: 'failed',
    startDate: '2026-03-10',
    endDate: '2026-03-31',
    effectiveness: 25,
    notes: 'Student disengaged after 2 sessions',
  },
];

export const InterventionTracker: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'failed'>('all');

  const filteredInterventions =
    filter === 'all' ? mockInterventions : mockInterventions.filter((i) => i.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const stats = {
    total: mockInterventions.length,
    completed: mockInterventions.filter((i) => i.status === 'completed').length,
    inProgress: mockInterventions.filter((i) => i.status === 'in-progress').length,
    failed: mockInterventions.filter((i) => i.status === 'failed').length,
    avgEffectiveness: Math.round(
      mockInterventions
        .filter((i) => i.status === 'completed')
        .reduce((sum, i) => sum + i.effectiveness, 0) / mockInterventions.filter((i) => i.status === 'completed').length,
    ),
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">Intervention Tracking</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">{stats.total} total</span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-slate-600 mt-1">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-xs text-slate-600 mt-1">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-slate-600 mt-1">Not Successful</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.avgEffectiveness}%</p>
          <p className="text-xs text-slate-600 mt-1">Avg Effectiveness</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {['all', 'completed', 'in-progress', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Intervention List */}
      <div className="space-y-3">
        {filteredInterventions.map((intervention) => (
          <div
            key={intervention.id}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${getStatusBgColor(
              intervention.status,
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                {getStatusIcon(intervention.status)}
                <div>
                  <p className="font-semibold text-slate-800">{intervention.studentName}</p>
                  <p className="text-sm text-slate-600">{intervention.interventionType}</p>
                </div>
              </div>
              {intervention.effectiveness > 0 && (
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{intervention.effectiveness}%</p>
                  <p className="text-xs text-slate-600">Effective</p>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-700 mb-2">{intervention.notes}</p>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>
                {intervention.startDate}
                {intervention.endDate && ` → ${intervention.endDate}`}
              </span>
              <span className="text-slate-500">ID: {intervention.id}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredInterventions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600">No interventions found for this filter</p>
        </div>
      )}
    </Card>
  );
};
