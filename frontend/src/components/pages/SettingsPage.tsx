import { useState } from "react";
import { MainContent, Card, Button, TextInput, Badge } from "..";
import { useAppSelector } from "../../hooks/useRedux";
import { useRoleGuard } from "../../hooks/useRoleGuard";

interface Setting {
  id: string;
  category: string;
  name: string;
  value: string | boolean;
  type: "text" | "toggle" | "select";
  description: string;
  options?: { label: string; value: string }[];
}

const initialSettings: Setting[] = [
  {
    id: "S001",
    category: "General",
    name: "Institution Name",
    value: "Academic Excellence University",
    type: "text",
    description: "Official name of the institution",
  },
  {
    id: "S002",
    category: "General",
    name: "Institution Code",
    value: "AEXU-001",
    type: "text",
    description: "Unique institutional identifier",
  },
  {
    id: "S003",
    category: "Security",
    name: "Two-Factor Authentication",
    value: true,
    type: "toggle",
    description: "Require 2FA for all user accounts",
  },
  {
    id: "S004",
    category: "Security",
    name: "Password Policy",
    value: "strong",
    type: "select",
    description: "Minimum password complexity requirement",
    options: [
      { label: "Basic", value: "basic" },
      { label: "Standard", value: "standard" },
      { label: "Strong", value: "strong" },
    ],
  },
  {
    id: "S005",
    category: "Notifications",
    name: "Email Notifications",
    value: true,
    type: "toggle",
    description: "Enable email alerts for system events",
  },
  {
    id: "S006",
    category: "Notifications",
    name: "Daily Digest",
    value: true,
    type: "toggle",
    description: "Send daily summary email",
  },
  {
    id: "S007",
    category: "Data",
    name: "Backup Frequency",
    value: "daily",
    type: "select",
    description: "How often to backup the database",
    options: [
      { label: "Hourly", value: "hourly" },
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
    ],
  },
  {
    id: "S008",
    category: "Data",
    name: "Data Retention",
    value: "7years",
    type: "select",
    description: "How long to retain historical data",
    options: [
      { label: "3 Years", value: "3years" },
      { label: "5 Years", value: "5years" },
      { label: "7 Years", value: "7years" },
      { label: "Indefinite", value: "indefinite" },
    ],
  },
];

export default function SettingsPage() {
  // Role guard - admin, lecturer, student can access
  useRoleGuard(["admin", "lecturer", "student"]);
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  const [systemSettings, setSystemSettings] =
    useState<Setting[]>(initialSettings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | boolean>("");

  // Filter settings based on role
  let visibleSettings = systemSettings;
  if (userRole === "lecturer" || userRole === "student") {
    // Only show notification settings for non-admin users
    visibleSettings = systemSettings.filter((s) =>
      ["Notifications"].includes(s.category),
    );
  }

  const categories = Array.from(
    new Set(visibleSettings.map((s) => s.category)),
  );

  const handleEdit = (setting: Setting) => {
    setEditingId(setting.id);
    setTempValue(setting.value);
  };

  const handleSave = (id: string) => {
    setSystemSettings(
      systemSettings.map((s) => (s.id === id ? { ...s, value: tempValue } : s)),
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempValue("");
  };

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[2.75rem] font-black text-primary leading-tight tracking-tight">
            Settings
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Configure system preferences and institutional settings.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
          <span className="material-symbols-outlined text-sm">save</span>
          Save All Changes
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySettings = visibleSettings.filter(
            (s) => s.category === category,
          );
          return (
            <Card key={category} className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">
                {category}
              </h2>
              <div className="space-y-4">
                {categorySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface mb-1">
                        {setting.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        {setting.description}
                      </p>
                    </div>

                    {editingId === setting.id ? (
                      <div className="ml-4 flex items-center gap-2">
                        {setting.type === "toggle" ? (
                          <button
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                              tempValue ? "bg-primary" : "bg-outline-variant/30"
                            }`}
                            onClick={() => setTempValue(!tempValue)}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                                tempValue ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        ) : setting.type === "select" ? (
                          <select
                            value={String(tempValue)}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="px-3 py-2 border border-outline-variant rounded-lg text-on-surface text-sm"
                          >
                            {setting.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <TextInput
                            value={String(tempValue)}
                            onChange={(e) => setTempValue(e.target.value)}
                          />
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave(setting.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="ml-4 flex items-center gap-3">
                        {setting.type === "toggle" ? (
                          <div
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition pointer-events-none ${
                              setting.value
                                ? "bg-primary"
                                : "bg-outline-variant/30"
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                                setting.value
                                  ? "translate-x-7"
                                  : "translate-x-1"
                              }`}
                            />
                          </div>
                        ) : (
                          <Badge variant="primary">
                            {String(setting.value)}
                          </Badge>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(setting)}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <Button variant="primary" size="md">
          <span className="material-symbols-outlined">save</span>
          Save All Changes
        </Button>
        <Button variant="secondary" size="md">
          <span className="material-symbols-outlined">refresh</span>
          Reset to Defaults
        </Button>
        <Button variant="ghost" size="md">
          <span className="material-symbols-outlined">download</span>
          Export Settings
        </Button>
      </div>
    </MainContent>
  );
}
