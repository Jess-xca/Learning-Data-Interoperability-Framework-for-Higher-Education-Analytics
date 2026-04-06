import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { updateReport } from "../store/slices/accreditationSlice";
import Button from "./forms/Button";

interface ReportGeneratorModalProps {
  reportId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  reportId,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { complianceAreas, reports } = useAppSelector(
    (state) => state.accreditation
  );

  const report = reports.find((r) => r.id === reportId);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  if (!report) {
    return null;
  }

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAreas.length === complianceAreas.length) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas(complianceAreas.map((a) => a.id));
    }
  };

  const generateReport = async () => {
    if (selectedAreas.length === 0) {
      alert("Please select at least one compliance area");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation process
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setGenerationProgress(i);
      }

      // Calculate stats
      const selectedComplianceAreas = complianceAreas.filter((a) =>
        selectedAreas.includes(a.id)
      );

      const totalStandards = selectedComplianceAreas.reduce(
        (sum, area) => sum + area.standards.length,
        0
      );

      const compliantStandards = selectedComplianceAreas.reduce(
        (sum, area) =>
          sum + area.standards.filter((s) => s.status === "compliant").length,
        0
      );

      // Update report
      const updatedReport = {
        ...report,
        status: "in_progress" as const,
        completionPercentage: Math.min(
          90,
          report.completionPercentage + 15
        ),
        standardsMapped: totalStandards,
        evidenceCollected: compliantStandards,
      };

      dispatch(updateReport(updatedReport));

      setGenerationProgress(100);

      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }

      setTimeout(onClose, 500);
    } catch (error) {
      alert(`Failed to generate report: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedComplianceAreas = complianceAreas.filter((a) =>
    selectedAreas.includes(a.id)
  );
  const totalStandards = selectedComplianceAreas.reduce(
    (sum, area) => sum + area.standards.length,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Generate Report</h2>
            <p className="text-sm opacity-90 mt-1">{report.name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        {!isGenerating ? (
          <div className="p-8 space-y-6">
            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600 flex-shrink-0">
                  info
                </span>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Report Information</p>
                  <p className="text-xs">
                    Select compliance areas to include in this self-study report. All mapped standards
                    and collected evidence will be summarized automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Areas Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Select Compliance Areas</h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {selectedAreas.length === complianceAreas.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="space-y-3">
                {complianceAreas.map((area) => (
                  <label
                    key={area.id}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area.id)}
                      onChange={() => handleAreaToggle(area.id)}
                      disabled={isGenerating}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{area.name}</p>
                      <p className="text-sm text-gray-600">
                        {area.standards.length} standards • Compliance:{" "}
                        <span
                          className={`font-bold ${
                            area.overallStatus === "compliant"
                              ? "text-green-600"
                              : area.overallStatus === "at_risk"
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {area.overallScore}%
                        </span>
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Report Options */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Report Options</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeEvidence}
                  onChange={(e) => setIncludeEvidence(e.target.checked)}
                  disabled={isGenerating}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Include Evidence Summary
                  </p>
                  <p className="text-sm text-gray-600">
                    Attach list of evidence documents and their status
                  </p>
                </div>
              </label>
            </div>

            {/* Summary */}
            {selectedAreas.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Report Summary</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Areas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedAreas.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Standards</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStandards}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Format</p>
                    <p className="text-2xl font-bold text-gray-900">PDF</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={generateReport}
                disabled={isGenerating || selectedAreas.length === 0}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">description</span>
                  Generate Report
                </span>
              </Button>
            </div>
          </div>
        ) : (
          /* Generation Progress */
          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Generating Report...
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {generationProgress}%
                  </span>
                  <span className="text-sm text-gray-600">
                    {generationProgress === 0
                      ? "Initializing..."
                      : generationProgress === 20
                      ? "Analyzing standards..."
                      : generationProgress === 40
                      ? "Collecting evidence..."
                      : generationProgress === 60
                      ? "Compiling data..."
                      : generationProgress === 80
                      ? "Formatting document..."
                      : "Finalizing..."}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-5 gap-2">
              {["Initialize", "Analyze", "Collect", "Compile", "Format"].map(
                (step, idx) => (
                  <div
                    key={step}
                    className={`text-center p-3 rounded-lg ${
                      generationProgress >= (idx + 1) * 20
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <p className="text-xs font-medium">{step}</p>
                  </div>
                )
              )}
            </div>

            <p className="text-center text-sm text-gray-600">
              Please wait while your report is being generated...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGeneratorModal;
