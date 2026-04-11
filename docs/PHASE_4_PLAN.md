# Phase 4: ETL Pipeline Engine (M5 - Data Validation & Processing)

## Overview
Phase 4 implements the core ETL (Extract, Transform, Load) pipeline engine that processes data from integrated sources, validates quality, transforms records, and resolves student identities across systems.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│           ETL Pipeline Manager UI                       │  (React Components)
│  ├─ ETL Dashboard (Overview & History)                 │
│  ├─ Pipeline Designer (Visual Builder)                 │
│  └─ Validation Reports (Data Quality)                  │
├─────────────────────────────────────────────────────────┤
│      Pipeline Orchestration Service                     │  (Workflow Engine)
│  ├─ Pipeline CRUD & Lifecycle                          │
│  ├─ Execution Management                               │
│  └─ Metrics & Reporting                                │
├─────────────────────────────────────────────────────────┤
│  Extract  │  Transform  │  Validate  │  Load            │  (Processing Stages)
│  ├─ Data Extraction  ├─ Rules Engine  ├─ Quality     ├─ Database Load
│  └─ Source Mapping   └─ Mapping       └─ Deduplication
├─────────────────────────────────────────────────────────┤
│     Error Handling, Retry, & Recovery System            │  (Resilience)
│  ├─ Error Logging & Classification                      │
│  ├─ Automatic Retry Logic                               │
│  └─ Dead Letter Queue (DLQ)                             │
└─────────────────────────────────────────────────────────┘
```

---

## M5.1: ETL Service (Core Pipeline)

### File: `frontend/src/services/ETLService.ts`

**Interface Definitions:**

```typescript
// Pipeline Configuration
interface PipelineStage {
  id: string;
  name: "extract" | "transform" | "validate" | "load";
  config: Record<string, any>;
  errorHandling: "halt" | "skip" | "accumulate";
}

interface ETLPipeline {
  id: string;
  name: string;
  description: string;
  dataSourceId: string;
  stages: PipelineStage[];
  schedule: {
    enabled: boolean;
    frequency: "hourly" | "daily" | "weekly" | "monthly" | "manual";
    cronExpression?: string;
  };
  status: "active" | "paused" | "archived" | "error";
  createdAt: Date;
  updatedAt: Date;
}

interface PipelineExecution {
  id: string;
  pipelineId: string;
  startTime: Date;
  endTime?: Date;
  status: "running" | "success" | "failed" | "partial";
  metrics: {
    recordsExtracted: number;
    recordsTransformed: number;
    recordsValidated: number;
    recordsLoaded: number;
    recordsFailed: number;
    duration: number; // milliseconds
  };
  errors: PipelineError[];
}

interface PipelineError {
  id: string;
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

// Data Record (normalized)
interface DataRecord {
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
    score: number; // 0-100
    issues: QualityIssue[];
  };
}

interface QualityIssue {
  field: string;
  severity: "error" | "warning";
  message: string;
}
```

**Core Methods:**

```typescript
class ETLService {
  // Pipeline Management
  createPipeline(config: Omit<ETLPipeline, "id" | "createdAt" | "updatedAt">): Promise<ETLPipeline>
  updatePipeline(pipelineId: string, updates: Partial<ETLPipeline>): Promise<ETLPipeline>
  deletePipeline(pipelineId: string): Promise<void>
  getPipeline(pipelineId: string): Promise<ETLPipeline>
  listPipelines(filters?: { status?: string; dataSourceId?: string }): Promise<ETLPipeline[]>
  
  // Execution Management
  executePipeline(pipelineId: string): Promise<PipelineExecution>
  getExecution(executionId: string): Promise<PipelineExecution>
  listExecutions(pipelineId: string, limit?: number): Promise<PipelineExecution[]>
  cancelExecution(executionId: string): Promise<void>
  
  // Processing Methods
  extract(dataSourceId: string, config: Record<string, any>): Promise<DataRecord[]>
  transform(records: DataRecord[], rules: TransformationRule[]): Promise<DataRecord[]>
  validate(records: DataRecord[], schema: ValidationSchema): Promise<ValidationResult[]>
  load(records: DataRecord[], target: string): Promise<LoadResult>
  
  // Utilities
  retryFailedRecords(executionId: string, recordIds: string[]): Promise<PipelineExecution>
  getMetrics(pipelineId: string, dateRange: DateRange): Promise<PipelineMetrics>
}
```

---

## M5.2: Data Validation Service

### File: `frontend/src/services/DataValidationService.ts`

**Features:**

- Required fields validation
- Data type checking (string, number, date, email, phone, etc.)
- Format validation (regex patterns, special formats)
- Range/length validation
- Constraint checks (unique, foreign key, referential integrity)
- Cross-field validation (dependencies, conditional requirements)
- Data quality scoring (completeness, accuracy, consistency)

**Interface:**

```typescript
interface ValidationSchema {
  id: string;
  name: string;
  fields: FieldValidation[];
  customRules?: ValidationRule[];
}

interface FieldValidation {
  fieldName: string;
  required: boolean;
  dataType: "string" | "number" | "date" | "boolean" | "array" | "object";
  format?: string; // regex or predefined (email, phone, url, etc.)
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  allowedValues?: any[];
  unique?: boolean;
  transform?: TransformFunction;
  errorMessage?: string;
}

interface ValidationRule {
  name: string;
  condition: (record: DataRecord) => boolean;
  action: "warn" | "error";
  message: string;
}

interface ValidationResult {
  recordId: string;
  valid: boolean;
  issues: ValidationIssue[];
  qualityScore: number;
  suggestions?: ValidationSuggestion[];
}

interface ValidationIssue {
  field: string;
  severity: "error" | "warning";
  code: string;
  message: string;
}

interface ValidationSuggestion {
  field: string;
  issue: string;
  suggestion: string;
  confidence: number; // 0-100
}
```

**Core Methods:**

```typescript
class DataValidationService {
  // Schema Management
  createSchema(schema: Omit<ValidationSchema, "id">): Promise<ValidationSchema>
  updateSchema(schemaId: string, updates: Partial<ValidationSchema>): Promise<ValidationSchema>
  getSchema(schemaId: string): Promise<ValidationSchema>
  listSchemas(): Promise<ValidationSchema[]>
  
  // Validation
  validateRecord(record: DataRecord, schema: ValidationSchema): Promise<ValidationResult>
  validateBatch(records: DataRecord[], schema: ValidationSchema): Promise<ValidationResult[]>
  validateField(value: any, validation: FieldValidation): Promise<boolean>
  
  // Quality Scoring
  calculateQualityScore(record: DataRecord, schema: ValidationSchema): Promise<number>
  getQualityReport(records: DataRecord[], schema: ValidationSchema): Promise<QualityReport>
  
  // Utilities
  suggestCorrections(record: DataRecord, issues: ValidationIssue[]): Promise<ValidationSuggestion[]>
  compareSchemas(schemaId1: string, schemaId2: string): Promise<SchemaComparison>
}
```

---

## M5.3: Student Identity Resolution Service

### File: `frontend/src/services/StudentIdentityResolutionService.ts`

**Features:**

- Email-based matching
- Full name + DOB matching (fuzzy)
- Student ID lookup (cross-system mapping)
- Phone + DOB matching
- Multi-system reference consolidation
- Unified student record generation

**Interface:**

```typescript
interface StudentRecord {
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
  createdAt: Date;
  updatedAt: Date;
}

interface ExternalId {
  system: string;
  value: string;
  type: "primary" | "secondary";
  verified: boolean;
}

interface StudentMatch {
  records: DataRecord[];
  confidence: number; // 0-100
  matchType: "exact" | "fuzzy" | "manual";
  reason: string[];
  unifiedRecord?: StudentRecord;
}

interface DuplicateReport {
  totalRecords: number;
  potentialDuplicates: StudentMatch[];
  confidence: {
    high: number; // > 95%
    medium: number; // 80-95%
    low: number; // < 80%
  };
}
```

**Core Methods:**

```typescript
class StudentIdentityResolutionService {
  // Matching Strategies
  matchByEmail(email: string, records: DataRecord[]): Promise<StudentMatch[]>
  matchByNameAndDOB(name: string, dob: Date, records: DataRecord[]): Promise<StudentMatch[]>
  matchByStudentId(studentId: string, records: DataRecord[]): Promise<StudentMatch[]>
  matchByPhone(phone: string, records: DataRecord[]): Promise<StudentMatch[]>
  
  // Batch Processing
  deduplicateRecords(records: DataRecord[], strategy: MatchStrategy[]): Promise<StudentMatch[]>
  createUnifiedRecords(matches: StudentMatch[]): Promise<StudentRecord[]>
  
  // Duplicate Detection
  findDuplicates(records: DataRecord[], threshold?: number): Promise<DuplicateReport>
  mergeRecords(sourceId: string, targetId: string, rules: MergeRule[]): Promise<StudentRecord>
  
  // Cross-System Resolution
  linkExternalIds(studentId: string, externalIds: ExternalId[]): Promise<StudentRecord>
  resolveCrossSystemReferences(records: DataRecord[]): Promise<StudentRecord[]>
  
  // Utilities
  calculateSimilarity(record1: DataRecord, record2: DataRecord): Promise<number>
  getSimilarityBreakdown(record1: DataRecord, record2: DataRecord): Promise<SimilarityScore[]>
}
```

---

## M5.4: ETL Pipeline Dashboard UI

### File: `frontend/src/components/pages/ETLPipelinePage.tsx`

**Sections:**

1. **Pipeline Overview**
   - List of active pipelines with status
   - Last execution status and time
   - Quick stats: success rate, avg. duration, records processed

2. **Execution History**
   - Table of recent executions (sortable, filterable)
   - Status indicators (success/failed/partial/running)
   - Execution duration, records processed, error count
   - Actions: View Details, Retry, Cancel

3. **Pipeline Details (Modal/Tab)**
   - Pipeline configuration
   - Execution history for specific pipeline
   - Performance chart (success rate over time)
   - Error trends
   - Action buttons: Edit, Run Now, Pause, Delete

4. **Error Management**
   - Failed records with error details
   - Retry queue status
   - Error rate by stage
   - Data quality issues summary

---

## M5.5: Pipeline Designer UI

### File: `frontend/src/components/PipelineDesigner/`

**Components:**

1. **PipelineBuilder**
   - Visual stage editor (Extract → Transform → Validate → Load)
   - Drag-and-drop rule builder
   - Stage configuration forms
   - Error handling options per stage

2. **TransformationRuleBuilder**
   - Rule type selection (concat, split, format, lookup, custom)
   - Input/output field mapping
   - Preview with sample data

3. **ValidationRuleBuilder**
   - Field-level validation rules
   - Custom validation expressions
   - Error handling strategy selection

4. **ScheduleBuilder**
   - Frequency selection (hourly, daily, weekly, monthly)
   - Cron expression editor
   - Timezone selection
   - Test schedule preview

---

## Implementation Tasks

### Week 1: Core Services
- [ ] ETLService implementation (pipeline CRUD, execution)
- [ ] DataValidationService (schema management, validation rules)
- [ ] StudentIdentityResolutionService (matching algorithms)
- [ ] Type definitions in `types/` folder
- [ ] Mock implementations for testing

### Week 2: ETL Pipeline Dashboard
- [ ] ETLPipelinePage component
- [ ] Execution history table
- [ ] Pipeline details view
- [ ] Error browser
- [ ] Real-time status updates

### Week 3: Pipeline Designer
- [ ] PipelineBuilder component
- [ ] Transformation rule builder
- [ ] Validation rule builder
- [ ] Schedule builder

### Week 4: Integration & Testing
- [ ] Connect dashboard to services
- [ ] End-to-end testing (Data Source → ETL Pipeline → Validation → Output)
- [ ] Performance testing
- [ ] Documentation

---

## Key Features By Priority

### Priority 1 (MVP)
- ✅ Pipeline configuration and CRUD
- ✅ Data validation with quality scoring
- ✅ Student identity resolution (email + phone matching)
- ✅ Pipeline execution and monitoring
- ✅ Error tracking and manual retry

### Priority 2 (Enhancement)
- ⏳ Automated retry logic
- ⏳ Custom transformation rules
- ⏳ Visual pipeline designer
- ⏳ Duplicate record merging
- ⏳ Data quality dashboards

### Priority 3 (Advanced)
- ⏳ Machine learning-based matching
- ⏳ Streaming data support
- ⏳ Advanced transformation expressions
- ⏳ Audit logging and compliance
- ⏳ Performance optimization

---

## Data Flow Example

```
1. USER INITIATES PIPELINE
   ↓
2. DATA EXTRACTION
   - Fetch from DataSource (Moodle, Canvas, SIS, etc.)
   - Format to DataRecord objects
   ↓
3. DATA TRANSFORMATION
   - Apply transformation rules (concat, split, format, etc.)
   - Create derived fields
   - Normalize data
   ↓
4. STUDENT IDENTITY RESOLUTION
   - Match students across systems
   - Consolidate duplicate records
   - Link external IDs
   ↓
5. DATA VALIDATION
   - Run validation schema
   - Calculate quality score
   - Flag errors vs warnings
   ↓
6. LOAD
   - Write valid records to database/warehouse
   - Queue invalid records for manual review
   - Generate execution report
   ↓
7. ERROR HANDLING
   - Queue failed records
   - Log errors with context
   - Set up retry attempts
   ↓
8. METRICS & REPORTING
   - Update execution metrics
   - Generate quality report
   - Track data lineage
```

---

## Testing Strategy

### Unit Tests
- Validation rules (required, format, range, custom)
- Matching algorithms (email, name+DOB, student ID)
- Transformation functions (concat, split, format)
- Quality scoring

### Integration Tests
- Full pipeline execution (Extract → Load)
- Error handling and recovery
- Duplicate detection and merging
- Data lineage tracking

### E2E Tests
- Data Source → ETL Pipeline → Output
- Dashboard interaction and reporting
- Export functionality

---

## Success Criteria

- ✅ 0 TypeScript errors
- ✅ All core services implemented and tested
- ✅ Dashboard functional and responsive
- ✅ <100ms response time for validation
- ✅ Accuracy >95% for student identity matching
- ✅ <5 second pipeline execution for 10k records
- ✅ Comprehensive error handling and recovery
