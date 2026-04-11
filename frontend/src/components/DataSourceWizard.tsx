/**
 * Data Source Connection Wizard
 * Multi-step wizard for configuring new data source connections
 */

import { useState } from "react";
import { Card } from "./common";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import type { DataSourceType } from "../types/datasources";

interface StepProps {
  onContinue: (data: WizardData) => void;
  onBack: () => void;
  data: WizardData;
}

interface WizardData {
  sourceType?: DataSourceType;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  organization?: string;
  contactEmail?: string;
  fieldMapping?: Record<string, string>;
}

export default function DataSourceWizard({
  onComplete,
  onCancel,
}: {
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSourceTypeSelect = (sourceType: DataSourceType) => {
    setData({ ...data, sourceType });
    setStep(2);
  };

  const handleCredentialsSubmit = (credentials: WizardData) => {
    setData({ ...data, ...credentials });
    setStep(3);
  };

  const handleMappingSubmit = (mapping: WizardData) => {
    setData({ ...data, ...mapping });
    setStep(4);
  };

  const handleTestConnection = async () => {
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTestResult({ success: true, message: "Connection successful!" });
    setStep(5);
  };

  const handleConfirm = () => {
    onComplete(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Add Data Source</h2>
          <p className="text-blue-100 mt-1">Step {step} of 5</p>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? "bg-white" : "bg-blue-400/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && <Step1SelectType onContinue={handleSourceTypeSelect} />}
          {step === 2 && (
            <Step2Credentials
              sourceType={data.sourceType!}
              onContinue={handleCredentialsSubmit}
              onBack={() => setStep(1)}
              data={data}
            />
          )}
          {step === 3 && (
            <Step3Mapping
              onContinue={handleMappingSubmit}
              onBack={() => setStep(2)}
              data={data}
            />
          )}
          {step === 4 && (
            <Step4TestConnection
              onContinue={handleTestConnection}
              onBack={() => setStep(3)}
              testResult={testResult}
              loading={false}
            />
          )}
          {step === 5 && (
            <Step5Review
              onConfirm={handleConfirm}
              onBack={() => setStep(4)}
              data={data}
              onCancel={onCancel}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex justify-between gap-4 bg-slate-50">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-slate-700 font-semibold hover:bg-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
}

function Step1SelectType({ onContinue }: { onContinue: (type: DataSourceType) => void }) {
  const sources = [
    { type: "mock" as DataSourceType, name: "Mock LMS", desc: "For Development/Testing" },
    { type: "moodle" as DataSourceType, name: "Moodle LMS", desc: "Open-source LMS" },
    { type: "canvas" as DataSourceType, name: "Canvas LMS", desc: "Instructure Canvas" },
    { type: "blackboard" as DataSourceType, name: "Blackboard Learn", desc: "Blackboard LMS" },
    { type: "sis" as DataSourceType, name: "SIS", desc: "Student Information System" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-700 mb-6">Select Data Source Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source) => (
          <button
            key={source.type}
            onClick={() => onContinue(source.type)}
            className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <h4 className="font-bold text-slate-700 text-lg group-hover:text-blue-600">{source.name}</h4>
            <p className="text-sm text-slate-500 mt-2">{source.desc}</p>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mt-4 float-right transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2Credentials({
  sourceType: _sourceType, // eslint-disable-line @typescript-eslint/no-unused-vars
  onContinue,
  onBack,
  data,
}: StepProps & { sourceType: DataSourceType }) {
  const [form, setForm] = useState(data);

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-700 mb-6">Connection Credentials</h3>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Main Campus Moodle"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Base URL</label>
          <input
            type="url"
            value={form.url || ""}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://lms.university.edu"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Username/Email</label>
          <input
            type="text"
            value={form.username || ""}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="admin@university.edu"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password/API Key</label>
          <input
            type="password"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password or API key"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Organization</label>
          <input
            type="text"
            value={form.organization || ""}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            placeholder="University of Advanced Systems"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email</label>
          <input
            type="email"
            value={form.contactEmail || ""}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            placeholder="admin@university.edu"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onContinue(form)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 ml-auto"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step3Mapping({ onContinue, onBack, data }: StepProps) {

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">Field Mapping</h3>
      <p className="text-sm text-slate-600 mb-6">Map LMS fields to standard format</p>
      <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">LMS User Email Field</label>
            <input
              type="text"
              defaultValue="email"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Standard Field</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm">
              <option>user_email</option>
            </select>
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center py-4">
          ℹ️ Default mappings will be created automatically. Customize as needed.
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onContinue(data)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 ml-auto"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step4TestConnection({
  onContinue,
  onBack,
  testResult,
}: {
  onContinue: () => void;
  onBack: () => void;
  testResult: { success: boolean; message: string } | null;
  loading: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    onContinue();
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-700 mb-6">Test Connection</h3>
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
        <p className="text-slate-700 mb-4">Verify that the connection credentials are correct</p>
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Testing..." : "Test Connection"}
        </button>

        {testResult && (
          <div
            className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
              testResult.success ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"
            }`}
          >
            <CheckCircle2 className={`w-5 h-5 ${testResult.success ? "text-green-600" : "text-red-600"}`} />
            <p className={`text-sm font-semibold ${testResult.success ? "text-green-700" : "text-red-700"}`}>
              {testResult.message}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!testResult?.success}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step5Review({
  onConfirm,
  onBack,
  data,
  onCancel,
}: {
  onConfirm: () => void;
  onBack: () => void;
  data: WizardData;
  onCancel: () => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-700 mb-6">Confirm Configuration</h3>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Name</p>
            <p className="text-lg font-semibold text-slate-800">{data.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Type</p>
            <p className="text-lg font-semibold text-slate-800 capitalize">{data.sourceType}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">URL</p>
            <p className="text-sm text-slate-800 break-all">{data.url}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Organization</p>
            <p className="text-sm text-slate-800">{data.organization}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm & Add Source
          </button>
        </div>
      </div>
    </div>
  );
}
