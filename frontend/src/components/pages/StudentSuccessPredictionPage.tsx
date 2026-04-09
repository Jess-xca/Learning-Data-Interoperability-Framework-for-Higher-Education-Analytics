import { useState } from "react";
import { MainContent, Card, Button, Badge } from "..";
import { ChartCard } from "../dashboard";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { generateDummyStudents } from "../../data/dummyGenerator";

export default function StudentSuccessPredictionPage() {
  useRoleGuard(["admin", "analyst", "hod", "qa"]);
  const [students] = useState(() => generateDummyStudents(50));

  const stats = {
    critical: students.filter(s => s.predictionStatus === "critical").length,
    high: students.filter(s => s.predictionStatus === "high").length,
    medium: students.filter(s => s.predictionStatus === "medium").length,
    low: students.filter(s => s.predictionStatus === "low").length,
  };

  return (
    <>
      <MainContent>
        <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 animate-in fade-in duration-700">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="h-page text-primary">Success Forecast</h1>
              <div className="flex items-center gap-3">
                <div className="w-12 h-1.5 rounded-full bg-primary" />
                <p className="text-on-surface-variant font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">
                   Neural Engine v4.2 // Risk Modeling & Predictive Synthesis
                </p>
              </div>
            </div>
            <div className="flex gap-4">
               <Button variant="secondary" className="h-16 px-8 rounded-2xl glass font-black text-[10px] uppercase tracking-widest border-none hover:bg-white/60 transition-all">
                <span className="material-symbols-outlined mr-2 text-lg">refresh</span>
                Retrain Logic
              </Button>
              <Button variant="primary" className="h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20 group">
                <span className="material-symbols-outlined mr-2 text-lg group-hover:rotate-180 transition-transform">rocket_launch</span>
                Execute Sync
              </Button>
            </div>
          </div>

          {/* Risk Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Critical Risk", value: stats.critical, color: "error", icon: "emergency", desc: "Immediate Intervention" },
              { label: "High Risk", value: stats.high, color: "secondary", icon: "warning", desc: "Priority Focus" },
              { label: "Medium Risk", value: stats.medium, color: "primary", icon: "info", desc: "Observational" },
              { label: "Low Risk", value: stats.low, color: "success", icon: "check_circle", desc: "Stable Growth" },
            ].map((s, i) => (
              <Card key={i} className="glass p-10 border-none bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[40px] shadow-xl group hover:bg-white transition-all duration-500 overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${s.color}/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-${s.color}/10 flex items-center justify-center text-${s.color} mb-6 group-hover:scale-110 transition-transform shadow-sm shadow-black/5`}>
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 mb-1">{s.label}</p>
                <div className="flex items-end gap-3">
                  <p className={`text-4xl font-black text-${s.color} tracking-tighter leading-none`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant opacity-40 mb-1 leading-none uppercase tracking-widest">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Risk Factors */}
            <div className="lg:col-span-8">
              <ChartCard 
                title="Cluster Risk Distribution" 
                subtitle="Cross-sectional analysis of department vulnerability scores"
                className="glass p-12 border-none bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[48px] shadow-2xl relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 -z-10" />
                <div className="h-80 flex items-end justify-around px-8 gap-8 mt-12 mb-12">
                  {["Engineering", "Medicine", "Business", "Science", "Law"].map((dept, i) => (
                    <div key={dept} className="flex-1 flex flex-col items-center gap-6 group/bar">
                      <div className="w-full flex flex-col-reverse rounded-3xl overflow-hidden h-64 bg-surface-container-low/50 shadow-inner border border-outline-variant/10 group-hover/bar:bg-white transition-all duration-500">
                        <div className="bg-error w-full transition-all duration-1000 delay-[100ms] hover:opacity-80" style={{ height: `${10+i*5}%` }} title="Critical" />
                        <div className="bg-secondary w-full transition-all duration-1000 delay-[200ms] hover:opacity-80" style={{ height: `${20-i*2}%` }} title="High" />
                        <div className="bg-primary w-full transition-all duration-1000 delay-[300ms] hover:opacity-80" style={{ height: `${40+i*3}%` }} title="Medium" />
                        <div className="bg-success w-full transition-all duration-1000 delay-[400ms] hover:opacity-80" style={{ height: `${30-i*6}%` }} title="Low" />
                      </div>
                      <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-tighter truncate w-full text-center opacity-60 group-hover/bar:text-primary group-hover/bar:opacity-100 transition-all">{dept}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-10 pt-8 border-t border-outline-variant/10">
                  {[
                    {c:'bg-error', l:'Critical Risk', v:'error'}, 
                    {c:'bg-secondary', l:'High Impact', v:'secondary'}, 
                    {c:'bg-primary', l:'Observational', v:'primary'}, 
                    {c:'bg-success', l:'Stable Nodes', v:'success'}
                  ].map(i => (
                    <div key={i.l} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${i.c} shadow-lg shadow-${i.v}/20 ring-4 ring-white`} />
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{i.l}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Neural Metrics */}
            <div className="lg:col-span-4">
              <Card className="glass p-12 border-none bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[48px] shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group hover:bg-white transition-all duration-700">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -mr-32 -mt-32 -z-10 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-on-surface tracking-tighter">Inference Stats</h3>
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Performance Telemetry</p>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    {[
                      { label: "Prediction Accuracy", value: 94.2, color: "success" },
                      { label: "Recall Vector", value: 88.7, color: "primary" },
                      { label: "Precision Logic", value: 91.5, color: "secondary" },
                    ].map(m => (
                      <div key={m.label} className="group/metric">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-70 group-hover/metric:text-primary transition-colors">{m.label}</span>
                          <span className={`text-lg font-black text-${m.color} tracking-tighter`}>{m.value}%</span>
                        </div>
                        <div className="h-3 w-full bg-surface-container-low/50 rounded-full overflow-hidden shadow-inner border border-outline-variant/10 group-hover/metric:bg-white transition-all">
                          <div className={`bg-${m.color} h-full rounded-full transition-all duration-[2000ms] ease-out shadow-lg shadow-${m.color}/20 group-hover/metric:opacity-80`} style={{ width: `${m.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-16 p-8 rounded-[32px] bg-success/5 border border-success/10 flex items-center justify-between group-hover:bg-success/10 transition-colors">
                  <div>
                    <p className="text-[10px] text-success font-black uppercase tracking-widest mb-1 opacity-60">Engine Status</p>
                    <p className="text-xl font-black text-success tracking-tighter">Optimized Protocol</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center shadow-2xl shadow-success/30 animate-pulse">
                     <span className="material-symbols-outlined text-2xl font-black">verified</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Intervention Matrix */}
          <Card className="glass border-none shadow-2xl bg-surface-container-lowest/40 backdrop-blur-3xl rounded-[48px] overflow-hidden group">
            <div className="p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-outline-variant/10">
              <div>
                <h2 className="text-3xl font-black text-on-surface tracking-tighter">Intervention Matrix</h2>
                <p className="text-sm font-medium text-on-surface-variant opacity-60">High-priority entities requiring logic sync</p>
              </div>
              <div className="flex gap-4">
                <Badge variant="error" className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] animate-pulse shadow-lg shadow-error/20">
                  Critical Alert
                </Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary/5 text-[10px] font-black text-primary uppercase tracking-[0.4em] text-center">
                    <th className="px-12 py-8 text-left">Principle Entity</th>
                    <th className="px-12 py-8">Program Cluster</th>
                    <th className="px-12 py-8">Engagement Vector</th>
                    <th className="px-12 py-8">Risk Probability</th>
                    <th className="px-12 py-8 text-right">Logic Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {students.filter(s => s.predictionStatus === "critical" || s.predictionStatus === "high").slice(0, 8).map((student) => (
                    <tr key={student.id} className="hover:bg-white/60 transition-colors group/row cursor-pointer">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative group-hover/row:scale-110 transition-transform">
                            <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${student.id}`} className="w-14 h-14 rounded-2xl bg-white border border-outline-variant/10 shadow-xl" alt="" />
                            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-lg border-4 border-white shadow-lg ${student.predictionStatus === 'critical' ? 'bg-error' : 'bg-secondary'}`} />
                          </div>
                          <div>
                            <p className="text-base font-black text-on-surface group-hover/row:text-primary transition-colors">{student.name}</p>
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center">
                        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{student.program}</p>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-24 bg-surface-container-low/50 h-2 rounded-full overflow-hidden shadow-inner border border-outline-variant/10 bg-white">
                            <div className={`h-full ${student.engagementScore > 80 ? 'bg-success' : 'bg-secondary'} transition-all duration-1000`} style={{ width: `${student.engagementScore}%` }} />
                          </div>
                          <span className="text-[11px] font-black text-on-surface-variant w-10">{student.engagementScore}%</span>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center">
                        <Badge 
                          variant={student.predictionStatus === 'critical' ? 'error' : 'warning'} 
                          className="px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-sm"
                        >
                          {student.predictionStatus}
                        </Badge>
                      </td>
                      <td className="px-12 py-8 text-right">
                         <Button variant="secondary" className="h-12 px-6 rounded-xl glass border-none group-hover/row:bg-primary group-hover/row:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                            {student.predictionStatus === "critical" ? "Academic Recall" : "Counseling Sync"}
                         </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 bg-primary/5 text-center border-t border-outline-variant/10">
              <button className="text-[11px] font-black text-primary uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all duration-500 hover:text-primary-dark">View Comprehensive Risk Ledger</button>
            </div>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
