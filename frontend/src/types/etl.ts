/**
 * ETL Pipeline Types
 * Defines interfaces for ETL operations, transformations, and validations
 */

export type PipelineStageType = "extract" | "validate" | "transform" | "load" | "notify";
export type RecordStatus = "valid" | "invalid" | "transformed" | "loaded" | "error";
export type PipelineStatus = "active" | "paused" | "error" | "completed" | "running";

export interface PipelineMetrics {
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  recordsSkipped: number;
  executionTime: number; // milliseconds
  startTime: Date;
  endTime?: Date;
  validationErrorCount: number;
  transformationErrorCount: number;
}

export interface ValidationRule {
  id: string;
  field: string;
  type: "required" | "type" | "format" | "unique" | "range" | "custom";
  config: {
    dataType?: "string" | "number" | "date" | "boolean";
    formatPattern?: string;
    min?: number;
    max?: number;
    allowedValues?: unknown[];
    customFunction?: string;
  };
  errorMessage: string;
  criticalLevel: "error" | "warning";
}

export interface TransformationRule {
  id: string;
  sourceField: string;
  targetField: string;
  operation: "direct" | "concat" | "split" | "format" | "lookup" | "custom";
  config: {
    delimiter?: string;
    formatTemplate?: string;
    lookupMap?: Record<string, string>;
    customFunction?: string;
    conditionalRules?: TransformationCondition[];
  };
}

export interface TransformationCondition {
  field: string;
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "regex" | "greaterThan" | "lessThan";
  value: unknown;
  targetTransformation?: Partial<TransformationRule>;
}

export interface PipelineStage {
  id: string;
  type: PipelineStageType;
  name: string;
  enabled: boolean;
  config: {
    validationRules?: ValidationRule[];
    transformationRules?: TransformationRule[];
    loadTarget?: string;
    batchSize?: number;
    errorHandling?: "skip" | "fail" | "retry";
    retryAttempts?: number;
  };
  order: number;
}

export interface ETLPipeline {
  id: string;
  name: string;
  description?: string;
  dataSourceId: string;
  standards: ("ims_global" | "xapi" | "caliper")[];
  stages: PipelineStage[];
  schedule?: string; // Cron expression
  status: PipelineStatus;
  lastExecution?: Date;
  nextExecution?: Date;
  metrics?: PipelineMetrics;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecordValidationResult {
  recordId: string;
  isValid: boolean;
  violations: ValidationViolation[];
  score: number; // 0-100, quality score
}

export interface ValidationViolation {
  field: string;
  ruleId: string;
  message: string;
  severity: "error" | "warning";
  value: unknown;
  expected: unknown;
}

export interface TransformedRecord {
  recordId: string;
  sourceFormat: unknown;
  targetFormat: unknown;
  standards: {
    imsGlobal?: unknown;
    xapi?: unknown;
    caliper?: unknown;
  };
  transformationErrors?: string[];
}

export interface StudentIdentityMatch {
  matchScore: number; // 0-100
  matchType: "exact_email" | "exact_id" | "name_dob" | "fuzzy_name" | "weak_match";
  matchedRecords: {
    sourceId: string;
    targetId: string;
    confidence: number;
  }[];
  suggestedMergeCandidate?: string;
}

export interface ETLExecutionLog {
  pipelineId: string;
  executionId: string;
  startTime: Date;
  endTime?: Date;
  status: PipelineStatus;
  metrics: PipelineMetrics;
  recordsFailed: {
    recordId: string;
    error: string;
    stage: PipelineStageType;
  }[];
  warnings: string[];
}
