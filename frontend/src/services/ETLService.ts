/**
 * ETL Service
 * Pipeline orchestration and execution engine for data processing
 * Handles extraction, transformation, loading, and error recovery
 */

import type { ETLPipeline, ETLExecutionLog, PipelineStage, TransformedRecord } from '../types/etl';

export interface PipelineExecution {
  pipelineId: string;
  executionId: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number; // 0-100
  metrics: {
    recordsProcessed: number;
    recordsSuccessful: number;
    recordsFailed: number;
    recordsSkipped: number;
    executionTime: number;
  };
  errors: Array<{
    stage: string;
    recordId: string;
    error: string;
    timestamp: Date;
  }>;
  startTime: Date;
  endTime?: Date;
}

class ETLServiceClass {
  private pipelines: Map<string, ETLPipeline> = new Map();
  private executions: Map<string, PipelineExecution> = new Map();
  private executionLogs: Map<string, ETLExecutionLog[]> = new Map();

  /**
   * Create a new ETL pipeline
   */
  createPipeline(config: Partial<ETLPipeline>): ETLPipeline {
    const pipeline: ETLPipeline = {
      id: config.id || `pipeline-${Date.now()}`,
      name: config.name || 'Unnamed Pipeline',
      description: config.description,
      dataSourceId: config.dataSourceId || '',
      standards: config.standards || ['ims_global'],
      stages: config.stages || this.getDefaultStages(),
      schedule: config.schedule, // Cron format
      status: 'paused',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  /**
   * Get default pipeline stages (Extract → Validate → Transform → Load)
   */
  private getDefaultStages(): PipelineStage[] {
    return [
      {
        id: 'stage-extract',
        type: 'extract',
        name: 'Data Extraction',
        enabled: true,
        order: 1,
        config: {
          batchSize: 100,
          errorHandling: 'skip',
          retryAttempts: 3,
        },
      },
      {
        id: 'stage-validate',
        type: 'validate',
        name: 'Data Validation',
        enabled: true,
        order: 2,
        config: {
          validationRules: [],
          errorHandling: 'fail',
          retryAttempts: 0,
        },
      },
      {
        id: 'stage-transform',
        type: 'transform',
        name: 'Data Transformation',
        enabled: true,
        order: 3,
        config: {
          transformationRules: [],
          errorHandling: 'skip',
          retryAttempts: 1,
        },
      },
      {
        id: 'stage-load',
        type: 'load',
        name: 'Data Loading',
        enabled: true,
        order: 4,
        config: {
          loadTarget: 'analytics_database',
          batchSize: 500,
          errorHandling: 'skip',
          retryAttempts: 3,
        },
      },
    ];
  }

  /**
   * Get pipeline by ID
   */
  getPipeline(pipelineId: string): ETLPipeline | undefined {
    return this.pipelines.get(pipelineId);
  }

  /**
   * List all pipelines
   */
  getAllPipelines(): ETLPipeline[] {
    return Array.from(this.pipelines.values());
  }

  /**
   * Update pipeline configuration
   */
  updatePipeline(pipelineId: string, updates: Partial<ETLPipeline>): ETLPipeline | undefined {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return undefined;

    const updated = { ...pipeline, ...updates, updatedAt: new Date() };
    this.pipelines.set(pipelineId, updated);
    return updated;
  }

  /**
   * Delete pipeline
   */
  deletePipeline(pipelineId: string): boolean {
    return this.pipelines.delete(pipelineId);
  }

  /**
   * Start pipeline execution
   */
  async executePipeline(pipelineId: string, records: any[]): Promise<PipelineExecution> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline ${pipelineId} not found`);

    const executionId = `exec-${Date.now()}`;
    const execution: PipelineExecution = {
      pipelineId,
      executionId,
      status: 'running',
      progress: 0,
      metrics: {
        recordsProcessed: 0,
        recordsSuccessful: 0,
        recordsFailed: 0,
        recordsSkipped: 0,
        executionTime: 0,
      },
      errors: [],
      startTime: new Date(),
    };

    this.executions.set(executionId, execution);

    try {
      const startTime = Date.now();
      const enabledStages = pipeline.stages
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order);

      let processedRecords = records;

      for (const stage of enabledStages) {
        execution.progress = Math.round(
          ((enabledStages.indexOf(stage) + 1) / enabledStages.length) * 100,
        );

        switch (stage.type) {
          case 'extract':
            processedRecords = await this.executeExtraction(
              processedRecords,
              stage,
            );
            break;
          case 'validate':
            processedRecords = await this.executeValidation(
              processedRecords,
              stage,
              execution,
            );
            break;
          case 'transform':
            processedRecords = await this.executeTransformation(
              processedRecords,
              stage,
              execution,
            );
            break;
          case 'load':
            await this.executeLoad(processedRecords, stage, execution);
            break;
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      execution.metrics.executionTime = Date.now() - startTime;
      execution.metrics.recordsProcessed = records.length;
      execution.metrics.recordsSuccessful =
        execution.metrics.recordsProcessed - execution.metrics.recordsFailed;

      // Log execution
      if (!this.executionLogs.has(pipelineId)) {
        this.executionLogs.set(pipelineId, []);
      }
      // At this point, execution.status is 'completed' (set on line above)
      const logStatus: 'active' | 'paused' | 'error' | 'completed' | 'running' = 'completed';
      
      this.executionLogs.get(pipelineId)!.push({
        pipelineId,
        executionId,
        startTime: execution.startTime,
        endTime: execution.endTime,
        status: logStatus,
        metrics: {
          recordsProcessed: execution.metrics.recordsProcessed,
          recordsSuccessful: execution.metrics.recordsSuccessful,
          recordsFailed: execution.metrics.recordsFailed,
          recordsSkipped: execution.metrics.recordsSkipped,
          executionTime: execution.metrics.executionTime,
          startTime: execution.startTime,
          validationErrorCount: 0,
          transformationErrorCount: 0,
        },
        recordsFailed: execution.errors.map((e) => ({
          recordId: e.recordId,
          error: e.error,
          stage: e.stage as 'extract' | 'validate' | 'transform' | 'load' | 'notify',
        })),
        warnings: [],
      });

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.errors.push({
        stage: 'pipeline',
        recordId: 'system',
        error: (error as Error).message,
        timestamp: new Date(),
      });

      throw execution;
    }
  }

  /**
   * Execute extraction stage
   */
  private async executeExtraction(
    records: any[],
    stage: PipelineStage,
  ): Promise<any[]> {
    // Simulate extraction with batch processing
    const batchSize = stage.config.batchSize || 100;

    const extractedRecords: any[] = [];
    for (let i = 0; i < records.length; i++) {
      extractedRecords.push({
        ...records[i],
        _extractedTime: new Date().toISOString(),
        _batchNumber: Math.floor(i / batchSize),
      });

      if ((i + 1) % batchSize === 0 || i === records.length - 1) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    return extractedRecords;
  }

  /**
   * Execute validation stage
   */
  private async executeValidation(
    records: any[],
    stage: PipelineStage,
    execution: PipelineExecution,
  ): Promise<any[]> {
    const validRecords: any[] = [];
    const invalidRecords: any[] = [];

    for (const record of records) {
      const isValid = this.validateRecord(record, stage.config.validationRules || []);

      if (isValid) {
        validRecords.push(record);
        execution.metrics.recordsSuccessful++;
      } else {
        invalidRecords.push(record);
        execution.metrics.recordsFailed++;
        execution.errors.push({
          stage: 'validate',
          recordId: record.id || 'unknown',
          error: 'Validation failed: Required fields missing or invalid format',
          timestamp: new Date(),
        });
      }

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // If errorHandling is 'fail', throw on any invalid records
    if (
      stage.config.errorHandling === 'fail' &&
      invalidRecords.length > 0
    ) {
      throw new Error(
        `Validation failed: ${invalidRecords.length} records did not pass validation`,
      );
    }

    return validRecords;
  }

  /**
   * Execute transformation stage
   */
  private async executeTransformation(
    records: any[],
    stage: PipelineStage,
    execution: PipelineExecution,
  ): Promise<any[]> {
    const transformedRecords: TransformedRecord[] = [];

    for (const record of records) {
      try {
        const transformed = this.transformRecord(
          record,
          stage.config.transformationRules || [],
        );

        transformedRecords.push(transformed);
        execution.metrics.recordsSuccessful++;

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 15));
      } catch (error) {
        execution.metrics.recordsFailed++;
        execution.errors.push({
          stage: 'transform',
          recordId: record.id || 'unknown',
          error: (error as Error).message,
          timestamp: new Date(),
        });

        if (stage.config.errorHandling === 'fail') {
          throw error;
        }
      }
    }

    return transformedRecords as any[];
  }

  /**
   * Execute load stage (persist data)
   */
  private async executeLoad(
    records: any[],
    stage: PipelineStage,
    execution: PipelineExecution,
  ): Promise<void> {
    const batchSize = stage.config.batchSize || 500;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, Math.min(i + batchSize, records.length));

      try {
        // Simulate database insert
        await new Promise((resolve) => setTimeout(resolve, 100));

        execution.metrics.recordsSuccessful += batch.length;

        // Simulate occasional failures
        if (Math.random() < 0.05) {
          throw new Error('Database connection timeout');
        }
      } catch (error) {
        execution.metrics.recordsFailed += batch.length;
        execution.errors.push({
          stage: 'load',
          recordId: `batch-${i}`,
          error: (error as Error).message,
          timestamp: new Date(),
        });

        if (stage.config.errorHandling === 'fail') {
          throw error;
        }
      }
    }
  }

  /**
   * Validate a single record
   */
  private validateRecord(record: any, _rules: any[]): boolean {
    // Basic validation: check for required fields
    const requiredFields = ['id', 'email', 'name'];
    return requiredFields.every((field) => field in record && record[field]);
  }

  /**
   * Transform a single record
   */
  private transformRecord(record: any, _rules: any[]): TransformedRecord {
    const transformed: any = { ...record };

    // Apply transformation rules
    _rules.forEach((rule: any) => {
      if (rule.operation === 'concat') {
        transformed[rule.targetField] = [rule.config.delimiter || ' '];
      } else if (rule.operation === 'format') {
        // Apply format template
        transformed[rule.targetField] = rule.config.formatTemplate || '';
      }
    });

    return {
      recordId: record.id,
      sourceFormat: record,
      targetFormat: transformed,
      standards: {
        imsGlobal: transformed,
        xapi: transformed,
        caliper: transformed,
      },
    };
  }

  /**
   * Pause pipeline execution
   */
  pauseExecution(executionId: string): PipelineExecution | undefined {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'paused';
    }
    return execution;
  }

  /**
   * Resume pipeline execution
   */
  resumeExecution(executionId: string): PipelineExecution | undefined {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'running';
    }
    return execution;
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): PipelineExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get execution logs for a pipeline
   */
  getExecutionLogs(pipelineId: string): ETLExecutionLog[] {
    return this.executionLogs.get(pipelineId) || [];
  }

  /**
   * Get pipeline statistics
   */
  getPipelineStats(pipelineId: string): {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageTime: number;
    lastExecution?: Date;
  } {
    const logs = this.executionLogs.get(pipelineId) || [];

    if (logs.length === 0) {
      return {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageTime: 0,
      };
    }

    const successful = logs.filter((l) => l.status === 'completed').length;
    const failed = logs.filter((l) => l.status === 'error').length;
    const avgTime =
      logs.reduce((sum, l) => sum + l.metrics.executionTime, 0) / logs.length;

    return {
      totalExecutions: logs.length,
      successfulExecutions: successful,
      failedExecutions: failed,
      averageTime: Math.round(avgTime),
      lastExecution: logs[logs.length - 1]?.endTime,
    };
  }

  /**
   * Get active executions
   */
  getActiveExecutions(): PipelineExecution[] {
    return Array.from(this.executions.values()).filter(
      (e) => e.status === 'running' || e.status === 'paused',
    );
  }

  /**
   * Cancel execution
   */
  cancelExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution && (execution.status === 'running' || execution.status === 'paused')) {
      execution.status = 'failed';
      execution.endTime = new Date();
      return true;
    }
    return false;
  }

  /**
   * Generate sample pipeline for demonstration
   */
  createSamplePipeline(): ETLPipeline {
    return this.createPipeline({
      name: 'Student Data Integration',
      description: 'Nightly sync of student data from Moodle to Analytics Database',
      dataSourceId: 'moodle-001',
      standards: ['ims_global', 'xapi'],
      schedule: '0 2 * * *', // 2 AM daily
    });
  }

  /**
   * Create sample pipelines with validation & transformation rules
   */
  createSamplePipelinesWithRules(): ETLPipeline[] {
    const pipelines: ETLPipeline[] = [];

    // Pipeline 1: Student Data with Validation & Transformation
    const pipeline1 = this.createPipeline({
      name: 'Student Data Integration',
      description: 'Nightly sync of student data from Moodle to Analytics Database',
      dataSourceId: 'moodle-001',
      standards: ['ims_global', 'xapi'],
      schedule: '0 2 * * *',
      stages: [
        {
          id: 'stage-extract',
          type: 'extract',
          name: 'Data Extraction',
          enabled: true,
          order: 1,
          config: {
            batchSize: 100,
            errorHandling: 'skip',
            retryAttempts: 2,
          },
        },
        {
          id: 'stage-validate',
          type: 'validate',
          name: 'Data Validation',
          enabled: true,
          order: 2,
          config: {
            validationRules: [
              {
                id: 'rule-student-id',
                field: 'id',
                type: 'required',
                config: { dataType: 'string' },
                errorMessage: 'Student ID is required',
                criticalLevel: 'error',
              },
              {
                id: 'rule-student-email',
                field: 'email',
                type: 'format',
                config: { formatPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
                errorMessage: 'Invalid email format',
                criticalLevel: 'error',
              },
              {
                id: 'rule-student-name',
                field: 'firstName',
                type: 'required',
                config: { dataType: 'string' },
                errorMessage: 'First name is required',
                criticalLevel: 'error',
              },
            ],
            errorHandling: 'fail',
            retryAttempts: 0,
          },
        },
        {
          id: 'stage-transform',
          type: 'transform',
          name: 'Data Transformation',
          enabled: true,
          order: 3,
          config: {
            transformationRules: [
              {
                id: 'transform-fullname',
                sourceField: 'firstName',
                targetField: 'fullName',
                operation: 'concat',
                config: {
                  delimiter: ' ',
                },
              },
              {
                id: 'transform-email-lower',
                sourceField: 'email',
                targetField: 'emailNormalized',
                operation: 'format',
                config: {
                  formatTemplate: 'lowercase',
                },
              },
            ],
            errorHandling: 'skip',
            retryAttempts: 1,
          },
        },
        {
          id: 'stage-load',
          type: 'load',
          name: 'Data Loading',
          enabled: true,
          order: 4,
          config: {
            loadTarget: 'analytics_database',
            batchSize: 500,
            errorHandling: 'skip',
            retryAttempts: 3,
          },
        },
      ],
    });
    pipelines.push(pipeline1);

    // Pipeline 2: Course Data Sync
    const pipeline2 = this.createPipeline({
      name: 'Course Data Sync',
      description: 'Synchronize course information from Canvas',
      dataSourceId: 'canvas-001',
      standards: ['ims_global', 'caliper'],
      schedule: '0 3 * * *',
      stages: [
        {
          id: 'stage-extract-2',
          type: 'extract',
          name: 'Data Extraction',
          enabled: true,
          order: 1,
          config: { batchSize: 50, errorHandling: 'skip' },
        },
        {
          id: 'stage-validate-2',
          type: 'validate',
          name: 'Data Validation',
          enabled: true,
          order: 2,
          config: {
            validationRules: [
              {
                id: 'rule-course-id',
                field: 'id',
                type: 'required',
                config: { dataType: 'string' },
                errorMessage: 'Course ID is required',
                criticalLevel: 'error',
              },
              {
                id: 'rule-course-code',
                field: 'code',
                type: 'format',
                config: { formatPattern: '^[A-Z]{2,4}[0-9]{3,4}$' },
                errorMessage: 'Invalid course code format',
                criticalLevel: 'error',
              },
            ],
            errorHandling: 'fail',
          },
        },
        {
          id: 'stage-load-2',
          type: 'load',
          name: 'Data Loading',
          enabled: true,
          order: 3,
          config: {
            loadTarget: 'course_database',
            batchSize: 200,
            errorHandling: 'skip',
          },
        },
      ],
    });
    pipelines.push(pipeline2);

    // Pipeline 3: Enrollment Data
    const pipeline3 = this.createPipeline({
      name: 'Enrollment Data Integration',
      description: 'Process enrollment records from SIS',
      dataSourceId: 'sis-001',
      standards: ['ims_global', 'xapi', 'caliper'],
      schedule: '0 1 * * *',
      stages: [
        {
          id: 'stage-extract-3',
          type: 'extract',
          name: 'Data Extraction',
          enabled: true,
          order: 1,
          config: { batchSize: 200, errorHandling: 'skip' },
        },
        {
          id: 'stage-validate-3',
          type: 'validate',
          name: 'Data Validation',
          enabled: true,
          order: 2,
          config: {
            validationRules: [
              {
                id: 'rule-enrollment-student',
                field: 'studentId',
                type: 'required',
                config: { dataType: 'string' },
                errorMessage: 'Student ID is required',
                criticalLevel: 'error',
              },
              {
                id: 'rule-enrollment-course',
                field: 'courseId',
                type: 'required',
                config: { dataType: 'string' },
                errorMessage: 'Course ID is required',
                criticalLevel: 'error',
              },
              {
                id: 'rule-enrollment-status',
                field: 'status',
                type: 'required',
                config: {
                  allowedValues: ['active', 'inactive', 'completed', 'pending'],
                },
                errorMessage: 'Invalid enrollment status',
                criticalLevel: 'error',
              },
            ],
            errorHandling: 'fail',
          },
        },
        {
          id: 'stage-transform-3',
          type: 'transform',
          name: 'Data Transformation',
          enabled: true,
          order: 3,
          config: {
            transformationRules: [
              {
                id: 'transform-enrollment-date',
                sourceField: 'enrolledDate',
                targetField: 'enrollmentDate',
                operation: 'format',
                config: { formatTemplate: 'ISO8601' },
              },
            ],
            errorHandling: 'skip',
          },
        },
        {
          id: 'stage-load-3',
          type: 'load',
          name: 'Data Loading',
          enabled: true,
          order: 4,
          config: {
            loadTarget: 'enrollment_database',
            batchSize: 500,
            errorHandling: 'skip',
          },
        },
      ],
    });
    pipelines.push(pipeline3);

    return pipelines;
  }
}

export const etlService = new ETLServiceClass();
