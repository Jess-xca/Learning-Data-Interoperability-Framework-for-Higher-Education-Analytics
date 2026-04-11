/**
 * Data Source Types
 * Defines interfaces for data source connections, status tracking, and operations
 */

export type DataSourceType = "moodle" | "canvas" | "blackboard" | "sis" | "mock";
export type ConnectionStatus = "connected" | "error" | "disconnected" | "testing";
export type SyncFrequency = "manual" | "hourly" | "daily" | "weekly";

export interface EncryptedCredentials {
  apiKey?: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  bearerToken?: string;
}

export interface DataSourceRecordCounts {
  students: number;
  courses: number;
  enrollments: number;
  assessments?: number;
  activities?: number;
}

export interface DataSourceSync {
  id: string;
  sourceId: string;
  startTime: Date;
  endTime?: Date;
  status: "pending" | "running" | "completed" | "failed";
  recordsProcessed: number;
  recordsFailed: number;
  errorMessage?: string;
  dataHash?: string; // For detecting changes
}

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  description?: string;
  url: string;
  credentials: EncryptedCredentials;
  status: ConnectionStatus;
  lastSync?: Date;
  nextSync?: Date;
  syncFrequency: SyncFrequency;
  recordCounts: DataSourceRecordCounts;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  organization?: string;
  contactEmail?: string;
}

export interface DataSourceConnection {
  sourceId: string;
  isHealthy: boolean;
  credentialsValid: boolean;
  credentialExpiresAt?: Date;
  lastCheckTime: Date;
  errorDetails?: string;
  responseTime?: number; // milliseconds
}

export interface DataSourceTestResult {
  success: boolean;
  message: string;
  recordsRetrieved?: number;
  sampleData?: unknown[];
  errors?: string[];
  executionTime: number;
}

export interface DataSourceOperationResult {
  success: boolean;
  message: string;
  affectedRecords?: number;
  errors?: string[];
  warnings?: string[];
}

// Sync history for analytics
export interface SyncHistory {
  sourceId: string;
  syncs: DataSourceSync[];
  successRate: number; // percentage
  avgSyncTime: number; // milliseconds
  lastSuccessfulSync?: Date;
  consistentErrors?: string[];
}
