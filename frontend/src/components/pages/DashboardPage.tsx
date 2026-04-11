import { MainContent, Card } from "..";
import { useAuth } from "../../context/AuthContext";
import { generateHECStudents, getHECPrograms } from "../../data/hecDummyData";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Mock enrollment data
const enrollmentByProgram = [
  {
    program: "Computer Science",
    students: 324,
    completion: 94.2,
    status: "target",
    trend: 12,
  },
  {
    program: "Business Admin",
    students: 287,
    completion: 89.5,
    status: "target",
    trend: 8,
  },
  {
    program: "Engineering",
    students: 265,
    completion: 87.3,
    status: "warning",
    trend: -3,
  },
  {
    program: "Sciences",
    students: 198,
    completion: 91.2,
    status: "target",
    trend: 5,
  },
];

// ============================================================================
// SMALL METRIC CARD COMPONENT
// ============================================================================
function SmallMetricCard({
  label,
  value,
  icon: Icon,
  status,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  status?: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    sky: "text-sky-500",
    cyan: "text-cyan-500",
    emerald: "text-emerald-500",
    violet: "text-violet-500",
    red: "text-red-500",
  };
  return (
    <div className="bg-surface-light rounded-lg p-4 border border-on-surface/5 hover:border-on-surface/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-tight mb-1">
            {label}
          </p>
          <p className="text-2xl font-black text-on-surface">{value}</p>
        </div>
        <Icon
          className={`w-5 h-5 ${color ? colorClasses[color] || "text-on-surface/40" : "text-on-surface/40"}`}
        />
      </div>
      {status && (
        <p className="text-xs text-on-surface-variant font-medium">{status}</p>
      )}
    </div>
  );
}

// ============================================================================
// TABLE COMPONENTS
// ============================================================================
function DataTable({
  columns,
  data,
}: {
  columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[];
  data: Record<string, React.ReactNode>[];
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-on-surface/10 bg-surface-light/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-tight text-${col.align || "left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-on-surface/5 hover:bg-primary/5 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-xs text-on-surface font-medium text-${col.align || "left"}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// STATUS BADGE
// ============================================================================
function StatusBadge({
  status,
}: {
  status: "success" | "warning" | "failed" | "processing" | "target";
}) {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
    target: "bg-green-100 text-green-700",
  };
  const text: Record<string, string> = {
    success: "SUCCESS",
    warning: "WARNING",
    failed: "FAILED",
    processing: "PROCESSING",
    target: "TARGET MET",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status]}`}>
      {text[status]}
    </span>
  );
}

// ============================================================================
// ADMIN DASHBOARD - SYSTEM HUB CONSOLE
// ============================================================================
function AdminDashboard() {
  return (
    <MainContent maxWidth="full">
      <div className="space-y-8">
        {/* ── Header Section ── */}
        <div className="flex items-start justify-between mb-8 pl-2">
          <div>
            <p className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest mb-2">
              INSTITUTIONAL OPERATIONS
            </p>
            <h1 className="text-4xl font-black text-[#002045] tracking-tight">
              System Hub
            </h1>
            <p className="text-sm text-[#1a365d] font-medium mt-2">
              Comprehensive health and operational telemetry for institutional
              data infrastructure.
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white rounded-lg font-bold text-xs hover:shadow-lg transition-all h-fit whitespace-nowrap flex items-center gap-2">
            <span>⬇</span> Run Global Sync
          </button>
        </div>

        {/* ── Key Metrics Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-tertiary shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">
              Core System Health
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-primary">99.98%</div>
              <div className="w-8 h-8 bg-tertiary-container/10 rounded-full flex items-center justify-center text-tertiary flex-shrink-0">
                <span className="material-symbols-outlined text-sm">bolt</span>
              </div>
            </div>
            <div className="text-[10px] mt-2 text-tertiary font-semibold">
              Nominal
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">
              Active Pipelines
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-primary">
                42{" "}
                <span className="text-xs font-normal text-slate-400">/ 42</span>
              </div>
              <div className="w-8 h-8 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-sm">
                  conversion_path
                </span>
              </div>
            </div>
            <div className="text-[10px] mt-2 text-slate-500 font-semibold">
              Synced
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-secondary shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">
              Connected Systems
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-primary">14</div>
              <div className="w-8 h-8 bg-secondary-container/30 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-sm">hub</span>
              </div>
            </div>
            <div className="text-[10px] mt-2 text-slate-500 font-semibold">
              Integrated
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-error shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">
              Security Incidents
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-primary">0</div>
              <div className="w-8 h-8 bg-error-container/30 rounded-full flex items-center justify-center text-error flex-shrink-0">
                <span className="material-symbols-outlined text-sm">
                  security
                </span>
              </div>
            </div>
            <div className="text-[10px] mt-2 text-slate-500 font-semibold">
              Secure
            </div>
          </div>
        </div>

        {/* ── Ecosystem Modules & Pipelines ── */}
        <div className="grid grid-cols-12 gap-8">
          {/* Modules Grid */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface-container-low rounded-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-primary tracking-tight">
                  Ecosystem Modules
                </h2>
                <span className="text-xs font-bold text-on-surface-variant uppercase bg-surface-container-highest px-3 py-1 rounded-full">
                  All Systems Operational
                </span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      school
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Academic Registry
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      finance_chip
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Financial Aid
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Active
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      diversity_3
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Admissions CRM
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Syncing
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      library_books
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      LMS Connector
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      psychology
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Predictive Analytics
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Training
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      home_work
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Campus Housing
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Idle
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      payments
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Bursar System
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      biotech
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Research Grants
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      work
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Alumni & Careers
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Updating
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      sports_soccer
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Athletics Hub
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      health_and_safety
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Student Wellness
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Protected
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col items-center gap-2 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm">
                  <div className="w-8 h-8 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                    <span className="material-symbols-outlined text-lg">
                      map
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold leading-tight">
                      Space Management
                    </div>
                    <div className="text-[8px] text-slate-500 group-hover:text-blue-200 uppercase mt-0.5">
                      Stable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Insight Rail */}
          <div className="col-span-12 lg:col-span-4 space-y-3">
            <div className="bg-surface-container-lowest rounded-lg p-3 shadow-sm border border-slate-100">
              <div className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex justify-between items-center">
                <span>Active Data Pipelines</span>
                <span className="text-[8px] text-slate-400 font-bold">
                  REAL-TIME
                </span>
              </div>
              <div className="space-y-3">
                <div className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-tertiary before:rounded-full">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold truncate">
                      Banner SIS Integration
                    </span>
                    <span className="text-[8px] font-bold text-tertiary flex-shrink-0 ml-2">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-1 truncate">
                    Student enrollment...
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-0.5">
                    <div className="bg-tertiary h-0.5 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary before:rounded-full">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold truncate">
                      Canvas LMS Export
                    </span>
                    <span className="text-[8px] font-bold text-primary flex-shrink-0 ml-2">
                      QUEUED
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-1 truncate">
                    Grade distributions for Fall 2024
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-0.5">
                    <div className="bg-primary h-0.5 rounded-full w-[30%]"></div>
                  </div>
                </div>

                <div className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-300 before:rounded-full opacity-60">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold truncate">
                      Financial Reporting
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 flex-shrink-0 ml-2">
                      IDLE
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Scheduled for 02:00 AM
                  </div>
                </div>
              </div>

              <button className="w-full mt-3 py-2 border-2 border-primary-container/20 text-primary-container font-bold rounded-lg text-xs hover:bg-primary-container/5 transition-colors">
                Manage All Pipelines
              </button>
            </div>

            <div className="bg-primary-container p-3 rounded-lg text-white shadow-lg shadow-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-on-primary-container text-sm flex-shrink-0">
                  verified_user
                </span>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Admin Security
                </div>
              </div>
              <p className="text-xs text-blue-100 font-medium leading-tight mb-3">
                MFA active. Last audit 3 days ago.
              </p>
              <div className="flex items-center gap-2 text-[8px]">
                <img
                  className="w-6 h-6 rounded-full border border-on-primary-container shadow-md flex-shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhAwnfe4bOkpQnho3pzAELrsX5SAgJhlB7kM5OYvi5DqryTZ4QWLsQ7n46vmRt8vmSYW6wBJr0zu8xaaNEYYCW5Ryp1s7TCB5nGOk6mSlbR798R_qs00qmg2dDvtz4mpEwJf8FVQtXt4doYWSnYxAoDdqmwAnTTVIa6Cq9OC3sATiUKoQordaVxdXbkcbTYwkuAqybLpqrO_tyXZ1NdTUGhEaPR9Snq9W60BKUAj6T7c7s4-29F-ffS4Ia0zj0F5K1sprTvdAHNxU"
                  alt="Auditor"
                />
                <div className="uppercase font-bold tracking-wider">
                  Sarah Chen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Analytics Jobs ── */}
        <div className="bg-gradient-to-br from-[#ffffff] to-[#f8f9ff] rounded-xl p-5 border border-[#e0e9ff] shadow-md mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-[#002045]">
                Recent Analytics
              </h2>
              <p className="text-xs text-[#1a365d] font-medium mt-0.5">
                Last 24 hours
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-200">
              24h
            </span>
          </div>
          <DataTable
            columns={[
              { key: "job", label: "Job / Source Process" },
              { key: "status", label: "Status" },
              { key: "volume", label: "Volume" },
              { key: "efficiency", label: "Efficiency" },
            ]}
            data={[
              {
                job: "Enrollment_Batch_001",
                status: <StatusBadge status="success" />,
                volume: "43,881 records",
                efficiency: "4m 32s",
              },
              {
                job: "LMS_Activity_Tracker",
                status: <StatusBadge status="failed" />,
                volume: "N/A",
                efficiency: "0m 04s",
              },
              {
                job: "Gradebook_Consolidation",
                status: <StatusBadge status="processing" />,
                volume: "13,450 records",
                efficiency: "2m 45s",
              },
              {
                job: "Library_Resource_Audit",
                status: <StatusBadge status="success" />,
                volume: "1,103 records",
                efficiency: "1m 20s",
              },
            ]}
          />
        </div>

        {/* ── Institution Visualization Map Section (Bento style) ── */}
        <div className="mt-8 grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-12">
            <div className="bg-surface-container-low rounded-xl p-8 overflow-hidden relative min-h-[300px] flex items-center shadow-sm">
              <div className="z-10 relative max-w-lg">
                <h3 className="text-2xl font-black text-primary mb-4 tracking-tight">
                  Institutional Network
                </h3>
                <p className="text-on-surface-variant font-medium mb-6">
                  Visualizing connectivity across 4 campus nodes and 12 remote
                  data centers. All regions reporting nominal latency.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 border border-slate-100">
                    <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      North Campus: <span className="text-primary">ACTIVE</span>
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 border border-slate-100">
                    <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      Cloud Mirror: <span className="text-primary">SYNCED</span>
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 border border-slate-100">
                    <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      Europe Node: <span className="text-primary">STABLE</span>
                    </span>
                  </div>
                </div>
              </div>
              {/* Background map decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-40 grayscale overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="/campus-network.png"
                  alt="Campus Network Map"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Analytics Jobs ── */}
      </div>
    </MainContent>
  );
}

// ============================================================================
// QA OFFICER DASHBOARD
// ============================================================================
function QADashboard() {
  return (
    <MainContent>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-on-surface">
            Quality Assurance Console
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Accreditation & compliance monitoring
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SmallMetricCard
            label="Compliance Score"
            value="98.5%"
            icon={CheckCircle2}
            status="Excellent standing"
            color="emerald"
          />
          <SmallMetricCard
            label="HEC Requirements"
            value="42/42"
            icon={CheckCircle2}
            status="All met"
            color="emerald"
          />
          <SmallMetricCard
            label="FERPA Audit"
            value="Clean"
            icon={CheckCircle2}
            status="No issues"
            color="emerald"
          />
          <SmallMetricCard
            label="Issues Found"
            value="3"
            icon={AlertCircle}
            status="-30% from last audit"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Accreditation Checklist
            </h2>
            <div className="space-y-2">
              {[
                "Institutional Mission & Vision",
                "Academic Programs (42)",
                "Student Support Services",
                "Financial Resources & Sustainability",
                "Quality Assurance System",
                "Faculty Credentials",
                "Library & Learning Resources",
                "Assessment Results",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-primary/5 rounded hover:bg-primary/10 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-on-surface">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Recent Audit Findings
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs font-bold text-yellow-900">
                  Lab Equipment Maintenance (Medium)
                </p>
                <p className="text-xs text-yellow-700 font-medium mt-1">
                  5 of 12 labs require calibration by June 30
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-bold text-blue-900">
                  Documentation Complete (Low)
                </p>
                <p className="text-xs text-blue-700 font-medium mt-1">
                  Faculty handbooks updated for 2024-25
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-bold text-green-900">
                  Resolved (Info)
                </p>
                <p className="text-xs text-green-700 font-medium mt-1">
                  15 previous findings now closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}

// ============================================================================
// DATA ANALYST DASHBOARD
// ============================================================================
function AnalystDashboard() {
  const hecStudents = generateHECStudents(1000);
  const programs = getHECPrograms();
  const avgGPA = (
    hecStudents.reduce((sum, s) => sum + s.academic.gpa, 0) / hecStudents.length
  ).toFixed(2);
  const riskStudents = hecStudents.filter(
    (s) => s.riskIndicators.predictionStatus === "High Risk",
  ).length;

  return (
    <MainContent>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-on-surface">
              Analytics Hub
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Advanced institutional insights & predictions
            </p>
          </div>
          <button className="px-3 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs">
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SmallMetricCard
            label="Total Students"
            value={hecStudents.length}
            icon={Users}
            status="+8.5% growth"
            color="sky"
          />
          <SmallMetricCard
            label="Avg GPA"
            value={avgGPA}
            icon={Award}
            status="+0.5 this term"
            color="cyan"
          />
          <SmallMetricCard
            label="Programs"
            value={programs.length}
            icon={BookOpen}
            status="Active enrollment"
            color="violet"
          />
          <SmallMetricCard
            label="At Risk"
            value={riskStudents}
            icon={AlertCircle}
            status="-15% improvement"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Enrollment Trend
            </h2>
            <div className="space-y-3">
              {enrollmentByProgram.map((prog, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface">
                      {prog.program}
                    </span>
                    <span className="text-xs font-black text-on-surface">
                      {prog.students}
                    </span>
                  </div>
                  <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${(prog.students / 350) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Success Metrics
            </h2>
            <div className="space-y-3">
              {[
                { name: "Graduation Rate", value: 87.3, target: 90 },
                { name: "Retention", value: 92.1, target: 95 },
                { name: "Academic Pass", value: 88.5, target: 92 },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface">
                      {metric.name}
                    </span>
                    <span className="text-xs font-black text-on-surface">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{
                        width: `${(metric.value / metric.target) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}

// ============================================================================
// HEAD OF DEPARTMENT DASHBOARD
// ============================================================================
function HODDashboard() {
  const hecStudents = generateHECStudents(250);
  const avgGPA = (
    hecStudents.reduce((sum, s) => sum + s.academic.gpa, 0) / hecStudents.length
  ).toFixed(2);

  return (
    <MainContent>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-on-surface">
            Department Overview
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Science & Engineering Program Management
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SmallMetricCard
            label="Total Enrollment"
            value={hecStudents.length}
            icon={Users}
            status="+4.2% from last"
            color="sky"
          />
          <SmallMetricCard
            label="Faculty Count"
            value="18"
            icon={Award}
            status="All positions filled"
            color="cyan"
          />
          <SmallMetricCard
            label="Avg GPA"
            value={avgGPA}
            icon={Award}
            status="+1.5 improvement"
            color="emerald"
          />
          <SmallMetricCard
            label="Research Output"
            value="12"
            icon={BookOpen}
            status="Publications this year"
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Program Performance
            </h2>
            <div className="space-y-3">
              {[
                { name: "Bachelor Engineering", value: 87 },
                { name: "Advanced Courses", value: 92 },
                { name: "Lab Practicals", value: 78 },
                { name: "Internships", value: 95 },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface">
                      {metric.name}
                    </span>
                    <span className="text-xs font-black">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Department Status
            </h2>
            <div className="space-y-2">
              {[
                "24 student assignments submitted this week",
                "8 internship offers received",
                "3 research papers published",
                "Lab equipment 98% operational",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-on-surface font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}

// ============================================================================
// LECTURER DASHBOARD
// ============================================================================
function LecturerDashboard() {
  const lecturerStudents = generateHECStudents(32);
  const avgGPA = (
    lecturerStudents.reduce((sum, s) => sum + s.academic.gpa, 0) /
    lecturerStudents.length
  ).toFixed(2);

  return (
    <MainContent>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-on-surface">
              Welcome back, Dr. Rodriguez
            </h1>
            <p className="text-xs text-on-surface-variant font-medium italic mt-1">
              "Excellence is the gradual result of always striving to do
              better."
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-secondary text-on-secondary rounded-lg font-semibold text-xs">
              Create Course Report
            </button>
            <button className="px-3 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs">
              Message All Students
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SmallMetricCard
            label="Current Load"
            value="224"
            icon={Activity}
            status="Across 2 sections"
            color="cyan"
          />
          <SmallMetricCard
            label="Avg Class GPA"
            value={avgGPA}
            icon={Award}
            status="+0.3 improvement"
            color="emerald"
          />
          <SmallMetricCard
            label="Attendance"
            value="94.2%"
            icon={Users}
            status="+2.1% this month"
            color="sky"
          />
          <SmallMetricCard
            label="Pending Grades"
            value="18"
            icon={Clock}
            status="-8 from last week"
            color="red"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              code: "CS-502-A",
              name: "Neural Networks & Cognition",
              status: "live",
              enrollment: 124,
              grade: "B+",
              time: "TUE 10:00",
            },
            {
              code: "CS-614-B",
              name: "Advanced Machine Learning",
              status: "next",
              enrollment: 82,
              grade: "A-",
              time: "THU 14:00",
            },
          ].map((course, idx) => (
            <div
              key={idx}
              className="p-4 bg-surface-light rounded-lg border border-on-surface/5 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">
                      {course.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${course.status === "live" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {course.status === "live" ? "LIVE NOW" : "NEXT"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface">
                    {course.name}
                  </p>
                </div>
                <span className="text-lg font-black text-primary">
                  {course.grade}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-1 bg-primary/5 rounded">
                  <p className="font-bold text-on-surface">
                    {course.enrollment}
                  </p>
                  <p className="text-on-surface-variant font-medium">
                    ENROLLMENT
                  </p>
                </div>
                <div className="text-center p-1 bg-secondary/5 rounded">
                  <p className="font-bold text-on-surface">{course.time}</p>
                  <p className="text-on-surface-variant font-medium">LECTURE</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tenure Readiness */}
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Tenure Readiness
            </h2>
            <div className="space-y-3">
              {[
                { task: "Peer Review Publications", status: 5, total: 6 },
                { task: "Guest Lecture Credits", status: 55, total: 60 },
                { task: "Final Committee Presentation", status: 0, total: 1 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface">
                      {item.task}
                    </span>
                    <span className="text-xs font-black text-on-surface">
                      {item.status}/{item.total}
                    </span>
                  </div>
                  <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${(item.status / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-4 p-2 bg-blue-50 rounded">
              Tenure Review: Spring 2025
            </p>
          </div>

          {/* Engagement Alerts */}
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Student Engagement Alerts
            </h2>
            <div className="space-y-3">
              {[
                {
                  name: "Marcus Thorne",
                  issue: "Inactive in LMS for 3 days",
                  severity: "high",
                },
                {
                  name: "Sarah Jenkins",
                  issue: "Missed assignment due deadline",
                  severity: "medium",
                },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-start gap-3 ${alert.severity === "high" ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}
                >
                  <img
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    src={`https://i.pravatar.cc/32?img=${idx}`}
                    alt=""
                  />
                  <div>
                    <p
                      className={`text-xs font-bold ${alert.severity === "high" ? "text-red-900" : "text-yellow-900"}`}
                    >
                      {alert.name}
                    </p>
                    <p
                      className={`text-xs font-medium ${alert.severity === "high" ? "text-red-700" : "text-yellow-700"}`}
                    >
                      {alert.issue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Benchmarks */}
        <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
          <h2 className="text-sm font-black text-on-surface mb-4">
            Faculty Performance Benchmarks
          </h2>
          <DataTable
            columns={[
              { key: "indicator", label: "Indicator" },
              { key: "personal", label: "Personal Score" },
              { key: "avg", label: "Institutional Avg" },
              { key: "trend", label: "Trend" },
            ]}
            data={[
              {
                indicator: "Student Satisfaction",
                personal: "4.82 / 5.0",
                avg: "4.15 / 5.0",
                trend: <TrendingUp className="w-4 h-4 text-green-600" />,
              },
              {
                indicator: "Grant Acquisition",
                personal: "1.2 yr",
                avg: "1.8 yr",
                trend: <TrendingUp className="w-4 h-4 text-green-600" />,
              },
              {
                indicator: "LMS Content Engagement",
                personal: "92%",
                avg: "76%",
                trend: <TrendingUp className="w-4 h-4 text-green-600" />,
              },
            ]}
          />
        </div>
      </div>
    </MainContent>
  );
}

// ============================================================================
// STUDENT DASHBOARD
// ============================================================================
// StudentDashboard component - Not used in current demo (no student role)
/*
function StudentDashboard() {
  const studentCourses = [
    {
      code: "CS-101",
      name: "Programming Fundamentals",
      grade: 4.0,
      credits: 3,
    },
    { code: "MAT-201", name: "Calculus II", grade: 3.8, credits: 4 },
    { code: "PHY-101", name: "Physics I", grade: 3.5, credits: 4 },
    { code: "ENG-101", name: "English Composition", grade: 3.9, credits: 3 },
  ];
  const cumulativeGPA = 3.8;

  return (
    <MainContent>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-on-surface">
              Academic Profile
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Computer Science • Year 2 • AUCA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SmallMetricCard
            label="Cumulative GPA"
            value={cumulativeGPA}
            icon={Award}
            status="+0.15 this semester"
            color="sky"
          />
          <SmallMetricCard
            label="Credits Earned"
            value="84"
            icon={BookOpen}
            status="+12 this semester"
            color="cyan"
          />
          <SmallMetricCard
            label="Current Courses"
            value="4"
            icon={Activity}
            status="2 major • 2 elective"
            color="emerald"
          />
          <SmallMetricCard
            label="Graduation"
            value="2025"
            icon={CheckCircle2}
            status="On track"
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-light rounded-xl p-6 border border-on-surface/5">
            <h2 className="text-sm font-black text-on-surface mb-4">
              Current Courses
            </h2>
            <div className="space-y-3">
              {studentCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-xs font-bold text-on-surface uppercase">
                        {course.code}
                      </p>
                      <p className="text-xs text-on-surface font-medium mt-1">
                        {course.name}
                      </p>
                    </div>
                    <span className="text-lg font-black text-primary">
                      {course.grade}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {course.credits} credits
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-xs font-bold text-green-900">
                  Good Standing
                </p>
              </div>
              <p className="text-xs text-green-700 font-medium">
                GPA meets academic standards
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-bold text-blue-900 mb-1">
                Next Semester
              </p>
              <p className="text-xs text-blue-700 font-medium">
                5 courses registered • 15 credits • Confirmed
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-xs font-bold text-purple-900 mb-1">
                Opportunities
              </p>
              <p className="text-xs text-purple-700 font-medium">
                Eligible for honors program • Deadline: May 15
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}
*/

// ============================================================================
// MAIN COMPONENT - Role-Based Router
// ============================================================================
export default function DashboardPage() {
  const { state } = useAuth();
  const user = state.user;
  const userRole = user?.role;

  switch (userRole) {
    case "academic_admin":
      return <AdminDashboard />;
    case "qa_officer":
      return <QADashboard />;
    case "data_analyst":
      return <AnalystDashboard />;
    case "department_head":
      return <HODDashboard />;
    case "system_admin":
      return <LecturerDashboard />;
    default:
      return (
        <MainContent>
          <Card className="p-8 text-center">
            <p className="text-on-surface-variant">Loading dashboard...</p>
          </Card>
        </MainContent>
      );
  }
}
