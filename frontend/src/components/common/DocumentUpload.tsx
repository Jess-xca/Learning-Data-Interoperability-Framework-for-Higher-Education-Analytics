import { useRef } from "react";
import {
  useDocumentUpload,
  type UploadedDocument,
} from "../../hooks/useDocumentUpload";

interface DocumentUploadProps {
  userId: string;
  category?: UploadedDocument["category"];
  maxFiles?: number;
  allowedTypes?: string[];
  onUploadSuccess?: (doc: UploadedDocument) => void;
  showLabel?: boolean;
  title?: string;
  description?: string;
}

export default function DocumentUpload({
  userId,
  category,
  maxFiles = 5,
  allowedTypes = [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ],
  onUploadSuccess,
  showLabel = true,
  title = "Upload Document",
  description,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    documents,
    uploadDocument,
    deleteDocument,
    getDocuments,
    uploadError,
    isUploading,
    formatFileSize,
  } = useDocumentUpload(userId);

  const filteredDocs = category ? getDocuments(category) : documents;
  const canUploadMore = filteredDocs.length < maxFiles;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploaded = await uploadDocument(file, category);
      if (uploaded) {
        onUploadSuccess?.(uploaded);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleClickUpload = () => {
    if (canUploadMore) {
      fileInputRef.current?.click();
    }
  };

  const getIconForFileType = (type: string): string => {
    if (type.includes("pdf")) return "picture_as_pdf";
    if (type.includes("image")) return "image";
    if (
      type.includes("word") ||
      type.includes("document") ||
      type.includes("wordprocessingml")
    )
      return "description";
    if (
      type.includes("sheet") ||
      type.includes("spreadsheet") ||
      type.includes("spreadsheetml")
    )
      return "table_chart";
    return "attach_file";
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            {title}
          </label>
          {description && (
            <p className="text-xs text-on-surface-variant">{description}</p>
          )}
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <button
          type="button"
          onClick={handleClickUpload}
          disabled={isUploading}
          className="w-full px-4 py-8 border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-outline text-3xl">
            {isUploading ? "hourglass_empty" : "file_upload"}
          </span>
          <div className="text-center">
            <p className="font-medium text-on-surface">
              {isUploading ? "Uploading..." : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {maxFiles - filteredDocs.length} of {maxFiles} files allowed
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={allowedTypes.join(",")}
        disabled={isUploading}
        className="hidden"
      />

      {/* Error Message */}
      {uploadError && (
        <div className="px-4 py-3 rounded-lg bg-error-container border border-error">
          <p className="text-sm text-on-error-container">{uploadError}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {filteredDocs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Uploaded Files ({filteredDocs.length})
          </p>
          <div className="space-y-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="material-symbols-outlined text-outline-variant flex-shrink-0">
                    {getIconForFileType(doc.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {formatFileSize(doc.size)} •{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDocument(doc.id)}
                  className="ml-3 p-2 hover:bg-error-container rounded-lg transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-error text-lg">
                    delete
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
