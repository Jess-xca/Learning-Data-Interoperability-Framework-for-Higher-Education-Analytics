import { useState, useCallback } from "react";

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  base64: string;
  category?: "profile" | "institution" | "id" | "certificate" | "other";
}

const STORAGE_KEY_PREFIX = "ac_docs_";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function useDocumentUpload(userId: string) {
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;

  /**
   * Convert file to base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Upload a file and store metadata
   */
  const uploadDocument = useCallback(
    async (
      file: File,
      category?: UploadedDocument["category"]
    ): Promise<UploadedDocument | null> => {
      setUploadError(null);
      setIsUploading(true);

      try {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
        }

        // Convert to base64
        const base64 = await fileToBase64(file);

        // Create document object
        const newDoc: UploadedDocument = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          base64,
          category,
        };

        // Update state and localStorage
        const updatedDocs = [...documents, newDoc];
        setDocuments(updatedDocs);
        localStorage.setItem(storageKey, JSON.stringify(updatedDocs));

        setIsUploading(false);
        return newDoc;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to upload document";
        setUploadError(message);
        setIsUploading(false);
        return null;
      }
    },
    [documents, storageKey]
  );

  /**
   * Delete a document by ID
   */
  const deleteDocument = useCallback(
    (docId: string) => {
      const updatedDocs = documents.filter((doc) => doc.id !== docId);
      setDocuments(updatedDocs);
      localStorage.setItem(storageKey, JSON.stringify(updatedDocs));
    },
    [documents, storageKey]
  );

  /**
   * Get all documents or filter by category
   */
  const getDocuments = useCallback(
    (category?: UploadedDocument["category"]): UploadedDocument[] => {
      if (!category) return documents;
      return documents.filter((doc) => doc.category === category);
    },
    [documents]
  );

  /**
   * Clear all documents for user
   */
  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return {
    documents,
    uploadDocument,
    deleteDocument,
    getDocuments,
    clearAllDocuments,
    uploadError,
    isUploading,
    formatFileSize,
  };
}
