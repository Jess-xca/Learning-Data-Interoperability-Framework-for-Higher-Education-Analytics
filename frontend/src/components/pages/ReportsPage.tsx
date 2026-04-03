import { useState } from "react";
import { MainContent, Card, Button, Badge } from "..";
import { useRoleGuard } from "../../hooks/useRoleGuard";

interface Report {
  id: string;
  name: string;
  description: string;
  type: "enrollment" | "academic" | "financial" | "compliance";
  frequency: "one-time" | "weekly" | "monthly" | "quarterly";
  lastGenerated?: string;
  nextGeneration?: string;
  status: "active" | "scheduled" | "archived";
  format: string[];
}

const reports: Report[] = [
  {
    id: "R001",
    name: "Enrollment Summary",
    description: "Complete enrollment statistics by program and semester",
    type: "enrollment",
    frequency: "monthly",
    lastGenerated: "2025-04-01",
    nextGeneration: "2025-05-01",
    status: "active",
    format: ["PDF", "CSV", "Excel"],
  },
  {
    id: "R002",
    name: "Academic Performance Report",
    description: "GPA trends, graduation rates, and academic progress",
    type: "academic",
    frequency: "quarterly",
    lastGenerated: "2025-01-15",
    nextGeneration: "2025-04-15",
    status: "active",
    format: ["PDF", "HTML"],
  },
  {
    id: "R003",
    name: "Compliance & Accreditation",
    description: "HEC and institutional compliance requirements",
    type: "compliance",
    frequency: "quarterly",
    lastGenerated: "2025-01-10",
    nextGeneration: "2025-04-10",
    status: "active",
    format: ["PDF"],
  },
  {
    id: "R004",
    name: "Financial Summary",
    description: "Budget utilization and financial reports by department",
    type: "financial",
    frequency: "monthly",
    lastGenerated: "2025-03-31",
    nextGeneration: "2025-04-30",
    status: "active",
    format: ["Excel", "CSV"],
  },
  {
    id: "R005",
    name: "Faculty Performance",
    description: "Faculty metrics, student evaluations, and publication record",
    type: "academic",
    frequency: "monthly",
    lastGenerated: "2025-02-01",
    nextGeneration: "2025-05-01",
    status: "scheduled",
    format: ["PDF", "Excel"],
  },
  {
    id: "R006",
    name: "Retention Analysis",
    description: "Student retention rates and progression tracking",
    type: "enrollment",
    frequency: "monthly",
    lastGenerated: "2025-03-15",
    nextGeneration: "2025-04-15",
    status: "active",
    format: ["PDF", "CSV", "Dashboard"],
  },
];

const getTypeVariant = (
  type: Report["type"],
): "primary" | "secondary" | "error" | "warning" => {
  const variants: Record<
    Report["type"],
    "primary" | "secondary" | "error" | "warning"
  > = {
    enrollment: "primary",
    academic: "secondary",
    financial: "warning",
    compliance: "error",
  };
  return variants[type];
};

const getStatusVariant = (
  status: Report["status"],
): "success" | "primary" | "error" | "warning" => {
  const variants: Record<
    Report["status"],
    "success" | "primary" | "error" | "warning"
  > = {
    active: "success",
    scheduled: "primary",
    archived: "error",
  };
  return variants[status];
};

export default function ReportsPage() {
  // Role guard - admin, qa, analyst can access
  useRoleGuard(["admin", "qa", "analyst"]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<"generated" | "templates">(
    "generated",
  );

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[2.75rem] font-black text-primary leading-tight tracking-tight">
            Reports
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Generate and manage institutional compliance reports.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          New Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Total Reports</p>
          <p className="text-3xl font-bold text-primary">{reports.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Active</p>
          <p className="text-3xl font-bold text-tertiary">
            {reports.filter((r) => r.status === "active").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Scheduled</p>
          <p className="text-3xl font-bold text-secondary">
            {reports.filter((r) => r.status === "scheduled").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">This Month</p>
          <p className="text-3xl font-bold text-primary-container">
            {reports.filter((r) => r.lastGenerated?.includes("2025-04")).length}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-4 mb-6 flex gap-4 border-b-2 border-outline-variant/20">
        <button
          className={`px-4 py-2 font-bold transition ${
            activeTab === "generated"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
          onClick={() => setActiveTab("generated")}
        >
          Generated Reports
        </button>
        <button
          className={`px-4 py-2 font-bold transition ${
            activeTab === "templates"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Report Templates
        </button>
      </Card>

      {/* Reports List */}
      <div className="space-y-4 mb-8">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-outline-variant hover:border-primary"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-primary">
                    {report.name}
                  </h3>
                  <Badge variant={getStatusVariant(report.status)}>
                    {report.status}
                  </Badge>
                  <Badge variant={getTypeVariant(report.type)}>
                    {report.type}
                  </Badge>
                </div>
                <p className="text-sm text-on-surface-variant mb-2">
                  {report.description}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-on-surface-variant">
                  {report.frequency}
                </p>
                {report.lastGenerated && (
                  <p className="text-xs text-tertiary font-bold">
                    Latest: {report.lastGenerated}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {report.format.map((fmt) => (
                <Badge key={fmt} variant="primary">
                  {fmt}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Report Details */}
      {selectedReport && (
        <Card className="p-8 border-l-4 border-primary space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                {selectedReport.name}
              </h2>
              <p className="text-on-surface-variant">
                {selectedReport.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedReport(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Type</p>
              <p className="text-lg font-bold text-primary capitalize">
                {selectedReport.type}
              </p>
            </div>
            <div className="bg-secondary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Frequency</p>
              <p className="text-lg font-bold text-secondary capitalize">
                {selectedReport.frequency}
              </p>
            </div>
            <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Status</p>
              <p className="text-lg font-bold text-tertiary capitalize">
                {selectedReport.status}
              </p>
            </div>
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">
                Last Generated
              </p>
              <p className="text-lg font-bold text-primary">
                {selectedReport.lastGenerated || "Never"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-on-surface mb-3">
              Available Formats
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedReport.format.map((fmt) => (
                <Button key={fmt} variant="secondary" size="sm">
                  <span className="material-symbols-outlined">download</span>
                  {fmt}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined">refresh</span>
              Generate Now
            </Button>
            <Button variant="secondary" size="md">
              <span className="material-symbols-outlined">edit</span>
              Edit Settings
            </Button>
            <Button variant="ghost" size="md">
              <span className="material-symbols-outlined">schedule</span>
              Change Frequency
            </Button>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
