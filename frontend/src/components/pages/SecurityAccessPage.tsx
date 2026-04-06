import React, { useState } from "react";
import { MainContent } from "../layout";
import Button from "../forms/Button";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  createdDate: string;
  status: "active" | "inactive";
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "failed";
}

export interface EncryptionStatus {
  name: string;
  status: "active" | "pending" | "failed";
  coverage: number;
}

const SecurityAccessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rbac" | "audit" | "encryption">(
    "rbac",
  );
  const [auditFilter, setAuditFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">(
    "week",
  );

  const roles: Role[] = [
    {
      id: "role_1",
      name: "Admin",
      description: "Full system access",
      permissions: [
        "view_all_data",
        "edit_all_data",
        "delete_data",
        "manage_users",
        "manage_roles",
        "view_audit_logs",
      ],
      usersCount: 3,
      createdDate: "2025-01-01",
      status: "active",
    },
    {
      id: "role_2",
      name: "QA Officer",
      description: "Quality assurance operations",
      permissions: [
        "view_all_data",
        "edit_quality_data",
        "generate_reports",
        "view_audit_logs",
      ],
      usersCount: 5,
      createdDate: "2025-06-15",
      status: "active",
    },
    {
      id: "role_3",
      name: "Analyst",
      description: "Data analysis and reporting",
      permissions: ["view_own_data", "generate_reports", "export_data"],
      usersCount: 12,
      createdDate: "2025-08-01",
      status: "active",
    },
    {
      id: "role_4",
      name: "Data Entry",
      description: "Data entry operations",
      permissions: ["view_own_data", "edit_own_data"],
      usersCount: 25,
      createdDate: "2025-09-20",
      status: "active",
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "log_1",
      user: "john.smith@institution.edu",
      action: "LOGIN",
      resource: "System",
      timestamp: "2026-04-06T15:30:00",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "log_2",
      user: "sarah.johnson@institution.edu",
      action: "DATA_EXPORT",
      resource: "Student Records",
      timestamp: "2026-04-06T14:15:00",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: "log_3",
      user: "michael.chen@institution.edu",
      action: "DATA_MODIFICATION",
      resource: "Academic Records",
      timestamp: "2026-04-06T13:45:00",
      ipAddress: "192.168.1.102",
      status: "success",
    },
    {
      id: "log_4",
      user: "emily.davis@institution.edu",
      action: "FAILED_LOGIN",
      resource: "System",
      timestamp: "2026-04-06T12:20:00",
      ipAddress: "192.168.1.103",
      status: "failed",
    },
    {
      id: "log_5",
      user: "john.smith@institution.edu",
      action: "DATA_ACCESS",
      resource: "Finance Records",
      timestamp: "2026-04-06T11:10:00",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "log_6",
      user: "admin@institution.edu",
      action: "USER_CREATED",
      resource: "User Management",
      timestamp: "2026-04-06T10:00:00",
      ipAddress: "192.168.1.150",
      status: "success",
    },
  ];

  const encryptionStatus = {
    dataAtRest: {
      status: "enabled",
      algorithm: "AES-256",
      keyRotation: "2026-04-15",
      coverage: "100%",
    },
    dataInTransit: {
      status: "enabled",
      protocol: "TLS 1.3",
      certExpiry: "2027-06-30",
      coverage: "100%",
    },
    fieldLevel: {
      status: "enabled",
      encryptedFields: 45,
      totalFields: 120,
    },
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <MainContent>
      {/* Main Content */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">Security & Access Control</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Manage roles, audit logs, and data encryption
        </p>
      </div>

      <div className="flex-1 px-10 pb-10 max-w-7xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "rbac"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">
                admin_panel_settings
              </span>
              Role-Based Access
            </span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "audit"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">fact_check</span>
              Audit Logs
            </span>
          </button>

          <button
            onClick={() => setActiveTab("encryption")}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === "encryption"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">lock</span>
              Data Encryption
            </span>
          </button>
        </div>

        {/* RBAC Tab */}
        {activeTab === "rbac" && (
          <div>
            <div className="mb-8">
              <Button variant="primary" className="w-full md:w-auto">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  Create Role
                </span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
                <p className="text-sm text-gray-600 mb-1">Total Roles</p>
                <p className="text-3xl font-bold">{roles.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
                <p className="text-sm text-gray-600 mb-1">Active Roles</p>
                <p className="text-3xl font-bold">
                  {roles.filter((r) => r.status === "active").length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold">
                  {roles.reduce((sum, r) => sum + r.usersCount, 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-600">
                <p className="text-sm text-gray-600 mb-1">Avg Permissions</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    roles.reduce((sum, r) => sum + r.permissions.length, 0) /
                      roles.length,
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {role.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {role.description}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Permissions ({role.permissions.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">
                      {role.usersCount} user{role.usersCount !== 1 ? "s" : ""} •
                      Created {new Date(role.createdDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="text-sm">
                        Edit
                      </Button>
                      <Button variant="primary" className="text-sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === "audit" && (
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Action
                  </label>
                  <select
                    value={auditFilter}
                    onChange={(e) => setAuditFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/30"
                  >
                    <option value="all">All Actions</option>
                    <option value="LOGIN">Login</option>
                    <option value="DATA_ACCESS">Data Access</option>
                    <option value="DATA_MODIFICATION">Data Modification</option>
                    <option value="DATA_EXPORT">Data Export</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as 'today' | 'week' | 'month')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/30"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button variant="primary" className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">
                        download
                      </span>
                      Export Report
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                            log.status,
                          )}`}
                        >
                          {log.status === "success" ? "✓ Success" : "✕ Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Encryption Tab */}
        {activeTab === "encryption" && (
          <div>
            {/* Data at Rest */}
            <div className="bg-white rounded-lg shadow-sm p-6 border mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data at Rest
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Encryption for stored data
                  </p>
                </div>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  Enabled
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Algorithm</p>
                  <p className="text-lg font-bold text-gray-900">
                    {encryptionStatus.dataAtRest.algorithm}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Key Rotation
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(
                      encryptionStatus.dataAtRest.keyRotation,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Coverage</p>
                  <p className="text-lg font-bold text-gray-900">
                    {encryptionStatus.dataAtRest.coverage}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </div>
            </div>

            {/* Data in Transit */}
            <div className="bg-white rounded-lg shadow-sm p-6 border mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data in Transit
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Encryption for data transmission
                  </p>
                </div>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  Enabled
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Protocol</p>
                  <p className="text-lg font-bold text-gray-900">
                    {encryptionStatus.dataInTransit.protocol}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Certificate Expiry
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(
                      encryptionStatus.dataInTransit.certExpiry,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Coverage</p>
                  <p className="text-lg font-bold text-gray-900">
                    {encryptionStatus.dataInTransit.coverage}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </div>
            </div>

            {/* Field Level Encryption */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Field-Level Encryption
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Encryption of sensitive fields
                  </p>
                </div>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  Enabled
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Field Coverage
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {encryptionStatus.fieldLevel.encryptedFields} of{" "}
                    {encryptionStatus.fieldLevel.totalFields} fields
                  </p>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full"
                    style={{
                      width: `${
                        (encryptionStatus.fieldLevel.encryptedFields /
                          encryptionStatus.fieldLevel.totalFields) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600">
                All sensitive fields including Student ID, SSN, and Financial
                Information are encrypted with AES-256 encryption.
              </p>
            </div>
          </div>
        )}      </div>    </MainContent>
  );
};

export default SecurityAccessPage;
