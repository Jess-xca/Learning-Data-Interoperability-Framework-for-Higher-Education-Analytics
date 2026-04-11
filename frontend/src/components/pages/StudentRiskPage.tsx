import React, { useEffect, useState } from 'react';
import { Card } from '..';
import {
  Target,
  CheckCircle2,
  Zap,
  TrendingUp,
  BarChart3,
  Send,
  ArrowRight,
} from 'lucide-react';
import { predictionService } from '../../services/PredictionService';
import type {
  StudentSuccessPrediction,
  InterventionRecommendation,
} from '../../types/prediction';

export const StudentRiskPage: React.FC = () => {
  const [predictions, setPredictions] = useState<StudentSuccessPrediction[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSuccessPrediction | null>(null);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  useEffect(() => {
    // Generate sample data
    predictionService.generateSamplePredictionData();

    // Load all predictions
    const allPredictions = predictionService.getAllPredictions();
    setPredictions(allPredictions);

    // Select first student
    if (allPredictions.length > 0) {
      setSelectedStudent(allPredictions[0]);
      const recs = predictionService.getRecommendations(allPredictions[0].studentId);
      setRecommendations(recs);
    }
  }, []);

  const handleSelectStudent = (prediction: StudentSuccessPrediction) => {
    setSelectedStudent(prediction);
    const recs = predictionService.getRecommendations(prediction.studentId);
    setRecommendations(recs);
  };

  const filteredPredictions = predictions.filter(
    (p) => riskFilter === 'all' || p.riskLevel === riskFilter,
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'from-red-600 to-red-700';
      case 'high':
        return 'from-orange-600 to-orange-700';
      case 'medium':
        return 'from-yellow-600 to-yellow-700';
      case 'low':
        return 'from-green-600 to-green-700';
      default:
        return 'from-blue-600 to-blue-700';
    }
  };

  const riskCounts = {
    critical: predictions.filter((p) => p.riskLevel === 'critical').length,
    high: predictions.filter((p) => p.riskLevel === 'high').length,
    medium: predictions.filter((p) => p.riskLevel === 'medium').length,
    low: predictions.filter((p) => p.riskLevel === 'low').length,
  };

  // Calculate aggregate metrics
  const avgSuccessProbability = Math.round(
    predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length
  );
  const retentionRate = 94.8;
  const completionRate = 88.2;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Search students, faculty, or cohorts..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6 ml-8">
          <button className="text-slate-500 hover:text-slate-700 transition-colors">
            🔄
          </button>
          <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
            🔔
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <span className="text-sm font-semibold text-slate-700">QA Officer</span>
          <img
            alt="User"
            className="w-8 h-8 rounded-full border border-slate-200"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPSTtPLDVK6PVZGg8BA8jj9HGx3ezIgVoUKoVMu5T3G2p-QkWCanCtEV0ip4T4Ho5y6Rb0a34lkIfLzB__b8O_ECBTAyciVqWwXAElfqVywkFIWIYsvd_FwE9J_GkAN4lmn_kbnRtJ5cz1yKy2YQBREc2r9mvU0VbhCq9ogjKuEM91Itbf7HDOGDDRmNvOY9SA4Jy6gf6V_klYzvEiRCyG0xWCbPMqEtE9fcQpVCbVuuSGjcZBSOl6VDbaxFRQKUmHHye2z63e7Ik"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                Student Success Prediction
              </h1>
              <p className="text-slate-600 max-w-2xl">
                Advanced modeling and early warning indicators for the{' '}
                <span className="font-bold text-slate-900">Fall 2025 Cohort</span> within the{' '}
                <span className="font-bold text-slate-900">Computer Science Dept</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
              <button className="px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg shadow-sm">
                Fall 2025
              </button>
              <button className="px-4 py-2 text-slate-600 font-medium hover:bg-white/50 rounded-lg transition-colors">
                Spring 2025
              </button>
              <button className="px-4 py-2 text-slate-600 font-medium hover:bg-white/50 rounded-lg transition-colors">
                Archive
              </button>
              <div className="w-px h-6 bg-slate-300 mx-1"></div>
              <button className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-colors">
                ⚙️
              </button>
            </div>
          </div>

          {/* KPI Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* KPI 1: Avg Success Probability */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-slate-600 font-semibold text-sm">Success Probability</span>
                <TrendingUp className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900">{avgSuccessProbability.toFixed(2)}%</div>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-1">
                  ↑ 3.20% vs last month
                </div>
              </div>
            </div>

            {/* KPI 2: Retention Rate */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-slate-600 font-semibold text-sm">Retention Rate</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900">{retentionRate.toFixed(2)}%</div>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-1">
                  ↑ 2.40% increase
                </div>
              </div>
            </div>

            {/* KPI 3: Course Completion */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-slate-600 font-semibold text-sm">Course Completion</span>
                <BarChart3 className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900">{completionRate.toFixed(2)}%</div>
                <div className="text-xs text-slate-600 font-medium mt-1">Target: 90.00%</div>
              </div>
            </div>

            {/* KPI 4: Risk Interventions - Featured Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl flex flex-col justify-between h-40 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start relative">
                <span className="text-white/70 font-semibold text-sm">Active Interventions</span>
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-4xl font-black">{(riskCounts.critical + riskCounts.high).toFixed(0)}</div>
                <p className="text-xs text-white/80 mt-1">Urgent + High priority</p>
              </div>
            </div>
          </div>

          {/* Main Data Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Student List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">At-Risk Students</h2>
                <p className="text-sm text-slate-600 mt-1">{filteredPredictions.length} total</p>
              </div>

              {/* Filter Buttons */}
              <div className="p-4 border-b border-slate-200 flex gap-2 flex-wrap">
                {(['all', 'critical', 'high', 'medium'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setRiskFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                      riskFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <div className="divide-y divide-slate-200">
                  {filteredPredictions.map((prediction) => (
                    <div
                      key={prediction.studentId}
                      onClick={() => handleSelectStudent(prediction)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-all ${
                        selectedStudent?.studentId === prediction.studentId
                          ? 'bg-blue-50 border-l-4 border-slate-900'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                          {prediction.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate text-sm">{prediction.studentName}</p>
                          <p className="text-xs text-slate-600">{prediction.studentId}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${getRiskColor(
                                prediction.riskLevel,
                              )}`}
                            >
                              {prediction.riskLevel}
                            </span>
                            <span className="text-xs text-slate-600 font-semibold">
                              {prediction.successProbability.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Student Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedStudent ? (
                <>
                  {/* Student Profile */}
                  <Card className="overflow-hidden border-2 border-slate-200">
                    <div className={`bg-gradient-to-r ${getRiskBgColor(selectedStudent.riskLevel)} p-6 text-white`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-black">{selectedStudent.studentName}</h2>
                          <p className="text-white/80 text-sm mt-1">{selectedStudent.studentId}</p>
                        </div>
                        <span className="text-sm px-4 py-2 rounded-lg font-bold bg-white/20 border border-white/40">
                          {selectedStudent.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-bold text-slate-600 uppercase mb-1">Success Probability</p>
                          <p className="text-3xl font-black text-slate-900">
                            {selectedStudent.successProbability.toFixed(2)}%
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${selectedStudent.successProbability}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600 uppercase mb-1">Risk Score</p>
                          <p className="text-3xl font-black text-slate-900">{selectedStudent.riskScore.toFixed(2)}</p>
                          <p className="text-xs text-slate-600 mt-2">
                            Confidence: {selectedStudent.predictionConfidence.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600 uppercase mb-1">Predicted GPA</p>
                          <p className="text-3xl font-black text-slate-900">{selectedStudent.predictedGPA.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600 uppercase mb-1">Completion</p>
                          <p className="text-3xl font-black text-slate-900">
                            {selectedStudent.completionProbability.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Interventions */}
                  <Card className="overflow-hidden border-2 border-slate-200">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Recommended Actions
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{recommendations.length} interventions</p>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 p-2 rounded ${
                                rec.priority === 'urgent'
                                  ? 'bg-red-100'
                                  : rec.priority === 'high'
                                    ? 'bg-orange-100'
                                    : 'bg-yellow-100'
                              }`}
                            >
                              <Zap
                                className={`w-4 h-4 ${
                                  rec.priority === 'urgent'
                                    ? 'text-red-600'
                                    : rec.priority === 'high'
                                      ? 'text-orange-600'
                                      : 'text-yellow-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900">{rec.interventionName}</h4>
                              <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                              <div className="flex gap-3 mt-3 flex-wrap">
                                <span className="text-xs px-2.5 py-1 bg-slate-100 rounded font-medium text-slate-700">
                                  {rec.interventionType}
                                </span>
                                <span className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded font-semibold">
                                  ~{rec.estimatedImpact.toFixed(2)}% impact
                                </span>
                                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded">
                                  {rec.timeToImplement}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-12 text-center border-2 border-slate-200">
                  <p className="text-slate-500 text-lg">Select a student to view details</p>
                </Card>
              )}
            </div>
          </div>

          {/* Bottom Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-xl overflow-hidden group h-48">
              <img
                alt="Curriculum"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsgvio4KbDDc72b6XXCQUBnZKXq0M2cxmfxbQ_s0LGLxR9f09fR0U-RC-O07WmNizldc8_KGqNWEKhaflBlFCtjdOzIW-w6H5TwN53Mwmf4GrtMK1-X9-6DOA-RALG51Tyn03JNOnV2UD5z5q_LjsZrYNFeZ9ccQ8FfuDK3IwF3JK10GuJzxEG2vI1SKWBWCeW3BEQQqat-ylZ-n1vBXdiwE8xHkQD_DcmhAQp0OMnPJKwK6WEdBmHL71u4JI4NhRGi8fPM9UWAhQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6">
                <h5 className="text-white font-bold text-lg">Curriculum Alignment</h5>
                <p className="text-white/80 text-sm">Review course load correlations with attrition rates.</p>
                <button className="mt-4 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  Explore Data <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden group h-48">
              <img
                alt="Analytics"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyVYDg7S6ydOrdreonuqtboOBOUQBLYodRXmnEW67Rm-js_DLqxb5fQIP6ZTDjYAyNh2HcO0S79Gj-LpgHBFMrpWphfd6q3ZPpWJB0hBsMRenOLolwwwSP2h8POEUmDWiln3sJtUAHG_JFi9IVbdMgXMZsZ-WpWA7XDgZH7SqUph6QTLGgrb0hhL-mM2fpYswlGnezezhFZWSO0vVf9stpAeeLJcUc7GuqRQ1GYO6SZn9hPCJcl105spCoN3jQvzM8Z6uEfjZuV7U"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 to-transparent flex flex-col justify-end p-6">
                <h5 className="text-white font-bold text-lg">Predictive Model Tuning</h5>
                <p className="text-white/80 text-sm">Adjust weightings for socioeconomic and academic factors.</p>
                <button className="mt-4 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  Configure AI <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 px-8 border-t border-slate-200 flex justify-between items-center bg-slate-50 text-sm">
          <p className="text-slate-600">
            © 2025 Academic Curator. All predictive models calibrated for 2024-2025 academic cycle.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-900 font-bold hover:text-slate-600 transition-colors">
              Data Ethics Policy
            </a>
            <a href="#" className="text-slate-900 font-bold hover:text-slate-600 transition-colors">
              Integration Logs
            </a>
          </div>
        </footer>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50">
        <Send className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StudentRiskPage;
