import React, { useState } from "react";
import { useAppDispatch } from "../hooks/useRedux";
import { addEvidence } from "../store/slices/accreditationSlice";
import type { Evidence } from "../store/slices/accreditationSlice";
import Button from "./forms/Button";

interface EvidenceCollectionModalProps {
  standardId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const EvidenceCollectionModal: React.FC<EvidenceCollectionModalProps> = ({
  standardId,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "document" as const,
    documentName: "",
  });

  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Array<{ value: Evidence["category"]; label: string }> = [
    { value: "document", label: "Document" },
    { value: "report", label: "Report" },
    { value: "audit", label: "Audit Evidence" },
    { value: "assessment", label: "Assessment" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      setFormData((prev) => ({ ...prev, documentName: file.name }));
      if (errors.documentName) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.documentName;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!fileName) {
      newErrors.documentName = "Please select a file to upload";
    }

    if (fileSize > 52428800) {
      // 50MB limit
      newErrors.file = "File size must be less than 50MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newEvidence: Evidence = {
        id: `ev_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        standardId: standardId || "",
        documentName: formData.documentName,
        documentPath: `/documents/evidence/${formData.documentName}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Current User", // TODO: Replace with actual user from auth
        category: formData.category,
        status: "pending",
      };

      dispatch(addEvidence(newEvidence));

      // Reset form
      setFormData({ title: "", description: "", category: "document", documentName: "" });
      setFileName("");
      setFileSize(0);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      setErrors({ submit: `Failed to upload evidence: ${error}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Upload Evidence</h2>
            <p className="text-sm opacity-90 mt-1">
              Add compliance documentation for HEC accreditation
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Learning Outcomes Assessment Report 2026"
              className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-500/30"
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Document Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the contents and relevance of this evidence..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-400 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-500/30"
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Select File *
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png"
                disabled={isSubmitting}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                  errors.documentName
                    ? "border-red-400 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {fileName ? fileName : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-600">
                      PDF, DOC, XLSX, PPT, PNG, JPG (Max 50MB)
                    </p>
                  </div>
                </div>
              </label>
              {errors.documentName && (
                <p className="text-red-600 text-sm mt-1">{errors.documentName}</p>
              )}
              {fileSize > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  File size: {(fileSize / 1024 / 1024).toFixed(2)}MB
                </p>
              )}
            </div>
          </div>

          {/* Error Summary */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-600 flex-shrink-0">
                info
              </span>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Upload Guidelines</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Ensure documents are clear and legible</li>
                  <li>Include metadata (dates, signatures, etc.)</li>
                  <li>All documents must support assigned standards</li>
                  <li>Uploaded files will be reviewed before approval</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Evidence"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenceCollectionModal;
