import { useState } from "react";
import { MainContent, MetricCard, ChartCard, Table, Card, Badge, Footer } from "..";
import type { TableColumn } from "../dashboard/Table";
import { useAppSelector } from "../../hooks/useRedux";
import {
  generateDummyStudents,
  type DummyStudent,
} from "../../data/dummyGenerator";

// ============================================================================
// ADMIN DASHBOARD - System Hub
// ============================================================================
function AdminDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<DummyStudent | null>(
    null,
  );
  const dashboardStudents = generateDummyStudents(5);

  const tableColumns: TableColumn<DummyStudent>[] = [
    { key: "id", label: "Student ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "program", label: "Program", sortable: true },
    {
      key: "gpa",
      label: "GPA",
      render: (value) => (
        <span className="font-black text-primary">{String(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge
          variant={
            value === "active"
              ? "success"
              : value === "graduated"
                ? "primary"
                : "error"
          }
        >
          {String(value)}
        </Badge>
      ),
    },
  ];

  return (
    <MainContent>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-primary">System Hub</h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Comprehensive health and operational telemetry
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg border border-outline-variant text-primary font-semibold flex items-center gap-2 hover:bg-surface-container-low transition">
            <span className="material-symbols-outlined">download</span>
            Export Report
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90">
            <span className="material-symbols-outlined">sync</span>
            Run Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Students"
          value="1,250"
          trend={{ value: 5.2, direction: "up" }}
          icon="people"
        />
        <MetricCard
          label="Active Systems"
          value="12/12"
          trend={{ value: 100, direction: "up" }}
          icon="cloud_done"
        />
        <MetricCard
          label="Data Pipelines"
          value="8"
          trend={{ value: 2.3, direction: "up" }}
          icon="integration_instructions"
        />
        <MetricCard
          label="System Health"
          value="99.8%"
          trend={{ value: 0.1, direction: "up" }}
          icon="health_and_safety"
        />
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8">
          <ChartCard
            title="Enrollment Trends"
            subtitle="Last 6 months"
            actions={
              <button className="text-primary hover:bg-surface-container-low p-2 rounded-lg">
                <span className="material-symbols-outlined">download</span>
              </button>
            }
          >
            <div className="flex items-end justify-around h-full p-4 gap-2">
              {[32, 45, 38, 52, 61, 55].map((value, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary-fixed rounded-t-lg"
                    style={{ height: `${(value / 65) * 100}%` }}
                  />
                  <span className="text-xs text-on-surface-variant">
                    M{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-lg p-6 border border-outline-variant">
          <span className="text-sm font-bold text-primary uppercase">
            Active Pipelines
          </span>
          <div className="space-y-4 mt-4">
            {[
              { name: "Banner SIS", pct: 85, status: "LIVE" },
              { name: "Canvas LMS", pct: 30, status: "QUEUED" },
              { name: "Financial", pct: 0, status: "IDLE" },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-on-surface">{p.name}</span>
                  <span className="text-xs text-primary font-bold">
                    {p.status}
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Recent Records</h2>
        <Table
          columns={tableColumns}
          data={dashboardStudents}
          keyExtractor={(row) => row.id}
          onRowClick={setSelectedStudent}
        />
      </Card>

      {selectedStudent && (
        <Card className="p-6 border-l-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-primary">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {selectedStudent.id}
              </p>
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-on-surface-variant">Program</p>
              <p className="font-bold">{selectedStudent.program}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">GPA</p>
              <p className="font-bold text-primary">
                {selectedStudent.gpa.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-on-surface-variant">Status</p>
              <Badge
                variant={
                  selectedStudent.status === "active"
                    ? "success"
                    : selectedStudent.status === "graduated"
                      ? "primary"
                      : "error"
                }
              >
                {selectedStudent.status}
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </MainContent>
  );
}

// ============================================================================
// QA OFFICER DASHBOARD - Compliance & Accreditation
// ============================================================================
function QADashboard() {
  const allStudents = generateDummyStudents(1000);

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">Compliance Hub</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Accreditation status and compliance monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Compliance Score"
          value="98.5%"
          trend={{ value: 2.1, direction: "up" }}
          icon="verified"
        />
        <MetricCard
          label="HEC Requirements"
          value="42/42"
          trend={{ value: 100, direction: "up" }}
          icon="check_circle"
        />
        <MetricCard
          label="FERPA Audit"
          value="Clean"
          trend={{ value: 0, direction: "up" }}
          icon="shield_admin"
        />
        <MetricCard
          label="Outstanding Issues"
          value="3"
          trend={{ value: -30, direction: "down" }}
          icon="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Student Status Distribution"
          subtitle="Overall compliance view"
        >
          <div className="flex items-center justify-around h-full p-4">
            {[
              {
                label: "Active",
                count: allStudents.filter((s) => s.status === "active").length,
                color: "bg-tertiary-fixed",
              },
              {
                label: "Graduated",
                count: allStudents.filter((s) => s.status === "graduated")
                  .length,
                color: "bg-secondary",
              },
              {
                label: "Suspended",
                count: allStudents.filter((s) => s.status === "suspended")
                  .length,
                color: "bg-error",
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm ${item.color}`}
                >
                  {Math.round((item.count / allStudents.length) * 100)}%
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  {item.label}
                </p>
                <p className="font-bold text-sm">{item.count}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <Card className="p-6">
          <h3 className="font-bold text-primary mb-4">Recent Audits</h3>
          <div className="space-y-3">
            {[
              {
                audit: "FERPA Privacy Check",
                date: "2025-03-27",
                status: "Passed",
              },
              {
                audit: "Data Backup Verification",
                date: "2025-03-25",
                status: "Passed",
              },
              {
                audit: "Access Control Review",
                date: "2025-03-20",
                status: "Passed",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-surface-container-low rounded"
              >
                <div>
                  <p className="font-bold text-sm">{a.audit}</p>
                  <p className="text-xs text-on-surface-variant">{a.date}</p>
                </div>
                <Badge variant="success">{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainContent>
  );
}

// ============================================================================
// DATA ANALYST DASHBOARD - Advanced Analytics
// ============================================================================
function AnalystDashboard() {
  const allStudents = generateDummyStudents(1000);
  const avgGPA = (
    allStudents.reduce((sum, s) => sum + s.gpa, 0) / allStudents.length
  ).toFixed(2);

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">Analytics Hub</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Advanced institutional analytics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Avg GPA"
          value={avgGPA}
          trend={{ value: 0.5, direction: "up" }}
          icon="trending_up"
        />
        <MetricCard
          label="Retention Rate"
          value="92.3%"
          trend={{ value: 3.2, direction: "up" }}
          icon="people"
        />
        <MetricCard
          label="Programs"
          value={Array.from(
            new Set(allStudents.map((s) => s.program)),
          ).length.toString()}
          trend={{ value: 0, direction: "up" }}
          icon="school"
        />
        <MetricCard
          label="Total Enrollment"
          value={allStudents.length.toString()}
          trend={{ value: 8.5, direction: "up" }}
          icon="equalizer"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="GPA Distribution" subtitle="Performance analytics">
          <div className="flex flex-col justify-around h-full p-4">
            {[
              {
                range: "3.5+",
                count: allStudents.filter((s) => s.gpa >= 3.5).length,
              },
              {
                range: "3.0-3.5",
                count: allStudents.filter((s) => s.gpa >= 3.0 && s.gpa < 3.5)
                  .length,
              },
              {
                range: "2.5-3.0",
                count: allStudents.filter((s) => s.gpa >= 2.5 && s.gpa < 3.0)
                  .length,
              },
              {
                range: "< 2.5",
                count: allStudents.filter((s) => s.gpa < 2.5).length,
              },
            ].map((item) => (
              <div key={item.range}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">{item.range}</span>
                  <span>{item.count}</span>
                </div>
                <div className="w-full bg-outline-variant/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${(item.count / 300) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <Card className="p-6">
          <h3 className="font-bold text-primary mb-4">Top Programs by Size</h3>
          <div className="space-y-3">
            {Array.from(new Set(allStudents.map((s) => s.program)))
              .map((prog) => ({
                program: prog,
                count: allStudents.filter((s) => s.program === prog).length,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-surface-container-low rounded"
                >
                  <span className="font-bold text-sm">{p.program}</span>
                  <span className="text-lg font-bold text-primary">
                    {p.count}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </MainContent>
  );
}

// ============================================================================
// HEAD OF DEPARTMENT DASHBOARD - Department Overview
// ============================================================================
function HODDashboard() {
  const allStudents = generateDummyStudents(400);
  const activeCount = allStudents.filter((s) => s.status === "active").length;

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">
          Department Dashboard
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Engineering Department Overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Students"
          value={allStudents.length.toString()}
          trend={{ value: 4.2, direction: "up" }}
          icon="people"
        />
        <MetricCard
          label="Active Enrollment"
          value={activeCount.toString()}
          trend={{ value: 2.1, direction: "up" }}
          icon="school"
        />
        <MetricCard
          label="Faculty Count"
          value="24"
          trend={{ value: 0, direction: "up" }}
          icon="group"
        />
        <MetricCard
          label="Avg Dept GPA"
          value={(
            allStudents.reduce((sum, s) => sum + s.gpa, 0) / allStudents.length
          ).toFixed(2)}
          trend={{ value: 1.5, direction: "up" }}
          icon="grade"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold text-primary mb-4">Active Courses</h3>
          <div className="space-y-3">
            {[
              { code: "ENG101", title: "Intro to Engineering", enrollment: 45 },
              { code: "ENG201", title: "Data Structures", enrollment: 38 },
              { code: "ENG301", title: "Systems Design", enrollment: 28 },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 bg-surface-container-low rounded-lg border-l-4 border-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">
                      {c.code}: {c.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {c.enrollment} enrolled
                    </p>
                  </div>
                  <Badge variant="success">{c.enrollment}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="Student Performance" subtitle="By year">
          <div className="flex items-end justify-around h-full px-4 gap-2">
            {[60, 65, 70, 75].map((value, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary-fixed rounded-t-lg"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-on-surface-variant">
                  Y{i + 1}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </MainContent>
  );
}

// ============================================================================
// LECTURER DASHBOARD - Class Management
// ============================================================================
function LecturerDashboard() {
  const allStudents = generateDummyStudents(100);

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">My Classroom</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Fall 2025 - ENG101: Introduction to Computer Science
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Students Enrolled"
          value={allStudents.length.toString()}
          trend={{ value: 5.0, direction: "up" }}
          icon="people"
        />
        <MetricCard
          label="Class Avg GPA"
          value={(
            allStudents.reduce((sum, s) => sum + s.gpa, 0) / allStudents.length
          ).toFixed(2)}
          trend={{ value: 0.3, direction: "up" }}
          icon="grade"
        />
        <MetricCard
          label="Attendance Rate"
          value="94.2%"
          trend={{ value: 2.1, direction: "up" }}
          icon="event_available"
        />
        <MetricCard
          label="Pending Grades"
          value="18"
          trend={{ value: -8, direction: "down" }}
          icon="assignment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold text-primary mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {[
              { name: "Quiz 3", due: "Apr 10", submissions: 45 },
              { name: "Project Proposal", due: "Apr 15", submissions: 32 },
              { name: "Midterm Exam", due: "Apr 22", submissions: 0 },
            ].map((a, i) => (
              <div
                key={i}
                className="p-3 bg-surface-container-low rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-sm">{a.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    Due: {a.due}
                  </p>
                </div>
                <Badge variant={a.submissions > 30 ? "success" : "primary"}>
                  {a.submissions}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="Grade Distribution" subtitle="Current term">
          <div className="flex items-end justify-around h-full p-4 gap-2">
            {[30, 50, 45, 35, 20].map((value, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-secondary to-secondary-container rounded-t-lg"
                  style={{ height: `${(value / 60) * 100}%` }}
                />
                <span className="text-xs text-on-surface-variant">
                  {"A+ABCD"[i]}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </MainContent>
  );
}

// ============================================================================
// STUDENT DASHBOARD - Personal Academic Record
// ============================================================================
function StudentDashboard() {
  const studentData = generateDummyStudents(1)[0];

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">My Academic Record</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          {studentData.name} • {studentData.program}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Cumulative GPA"
          value={studentData.gpa.toFixed(2)}
          trend={{ value: 0.15, direction: "up" }}
          icon="grade"
        />
        <MetricCard
          label="Credits Completed"
          value="84"
          trend={{ value: 12, direction: "up" }}
          icon="school"
        />
        <MetricCard
          label="Current Semester"
          value="Spring 2025"
          trend={{ value: 0, direction: "up" }}
          icon="calendar_month"
        />
        <MetricCard
          label="Status"
          value="In Good Standing"
          trend={{ value: 0, direction: "up" }}
          icon="verified"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold text-primary mb-4">Current Courses</h3>
          <div className="space-y-3">
            {[
              { code: "CS201", title: "Algorithms", grade: "A-", credits: 4 },
              {
                code: "MATH301",
                title: "Linear Algebra",
                grade: "B+",
                credits: 3,
              },
              { code: "ENG101", title: "English Comp", grade: "A", credits: 3 },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 bg-surface-container-low rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-sm">
                    {c.code}: {c.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {c.credits} credits
                  </p>
                </div>
                <Badge variant="success">{c.grade}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="GPA Trend" subtitle="Last 4 semesters">
          <div className="flex items-end justify-around h-full p-4 gap-2">
            {[3.2, 3.4, 3.6, 3.78].map((value, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed rounded-t-lg"
                  style={{ height: `${(value / 4) * 100}%` }}
                />
                <span className="text-xs text-on-surface-variant">
                  S{i + 1}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-primary mb-4">Academic Standing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container-low rounded-lg">
            <p className="text-on-surface-variant text-sm">Degree Progress</p>
            <p className="text-2xl font-bold text-primary">84/120</p>
            <div className="w-full bg-surface-container h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "70%" }} />
            </div>
          </div>
          <div className="p-4 bg-surface-container-low rounded-lg">
            <p className="text-on-surface-variant text-sm">
              On Track for Graduation
            </p>
            <p className="text-2xl font-bold text-tertiary">May 2027</p>
          </div>
        </div>
      </Card>
    </MainContent>
  );
}

// ============================================================================
// MAIN COMPONENT - Role-Based Router
// ============================================================================
export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Route to appropriate dashboard based on role
  switch (userRole) {
    case "admin":
      return (
        <>
          <AdminDashboard />
          <Footer variant="minimal" />
        </>
      );
    case "qa":
      return (
        <>
          <QADashboard />
          <Footer variant="minimal" />
        </>
      );
    case "analyst":
      return (
        <>
          <AnalystDashboard />
          <Footer variant="minimal" />
        </>
      );
    case "hod":
      return (
        <>
          <HODDashboard />
          <Footer variant="minimal" />
        </>
      );
    case "lecturer":
      return (
        <>
          <LecturerDashboard />
          <Footer variant="minimal" />
        </>
      );
    case "student":
      return (
        <>
          <StudentDashboard />
          <Footer variant="minimal" />
        </>
      );
    default:
      return (
        <>
        <MainContent>
          <Card className="p-8 text-center">
            <p className="text-on-surface-variant">Loading dashboard...</p>
          </Card>
        </MainContent>
        <Footer variant="minimal" />
        </>
      );
  }
}
