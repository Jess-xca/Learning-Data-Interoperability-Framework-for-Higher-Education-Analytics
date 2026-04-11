/**
 * Pipeline Error Recovery & Retry Service
 * Handles error classification, retry logic, and dead letter queue management
 */

import { PipelineError, DataRecord } from '../types/etl-extended';

interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

interface ErrorClassification {
  code: string;
  category: 'transient' | 'permanent' | 'recoverable';
  retryable: boolean;
  suggestedAction: string;
}

interface ErrorQueueItem {
  id: string;
  error: PipelineError;
  record?: DataRecord;
  retryCount: number;
  nextRetryAt?: Date;
  classification: ErrorClassification;
  metadata: Record<string, any>;
}

interface DeadLetterQueueEntry {
  id: string;
  error: PipelineError;
  record?: DataRecord;
  failureCount: number;
  firstFailedAt: Date;
  lastFailedAt: Date;
  reason: string;
}

/**
 * PipelineErrorRecoveryService - Advanced error handling and recovery
 */
class PipelineErrorRecoveryService {
  private errorQueue: Map<string, ErrorQueueItem> = new Map();
  private deadLetterQueue: Map<string, DeadLetterQueueEntry> = new Map();
  private retryPolicy: RetryPolicy = {
    maxRetries: 3,
    initialDelayMs: 1000,
    backoffMultiplier: 2,
    maxDelayMs: 60000,
  };
  private errorClassifiers: Map<string, ErrorClassification> = new Map();
  private errorStats: Map<string, { count: number; lastOccurred: Date }> = new Map();

  constructor() {
    this.initializeErrorClassifiers();
  }

  // ============================================================================
  // RETRY POLICY MANAGEMENT
  // ============================================================================

  /**
   * Set retry policy
   */
  setRetryPolicy(policy: Partial<RetryPolicy>): void {
    this.retryPolicy = { ...this.retryPolicy, ...policy };
    console.log('[ErrorRecovery] Retry policy updated', this.retryPolicy);
  }

  /**
   * Get current retry policy
   */
  getRetryPolicy(): RetryPolicy {
    return { ...this.retryPolicy };
  }

  // ============================================================================
  // ERROR CLASSIFICATION
  // ============================================================================

  /**
   * Classify error and determine if retryable
   */
  classifyError(error: PipelineError): ErrorClassification {
    const cached = this.errorClassifiers.get(error.code);
    if (cached) return cached;

    // Classify based on error code
    const classification: ErrorClassification = {
      code: error.code,
      category: this.inferCategory(error.code, error.message),
      retryable: this.isRetryable(error.code),
      suggestedAction: this.getSuggestedAction(error.code),
    };

    this.errorClassifiers.set(error.code, classification);
    return classification;
  }

  /**
   * Register custom error classifier
   */
  registerErrorClassifier(code: string, classification: ErrorClassification): void {
    this.errorClassifiers.set(code, classification);
  }

  // ============================================================================
  // ERROR QUEUE MANAGEMENT
  // ============================================================================

  /**
   * Add error to queue for retry
   */
  queueForRetry(
    error: PipelineError,
    record?: DataRecord,
    metadata?: Record<string, any>
  ): ErrorQueueItem {
    const classification = this.classifyError(error);

    if (!classification.retryable) {
      throw new Error(`Error ${error.code} is not retryable`);
    }

    const queueItem: ErrorQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      record,
      retryCount: 0,
      classification,
      metadata: metadata || {},
    };

    this.errorQueue.set(queueItem.id, queueItem);
    this.updateErrorStats(error.code);

    console.log(`[ErrorRecovery] Error queued for retry: ${error.code} (Queue size: ${this.errorQueue.size})`);
    return queueItem;
  }

  /**
   * Get next item to retry from queue
   */
  getNextRetryItem(): ErrorQueueItem | null {
    const now = new Date();

    for (const [, item] of this.errorQueue) {
      if (!item.nextRetryAt || item.nextRetryAt <= now) {
        return item;
      }
    }

    return null;
  }

  /**
   * Mark error as successfully retried
   */
  markRetrySuccess(queueItemId: string): void {
    this.errorQueue.delete(queueItemId);
    console.log(`[ErrorRecovery] Retry successful, removed from queue`);
  }

  /**
   * Update retry for an item (increment count, reschedule)
   */
  updateRetry(queueItemId: string): ErrorQueueItem {
    const item = this.errorQueue.get(queueItemId);
    if (!item) throw new Error(`Queue item not found: ${queueItemId}`);

    item.retryCount++;

    if (item.retryCount >= this.retryPolicy.maxRetries) {
      // Move to dead letter queue
      this.moveToDeadLetterQueue(item, 'Max retries exceeded');
      this.errorQueue.delete(queueItemId);
    } else {
      // Schedule next retry with exponential backoff
      const delayMs = Math.min(
        this.retryPolicy.initialDelayMs * Math.pow(this.retryPolicy.backoffMultiplier, item.retryCount - 1),
        this.retryPolicy.maxDelayMs
      );

      item.nextRetryAt = new Date(Date.now() + delayMs);
      console.log(
        `[ErrorRecovery] Scheduled retry ${item.retryCount} in ${delayMs}ms`
      );
    }

    this.errorQueue.set(queueItemId, item);
    return item;
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    totalQueued: number;
    readyNow: number;
    pendingRetry: number;
  } {
    const now = new Date();
    let readyNow = 0;
    let pendingRetry = 0;

    for (const [, item] of this.errorQueue) {
      if (!item.nextRetryAt || item.nextRetryAt <= now) {
        readyNow++;
      } else {
        pendingRetry++;
      }
    }

    return {
      totalQueued: this.errorQueue.size,
      readyNow,
      pendingRetry,
    };
  }

  // ============================================================================
  // DEAD LETTER QUEUE MANAGEMENT
  // ============================================================================

  /**
   * Move item to dead letter queue
   */
  private moveToDeadLetterQueue(item: ErrorQueueItem, reason: string): void {
    const existing = Array.from(this.deadLetterQueue.values()).find(
      (dlq) => dlq.error.recordId === item.error.recordId
    );

    if (existing) {
      existing.failureCount++;
      existing.lastFailedAt = new Date();
    } else {
      const dlqEntry: DeadLetterQueueEntry = {
        id: `dlq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        error: item.error,
        record: item.record,
        failureCount: item.retryCount,
        firstFailedAt: new Date(),
        lastFailedAt: new Date(),
        reason,
      };

      this.deadLetterQueue.set(dlqEntry.id, dlqEntry);
      console.log(
        `[ErrorRecovery] Record moved to DLQ: ${item.error.recordId} (Reason: ${reason})`
      );
    }
  }

  /**
   * Get dead letter queue items
   */
  getDeadLetterQueue(limit: number = 100): DeadLetterQueueEntry[] {
    return Array.from(this.deadLetterQueue.values())
      .sort((a, b) => b.lastFailedAt.getTime() - a.lastFailedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Remove item from dead letter queue
   */
  removeFromDeadLetterQueue(dlqId: string): void {
    this.deadLetterQueue.delete(dlqId);
  }

  /**
   * Retry all items from dead letter queue
   */
  retryDeadLetterQueue(): ErrorQueueItem[] {
    const retriedItems: ErrorQueueItem[] = [];

    for (const [dlqId, dlqEntry] of this.deadLetterQueue) {
      try {
        const queueItem = this.queueForRetry(
          dlqEntry.error,
          dlqEntry.record,
          { fromDLQ: true, dlqId }
        );
        retriedItems.push(queueItem);
        this.deadLetterQueue.delete(dlqId);
      } catch (error) {
        console.error(`[ErrorRecovery] Failed to retry DLQ item`, error);
      }
    }

    console.log(`[ErrorRecovery] Retried ${retriedItems.length} items from DLQ`);
    return retriedItems;
  }

  // ============================================================================
  // ERROR STATISTICS & ANALYTICS
  // ============================================================================

  /**
   * Update error statistics
   */
  private updateErrorStats(errorCode: string): void {
    const current = this.errorStats.get(errorCode);
    if (current) {
      current.count++;
      current.lastOccurred = new Date();
    } else {
      this.errorStats.set(errorCode, {
        count: 1,
        lastOccurred: new Date(),
      });
    }
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(): {
    totalErrors: number;
    errorsByCode: Array<{ code: string; count: number; lastOccurred: Date }>;
    queueStatus: any;
    dlqStatus: any;
  } {
    let totalErrors = 0;
    const errorsByCode = Array.from(this.errorStats.entries()).map(([code, stats]) => {
      totalErrors += stats.count;
      return {
        code,
        count: stats.count,
        lastOccurred: stats.lastOccurred,
      };
    });

    return {
      totalErrors,
      errorsByCode: errorsByCode.sort((a, b) => b.count - a.count),
      queueStatus: this.getQueueStatus(),
      dlqStatus: {
        total: this.deadLetterQueue.size,
        oldest: Array.from(this.deadLetterQueue.values()).sort(
          (a, b) => a.firstFailedAt.getTime() - b.firstFailedAt.getTime()
        )[0],
      },
    };
  }

  /**
   * Clear all statistics
   */
  clearStatistics(): void {
    this.errorStats.clear();
  }

  // ============================================================================
  // ERROR CLASSIFICATION LOGIC
  // ============================================================================

  private inferCategory(
    code: string,
    message: string
  ): 'transient' | 'permanent' | 'recoverable' {
    if (
      code.includes('TIMEOUT') ||
      code.includes('CONNECTION') ||
      code.includes('NETWORK')
    ) {
      return 'transient';
    }

    if (
      code.includes('INVALID') ||
      code.includes('VALIDATION') ||
      code.includes('SCHEMA')
    ) {
      return 'permanent';
    }

    if (
      code.includes('DUPLICATE') ||
      code.includes('CONSTRAINT') ||
      code.includes('CONFLICT')
    ) {
      return 'recoverable';
    }

    return 'recoverable';
  }

  private isRetryable(code: string): boolean {
    // Permanent errors should not be retried
    const permanentErrors = ['INVALID_FORMAT', 'INVALID_DATA_TYPE', 'VALIDATION_FAILED'];
    return !permanentErrors.some((err) => code.includes(err));
  }

  private getSuggestedAction(code: string): string {
    if (code.includes('TIMEOUT'))
      return 'Increase timeout or check network connectivity';
    if (code.includes('DUPLICATE'))
      return 'Manual deduplication or merge required';
    if (code.includes('VALIDATION'))
      return 'Review data quality and schema validation';
    if (code.includes('DATABASE'))
      return 'Check database connection and capacity';
    return 'Review error logs and retry';
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeErrorClassifiers(): void {
    const commonErrors: ErrorClassification[] = [
      {
        code: 'TIMEOUT',
        category: 'transient',
        retryable: true,
        suggestedAction: 'Increase timeout or check connection',
      },
      {
        code: 'CONNECTION_ERROR',
        category: 'transient',
        retryable: true,
        suggestedAction: 'Check network connectivity',
      },
      {
        code: 'DATABASE_ERROR',
        category: 'transient',
        retryable: true,
        suggestedAction: 'Check database availability',
      },
      {
        code: 'OUT_OF_MEMORY',
        category: 'transient',
        retryable: true,
        suggestedAction: 'Reduce batch size',
      },
      {
        code: 'VALIDATION_FAILED',
        category: 'permanent',
        retryable: false,
        suggestedAction: 'Fix data quality issues',
      },
      {
        code: 'INVALID_SCHEMA',
        category: 'permanent',
        retryable: false,
        suggestedAction: 'Update schema definition',
      },
      {
        code: 'DUPLICATE_RECORD',
        category: 'recoverable',
        retryable: true,
        suggestedAction: 'Merge or deduplicate',
      },
      {
        code: 'CONSTRAINT_VIOLATION',
        category: 'recoverable',
        retryable: true,
        suggestedAction: 'Resolve foreign key or unique constraints',
      },
    ];

    commonErrors.forEach((err) => {
      this.registerErrorClassifier(err.code, err);
    });
  }
}

export const pipelineErrorRecoveryService = new PipelineErrorRecoveryService();
export default PipelineErrorRecoveryService;
