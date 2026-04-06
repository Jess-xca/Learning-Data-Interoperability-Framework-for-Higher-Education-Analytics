import React, { useState } from "react";
import Button from "../forms/Button";

interface DataDictionary {
  id: string;
  name: string;
  description: string;
  dataType: "string" | "number" | "boolean" | "date" | "array";
  source: string;
  owner: string;
  lastModified: string;
  tags: string[];
  sensitivity: "public" | "internal" | "confidential";
}

const DataGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dictionary" | "lineage" | "policies">("dictionary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSensitivity, setSelectedSensitivity] = useState<string>("all");

  const dictionaries: DataDictionary[] = [
    {
      id: "dict_1",
      name: "Student ID",
      description: "Unique identifier for students",
      dataType: "string",
      source: "Student Information System",
      owner: "Registrar Office",
      lastModified: "2026-04-01",
      tags: ["student", "identifier"],
      sensitivity: "confidential",
    },
    {
      id: "dict_2",
      name: "GPA",
      description: "Grade Point Average",
      dataType: "number",
      source: "Academic System",
      owner: "Academic Affairs",
      lastModified: "2026-03-28",
      tags: ["academic", "performance"],
      sensitivity: "internal",
    },
    {
      id: "dict_3",
      name: "Enrollment Date",
      description: "Date student enrolled in program",
      dataType: "date",
      source: "Student Information System",
      owner: "Registrar Office",
      lastModified: "2026-03-15",
      tags: ["date", "enrollment"],
      sensitivity: "internal",
    },
    {
      id: "dict_4",
      name: "Program Name",
      description: "Name of academic program",
      dataType: "string",
      source: "Program Database",
      owner: "Academic Affairs",
      lastModified: "2026-04-03",
      tags: ["program", "academic"],
      sensitivity: "public",
    },
  ];

  const dataLineage = [
    {
      id: "lineage_1",
      name: "Student Data Pipeline",
      source: "Student Information System",
      stages: ["Extract", "Validate", "Transform", "Load"],
      lastRun: "2026-04-06",
      status: "success",
      recordsProcessed: 2458,
    },
    {
      id: "lineage_2",
      name: "Academic Performance Pipeline",
      source: "Academic System",
      stages: ["Extract", "Aggregate", "Calculate", "Load"],
      lastRun: "2026-04-05",
      status: "success",
      recordsProcessed: 15420,
    },
  ];

  const policies = [
    {
      id: "policy_1",
      name: "Data Retention Policy",
      description: "Define how long data is retained",
      category: "retention",
      status: "active",
      createdDate: "2026-01-15",
    },
    {
      id: "policy_2",
      name: "Data Access Policy",
      description: "Define who can access what data",
      category: "access",
      status: "active",
      createdDate: "2026-02-01",
    },
    {
      id: "policy_3",
      name: "Data Quality Standards",
      description: "Define acceptable data quality thresholds",
      category: "quality",
      status: "under_review",
      createdDate: "2026-03-10",
    },
  ];

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "public":
        return "bg-green-100 text-green-700 border-green-300";
      case "internal":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "confidential":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "active":
        return "text-green-600";
      case "under_review":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredDictionaries = dictionaries.filter((dict) => {
    const matchesSearch = dict.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dict.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSensitivity = selectedSensitivity === "all" || dict.sensitivity === selectedSensitivity;
    return matchesSearch && matchesSensitivity;
  });

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-10 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Governance</h1>
        <p className="opacity-90 text-base">Manage data dictionaries, lineage, and governance policies</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 pb-10 max-w-7xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("dictionary")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "dictionary"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">dataset</span>
              Data Dictionary
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lineage")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "lineage"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">account_tree</span>
              Data Lineage
            </span>
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "policies"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">rule</span>
              Governance Policies
            </span>
          </button>
        </div>

        {/* Data Dictionary Tab */}
        {activeTab === "dictionary" && (
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search data elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30"
                />

                <select
                  value={selectedSensitivity}
                  onChange={(e) => setSelectedSensitivity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="all">All Sensitivities</option>
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                </select>
              </div>

              <Button variant="primary" className="w-full md:w-auto">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  Add Data Element
                </span>
              </Button>
            </div>

            <div className="space-y-4">
              {filteredDictionaries.map((dict) => (
                <div
                  key={dict.id}
                  className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{dict.name}</h3>
                      <p className="text-gray-600 text-sm">{dict.description}</p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getSensitivityColor(
                        dict.sensitivity
                      )}`}
                    >
                      {dict.sensitivity.charAt(0).toUpperCase() + dict.sensitivity.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Type</p>
                      <p className="text-gray-900">{dict.dataType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Source</p>
                      <p className="text-gray-900">{dict.source}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Owner</p>
                      <p className="text-gray-900">{dict.owner}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Modified</p>
                      <p className="text-gray-900">
                        {new Date(dict.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {dict.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Lineage Tab */}
        {activeTab === "lineage" && (
          <div>
            <div className="space-y-4">
              {dataLineage.map((lineage) => (
                <div key={lineage.id} className="bg-white rounded-lg shadow-sm p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{lineage.name}</h3>
                      <p className="text-gray-600 text-sm">Source: {lineage.source}</p>
                    </div>
                    <span className={`font-semibold text-sm ${getStatusColor(lineage.status)}`}>
                      {lineage.status.charAt(0).toUpperCase() + lineage.status.slice(1)}
                    </span>
                  </div>

                  {/* Pipeline Stages */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      {lineage.stages.map((stage, index) => (
                        <div key={index} className="flex items-center flex-1">
                          <div className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xa font-semibold text-center">
                            {stage}
                          </div>
                          {index < lineage.stages.length - 1 && (
                            <div className="flex-1 h-1 bg-blue-600 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Last Run</p>
                      <p className="text-gray-900">
                        {new Date(lineage.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Records Processed</p>
                      <p className="text-gray-900">{lineage.recordsProcessed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Governance Policies Tab */}
        {activeTab === "policies" && (
          <div>
            <div className="mb-8">
              <Button variant="primary" className="w-full md:w-auto">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  Create Policy
                </span>
              </Button>
            </div>

            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{policy.name}</h3>
                      <p className="text-gray-600 text-sm">{policy.description}</p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        policy.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {policy.status === "active" ? "Active" : "Under Review"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Created: {new Date(policy.createdDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="text-sm">
                        Edit
                      </Button>
                      <Button variant="primary" className="text-sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGovernancePage;
