import React, { useState } from "react";

interface PipelineStage {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration: number;
  recordsProcessed: number;
}

interface PipelineFlow {
  id: string;
  name: string;
  sourceSystem: string;
  targetStandards: string[];
  stages: PipelineStage[];
  overallProgress: number;
}

const PipelineVisualizerPage: React.FC = () => {
  const [selectedPipeline, setSelectedPipeline] =
    useState<string>("pipeline_1");

  const pipelines: PipelineFlow[] = [
    {
      id: "pipeline_1",
      name: "Canvas LMS → xAPI",
      sourceSystem: "Canvas LMS",
      targetStandards: ["xAPI"],
      stages: [
        {
          id: "extract",
          name: "Extract",
          status: "completed",
          duration: 2300,
          recordsProcessed: 2450,
        },
        {
          id: "transform",
          name: "Transform",
          status: "completed",
          duration: 1850,
          recordsProcessed: 2450,
        },
        {
          id: "validate",
          name: "Validate",
          status: "running",
          duration: 450,
          recordsProcessed: 1890,
        },
        {
          id: "load",
          name: "Load",
          status: "pending",
          duration: 0,
          recordsProcessed: 0,
        },
      ],
      overallProgress: 65,
    },
    {
      id: "pipeline_2",
      name: "Banner SIS → OneRoster",
      sourceSystem: "Banner SIS",
      targetStandards: ["OneRoster", "LIS v2"],
      stages: [
        {
          id: "extract",
          name: "Extract",
          status: "completed",
          duration: 3200,
          recordsProcessed: 5230,
        },
        {
          id: "transform",
          name: "Transform",
          status: "completed",
          duration: 2100,
          recordsProcessed: 5230,
        },
        {
          id: "validate",
          name: "Validate",
          status: "completed",
          duration: 1450,
          recordsProcessed: 5230,
        },
        {
          id: "load",
          name: "Load",
          status: "completed",
          duration: 890,
          recordsProcessed: 5230,
        },
      ],
      overallProgress: 100,
    },
  ];

  const currentPipeline = pipelines.find((p) => p.id === selectedPipeline);

  if (!currentPipeline) {
    return <div>Pipeline not found</div>;
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "running":
        return "●";
      case "failed":
        return "✕";
      default:
        return "○";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return "—";
    const seconds = ms / 1000;
    return seconds < 60
      ? `${seconds.toFixed(1)}s`
      : `${(seconds / 60).toFixed(2)}m`;
  };

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      <div className="bg-gradient-to-r from-pink-500 to-red-600 text-white px-10 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Pipeline Visualizer</h1>
        <p className="opacity-90 text-base">
          Monitor real-time data flow through integration standards
        </p>
      </div>

      <div className="px-10 pb-10 max-w-7xl mx-auto w-full">
        {/* Pipeline Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Active Pipelines
          </h2>
          <div className="flex gap-3 flex-wrap">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`flex-1 min-w-[220px] p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pipeline.id === selectedPipeline
                    ? "bg-gradient-to-r from-pink-500 to-red-600 text-white border-transparent"
                    : "bg-white text-gray-900 border-gray-200 hover:border-red-600 hover:shadow-md"
                }`}
                onClick={() => setSelectedPipeline(pipeline.id)}
              >
                <div
                  className={`font-bold mb-2 ${pipeline.id === selectedPipeline ? "text-white" : "text-gray-900"}`}
                >
                  {pipeline.name}
                </div>
                <div
                  className={`h-1 rounded-full overflow-hidden ${pipeline.id === selectedPipeline ? "bg-pink-400/30" : "bg-gray-200"}`}
                >
                  <div
                    className={`h-full ${pipeline.id === selectedPipeline ? "bg-white" : "bg-green-500"}`}
                    style={{ width: `${pipeline.overallProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentPipeline.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-700">
                <span>
                  <strong>Source:</strong> {currentPipeline.sourceSystem}
                </span>
                <span className="text-lg">→</span>
                <span>
                  <strong>Targets:</strong>{" "}
                  {currentPipeline.targetStandards.join(", ")}
                </span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray={`${currentPipeline.overallProgress * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute text-2xl font-bold text-gray-900">
                  {currentPipeline.overallProgress}%
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Flow Visualization */}
          <div className="p-6 border-b">
            <div className="flex gap-4">
              {currentPipeline.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center flex-1">
                  <div
                    className={`flex-1 p-4 rounded-lg border-2 text-center ${
                      stage.status === "completed"
                        ? "bg-green-50 border-green-300"
                        : stage.status === "running"
                          ? "bg-blue-50 border-blue-300"
                          : stage.status === "failed"
                            ? "bg-red-50 border-red-300"
                            : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <div
                      className={`text-2xl mb-1 ${
                        stage.status === "completed"
                          ? "text-green-600"
                          : stage.status === "running"
                            ? "text-blue-600"
                            : stage.status === "failed"
                              ? "text-red-600"
                              : "text-gray-600"
                      }`}
                    >
                      {getStageIcon(stage.status)}
                    </div>
                    <div className="font-bold text-gray-900 text-sm mb-2">
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {stage.status === "running"
                        ? "In Progress..."
                        : stage.status === "completed"
                          ? "Complete"
                          : stage.status === "failed"
                            ? "Failed"
                            : "Pending"}
                    </div>
                    <div className="text-xs text-gray-700 space-y-1">
                      <div>Duration: {formatDuration(stage.duration)}</div>
                      <div>Records: {stage.recordsProcessed}</div>
                    </div>
                  </div>

                  {index < currentPipeline.stages.length - 1 && (
                    <div className="w-8 flex justify-center text-gray-400 text-xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Stage Statistics */}
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Stage Statistics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">
                      Stage
                    </th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">
                      Duration
                    </th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">
                      Records
                    </th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">
                      Throughput
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentPipeline.stages.map((stage) => (
                    <tr key={stage.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {stage.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            stage.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : stage.status === "running"
                                ? "bg-blue-100 text-blue-700"
                                : stage.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {stage.status.charAt(0).toUpperCase() +
                            stage.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatDuration(stage.duration)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {stage.recordsProcessed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {stage.duration > 0
                          ? `${(
                              (stage.recordsProcessed / stage.duration) *
                              1000
                            ).toFixed(0)} rec/s`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Quality Checkpoints */}
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quality Checkpoints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Schema Validation
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  2,450 records passed schema validation
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  100%
                </span>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Data Type Consistency
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  All field data types verified
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  100%
                </span>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <div className="text-2xl mb-2">⚠</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Required Fields Check
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  34 records missing required fields
                </p>
                <span className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                  98.6%
                </span>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Transformation Success
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  All field transformations applied successfully
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* Error Log */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recent Errors
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                <span className="font-mono text-gray-600 flex-shrink-0">
                  14:32:15
                </span>
                <span className="inline-block bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                  Validate
                </span>
                <span className="text-gray-700">
                  Record 1247: Invalid email format - missing @domain
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                <span className="font-mono text-gray-600 flex-shrink-0">
                  14:31:42
                </span>
                <span className="inline-block bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                  Transform
                </span>
                <span className="text-gray-700">
                  Record 892: Transformation error in courseCode field
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                <span className="font-mono text-gray-600 flex-shrink-0">
                  14:30:18
                </span>
                <span className="inline-block bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                  Validate
                </span>
                <span className="text-gray-700">
                  Record 456: Missing required field student.banner_id
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineVisualizerPage;
