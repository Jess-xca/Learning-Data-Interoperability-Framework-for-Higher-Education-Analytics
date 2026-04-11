// Phase 4 Type Extensions and Definitions

export interface PipelineStage {
  id: string;
  type: 'extract' | 'transform' | 'validate' | 'load';
  name: string;
  config: Record<string, any>;
  errorHandling: 'halt' | 'skip' | 'accumulate';
  enabled: boolean;
}

export interface ETLPipeline {
  id: string;
  name: string;
  description: string;
  dataSourceId: string;
  stages: PipelineStage[];
  schedule: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual';
    cronExpression?: string;
  };
  status: 'active' | 'paused' | 'archived' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineExecution {
  id: string;
  pipelineId: string;
  dataSourceId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'success' | 'failed' | 'partial' | 'cancelled';
  metrics: {
    recordsExtracted: number;
    recordsTransformed: number;
    recordsValidated: number;
    recordsLoaded: number;
    recordsFailed: number;
    duration: number;
  };
  errors: PipelineError[];
}

export interface PipelineError {
  id: string;
  executionId: string;
  stage: string;
  recordId: string;
  code: string;
  message: string;
  timestamp: Date;
  retry: {
    count: number;
    nextRetryAt?: Date;
    maxRetries: number;
  };
  data?: Record<string, any>;
}

export interface DataRecord {
  id: string;
  sourceId: string;
  timestamp: Date;
  data: Record<string, any>;
  lineage: {
    source: string;
    transformations: string[];
    validations: string[];
  };
  quality: {
    score: number;
    issues: QualityIssue[];
  };
}

export interface QualityIssue {
  field: string;
  severity: 'error' | 'warning';
  message: string;
  code?: string;
}

export interface ValidationSchema {
  id: string;
  name: string;
  description: string;
  fields: FieldValidation[];
  customRules?: ValidationRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldValidation {
  fieldName: string;
  required: boolean;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object' | 'email' | 'phone';
  format?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  allowedValues?: any[];
  unique?: boolean;
  errorMessage?: string;
}

export interface ValidationRule {
  name: string;
  condition: string; // for serialization: lambda-like expression
  action: 'warn' | 'error';
  message: string;
}

export interface ValidationResult {
  recordId: string;
  valid: boolean;
  issues: ValidationIssue[];
  qualityScore: number;
  suggestions?: ValidationSuggestion[];
}

export interface ValidationIssue {
  field: string;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface ValidationSuggestion {
  field: string;
  issue: string;
  suggestion: string;
  confidence: number;
}

export interface StudentRecord {
  id: string;
  externalIds: ExternalId[];
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  institution: string;
  sourceRecordIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExternalId {
  system: string;
  value: string;
  type: 'primary' | 'secondary';
  verified: boolean;
}

export interface StudentMatch {
  records: DataRecord[];
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'manual';
  reason: string[];
  unifiedRecord?: StudentRecord;
}

export interface DuplicateReport {
  totalRecords: number;
  potentialDuplicates: StudentMatch[];
  confidence: {
    high: number;
    medium: number;
    low: number;
  };
  timestamp: Date;
}

export interface PipelineMetrics {
  pipelineId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  successRate: number;
  averageRecordsProcessed: number;
  topErrors: Array<{ code: string; count: number }>;
}

export interface TransformationRule {
  id: string;
  name: string;
  type: 'concat' | 'split' | 'format' | 'lookup' | 'custom';
  sourceFields: string[];
  targetField: string;
  config: Record<string, any>;
}

export interface LoadResult {
  recordsLoaded: number;
  recordsFailed: number;
  timestamp: Date;
  errors: Array<{ recordId: string; error: string }>;
}

export interface QualityReport {
  timestamp: Date;
  totalRecords: number;
  recordsWithErrors: number;
  recordsWithWarnings: number;
  averageQualityScore: number;
  byField: Array<{
    field: string;
    errorCount: number;
    warningCount: number;
  }>;
}
