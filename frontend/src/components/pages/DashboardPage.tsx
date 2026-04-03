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
  {
    id: "202502SENG001",
    name: "Jean Umucyo",
    program: "Engineering",
    gpa: 3.92,
    status: "active",
  },
  {
    id: "202502SENG002",
    name: "Claire Habimana",
    program: "Engineering",
    gpa: 3.65,
    status: "active",
  },
  {
    id: "202502BUS001",
    name: "David Mugisha",
    program: "Business",
    gpa: 3.45,
    status: "active",
  },
  {
    id: "202502CSC001",
    name: "Marie Kamanzi",
    program: "Computer Science",
    gpa: 3.78,
    status: "active",
  },
  {
    id: "202502ITE001",
    name: "Pierre Kubwimana",
    program: "Information Technology",
    gpa: 3.32,
    status: "active",
  },
];

const tableColumns: TableColumn<DashboardStudent>[] = [
  { key: "id", label: "Student ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "program", label: "Program", sortable: true },
  {
    key: "gpa",
    label: "GPA",
    render: (value: unknown) => (
      <span className="font-bold text-primary">{String(value)}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: unknown) => {
      const statusColor =
        String(value) === "active"
          ? "success"
          : String(value) === "graduated"
            ? "primary"
            : "error";
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
            statusColor === "success"
              ? "bg-tertiary-fixed text-on-tertiary"
              : statusColor === "primary"
                ? "bg-primary-container text-on-primary-container"
                : "bg-error-container text-on-error-container"
          }`}
        >
          {String(value)}
        </span>
      );
    },
  },
];

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] =
    useState<DashboardStudent | null>(null);

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-lg text-on-surface-variant">
          Welcome back! Here's your institutional overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          label="Total Students"
          value="1,250"
          trend={{ value: 5.2, direction: "up" }}
          icon="people"
        />
        <MetricCard
          label="Graduation Rate"
          value="84.2%"
          trend={{ value: 2.1, direction: "up" }}
          icon="school"
        />
        <MetricCard
          label="Faculty-to-Student"
          value="1:18"
          trend={{ value: 1.5, direction: "down" }}
          icon="group"
        />
        <MetricCard
          label="Programs Active"
          value="42"
          trend={{ value: 8.3, direction: "up" }}
          icon="menu_book"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <ChartCard
          title="Enrollment Trends"
          subtitle="Last 4 months"
          actions={
            <button className="text-primary text-sm font-bold hover:bg-surface-container-low p-2 rounded">
              <span className="material-symbols-outlined">download</span>
            </button>
          }
        >
          <div className="flex items-end justify-around h-full p-4">
            {[32, 45, 38, 52, 61, 55].map((value, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="bg-gradient-to-t from-primary to-primary-container rounded-t-lg w-8"
                  style={{ height: `${(value / 65) * 100}%` }}
                ></div>
                <span className="text-xs text-on-surface-variant">
                  M{i + 1}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Program Distribution"
          subtitle="By enrollment count"
          actions={
            <button className="text-primary text-sm font-bold hover:bg-surface-container-low p-2 rounded">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          }
        >
          <div className="flex items-center justify-around h-full space-x-4 p-4">
            {[
              { name: "Engineering", value: 320, color: "from-primary" },
              { name: "Business", value: 240, color: "from-secondary" },
              { name: "Science", value: 280, color: "from-tertiary" },
            ].map((program, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${program.color} to-surface-container flex items-center justify-center`}
                >
                  <span className="text-sm font-bold text-white">
                    {program.value}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant text-center">
                  {program.name}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Data Table */}
      <div className="space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-primary">
          Recent Student Records
        </h2>
        <Table
          columns={tableColumns}
          data={dashboardStudents}
          keyExtractor={(row: DashboardStudent) => row.id}
          onRowClick={setSelectedStudent}
        />
      </div>

      {/* Selected Student Detail */}
      {selectedStudent && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">
              {selectedStudent.name}
            </h3>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant uppercase">
                Student ID
              </p>
              <p className="text-sm font-bold text-primary">
                {selectedStudent.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase">
                Program
              </p>
              <p className="text-sm font-bold">{selectedStudent.program}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase">GPA</p>
              <p className="text-sm font-bold text-primary">
                {selectedStudent.gpa}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase">
                Status
              </p>
              <p className="text-sm font-bold capitalize text-tertiary">
                {selectedStudent.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </MainContent>
  );
}
