import { useState } from "react";
import { MainContent, Card, Button, Badge, Footer } from "..";
import { useRoleGuard } from "../../hooks/useRoleGuard";

interface DataSource {
  id: string;
  name: string;
  type: "lms" | "sis" | "library" | "crm" | "custom";
  status: "connected" | "warning" | "error" | "disconnected";
  lastSync: string;
  reliability: number;
  recordsPerMinute: number;
  icon: string;
}

const dataSources: DataSource[] = [
  {
    id: "ds_001",
    name: "Canvas LMS",
    type: "lms",
    status: "connected",
    lastSync: "2m ago",
    reliability: 99.9,
    recordsPerMinute: 1402,
    icon: "school",
  },
  {
    id: "ds_002",
    name: "Banner SIS",
    type: "sis",
    status: "connected",
    lastSync: "14m ago",
    reliability: 98.4,
    recordsPerMinute: 421,
    icon: "person_search",
  },
  {
    id: "ds_003",
    name: "ExLibris Alma",
    type: "library",
    status: "warning",
    lastSync: "1h ago",
    reliability: 92.1,
    recordsPerMinute: 0,
    icon: "local_library",
  },
  {
    id: "ds_004",
    name: "Salesforce CRM",
    type: "crm",
    status: "connected",
    lastSync: "5m ago",
    reliability: 99.7,
    recordsPerMinute: 8103,
    icon: "handshake",
  },
];

interface IngestionLog {
  id: string;
  transactionId: string;
  source: string;
  entityType: string;
  volume: number;
  duration: string;
  status: "success" | "error";
  timestamp: string;
}

const ingestionLogs: IngestionLog[] = [
  {
    id: "log_001",
    transactionId: "#TX-88219-CANV",
    source: "Canvas LMS",
    entityType: "Student Gradebook",
    volume: 1402,
    duration: "12.4s",
    status: "success",
    timestamp: "2025-04-03 14:32:15",
  },
  {
    id: "log_002",
    transactionId: "#TX-88220-BANN",
    source: "Banner SIS",
    entityType: "Course Registration",
    volume: 421,
    duration: "4.1s",
    status: "success",
    timestamp: "2025-04-03 14:18:42",
  },
  {
    id: "log_003",
    transactionId: "#TX-88221-ALMA",
    source: "ExLibris Alma",
    entityType: "Bibliographic Data",
    volume: 0,
    duration: "--",
    status: "error",
    timestamp: "2025-04-03 13:45:20",
  },
  {
    id: "log_004",
    transactionId: "#TX-88222-SFOR",
    source: "Salesforce CRM",
    entityType: "Alumni Engagement",
    volume: 8103,
    duration: "45.2s",
    status: "success",
    timestamp: "2025-04-03 13:22:35",
  },
];

export default function DataSourcesPage() {
  useRoleGuard(["admin"]);

  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const getStatusColor = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "disconnected":
        return "error";
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return "LIVE";
      case "warning":
        return "WARNING";
      case "error":
        return "ERROR";
      case "disconnected":
        return "OFFLINE";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <>
      <MainContent>
        {/* Page Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-primary tracking-tight">
              Data Sources
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 text-lg">
              Manage institutional pipeline architecture and synchronization
              health
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowWizard(true)}
          >
            <span className="material-symbols-outlined">add</span>
            Connect New Source
          </Button>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Main Health Graph */}
          <Card className="col-span-8 p-6 h-[400px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
                  Global Pipeline Health
                </h3>
                <p className="text-3xl font-black text-on-surface mt-2">
                  99.84%{" "}
                  <Badge variant="success" className="ml-2">
                    +0.02%
                  </Badge>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold bg-primary text-on-primary rounded">
                  24h
                </button>
                <button className="px-3 py-1 text-xs font-bold text-outline hover:bg-surface-container-low rounded">
                  7d
                </button>
              </div>
            </div>

            {/* Simulated Bar Chart */}
            <div className="flex-1 mt-6 relative flex items-end gap-1">
              {[60, 65, 55, 70, 80, 75, 90, 85, 88, 95, 92, 94].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/10 rounded-t hover:bg-primary/20 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${height}% uptime`}
                  />
                ),
              )}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30" />
            </div>

            <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-tighter">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Current</span>
            </div>
          </Card>

          {/* Stats Rail */}
          <div className="col-span-4 flex flex-col gap-6">
            <Card className="flex-1 bg-primary-container p-6 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-on-primary-container text-3xl">
                  sync
                </span>
                <h4 className="text-xs font-bold uppercase tracking-widest mt-2 text-on-primary-container/70">
                  Active Ingestions
                </h4>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-black text-on-primary-container">
                  14,282
                </span>
                <p className="text-sm text-on-primary-container/80">
                  Records / minute
                </p>
              </div>
            </Card>

            <Card className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-error text-3xl">
                  warning
                </span>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mt-2">
                  Open Issues
                </h4>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-black text-on-surface">02</span>
                <p className="text-sm text-secondary">
                  Schema mismatches detected
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Connected Ecosystem Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-6">
            Connected Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataSources.map((source) => (
              <Card
                key={source.id}
                className="p-1 group hover:bg-primary-container transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedSource(source)}
              >
                <div className="bg-surface-container-lowest p-5 rounded-lg h-full border border-transparent group-hover:border-primary-container transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        {source.icon}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(source.status)}>
                      {getStatusLabel(source.status)}
                    </Badge>
                  </div>

                  <h3 className="font-black text-primary text-lg mb-1">
                    {source.name}
                  </h3>
                  <p className="text-xs text-secondary mb-4 capitalize">
                    {source.type.replace("_", " ")}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                    <div className="flex justify-between text-xs">
                      <span className="text-outline">Last Sync</span>
                      <span className="font-bold text-on-surface">
                        {source.lastSync}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-outline">Reliability</span>
                      <span
                        className={`font-bold ${
                          source.reliability >= 99
                            ? "text-tertiary"
                            : source.reliability >= 95
                              ? "text-primary"
                              : "text-error"
                        }`}
                      >
                        {source.reliability}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Ingestion Logs */}
        <Card className="overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between">
            <h2 className="text-sm font-black text-primary uppercase tracking-widest">
              Recent Ingestion Activity
            </h2>
            <button className="text-xs font-bold text-primary hover:underline">
              Download Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary-container text-on-primary-container text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Source System</th>
                  <th className="px-6 py-4">Entity Type</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ingestionLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`${
                      idx % 2 === 0 ? "bg-surface" : "bg-surface-container-low"
                    } hover:bg-surface-container-high transition-colors`}
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      {log.transactionId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-4">
                      {log.volume > 0 ? `${log.volume} records` : "0 records"}
                    </td>
                    <td className="px-6 py-4">{log.duration}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={log.status === "success" ? "success" : "error"}
                      >
                        {log.status === "success" ? "SUCCESS" : "AUTH ERROR"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected Source Details */}
        {selectedSource && (
          <Card className="p-8 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {selectedSource.name}
                </h3>
                <p className="text-on-surface-variant capitalize">
                  {selectedSource.type} Integration
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSource(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-primary-container/10 p-4 rounded-lg">
                <p className="text-on-surface-variant text-sm mb-2">Status</p>
                <Badge variant={getStatusColor(selectedSource.status)}>
                  {getStatusLabel(selectedSource.status)}
                </Badge>
              </div>
              <div className="bg-secondary-container/10 p-4 rounded-lg">
                <p className="text-on-surface-variant text-sm mb-2">
                  Last Sync
                </p>
                <p className="font-bold text-secondary">
                  {selectedSource.lastSync}
                </p>
              </div>
              <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
                <p className="text-on-surface-variant text-sm mb-2">
                  Reliability
                </p>
                <p className="font-bold text-tertiary">
                  {selectedSource.reliability}%
                </p>
              </div>
              <div className="bg-primary-container/10 p-4 rounded-lg">
                <p className="text-on-surface-variant text-sm mb-2">
                  Throughput
                </p>
                <p className="font-bold text-primary">
                  {selectedSource.recordsPerMinute} rec/min
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" size="md">
                <span className="material-symbols-outlined">sync</span>
                Sync Now
              </Button>
              <Button variant="secondary" size="md">
                <span className="material-symbols-outlined">settings</span>
                Configure
              </Button>
              <Button variant="ghost" size="md">
                <span className="material-symbols-outlined">bug_report</span>
                View Logs
              </Button>
            </div>
          </Card>
        )}

        {/* Integration Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      Integration Wizard
                    </h2>
                    <p className="text-on-surface-variant mt-2">
                      Connect a new data source to Academic Curator
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWizard(false)}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </Button>
                </div>

                {/* Step Indicator */}
                <div className="mb-8 flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -z-10 -translate-y-1/2" />
                  {[
                    "Select Source",
                    "Configure API",
                    "Field Mapping",
                    "Finalize",
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-surface pr-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          idx === 0
                            ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-sm uppercase tracking-wider ${
                          idx === 0
                            ? "font-bold text-primary"
                            : "font-medium text-on-surface-variant"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Source Selection */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">
                    Choose Ecosystem
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      {
                        name: "Canvas LMS",
                        icon: "school",
                        desc: "LTI 1.3 Compliant",
                      },
                      {
                        name: "Moodle",
                        icon: "hub",
                        desc: "Modular Integration",
                      },
                      {
                        name: "Blackboard",
                        icon: "auto_stories",
                        desc: "Ultra Experience",
                      },
                    ].map((source, idx) => (
                      <button
                        key={idx}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          idx === 0
                            ? "bg-surface-container-low border-primary ring-4 ring-primary/5"
                            : "bg-surface-container-low border-transparent hover:border-outline-variant"
                        }`}
                      >
                        <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-white shadow-sm">
                          <span className="material-symbols-outlined text-primary text-3xl">
                            {source.icon}
                          </span>
                        </div>
                        <p className="font-bold text-primary mb-1">
                          {source.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {source.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
                  <Button variant="ghost" size="md">
                    Save Draft
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setShowWizard(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="md">
                      Continue to Configuration
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </MainContent>
      <Footer variant="minimal" />
    </>
  );
}
