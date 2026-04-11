/**
 * Phase 4C: Performance Optimization Service
 * Handles batch processing, caching, parallel execution to support 10k+ records efficiently
 * Target: <5 seconds for 10,000 records with full lineage tracking
 */

interface CacheConfig {
  maxSize: number;
  ttlMs: number;
  strategy: 'LRU' | 'LFU' | 'FIFO';
}

interface BatchConfig {
  batchSize: number;
  parallelFactor: number;
  timeoutMs: number;
}

interface CacheEntry<T> {
  value: T;
  createdAt: number;
  accessCount: number;
  lastAccess: number;
}

class PerformanceOptimizationService {
  private cache = new Map<string, CacheEntry<any>>();
  private cacheConfig: CacheConfig = {
    maxSize: 10000,
    ttlMs: 300000, // 5 minutes
    strategy: 'LRU',
  };

  private batchConfig: BatchConfig = {
    batchSize: 100,
    parallelFactor: 4,
    timeoutMs: 30000,
  };

  private metrics = {
    cacheHits: 0,
    cacheMisses: 0,
    batchesProcessed: 0,
    recordsProcessed: 0,
    averageProcessingTime: 0,
    lastOperationMs: 0,
  };

  /**
   * Get or compute value with caching
   */
  memoize<T>(
    key: string,
    fn: () => T,
    ttlMs?: number
  ): T {
    const cached = this.cache.get(key);

    // Return if exists and not expired
    if (cached && Date.now() - cached.createdAt < (ttlMs || this.cacheConfig.ttlMs)) {
      cached.accessCount++;
      cached.lastAccess = Date.now();
      this.metrics.cacheHits++;
      return cached.value;
    }

    // Compute new value
    const value = fn();
    this.metrics.cacheMisses++;

    // Store in cache
    this.cache.set(key, {
      value,
      createdAt: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
    });

    // Enforce cache size limit
    if (this.cache.size > this.cacheConfig.maxSize) {
      this.evictFromCache();
    }

    return value;
  }

  /**
   * Process records in parallel batches
   */
  async processBatchParallel<T, R>(
    records: T[],
    processor: (record: T) => Promise<R>,
    batchSize?: number
  ): Promise<R[]> {
    const startTime = Date.now();
    const size = batchSize || this.batchConfig.batchSize;
    const results: R[] = [];

    // Split into batches
    const batches = this.chunkArray(records, size);

    // Process batches in parallel
    for (let i = 0; i < batches.length; i += this.batchConfig.parallelFactor) {
      const parallelBatches = batches.slice(
        i,
        i + this.batchConfig.parallelFactor
      );

      const batchResults = await Promise.allSettled(
        parallelBatches.map((batch) =>
          Promise.allSettled(batch.map(processor))
        )
      );

      // Collect results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          result.value.forEach((item) => {
            if (item.status === 'fulfilled') {
              results.push(item.value);
            }
          });
        }
      });

      this.metrics.batchesProcessed++;
    }

    this.metrics.recordsProcessed += records.length;
    this.metrics.lastOperationMs = Date.now() - startTime;
    this.updateAverageProcessingTime();

    return results;
  }

  /**
   * Transform records with transformation chain caching
   */
  transformWithCache<T>(
    records: T[],
    transformations: Array<(record: T) => T>,
    cacheKey?: string
  ): T[] {
    return records.map((record) => {
      const key = cacheKey ? `${cacheKey}:${JSON.stringify(record)}` : null;

      if (key) {
        return this.memoize(key, () => {
          let result = record;
          transformations.forEach((transform) => {
            result = transform(result);
          });
          return result;
        });
      } else {
        let result = record;
        transformations.forEach((transform) => {
          result = transform(result);
        });
        return result;
      }
    });
  }

  /**
   * Batch fetch with request deduplication
   */
  async batchFetchWithDedup<T>(
    keys: string[],
    fetchFn: (keys: string[]) => Promise<Map<string, T>>
  ): Promise<Map<string, T>> {
    // Find keys not in cache
    const uncachedKeys: string[] = [];
    const results = new Map<string, T>();

    for (const key of keys) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.createdAt < this.cacheConfig.ttlMs) {
        results.set(key, cached.value);
      } else {
        uncachedKeys.push(key);
      }
    }

    // Fetch uncached keys
    if (uncachedKeys.length > 0) {
      const fetched = await fetchFn(uncachedKeys);
      fetched.forEach((value, key) => {
        this.cache.set(key, {
          value,
          createdAt: Date.now(),
          accessCount: 0,
          lastAccess: Date.now(),
        });
        results.set(key, value);
      });
    }

    return results;
  }

  /**
   * Index records for fast lookups
   */
  createIndex<T>(
    records: T[],
    keyExtractor: (record: T) => string
  ): Map<string, T> {
    const index = new Map<string, T>();
    records.forEach((record) => {
      index.set(keyExtractor(record), record);
    });
    return index;
  }

  /**
   * Stream processing for large datasets
   */
  async *streamProcess<T, R>(
    records: T[],
    processor: (record: T) => Promise<R>,
    chunkSize: number = this.batchConfig.batchSize
  ): AsyncGenerator<R[], void, unknown> {
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const results = await Promise.all(chunk.map(processor));
      yield results;
    }
  }

  /**
   * Connection pool for database access
   */
  private connectionPool: any[] = [];
  private poolConfig = {
    minSize: 2,
    maxSize: 10,
  };

  createConnectionPool(
    factory: () => any,
    minSize?: number,
    maxSize?: number
  ): void {
    const min = minSize || this.poolConfig.minSize;
    const max = maxSize || this.poolConfig.maxSize;

    this.connectionPool = Array.from({ length: min }, factory);
  }

  async getConnection(): Promise<any> {
    if (this.connectionPool.length > 0) {
      return this.connectionPool.pop();
    }

    // Create new connection if pool is exhausted
    return { id: Math.random() };
  }

  releaseConnection(conn: any): void {
    if (this.connectionPool.length < this.poolConfig.maxSize) {
      this.connectionPool.push(conn);
    }
  }

  /**
   * Configuration management
   */
  setCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }

  setBatchConfig(config: Partial<BatchConfig>): void {
    this.batchConfig = { ...this.batchConfig, ...config };
  }

  /**
   * Cache management utilities
   */
  clearCache(): void {
    this.cache.clear();
    this.metrics.cacheHits = 0;
    this.metrics.cacheMisses = 0;
  }

  getCacheStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.cacheConfig.maxSize,
      hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses),
      hits: this.metrics.cacheHits,
      misses: this.metrics.cacheMisses,
    };
  }

  getMetrics(): any {
    return {
      ...this.metrics,
      cacheStats: this.getCacheStats(),
    };
  }

  /**
   * Private helper methods
   */
  private evictFromCache(): void {
    if (this.cacheConfig.strategy === 'LRU') {
      this.evictLRU();
    } else if (this.cacheConfig.strategy === 'LFU') {
      this.evictLFU();
    }
  }

  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.lastAccess < lruTime) {
        lruTime = entry.lastAccess;
        lruKey = key;
      }
    });

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private evictLFU(): void {
    let lfuKey: string | null = null;
    let lfuCount = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.accessCount < lfuCount) {
        lfuCount = entry.accessCount;
        lfuKey = key;
      }
    });

    if (lfuKey) {
      this.cache.delete(lfuKey);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private updateAverageProcessingTime(): void {
    // Exponential moving average
    this.metrics.averageProcessingTime =
      this.metrics.averageProcessingTime * 0.7 +
      this.metrics.lastOperationMs * 0.3;
  }
}

// Export singleton
export const performanceOptimizationService = new PerformanceOptimizationService();
export default PerformanceOptimizationService;
