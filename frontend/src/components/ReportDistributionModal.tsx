import React, { useState } from "react";
import { useAppDispatch } from "../hooks/useRedux";
import { addDistribution } from "../store/slices/reportingSlice";

export interface ReportDistributionModalProps {
  reportId: string;
  reportName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface Recipient {
  email: string;
  department: string;
}

const ReportDistributionModal: React.FC<ReportDistributionModalProps> = ({
  reportId,
  reportName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentDept, setCurrentDept] = useState("");
  const [distributionMethod, setDistributionMethod] = useState<
    "email" | "link"
  >("email");
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">(
    "immediate",
  );
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [allowComments, setAllowComments] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [distributing, setDistributing] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddRecipient = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentEmail) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(currentEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!currentDept) {
      newErrors.department = "Department is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const recipient: Recipient = {
      email: currentEmail,
      department: currentDept,
    };

    // Check for duplicates
    if (recipients.some((r) => r.email === currentEmail)) {
      setErrors({ email: "This email is already added" });
      return;
    }

    setRecipients([...recipients, recipient]);
    setCurrentEmail("");
    setCurrentDept("");
    setErrors({});
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleDistribute = async () => {
    if (recipients.length === 0) {
      setErrors({ recipients: "Add at least one recipient" });
      return;
    }

    setDistributing(true);

    // Simulate distribution process
    for (const recipient of recipients) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const distribution = {
        id: `dist_${Date.now()}_${Math.random()}`,
        reportId,
        recipientEmail: recipient.email,
        sentDate: new Date().toISOString().split("T")[0],
        status: "sent" as const,
        accessCount: 0,
      };

      dispatch(addDistribution(distribution));
    }

    setDistributing(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-bold">Distribute Report</h2>
            <p className="text-sm opacity-90 mt-1">{reportName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Distribution Method */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Distribution Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                style={{
                  borderColor:
                    distributionMethod === "email" ? "#059669" : undefined,
                  backgroundColor:
                    distributionMethod === "email" ? "#d1fae5" : undefined,
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={distributionMethod === "email"}
                  onChange={(e) => setDistributionMethod(e.target.value as 'email' | 'link')}
                  className="w-4 h-4 accent-emerald-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">Send to recipients</p>
                </div>
              </label>

              <label
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                style={{
                  borderColor:
                    distributionMethod === "link" ? "#059669" : undefined,
                  backgroundColor:
                    distributionMethod === "link" ? "#d1fae5" : undefined,
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value="link"
                  checked={distributionMethod === "link"}
                  onChange={(e) => setDistributionMethod(e.target.value as 'email' | 'link')}
                  className="w-4 h-4 accent-emerald-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Shareable Link</p>
                  <p className="text-sm text-gray-600">Public access URL</p>
                </div>
              </label>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <label
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                style={{
                  borderColor:
                    scheduleType === "immediate" ? "#059669" : undefined,
                  backgroundColor:
                    scheduleType === "immediate" ? "#d1fae5" : undefined,
                }}
              >
                <input
                  type="radio"
                  name="schedule"
                  value="immediate"
                  checked={scheduleType === "immediate"}
                  onChange={(e) => setScheduleType(e.target.value as 'immediate' | 'scheduled')}
                  className="w-4 h-4 accent-emerald-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Immediate</p>
                  <p className="text-sm text-gray-600">Send now</p>
                </div>
              </label>

              <label
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                style={{
                  borderColor:
                    scheduleType === "scheduled" ? "#059669" : undefined,
                  backgroundColor:
                    scheduleType === "scheduled" ? "#d1fae5" : undefined,
                }}
              >
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  checked={scheduleType === "scheduled"}
                  onChange={(e) => setScheduleType(e.target.value as 'immediate' | 'scheduled')}
                  className="w-4 h-4 accent-emerald-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Scheduled</p>
                  <p className="text-sm text-gray-600">Choose date/time</p>
                </div>
              </label>
            </div>
          </div>

          {/* Options */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Options</h3>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={includeEvidence}
                onChange={(e) => setIncludeEvidence(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Include Evidence</p>
                <p className="text-sm text-gray-600">
                  Attach supporting documents
                </p>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Allow Comments</p>
                <p className="text-sm text-gray-600">
                  Recipients can provide feedback
                </p>
              </div>
            </label>
          </div>

          {/* Recipients */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recipients</h3>

            {/* Add Recipient Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="recipient@institution.edu"
                    value={currentEmail}
                    onChange={(e) => {
                      setCurrentEmail(e.target.value);
                      setErrors({ ...errors, email: "" });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={currentDept}
                    onChange={(e) => {
                      setCurrentDept(e.target.value);
                      setErrors({ ...errors, department: "" });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="">Select Department</option>
                    <option value="admin">Administration</option>
                    <option value="academic">Academic Affairs</option>
                    <option value="finance">Finance</option>
                    <option value="student">Student Services</option>
                    <option value="research">Research</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddRecipient}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Recipient
              </button>
            </div>

            {/* Recipients List */}
            {recipients.length > 0 && (
              <div className="space-y-2">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {recipient.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {recipient.department}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ))}

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 font-medium">
                    Distribution Summary
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <span className="font-semibold">{recipients.length}</span>{" "}
                    recipient{recipients.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>
            )}

            {errors.recipients && (
              <p className="text-red-600 text-sm mt-2">{errors.recipients}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 px-8 py-6 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDistribute}
            disabled={distributing || recipients.length === 0}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {distributing ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">
                  hourglass_bottom
                </span>
                Distributing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Distribute ({recipients.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDistributionModal;
