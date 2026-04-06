import React, { useState } from "react";
import { useAppSelector } from "../../hooks/useRedux";
import Button from "../forms/Button";
import ReportDistributionModal from "../ReportDistributionModal";
import ReportingAnalyticsModal from "../ReportingAnalyticsModal";

const InstitutionalReportingPage: React.FC = () => {
  const { reports: institutionalReports } = useAppSelector(
    (state) => state.reporting,
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "status" | "deadline">("date");
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [selectedReportName, setSelectedReportName] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "submitted":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "accreditation":
        return "verified_user";
      case "compliance":
        return "check_circle";
      case "quality":
        return "auto_awesome";
      case "performance":
        return "trending_up";
      default:
        return "description";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "accreditation":
        return "Accreditation";
      case "compliance":
        return "Compliance";
      case "quality":
        return "Quality";
      case "performance":
        return "Performance";
      default:
        return "Report";
    }
  };

  const filterReports = () => {
    let filtered = institutionalReports;

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((r) => r.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "deadline":
          return (
            new Date(a.submissionDeadline).getTime() -
            new Date(b.submissionDeadline).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredReports = filterReports();

  const stats = {
    total: institutionalReports.length,
    draft: institutionalReports.filter((r) => r.status === "draft").length,
    completed: institutionalReports.filter((r) => r.status === "completed")
      .length,
    approved: institutionalReports.filter((r) => r.status === "approved")
      .length,
  };

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-10 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Institutional Reporting</h1>
        <p className="opacity-90 text-base">
          Manage and distribute institutional reports across departments
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 pb-10 max-w-7xl mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Total Reports
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Drafts
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.draft}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Completed
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.completed}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Approved
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.approved}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Reports
              </label>
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="date">Last Modified</option>
                <option value="status">Status</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          <Button variant="primary" className="w-full md:w-auto">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              New Report
            </span>
          </Button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 block mb-4">
                description
              </span>
              <p className="text-gray-600">
                No reports found matching your criteria
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl text-emerald-600 flex-shrink-0">
                        <span className="material-symbols-outlined">
                          {getTypeIcon(report.type)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {report.name}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {getTypeLabel(report.type)}
                          </span>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(
                              report.status,
                            )}`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Created:{" "}
                          {new Date(report.createdDate).toLocaleDateString()} •
                          Due:{" "}
                          {new Date(
                            report.submissionDeadline,
                          ).toLocaleDateString()}{" "}
                          • Modified:{" "}
                          {new Date(report.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Completion
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {report.completionPercentage}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full rounded-full"
                      style={{ width: `${report.completionPercentage}%` }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {report.distributions &&
                      report.distributions.length > 0 ? (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            share
                          </span>
                          Distributed to {report.distributions.length}{" "}
                          recipients
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Not distributed yet
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-sm"
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setSelectedReportName(report.name);
                          setShowAnalyticsModal(true);
                        }}
                      >
                        Analytics
                      </Button>
                      <Button
                        variant="primary"
                        className="text-sm"
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setSelectedReportName(report.name);
                          setShowDistributionModal(true);
                        }}
                      >
                        Distribute
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <ReportDistributionModal
        reportId={selectedReportId}
        reportName={selectedReportName}
        isOpen={showDistributionModal}
        onClose={() => setShowDistributionModal(false)}
        onSuccess={() => {
          setShowDistributionModal(false);
        }}
      />

      <ReportingAnalyticsModal
        reportId={selectedReportId}
        reportName={selectedReportName}
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />
    </div>
  );
};

export default InstitutionalReportingPage;
