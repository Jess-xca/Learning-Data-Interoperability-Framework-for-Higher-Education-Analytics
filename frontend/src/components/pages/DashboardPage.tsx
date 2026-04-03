import { useState } from "react";
import { MainContent, MetricCard, ChartCard, Table } from "..";
import type { TableColumn } from "../dashboard/Table";

interface DashboardStudent {
  id: string;
  name: string;
  program: string;
  gpa: number;
  status: "active" | "graduated" | "suspended";
}

const dashboardStudents: DashboardStudent[] = [
  { id: "202502SENG001", name: "Jean Umucyo", program: "Engineering", gpa: 3.92, status: "active" },
  { id: "202502SENG002", name: "Claire Habimana", program: "Engineering", gpa: 3.65, status: "active" },
  { id: "202502BUS001", name: "David Mugisha", program: "Business", gpa: 3.45, status: "active" },
  { id: "202502CSC001", name: "Marie Kamanzi", program: "Computer Science", gpa: 3.78, status: "active" },
  { id: "202502ITE001", name: "Pierre Kubwimana", program: "Information Technology", gpa: 3.32, status: "active" },
];

const statusStyle: Record<DashboardStudent["status"], string> = {
  active: "bg-tertiary-container/20 text-on-tertiary-container",
  graduated: "bg-primary-fixed/30 text-primary",
  suspended: "bg-error-container text-on-error-container",
};

const tableColumns: TableColumn<DashboardStudent>[] = [
  { key: "id", label: "Student ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "program", label: "Program", sortable: true },
  {
    key: "gpa",
    label: "GPA",
    render: (value) => <span className="font-black text-primary">{String(value)}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle[value as DashboardStudent["status"]]}`}>
        {String(value)}
      </span>
    ),
  },
];

const enrollmentBars = [32, 45, 38, 52, 61, 55];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<DashboardStudent | null>(null);

  return (
    <MainContent>
      {/* Page header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[2.75rem] font-black text-primary leading-tight tracking-tight">System Hub</h1>
          <p className="text-on-surface-variant font-medium mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container">analytics</span>
            Comprehensive health and operational telemetry for institutional data infrastructure.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-primary font-semibold flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
            <span className="material-symbols-outlined text-sm">sync</span>
            Run Global Sync
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Students" value="1,250" trend={{ value: 5.2, direction: "up" }} icon="people" accentColor="success" />
        <MetricCard label="Graduation Rate" value="84.2%" trend={{ value: 2.1, direction: "up" }} icon="school" accentColor="primary" />
        <MetricCard label="Faculty-to-Student" value="1:18" trend={{ value: 1.5, direction: "down" }} icon="group" accentColor="secondary" />
        <MetricCard label="Active Programs" value="42" trend={{ value: 8.3, direction: "up" }} icon="menu_book" accentColor="error" />
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Enrollment chart */}
        <div className="col-span-12 lg:col-span-8">
          <ChartCard
            title="Enrollment Trends"
            subtitle="Last 6 months across all programs"
            actions={
              <button className="text-primary hover:bg-surface-container-low p-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            }
          >
            <div className="flex items-end justify-around h-full px-4 pb-2 gap-3">
              {enrollmentBars.map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-primary">{value * 10}</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary-fixed rounded-t-lg hover:from-on-tertiary-container hover:to-tertiary-fixed transition-all cursor-pointer"
                    style={{ height: `${(value / 65) * 100}%` }}
                  />
                  <span className="text-xs text-on-surface-variant">{months[i]}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Pipeline status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black text-primary uppercase tracking-widest">Active Pipelines</span>
            <span className="text-[10px] text-on-tertiary-container font-bold bg-tertiary-container/10 px-2 py-0.5 rounded-full">REAL-TIME</span>
          </div>
          <div className="space-y-6">
            {[
              { name: "Banner SIS Integration", detail: "Syncing student enrollment records...", pct: 85, color: "bg-on-tertiary-container", status: "LIVE", statusColor: "text-on-tertiary-container" },
              { name: "Canvas LMS Export", detail: "Grade distributions for Fall 2024", pct: 30, color: "bg-primary", status: "QUEUED", statusColor: "text-primary" },
              { name: "Financial Reporting", detail: "Scheduled for 02:00 AM", pct: 0, color: "bg-outline-variant", status: "IDLE", statusColor: "text-on-surface-variant" },
            ].map((p) => (
              <div key={p.name} className={`relative pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:${p.color} before:rounded-full ${p.pct === 0 ? "opacity-60" : ""}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-on-surface">{p.name}</span>
                  <span className={`text-[10px] font-bold ${p.statusColor}`}>{p.status}</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">{p.detail}</p>
                {p.pct > 0 && (
                  <div className="w-full bg-surface-container rounded-full h-1">
                    <div className={`${p.color} h-1 rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border-2 border-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary/5 transition-colors">
            Manage All Pipelines
          </button>
        </div>
      </div>

      {/* Ecosystem modules */}
      <div className="bg-surface-container-low rounded-xl p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-primary tracking-tight">Ecosystem Modules</h2>
          <span className="text-xs font-bold text-on-surface-variant uppercase bg-surface-container-highest px-3 py-1 rounded-full">
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: "school", name: "Academic Registry", status: "Stable" },
            { icon: "library_books", name: "LMS Connector", status: "Stable" },
            { icon: "psychology", name: "Predictive Analytics", status: "Training" },
            { icon: "diversity_3", name: "Admissions CRM", status: "Syncing" },
            { icon: "payments", name: "Bursar System", status: "Stable" },
            { icon: "biotech", name: "Research Grants", status: "Stable" },
          ].map((mod) => (
            <div key={mod.name}
              className="bg-surface-container-lowest p-4 rounded-lg flex flex-col items-start gap-3 group hover:bg-primary-container hover:text-white transition-all duration-200 border border-transparent hover:border-primary-container shadow-sm cursor-pointer">
              <div className="w-10 h-10 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary-container">
                <span className="material-symbols-outlined text-xl">{mod.icon}</span>
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">{mod.name}</div>
                <div className="text-[10px] text-on-surface-variant group-hover:text-blue-200 uppercase mt-1">{mod.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent students table */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-primary tracking-tight">Recent Student Records</h2>
          <button className="text-sm font-bold text-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <Table
          columns={tableColumns}
          data={dashboardStudents}
          keyExtractor={(row) => row.id}
          onRowClick={setSelectedStudent}
        />
      </div>

      {/* Selected student detail */}
      {selectedStudent && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-primary">{selectedStudent.name}</h3>
              <p className="text-sm text-on-surface-variant font-mono mt-0.5">{selectedStudent.id}</p>
            </div>
            <button onClick={() => setSelectedStudent(null)}
              className="text-on-surface-variant hover:text-primary p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Program", value: selectedStudent.program },
              { label: "GPA", value: String(selectedStudent.gpa) },
              { label: "Status", value: selectedStudent.status },
              { label: "Enrollment Year", value: selectedStudent.id.slice(0, 4) },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-low p-4 rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">{item.label}</p>
                <p className="text-sm font-bold text-primary capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainContent>
  );
}
