import React from "react";
import { MainContent } from "../layout";
import { useStandardsValidation } from "../../hooks/useStandardsValidation";

const DataQualityPage: React.FC = () => {
  const { standards, metrics, settings, generateComplianceSummary } =
    useStandardsValidation();

  const summary = generateComplianceSummary();

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="h-page text-primary">Data Quality & Compliance</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Monitor data integrity across all integrated standards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {summary.averageCompliance}%
                </div>
                <div className="text-sm font-semibold opacity-90 mb-2">
                  Average Compliance
                </div>
                <div className="text-sm opacity-80">
                  Threshold: {settings.complianceThreshold}%
                </div>
              </div>
              <div className="text-3xl">
                {summary.averageCompliance >= settings.complianceThreshold
                  ? "✓"
                  : "!"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-600 mb-2 opacity-90">
              Enabled Standards
            </div>
            <div className="text-4xl font-bold mb-2">
              {summary.enabledStandards}
            </div>
            <div className="text-sm opacity-80">
              of {summary.totalStandards} total
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-600 mb-2 opacity-90">
              Records Processed
            </div>
            <div className="text-4xl font-bold mb-2">
              {Object.values(metrics)
                .reduce((sum, m) => sum + m.recordsProcessed, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm opacity-80">24-hour period</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-600 mb-2 opacity-90">
              Issues Detected
            </div>
            <div className="text-4xl font-bold mb-2 text-red-600">
              {Object.values(metrics).reduce((sum, m) => sum + m.errors, 0)}
            </div>
            <div className="text-sm opacity-80">Requires attention</div>
          </div>
        </div>

        {/* Standards Compliance Matrix */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Standards Compliance Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((standard) => {
              const stdMetrics = metrics[standard.id as keyof typeof metrics];
              const isCompliant =
                stdMetrics.compliance >= settings.complianceThreshold;

              return (
                <div
                  key={standard.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                    isCompliant ? "border-green-200" : "border-amber-200"
                  }`}
                >
                  <div className="bg-gray-50 p-4 border-b flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {standard.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {standard.version}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded font-bold text-sm ${
                        isCompliant
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isCompliant ? "PASS" : "REVIEW"}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${
                          isCompliant ? "bg-green-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${stdMetrics.compliance}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-4">
                      {stdMetrics.compliance}% compliant
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Records:</span>
                        <span className="font-medium">
                          {stdMetrics.recordsProcessed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Errors:</span>
                        <span
                          className={`font-medium ${stdMetrics.errors > 0 ? "text-red-600" : ""}`}
                        >
                          {stdMetrics.errors}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium text-xs">
                          {new Date(stdMetrics.lastSync).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                      {standard.category === "learning_analytics"
                        ? "Learning Analytics"
                        : "Roster Management"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Quality Issues */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Common Data Quality Issues
          </h2>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
              <div className="flex gap-3">
                <div className="text-2xl">⚠</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    Missing Email Fields
                  </h4>
                  <p className="text-sm text-gray-600">
                    425 records missing email address in user data
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                    Medium Severity
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex gap-3">
                <div className="text-2xl">✕</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    Invalid Timezone Format
                  </h4>
                  <p className="text-sm text-gray-600">
                    18 records have invalid timezone values
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                    Low Severity
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
              <div className="flex gap-3">
                <div className="text-2xl">⚠</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    Transformation Errors
                  </h4>
                  <p className="text-sm text-gray-600">
                    12 field transformations failed during mapping
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                    Medium Severity
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex gap-3">
                <div className="text-2xl">ℹ</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    Duplicate Records Detected
                  </h4>
                  <p className="text-sm text-gray-600">
                    3,421 potential duplicate student IDs identified
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    Low Severity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Compliance Settings
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h4 className="font-bold text-gray-900">Primary Standard</h4>
                <p className="text-sm text-gray-600">
                  Default format for data exports
                </p>
              </div>
              <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-semibold text-sm">
                {settings.primaryStandard.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h4 className="font-bold text-gray-900">Require Compliance</h4>
                <p className="text-sm text-gray-600">
                  Enforce compliance checks before processing
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded font-semibold text-sm ${
                  settings.requireCompliance
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {settings.requireCompliance ? "On" : "Off"}
              </span>
            </div>

            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h4 className="font-bold text-gray-900">
                  Compliance Threshold
                </h4>
                <p className="text-sm text-gray-600">
                  Minimum pass rate required for compliance
                </p>
              </div>
              <span className="font-bold text-gray-900">
                {settings.complianceThreshold}%
              </span>
            </div>

            <div className="flex justify-between items-center py-4">
              <div>
                <h4 className="font-bold text-gray-900">Auto Correction</h4>
                <p className="text-sm text-gray-600">
                  Automatically fix common data issues
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded font-semibold text-sm ${
                  settings.autoCorrection
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {settings.autoCorrection ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Processing Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                2.145s
              </div>
              <div className="font-semibold text-gray-900 mb-1">
                Avg Processing Time
              </div>
              <div className="text-sm text-gray-600">per 1000 records</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                99.2%
              </div>
              <div className="font-semibold text-gray-900 mb-1">
                Throughput Rate
              </div>
              <div className="text-sm text-gray-600">successful operations</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="font-semibold text-gray-900 mb-1">
                Active Mappings
              </div>
              <div className="text-sm text-gray-600">currently enabled</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                18.4 MB
              </div>
              <div className="font-semibold text-gray-900 mb-1">
                Data Processed
              </div>
              <div className="text-sm text-gray-600">today</div>
            </div>
          </div>
        </div>
      </MainContent>
  );
};

export default DataQualityPage;
