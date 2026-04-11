/**
 * Phase 4A Test Suite - Integration Tests
 * Validates all Phase 4A services work together
 */

import { transformationRulesEngine } from '../services/TransformationRulesEngine';
import { pipelineErrorRecoveryService } from '../services/PipelineErrorRecoveryService';
import { dataLineageTracker } from '../services/DataLineageTracker';
import { DataRecord, TransformationRule, PipelineError } from '../types/etl-extended';

/**
 * Phase 4A Integration Test Suite
 */
export const phase4aTestSuite = {
  name: 'Phase 4A: ETL Enhancement Services',
  tests: [] as Array<{ name: string; fn: () => Promise<void>; category: string }>,

  // ============================================================================
  // TEST UTILITIES
  // ============================================================================

  createMockRecord(id: string, overrides?: Partial<DataRecord>): DataRecord {
    return {
      id,
      sourceId: 'test_source',
      timestamp: new Date(),
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@university.edu',
        grade: 85,
        status: 'Active',
        dateOfBirth: '2005-03-15',
        ...overrides?.data,
      },
      lineage: {
        source: 'test_source',
        transformations: [],
        validations: [],
        ...overrides?.lineage,
      },
      quality: {
        score: 100,
        issues: [],
        ...overrides?.quality,
      },
      ...overrides,
    } as DataRecord;
  },

  createMockRule(overrides?: Partial<TransformationRule>): TransformationRule {
    return {
      id: `rule_${Date.now()}`,
      name: 'Test Rule',
      type: 'concat',
      sourceFields: ['firstName', 'lastName'],
      targetField: 'fullName',
      config: { separator: ' ' },
      ...overrides,
    };
  },

  createMockError(code: string): PipelineError {
    return {
      id: `err_${Date.now()}`,
      executionId: 'test_exec',
      stage: 'transform',
      recordId: 'test_record',
      code,
      message: `Mock error: ${code}`,
      timestamp: new Date(),
      retry: { count: 0, maxRetries: 3 },
    };
  },

  // ============================================================================
  // TRANSFORMATION RULES ENGINE TESTS
  // ============================================================================

  async testConcatenationTransformation() {
    const record = this.createMockRecord('rec1');
    const rule = this.createMockRule({
      type: 'concat',
      sourceFields: ['firstName', 'lastName'],
      targetField: 'fullName',
      config: { separator: ' ' },
    });

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, [rule]);
    
    if (transformed.data.fullName !== 'John Doe') {
      throw new Error(`Expected 'John Doe', got '${transformed.data.fullName}'`);
    }
  },

  async testSplitTransformation() {
    const record = this.createMockRecord('rec2', {
      data: { fullName: 'John,Doe,Smith' },
    });

    const rule = this.createMockRule({
      type: 'split',
      sourceFields: ['fullName'],
      targetField: 'nameParts',
      config: { delimiter: ',', asArray: true },
    });

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, [rule]);
    
    if (!Array.isArray(transformed.data.nameParts) || transformed.data.nameParts.length !== 3) {
      throw new Error('Split transformation failed');
    }
  },

  async testFormatTransformation() {
    const record = this.createMockRecord('rec3');
    const rule = this.createMockRule({
      type: 'format',
      sourceFields: ['firstName', 'lastName'],
      targetField: 'displayName',
      config: { template: '{lastName}, {firstName}' },
    });

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, [rule]);
    
    if (transformed.data.displayName !== 'Doe, John') {
      throw new Error(`Expected 'Doe, John', got '${transformed.data.displayName}'`);
    }
  },

  async testLookupTransformation() {
    const record = this.createMockRecord('rec4', {
      data: { grade: 85 },
    });

    const rule = this.createMockRule({
      type: 'lookup',
      sourceFields: ['grade'],
      targetField: 'gradeLetter',
      config: {
        lookupTable: {
          '90': 'A',
          '80': 'B',
          '70': 'C',
        },
        defaultValue: 'F',
      },
    });

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, [rule]);
    
    if (transformed.data.gradeLetter !== 'B') {
      throw new Error(`Expected 'B', got '${transformed.data.gradeLetter}'`);
    }
  },

  async testRuleChainExecution() {
    const records = [
      this.createMockRecord('rec5'),
      this.createMockRecord('rec6'),
    ];

    const rules: TransformationRule[] = [
      this.createMockRule({
        type: 'concat',
        sourceFields: ['firstName', 'lastName'],
        targetField: 'fullName',
        config: { separator: ' ' },
      }),
      this.createMockRule({
        type: 'format',
        sourceFields: ['fullName'],
        targetField: 'displayName',
        config: {
          template: 'Student: {fullName}',
        },
      }),
    ];

    const result = await transformationRulesEngine.transformBatch(records, rules);
    
    if (result.successful !== 2) {
      throw new Error(`Expected 2 successful, got ${result.successful}`);
    }

    const firstRecord = result.records[0];
    if (firstRecord.data.displayName !== 'Student: John Doe') {
      throw new Error('Rule chain failed');
    }
  },

  async testCustomFunction() {
    transformationRulesEngine.registerCustomFunction('toUpperCase', (str: string) => {
      return str?.toUpperCase() || '';
    });

    const record = this.createMockRecord('rec7', {
      data: { firstName: 'john' },
    });

    const rule = this.createMockRule({
      type: 'custom',
      sourceFields: ['firstName'],
      targetField: 'firstNameUpper',
      config: { functionName: 'toUpperCase' },
    });

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, [rule]);
    
    if (transformed.data.firstNameUpper !== 'JOHN') {
      throw new Error('Custom function failed');
    }
  },

  // ============================================================================
  // ERROR RECOVERY TESTS
  // ============================================================================

  async testErrorQueueing() {
    const error = this.createMockError('CONNECTION_ERROR');
    const queueItem = pipelineErrorRecoveryService.queueForRetry(error);

    if (!queueItem || queueItem.retryCount !== 0) {
      throw new Error('Error queueing failed');
    }
  },

  async testRetryScheduling() {
    const error = this.createMockError('TIMEOUT');
    const queueItem = pipelineErrorRecoveryService.queueForRetry(error);

    pipelineErrorRecoveryService.updateRetry(queueItem.id);

    const status = pipelineErrorRecoveryService.getQueueStatus();
    if (status.totalQueued === 0) {
      throw new Error('Retry scheduling failed');
    }
  },

  async testErrorClassification() {
    const transientError = this.createMockError('CONNECTION_ERROR');
    const permanentError = this.createMockError('INVALID_FORMAT');

    const transientClass = pipelineErrorRecoveryService.classifyError(transientError);
    const permanentClass = pipelineErrorRecoveryService.classifyError(permanentError);

    if (transientClass.category !== 'transient' || permanentClass.category !== 'permanent') {
      throw new Error('Error classification failed');
    }
  },

  async testDeadLetterQueue() {
    pipelineErrorRecoveryService.setRetryPolicy({ maxRetries: 1 });

    const error = this.createMockError('VALIDATION_FAILED');
    const queueItem = pipelineErrorRecoveryService.queueForRetry(error);

    // Simulate exhausting retries
    pipelineErrorRecoveryService.updateRetry(queueItem.id);
    pipelineErrorRecoveryService.updateRetry(queueItem.id);

    const dlq = pipelineErrorRecoveryService.getDeadLetterQueue();
    if (dlq.length === 0) {
      throw new Error('Dead letter queue failed');
    }
  },

  // ============================================================================
  // DATA LINEAGE TESTS
  // ============================================================================

  async testLineageGraphCreation() {
    const graph = dataLineageTracker.createLineageGraph('exec1', 'pipeline1', 5);

    if (!graph || graph.recordCount !== 5) {
      throw new Error('Lineage graph creation failed');
    }
  },

  async testRecordLineageInitialization() {
    const record = this.createMockRecord('rec8');
    dataLineageTracker.createLineageGraph('exec2', 'pipeline2', 1);
    const lineage = dataLineageTracker.initializeRecordLineage('exec2', record, 'moodle');

    if (!lineage || lineage.recordId !== 'rec8') {
      throw new Error('Record lineage initialization failed');
    }
  },

  async testTransformationNodeTracking() {
    const record = this.createMockRecord('rec9');
    dataLineageTracker.createLineageGraph('exec3', 'pipeline3', 1);
    dataLineageTracker.initializeRecordLineage('exec3', record, 'canvas');

    dataLineageTracker.addTransformationNode(
      'exec3',
      'rec9',
      'full_name_concat',
      50,
      'success',
      { fullName: 'John Doe' }
    );

    const trace = dataLineageTracker.traceRecordHistory('exec3', 'rec9');
    const transformNode = trace.path.find((n) => n.type === 'transform');

    if (!transformNode) {
      throw new Error('Transformation node tracking failed');
    }
  },

  async testLineageStatistics() {
    dataLineageTracker.createLineageGraph('exec4', 'pipeline4', 3);

    const record1 = this.createMockRecord('rec10');
    dataLineageTracker.initializeRecordLineage('exec4', record1, 'sis');

    const stats = dataLineageTracker.getLineageStatistics('exec4');

    if (stats.totalRecords !== 3 || stats.recordsTracked !== 1) {
      throw new Error('Lineage statistics failed');
    }
  },

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  async testFullPipelineSimulation() {
    // Create execution
    const executionId = 'full_test_' + Date.now();
    dataLineageTracker.createLineageGraph(executionId, 'test_pipeline', 1);

    // Initialize record
    const record = this.createMockRecord('rec11');
    dataLineageTracker.initializeRecordLineage(executionId, record, 'mock_source');

    // Apply transformations
    const rules: TransformationRule[] = [
      this.createMockRule({
        type: 'concat',
        sourceFields: ['firstName', 'lastName'],
        targetField: 'fullName',
        config: { separator: ' ' },
      }),
    ];

    const { record: transformed } = await transformationRulesEngine.transformRecord(record, rules);

    // Track transformation
    dataLineageTracker.addTransformationNode(
      executionId,
      record.id,
      'concat_full_name',
      10,
      'success',
      transformed.data
    );

    // Track validation
    dataLineageTracker.addValidationNode(
      executionId,
      record.id,
      true,
      100,
      [],
      15
    );

    // Track load
    dataLineageTracker.addLoadNode(
      executionId,
      record.id,
      'analytics_db',
      true,
      20
    );

    // Get statistics
    const stats = dataLineageTracker.getLineageStatistics(executionId);

    if (stats.recordsTracked !== 1 || stats.stageStatistics.transform === 0) {
      throw new Error('Full pipeline simulation failed');
    }

    dataLineageTracker.completeLineageGraph(executionId, 'completed');
  },

  async testBatchProcessingWithErrorHandling() {
    const records = Array.from({ length: 10 }, (_, i) =>
      this.createMockRecord(`rec_batch_${i}`)
    );

    const rules: TransformationRule[] = [
      this.createMockRule({
        type: 'concat',
        sourceFields: ['firstName', 'lastName'],
        targetField: 'fullName',
        config: { separator: ' ' },
      }),
    ];

    const result = await transformationRulesEngine.transformBatch(records, rules);

    if (result.successful !== 10) {
      throw new Error('Batch processing failed');
    }

    // Simulate error scenario
    const error = this.createMockError('BATCH_ERROR');
    pipelineErrorRecoveryService.queueForRetry(error);

    const queueStatus = pipelineErrorRecoveryService.getQueueStatus();
    if (queueStatus.totalQueued === 0) {
      throw new Error('Error handling in batch failed');
    }
  },

  // ============================================================================
  // RUN ALL TESTS
  // ============================================================================

  async runAllTests(): Promise<{
    total: number;
    passed: number;
    failed: number;
    results: Array<{ name: string; status: 'pass' | 'fail'; error?: string }>;
  }> {
    const results: Array<{ name: string; status: 'pass' | 'fail'; error?: string }> = [];

    const testMethods = [
      // Transformation Tests
      { name: 'Concatenation Transformation', fn: () => this.testConcatenationTransformation() },
      { name: 'Split Transformation', fn: () => this.testSplitTransformation() },
      { name: 'Format Transformation', fn: () => this.testFormatTransformation() },
      { name: 'Lookup Transformation', fn: () => this.testLookupTransformation() },
      { name: 'Rule Chain Execution', fn: () => this.testRuleChainExecution() },
      { name: 'Custom Function', fn: () => this.testCustomFunction() },
      // Error Recovery Tests
      { name: 'Error Queueing', fn: () => this.testErrorQueueing() },
      { name: 'Retry Scheduling', fn: () => this.testRetryScheduling() },
      { name: 'Error Classification', fn: () => this.testErrorClassification() },
      { name: 'Dead Letter Queue', fn: () => this.testDeadLetterQueue() },
      // Data Lineage Tests
      { name: 'Lineage Graph Creation', fn: () => this.testLineageGraphCreation() },
      { name: 'Record Lineage Initialization', fn: () => this.testRecordLineageInitialization() },
      { name: 'Transformation Node Tracking', fn: () => this.testTransformationNodeTracking() },
      { name: 'Lineage Statistics', fn: () => this.testLineageStatistics() },
      // Integration Tests
      { name: 'Full Pipeline Simulation', fn: () => this.testFullPipelineSimulation() },
      { name: 'Batch Processing with Error Handling', fn: () => this.testBatchProcessingWithErrorHandling() },
    ];

    for (const test of testMethods) {
      try {
        await test.fn();
        results.push({ name: test.name, status: 'pass' });
        console.log(`✅ ${test.name}`);
      } catch (error) {
        results.push({
          name: test.name,
          status: 'fail',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.log(`❌ ${test.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const passed = results.filter((r) => r.status === 'pass').length;
    const failed = results.filter((r) => r.status === 'fail').length;

    return {
      total: results.length,
      passed,
      failed,
      results,
    };
  },
};

// Export for use in test runners
export default phase4aTestSuite;
