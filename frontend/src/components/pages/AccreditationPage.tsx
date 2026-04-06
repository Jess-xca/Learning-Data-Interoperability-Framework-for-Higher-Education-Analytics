import React, { useState } from "react";
import { MainContent } from "../layout";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { selectArea } from "../../store/slices/accreditationSlice";
import Button from "../forms/Button";
import EvidenceCollectionModal from "../EvidenceCollectionModal";
import ReportGeneratorModal from "../ReportGeneratorModal";
import type {
  Standard,
  ComplianceArea,
  Evidence,
  AccreditationReport,
} from "../../store/slices/accreditationSlice";

const AccreditationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { complianceAreas, evidence, reports } = useAppSelector(
    (state) => state.accreditation,
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "standards" | "evidence" | "reports"
  >("overview");
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 border-green-300 text-green-700";
      case "at_risk":
        return "bg-amber-100 border-amber-300 text-amber-700";
      case "non_compliant":
        return "bg-red-100 border-red-300 text-red-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return "✓";
      case "at_risk":
        return "⚠";
      case "non_compliant":
        return "✕";
      default:
        return "·";
    }
  };

  const overallCompliance = Math.round(
    complianceAreas.reduce(
      (sum: number, area: ComplianceArea) => sum + area.overallScore,
      0,
    ) / complianceAreas.length,
  );

  return (
    <MainContent>
      {/* Main Content */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">
          Accreditation & Quality Assurance
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          HEC Compliance Management & Evidence Tracking
        </p>
      </div>

      <div>
        {/* Compliance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Overall Compliance
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {overallCompliance}%
            </div>
            <div className="text-xs text-gray-600">Across all areas</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Compliant Areas
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {
                complianceAreas.filter(
                  (a: ComplianceArea) => a.overallStatus === "compliant",
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">
              of {complianceAreas.length}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              At Risk
            </div>
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {
                complianceAreas.filter(
                  (a: ComplianceArea) => a.overallStatus === "at_risk",
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">Requires attention</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Non-Compliant
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {
                complianceAreas.filter(
                  (a: ComplianceArea) => a.overallStatus === "non_compliant",
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">Urgent action needed</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Evidence Collected
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {evidence.length}
            </div>
            <div className="text-xs text-gray-600">Documents/reports</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Compliance Overview
          </button>
          <button
            onClick={() => setActiveTab("standards")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "standards"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Standards Mapping
          </button>
          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "evidence"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Evidence ({evidence.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "reports"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Reports
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Compliance Areas
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceAreas.map((area: ComplianceArea) => (
                <div
                  key={area.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border"
                >
                  <div
                    className={`px-6 py-4 border-b-2 ${
                      area.overallStatus === "compliant"
                        ? "bg-green-50 border-green-200"
                        : area.overallStatus === "at_risk"
                          ? "bg-amber-50 border-amber-200"
                          : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {area.name}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {area.standards.length} standards
                        </div>
                      </div>
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold ${
                          area.overallStatus === "compliant"
                            ? "bg-green-100 text-green-700"
                            : area.overallStatus === "at_risk"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {getStatusIcon(area.overallStatus)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {area.overallScore}%
                      </span>
                      <div className="text-sm font-semibold text-gray-600">
                        {area.overallStatus === "compliant"
                          ? "Compliant"
                          : area.overallStatus === "at_risk"
                            ? "At Risk"
                            : "Non-Compliant"}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full ${
                          area.overallStatus === "compliant"
                            ? "bg-green-500"
                            : area.overallStatus === "at_risk"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${area.overallScore}%` }}
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      {area.standards.slice(0, 3).map((std: Standard) => (
                        <div
                          key={std.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                std.status === "compliant"
                                  ? "bg-green-500"
                                  : std.status === "at_risk"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <span className="text-gray-700 truncate">
                              {std.name}
                            </span>
                          </div>
                          <span className="text-gray-600 font-medium">
                            {std.complianceScore}%
                          </span>
                        </div>
                      ))}
                      {area.standards.length > 3 && (
                        <div className="text-sm text-gray-600 italic">
                          +{area.standards.length - 3} more standards
                        </div>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => dispatch(selectArea(area.id))}
                      className="w-full"
                    >
                      Review Area
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standards Tab */}
        {activeTab === "standards" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Standards Mapping
            </h2>
            {complianceAreas.map((area: ComplianceArea) => (
              <div
                key={area.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b font-bold text-gray-900">
                  {area.name} ({area.standards.length} standards)
                </div>
                <div className="divide-y">
                  {area.standards.map((std: Standard) => (
                    <div key={std.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {std.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {std.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-600">
                              Version: {std.version}
                            </span>
                            {std.deadline && (
                              <span className="text-gray-600">
                                Deadline:{" "}
                                {new Date(std.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(std.status)}`}
                          >
                            {std.complianceScore}%
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            {std.status === "compliant"
                              ? "Compliant"
                              : std.status === "at_risk"
                                ? "At Risk"
                                : "Non-Compliant"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === "evidence" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Evidence Collection
              </h2>
              <Button
                variant="primary"
                onClick={() => setShowEvidenceModal(true)}
              >
                + Upload Evidence
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-gray-900">
                      Standard
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-gray-900">
                      Uploaded
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {evidence.map((ev: Evidence) => {
                    const standard = complianceAreas
                      .flatMap((a: ComplianceArea) => a.standards)
                      .find((s: Standard) => s.id === ev.standardId);
                    return (
                      <tr key={ev.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {ev.title}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {standard?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm capitalize">
                          {ev.category}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ev.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : ev.status === "reviewed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {ev.status.charAt(0).toUpperCase() +
                              ev.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(ev.uploadedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Accreditation Reports
              </h2>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedReportId(reports[0]?.id || "");
                  setShowReportModal(true);
                }}
              >
                + New Report
              </Button>
            </div>

            {reports.map((report: AccreditationReport) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border"
              >
                <div className="px-6 py-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {report.name}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Submission deadline:{" "}
                        {new Date(
                          report.submissionDeadline,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        report.status === "submitted"
                          ? "bg-green-100 text-green-700"
                          : report.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : report.status === "draft"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {report.status === "in_progress"
                        ? "In Progress"
                        : report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                    </span>
                  </div>

                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${report.completionPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-600">Completion</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {report.completionPercentage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Standards Mapped
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {report.standardsMapped}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Evidence Collected
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {report.evidenceCollected}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setShowReportModal(true);
                    }}
                    className="w-full"
                  >
                    Continue Working on Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evidence Collection Modal */}
        {showEvidenceModal && (
          <EvidenceCollectionModal
            onClose={() => setShowEvidenceModal(false)}
            onSuccess={() => {
              setShowEvidenceModal(false);
            }}
          />
        )}

        {/* Report Generator Modal */}
        {showReportModal && selectedReportId && (
          <ReportGeneratorModal
            reportId={selectedReportId}
            onClose={() => {
              setShowReportModal(false);
              setSelectedReportId(null);
            }}
            onSuccess={() => {
              setShowReportModal(false);
              setSelectedReportId(null);
            }}
          />
        )}
      </div>
    </MainContent>
  );
};

export default AccreditationPage;
