import { useState } from "react";
import { MainContent, Card, Button, Badge } from "..";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failure";
  details: string;
}

interface ComplianceItem {
  id: string;
  name: string;
  framework: string;
  status: "compliant" | "warning" | "non-compliant";
  lastChecked: string;
  nextReview: string;
  description: string;
}

const auditLogs: AuditLog[] = [
  {
    id: "A001",
    timestamp: "2025-04-03 14:32:15",
    user: "Admin User",
    action: "Student Record Updated",
    resource: "202502ENG001",
    status: "success",
    details: "GPA updated from 3.8 to 3.82",
  },
  {
    id: "A002",
    timestamp: "2025-04-03 13:15:42",
    user: "Faculty Member",
    action: "Grade Posted",
    resource: "CS101-Spring2025",
    status: "success",
    details: "45 students graded",
  },
  {
    id: "A003",
    timestamp: "2025-04-03 12:48:20",
    user: "System Admin",
    action: "Data Export Requested",
    resource: "Students Export",
    status: "success",
    details: "1000 student records exported in CSV format",
  },
  {
    id: "A004",
    timestamp: "2025-04-03 11:22:35",
    user: "Admin User",
    action: "Report Generation",
    resource: "Enrollment Report",
    status: "success",
    details: "Monthly enrollment report generated",
  },
  {
    id: "A005",
    timestamp: "2025-04-03 10:15:18",
    user: "Unauthorized User",
    action: "Access Denied",
    resource: "Student Database",
    status: "failure",
    details: "Insufficient permissions",
  },
];

const complianceItems: ComplianceItem[] = [
  {
    id: "C001",
    name: "FERPA Compliance",
    framework: "USA (FERPA)",
    status: "compliant",
    lastChecked: "2025-03-15",
    nextReview: "2025-06-15",
    description: "Student privacy and data protection regulations",
  },
  {
    id: "C002",
    name: "GDPR Data Rights",
    framework: "EU (GDPR)",
    status: "compliant",
    lastChecked: "2025-02-20",
    nextReview: "2025-05-20",
    description: "Data subject rights and consent management",
  },
  {
    id: "C003",
    name: "HEC Accreditation",
    framework: "Rwanda (HEC)",
    status: "compliant",
    lastChecked: "2025-01-10",
    nextReview: "2025-07-10",
    description: "Higher Education Council institutional requirements",
  },
  {
    id: "C004",
    name: "Financial Audit",
    framework: "IFR Standards",
    status: "warning",
    lastChecked: "2025-03-01",
    nextReview: "2025-06-01",
    description: "Annual financial statement audit",
  },
  {
    id: "C005",
    name: "Data Retention Policy",
    framework: "Institutional Policy",
    status: "compliant",
    lastChecked: "2025-03-20",
    nextReview: "2025-09-20",
    description: "Records retention and archival schedule",
  },
];

export default function GovernancePage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [selectedCompliance, setSelectedCompliance] =
    useState<ComplianceItem | null>(null);
  const [logFilter, setLogFilter] = useState<"all" | "success" | "failure">(
    "all"
  );

  const filteredLogs =
    logFilter === "all"
      ? auditLogs
      : auditLogs.filter((log) => log.status === logFilter);

  const getStatusColor = (status: AuditLog["status"]) => {
    return status === "success" ? "text-tertiary" : "text-error";
  };

  const getComplianceVariant = (status: ComplianceItem["status"]) => {
    const variants: Record<ComplianceItem["status"], string> = {
      compliant: "success",
      warning: "warning",
      "non-compliant": "error",
    };
    return variants[status];
  };

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Governance</h1>
        <p className="text-lg text-on-surface-variant">
          Compliance, audit logs, and governance controls
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Total Audits</p>
          <p className="text-3xl font-bold text-primary">
            {filteredLogs.length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Successful</p>
          <p className="text-3xl font-bold text-tertiary">
            {auditLogs.filter((l) => l.status === "success").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Compliant</p>
          <p className="text-3xl font-bold text-tertiary">
            {complianceItems.filter((c) => c.status === "compliant").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Warnings</p>
          <p className="text-3xl font-bold text-error">
            {complianceItems.filter((c) => c.status === "warning").length}
          </p>
        </Card>
      </div>

      {/* Compliance Overview */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Compliance Status
        </h2>
        <div className="space-y-3">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 bg-surface-container-low rounded-lg cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedCompliance(item)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-on-surface">{item.name}</h3>
                  <Badge variant={getComplianceVariant(item.status) as any}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-on-surface-variant mb-2">
                  {item.description}
                </p>
                <p className="text-xs text-on-surface-variant">
                  Framework: {item.framework} | Last Checked: {item.lastChecked}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                setSelectedCompliance(item);
              }}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Audit Log</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm font-bold rounded transition ${
                logFilter === "all"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-outline-variant/20"
              }`}
              onClick={() => setLogFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm font-bold rounded transition ${
                logFilter === "success"
                  ? "bg-tertiary text-on-tertiary"
                  : "bg-surface-container-low text-on-surface hover:bg-outline-variant/20"
              }`}
              onClick={() => setLogFilter("success")}
            >
              Success
            </button>
            <button
              className={`px-3 py-1 text-sm font-bold rounded transition ${
                logFilter === "failure"
                  ? "bg-error text-on-error"
                  : "bg-surface-container-low text-on-surface hover:bg-outline-variant/20"
              }`}
              onClick={() => setLogFilter("failure")}
            >
              Failures
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead className="bg-primary-container text-on-primary-container border-b border-outline-variant/20">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase text-xs">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-xs">
                  User
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-xs">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-xs">
                  Resource
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-xs">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`${
                    idx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest"
                  } border-b border-outline-variant/20 hover:bg-surface-container-low transition cursor-pointer`}
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-4 py-3 text-xs">{log.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-primary">
                    {log.user}
                  </td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {log.resource}
                  </td>
                  <td className={`px-4 py-3 font-bold ${getStatusColor(log.status)}`}>
                    {log.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected Log Details */}
      {selectedLog && (
        <Card className="p-6 border-l-4 border-primary mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">Audit Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLog(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-on-surface-variant">Timestamp</p>
              <p className="font-bold">{selectedLog.timestamp}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">User</p>
              <p className="font-bold">{selectedLog.user}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Action</p>
              <p className="font-bold">{selectedLog.action}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Resource</p>
              <p className="font-bold font-mono">{selectedLog.resource}</p>
            </div>
            <div className="col-span-2">
              <p className="text-on-surface-variant">Details</p>
              <p className="font-bold">{selectedLog.details}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Status</p>
              <Badge
                variant={
                  selectedLog.status === "success" ? "success" : "error"
                }
              >
                {selectedLog.status}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Selected Compliance Details */}
      {selectedCompliance && (
        <Card className="p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">
              {selectedCompliance.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCompliance(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Status</p>
              <Badge
                variant={getComplianceVariant(selectedCompliance.status) as any}
              >
                {selectedCompliance.status}
              </Badge>
            </div>
            <div className="bg-secondary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Framework</p>
              <p className="font-bold text-secondary">
                {selectedCompliance.framework}
              </p>
            </div>
            <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Last Checked</p>
              <p className="font-bold text-tertiary">
                {selectedCompliance.lastChecked}
              </p>
            </div>
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">
                Next Review
              </p>
              <p className="font-bold text-primary">
                {selectedCompliance.nextReview}
              </p>
            </div>
          </div>
          <p className="text-on-surface mb-4">{selectedCompliance.description}</p>
          <div className="flex gap-3">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined">check_circle</span>
              Mark Compliant
            </Button>
            <Button variant="secondary" size="md">
              <span className="material-symbols-outlined">assessment</span>
              View Report
            </Button>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
