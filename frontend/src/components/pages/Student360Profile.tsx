interface StudentData {
  name: string;
  semester: string;
  id: string;
  department: string;
  concentration: string;
  cumulativeGPA: number;
  majorGPA: number;
  creditsEarned: number;
  creditsRequired: number;
  successProbability: number;
  trendPercentage: number;
  advisorName: string;
  lmsLogins: number;
  assessmentAvg: number;
  attendance: number;
}

const dummyStudent: StudentData = {
  name: "Marcus Wright",
  semester: "Senior",
  id: "884-291-002",
  department: "Cognitive Science",
  concentration: "Neuro-Informatics Concentration",
  cumulativeGPA: 3.82,
  majorGPA: 3.95,
  creditsEarned: 102,
  creditsRequired: 120,
  successProbability: 94,
  trendPercentage: 2.1,
  advisorName: "Dr. Elena Rostova",
  lmsLogins: 24,
  assessmentAvg: 92,
  attendance: 98,
};

interface Student360Props {
  studentData?: StudentData;
}

export function Student360Profile({ studentData = dummyStudent }: Student360Props) {
  const student = studentData;
  const creditsProgress = (student.creditsEarned / student.creditsRequired) * 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Student Profile Header Card */}
      <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-36 h-44 rounded-xl overflow-hidden shadow-xl ring-4 ring-white">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop"
              alt={student.name}
            />
          </div>
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg">
              In Good Standing
            </span>
          </div>
        </div>

        <div className="flex-grow space-y-4 z-10">
          <div>
            <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">
              {student.semester} • ID: {student.id}
            </span>
            <h1 className="font-bold text-5xl text-slate-900 tracking-tight mt-1">
              {student.name}
            </h1>
            <p className="text-slate-500 font-medium">
              B.S. {student.department} • {student.concentration}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA</p>
              <p className="text-2xl font-bold text-slate-900">{student.cumulativeGPA.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Major GPA</p>
              <p className="text-2xl font-bold text-slate-900">{student.majorGPA.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Credits Earned</p>
              <p className="text-2xl font-bold text-slate-900">
                {student.creditsEarned} <span className="text-xs font-normal text-slate-400">/ {student.creditsRequired}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Advisor</p>
              <p className="text-sm font-semibold text-slate-900">{student.advisorName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto z-10">
          <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">mail</span> Send Message
          </button>
          <button className="w-full px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">calendar_month</span> Schedule Review
          </button>
          <button className="w-full px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">description</span> Full Transcript
          </button>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Engagement & Heatmaps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Activity Heatmap - GitHub Style */}
          <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">LMS Activity Engagement</h3>
                <p className="text-xs text-slate-500">Platform interactions over the last 90 days</p>
              </div>
              <div className="flex gap-4 items-center text-xs font-medium text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-1.5 min-w-[700px]">
                {Array.from({ length: 24 }).map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1.5">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const intensity = Math.floor(Math.random() * 5);
                      const colors = ["bg-slate-100", "bg-blue-100", "bg-blue-300", "bg-blue-500", "bg-blue-600"];
                      return (
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          className={`w-3 h-3 rounded-sm ${colors[intensity]} hover:ring-1 hover:ring-offset-1 hover:ring-blue-400 cursor-pointer transition-all`}
                          title={`Week ${weekIdx + 1}, Day ${dayIdx + 1}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</p>
                <p className="text-lg font-bold text-slate-900">14 Days</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Daily Session</p>
                <p className="text-lg font-bold text-slate-900">2.4 Hours</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Peak Activity</p>
                <p className="text-lg font-bold text-slate-900">8 PM - 11 PM</p>
              </div>
            </div>
          </section>

          {/* Degree Progress */}
          <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Degree Pathway Analytics</h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-600/10 rounded-full">DEGREE MAP</button>
                <button className="text-xs font-bold text-slate-400 px-3 py-1 hover:bg-slate-100 rounded-full">AUDIT REPORT</button>
              </div>
            </div>
            <div className="relative space-y-8">
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${creditsProgress}%` }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                    Core Requirements
                  </h4>
                  <div className="pl-6 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">General Education</span>
                      <span className="font-bold text-emerald-600">COMPLETED</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Math & Foundations</span>
                      <span className="font-bold text-emerald-600">COMPLETED</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Ethics & Society</span>
                      <span className="font-bold text-emerald-600">COMPLETED</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500 text-sm">pending</span>
                    Major Requirements
                  </h4>
                  <div className="pl-6 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Neural Informatics Lab</span>
                      <span className="font-bold text-blue-600 uppercase">In Progress</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Cognitive Robotics</span>
                      <span className="font-bold text-slate-400 uppercase">Upcoming (Sp 25)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Senior Thesis</span>
                      <span className="font-bold text-slate-400 uppercase">Awaiting Prereq</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Support & Intervention Log</h3>
              <button className="text-sm font-bold text-white bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
                <span className="material-symbols-outlined text-xs">add</span> New Intervention
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">RESOLVED</span>
                  <span className="text-[10px] font-medium text-slate-400">SEP 12, 2024</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Academic Advising: Course Overload</h4>
                <p className="text-xs text-slate-600 mt-1">Met with Marcus regarding 18-credit load. Student adjusted schedule to 15 credits to focus on Research Assistantship. Confidence high.</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Advisor: Elena Rostova</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-amber-400">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">IN REVIEW</span>
                  <span className="text-[10px] font-medium text-slate-400">AUG 28, 2024</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Financial Aid: Scholarship Renewal</h4>
                <p className="text-xs text-slate-600 mt-1">Automatic flag for renewal documents. Marcus notified via portal. Deadline approaching but student is responsive.</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">FinAid: Mark Thompson</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Predictive Trends & Status */}
        <div className="lg:col-span-4 space-y-8">
          {/* Success Prediction */}
          <section className="bg-blue-600 text-white p-6 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-300">auto_awesome</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Success Probability Index</p>
              </div>
              <div className="flex items-end gap-3">
                <h3 className="text-6xl font-bold">{student.successProbability.toFixed(0)}%</h3>
                <div className="mb-2 text-emerald-400 flex items-center text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span> +{student.trendPercentage.toFixed(2)}%
                </div>
              </div>
              <p className="text-blue-100 mt-4 text-sm leading-relaxed">
                High likelihood of graduating with Honors. Trending upwards due to consistent assessment scores above 90%.
              </p>
            </div>
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </section>

          {/* Status Cards */}
          <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Institutional Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">task_alt</span>
                    <span className="text-xs font-semibold text-slate-700">Tuition Settled</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">FY 24/25</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">task_alt</span>
                    <span className="text-xs font-semibold text-slate-700">Housing Assigned</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">West Hall</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500">warning</span>
                    <span className="text-xs font-semibold text-slate-700">Lab Clearance</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600">RENEW SOON</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Privacy Controls</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>FERPA Data Access</span>
                  <span className="font-bold text-emerald-600">AUTHORIZED</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Research Usage</span>
                  <span className="font-bold text-emerald-600">CONSENTED</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button className="w-full py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">emergency_home</span> Raise Crisis Flag
              </button>
            </div>
          </section>

          {/* Milestones */}
          <section className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Key Milestones</h3>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              <div className="flex gap-4 relative">
                <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white z-10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dean's List Honoree</h4>
                  <p className="text-[10px] text-slate-400">Spring Semester 2024</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white z-10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Research Grant Award</h4>
                  <p className="text-[10px] text-slate-400">Neuro-Ethics Grant • June 2024</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-5 h-5 rounded-full bg-slate-200 ring-4 ring-white z-10"></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">Capstone Proposal</h4>
                  <p className="text-[10px] text-slate-400 italic">Target: Nov 2024</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
