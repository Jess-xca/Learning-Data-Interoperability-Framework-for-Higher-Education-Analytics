# Phase 3: Data Integration & Interoperability

## Overview
Phase 3 builds the core data integration engine, establishing connections to LMS/SIS systems and implementing industry standards for data exchange (IMS Global, xAPI, Caliper). This phase enables the system to ingest, validate, transform, and standardize educational data from multiple sources.

---

## M3: Data Source Integration (Foundation Layer)

### Architecture
```
┌─────────────────────────────────────────────┐
│      Data Source Management UI              │  (React Components)
├─────────────────────────────────────────────┤
│   DataSourceService (State & Operations)    │  (Business Logic)
├─────────────────────────────────────────────┤
│  LMS Adapters  │  SIS Adapters  │  Other    │  (Connector Layer)
├─────────────────────────────────────────────┤
│      Mock Data Source Implementations       │  (For Dev/Testing)
└─────────────────────────────────────────────┘
```

### Components to Build

#### M3.1: Data Sources Dashboard
- **Location:** `frontend/src/components/pages/DataSourcesPage.tsx`
- **Features:**
  - List all connected data sources
  - Connection status indicators (green=connected, yellow=warning, red=error)
  - Last sync timestamp
  - Data record counts (students, courses, enrollments)
  - Quick actions: Sync Now, Test Connection, Edit, Delete

#### M3.2: Connection Wizard
- **Location:** `frontend/src/components/DataSourceWizard/`
- **Steps:**
  1. Select data source type (Moodle, Canvas, Blackboard, SIS, etc.)
  2. Enter connection credentials
  3. Configure mapping (LMS fields → Standard fields)
  4. Test connection
  5. Schedule sync frequency
  6. Review & confirm

#### M3.3: Connector Services
- **Location:** `frontend/src/services/connectors/`
- **Implementations:**
  - `MoodleConnector.ts` - Moodle LMS API
  - `CanvasConnector.ts` - Canvas LMS API
  - `BlackboardConnector.ts` - Blackboard LMS API
  - `SISConnector.ts` - Student Information System
  - `MockLMSConnector.ts` - Development/testing

#### M3.4: Health Monitoring
- **Location:** `frontend/src/services/HealthMonitor.ts`
- **Features:**
  - Connection status checks
  - Credential expiration tracking
  - Sync success/failure rates
  - Data freshness (last successful import)
  - Alert thresholds

### Key Services

#### DataSourceService
```typescript
interface DataSource {
  id: string;
  type: "moodle" | "canvas" | "blackboard" | "sis" | "mock";
  name: string;
  url: string;
  credentials: EncryptedCredentials;
  status: "connected" | "error" | "disconnected";
  lastSync: Date;
  syncFrequency: "hourly" | "daily" | "weekly";
  recordCounts: {
    students: number;
    courses: number;
    enrollments: number;
  };
}

// Core operations
- addDataSource(config)
- testConnection(sourceId)
- syncNow(sourceId)
- deleteDataSource(sourceId)
- getStatus(sourceId)
- listAllSources()
```

---

## M4: Interoperability Standards (Data Normalization)

### Architecture
```
┌─────────────────────────────────────────────┐
│    Standards Compliance Manager UI          │  (React Components)
├─────────────────────────────────────────────┤
│  IMS Global  │  xAPI   │  Caliper Service   │  (Transformation)
├─────────────────────────────────────────────┤
│    Standard Data Model (Normalized)         │  (Target Format)
└─────────────────────────────────────────────┘
```

### Components to Build

#### M4.1: Standards Configuration UI
- **Location:** `frontend/src/components/pages/InteroperabilityPage.tsx`
- **Features:**
  - Available standards: IMS Global, xAPI, Caliper
  - Enable/disable standards per data source
  - View sample transformed data
  - Test transformation rules
  - Export data in different formats (XML/JSON/CSV)

#### M4.2: Transformation Services (Existing Stubs to Complete)
- `imsGlobalService.ts` - LIS, OneRoster, Caliper format
- `xAPIService.ts` - xAPI 1.0.3 statements
- `caliperService.ts` - Caliper 1.2 events

#### M4.3: Data Mapping UI
- **Location:** `frontend/src/components/DataMappingEditor/`
- **Features:**
  - Field mapping builder (Source → Standard)
  - Transformation rules (concat, split, format, lookup)
  - Preview transformed data
  - Save mapping templates

### Standards Implementation

#### IMS Global (LIS 2 & OneRoster)
```typescript
// Normalize to standard format
- User: sourcedId, email, name, role
- Course: code, title, term, credits
- Enrollment: user→course relationship, role, status
```

#### xAPI (Experience API)
```typescript
// Activity streams
- Actor: Student/Instructor identity
- Verb: viewed, attempted, passed, failed, etc.
- Object: Course, Module, Assessment
- Result: score, completion, duration
```

#### Caliper Analytics
```typescript
// Learning events
- Person entity tracking
- Course offering context
- Assessment submissions
- Learning object interactions
```

---

## M5: ETL Pipelines (Data Processing Engine)

### Architecture
```
┌─────────────────────────────────────────────┐
│       ETL Pipeline Manager UI               │  (React Components)
├─────────────────────────────────────────────┤
│  Pipeline Orchestration Service             │  (Workflow Engine)
├─────────────────────────────────────────────┤
│ Extract  │  Transform  │  Validate  │ Load   │  (Processing Stages)
├─────────────────────────────────────────────┤
│     Error Handling & Recovery System        │  (Resilience)
└─────────────────────────────────────────────┘
```

### Components to Build

#### M5.1: ETL Dashboard
- **Location:** `frontend/src/components/pages/ETLPipelinePage.tsx`
- **Features:**
  - Active pipelines list
  - Pipeline execution history (success/failures)
  - Current processing status (% complete, records processed)
  - Error logs and retry options
  - Processing times and performance metrics

#### M5.2: Pipeline Designer
- **Location:** `frontend/src/components/PipelineDesigner/`
- **Features:**
  - Visual pipeline builder
  - Drag-and-drop transformation rules
  - Condition-based routing
  - Error handling branches
  - Preview data flow

#### M5.3: Services

##### ETLService
```typescript
interface ETLPipeline {
  id: string;
  name: string;
  source: DataSourceId;
  stages: PipelineStage[];
  schedule: CronExpression;
  status: "active" | "paused" | "error";
  metrics: {
    recordsProcessed: number;
    recordsFailed: number;
    executionTime: number;
    lastRun: Date;
  }
}

// Core operations
- createPipeline(config)
- executePipeline(pipelineId)
- validateData(records)
- transformRecords(records, rules)
- loadData(records)
```

##### DataValidationService
```typescript
// Validation rules
- Required fields check
- Data type validation
- Format validation (email, phone, etc.)
- Constraint checks (unique, foreign keys)
- Data quality scoring

// Outputs
- Valid records → Load stage
- Invalid records → Error queue
- Quality report with issues per record
```

##### StudentIdentityResolution
```typescript
// Match students across systems
- Email matching
- Full name + DOB matching
- Student ID lookup
- Fuzzy matching (Levenshtein distance)

// Output
- Unified student record across systems
- Cross-system reference mapping
```

---

## Implementation Roadmap

### Week 1: M3 Foundation
- [ ] DataSourceService core implementation
- [ ] Data Sources Dashboard UI
- [ ] Mock LMS Connector (for testing)
- [ ] Connection wizard (steps 1-3)
- [ ] Health monitoring basics

### Week 2: M3 Finalization
- [ ] Connection testing & validation
- [ ] Sync scheduling & execution
- [ ] Status indicators & alerts
- [ ] Build & test with all 5 demo users

### Week 3-4: M4 Standards
- [ ] Complete IMS Global transformation
- [ ] xAPI statement generation
- [ ] Caliper event generation
- [ ] Standards config UI
- [ ] Data mapping editor

### Week 5-6: M5 ETL Engine
- [ ] ETL service core
- [ ] Data validation engine
- [ ] Transformation pipeline
- [ ] Error handling & recovery
- [ ] ETL dashboard & designer UI

### Week 7: Integration & Testing
- [ ] End-to-end testing (M3 → M4 → M5)
- [ ] Performance optimization
- [ ] Documentation
- [ ] Demo-ready state

---

## Key Design Decisions

### 1. Mock vs. Real Connectors
- **Approach:** Start with Mock connectors, structure for real API integration
- **Benefits:** Dev-agnostic, consistent testing, no external dependencies
- **Real APIs:** Implement behind interface abstraction for easy swapping

### 2. State Management
- **Approach:** Context API with useReducer for pipeline state
- **Benefits:** Simple, no Redux needed, aligned with auth pattern

### 3. Error Handling Strategy
- **Approach:** Graceful degradation - partial success is logged, not failed
- **Benefits:** Real-world data integration is messy; show what worked + what failed

### 4. Performance Considerations
- **Approach:** Pagination for large datasets, virtual scrolling for lists
- **Benefits:** Handle 10K+ records without UI lag

### 5. Data Security
- **Approach:** Credentials encrypted in storage (mock), HTTPS enforced
- **Benefits:** Safe handling of LMS/SIS credentials

---

## Success Criteria

### M3 Complete When:
- ✅ Can add 3+ different data source types
- ✅ Connection wizard completes all steps
- ✅ Health monitoring shows accurate status
- ✅ Mock sync retrieves sample data
- ✅ All 5 demo users can manage data sources

### M4 Complete When:
- ✅ Data transforms to IMS Global format correctly
- ✅ xAPI statements generate with proper structure
- ✅ Caliper events capture learning activities
- ✅ Can export transformed data in multiple formats
- ✅ Mapping rules are reusable across sources

### M5 Complete When:
- ✅ Can create & execute ETL pipelines
- ✅ Data validation catches 100% of test cases
- ✅ Student identity resolution matches 99%+ of records
- ✅ Error handling & recovery works correctly
- ✅ Performance: 10K records processed in <5 seconds

---

## File Structure (To Create)

```
frontend/src/
├── services/
│   ├── DataSourceService.ts           [NEW - M3]
│   ├── ETLService.ts                  [NEW - M5]
│   ├── DataValidationService.ts       [NEW - M5]
│   ├── HealthMonitorService.ts        [NEW - M3]
│   ├── connectors/                    [NEW - M3]
│   │   ├── BaseConnector.ts
│   │   ├── MoodleConnector.ts
│   │   ├── CanvasConnector.ts
│   │   ├── BlackboardConnector.ts
│   │   ├── SISConnector.ts
│   │   └── MockLMSConnector.ts
│   ├── imsGlobalService.ts            [EXPAND - M4]
│   ├── xAPIService.ts                 [EXPAND - M4]
│   └── caliperService.ts              [EXPAND - M4]
│
├── components/
│   ├── pages/
│   │   ├── DataSourcesPage.tsx        [NEW - M3]
│   │   ├── InteroperabilityPage.tsx   [NEW - M4]
│   │   └── ETLPipelinePage.tsx        [NEW - M5]
│   ├── DataSourceWizard/              [NEW - M3]
│   │   ├── StepSelectType.tsx
│   │   ├── StepConnectCredentials.tsx
│   │   ├── StepConfigureMapping.tsx
│   │   ├── StepTestConnection.tsx
│   │   └── StepReviewConfirm.tsx
│   ├── DataMappingEditor/             [NEW - M4]
│   │   ├── FieldMapper.tsx
│   │   ├── TransformationRules.tsx
│   │   └── DataPreview.tsx
│   └── PipelineDesigner/              [NEW - M5]
│       ├── PipelineBuilder.tsx
│       ├── StageEditor.tsx
│       └── ExecutionMonitor.tsx
│
├── context/
│   ├── DataSourceContext.tsx          [NEW - M3]
│   ├── ETLContext.tsx                 [NEW - M5]
│   └── AuthContext.tsx                [EXISTING]
│
└── types/
    ├── datasources.ts                 [NEW - M3]
    ├── etl.ts                         [NEW - M5]
    └── standards.ts                   [NEW - M4]

docs/
├── PHASE_3_PLAN.md                    [THIS FILE]
├── API_INTEGRATION_GUIDE.md           [NEW - M3]
├── STANDARDS_REFERENCE.md             [NEW - M4]
└── ETL_DESIGN_GUIDE.md                [NEW - M5]
```

---

## Next Steps

1. ✅ **Create Phase 3 Plan** (THIS FILE)
2. 🔄 **Start M3.1:** Build DataSourceService
3. 🔄 **Start M3.2:** Create Data Sources Dashboard
4. 🔄 **Start M3.3:** Implement MockLMSConnector
5. → **Test with demo users**
6. → **Move to M4 transformation services**
7. → **Build M5 ETL engine**

