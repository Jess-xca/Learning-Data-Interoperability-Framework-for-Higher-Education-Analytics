/**
 * Data Lineage Tracker Service
 * Tracks data provenance, transformations, and quality history
 */

import { DataRecord } from '../types/etl-extended';

interface LineageNode {
  id: string;
  type: 'source' | 'transform' | 'validate' | 'load';
  name: string;
  timestamp: Date;
  duration?: number;
  status: 'success' | 'failed' | 'partial';
  metadata: Record<string, any>;
}

interface RecordLineage {
  recordId: string;
  sourceSystem: string;
  nodes: LineageNode[];
  dataHistory: Array<{
    timestamp: Date;
    stage: string;
    data: Record<string, any>;
  }>;
  qualityHistory: Array<{
    timestamp: Date;
    stage: string;
    score: number;
  }>;
}

interface LineageGraph {
  executionId: string;
  pipelineId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  recordCount: number;
  recordLineages: Map<string, RecordLineage>;
  transformationChain: LineageNode[];
}

/**
 * DataLineageTracker - Complete data provenance tracking
 */
class DataLineageTracker {
  private lineageGraphs: Map<string, LineageGraph> = new Map();
  private executionLineages: Map<string, RecordLineage[]> = new Map();
  private lineageIndex: Map<string, Set<string>> = new Map(); // For quick lookups

  constructor() {
    console.log('[DataLineageTracker] Initialized');
  }

  // ============================================================================
  // LINEAGE GRAPH MANAGEMENT
  // ============================================================================

  /**
   * Create a new lineage graph for an execution
   */
  createLineageGraph(
    executionId: string,
    pipelineId: string,
    recordCount: number
  ): LineageGraph {
    const graph: LineageGraph = {
      executionId,
      pipelineId,
      startTime: new Date(),
      status: 'running',
      recordCount,
      recordLineages: new Map(),
      transformationChain: [],
    };

    this.lineageGraphs.set(executionId, graph);
    console.log(
      `[DataLineageTracker] Graph created for execution: ${executionId} (${recordCount} records)`
    );

    return graph;
  }

  /**
   * Get a lineage graph
   */
  getLineageGraph(executionId: string): LineageGraph | undefined {
    return this.lineageGraphs.get(executionId);
  }

  /**
   * Complete a lineage graph
   */
  completeLineageGraph(executionId: string, status: 'completed' | 'failed'): void {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return;

    graph.status = status;
    graph.endTime = new Date();
    console.log(`[DataLineageTracker] Graph completed: ${executionId} (${status})`);
  }

  // ============================================================================
  // RECORD LINEAGE TRACKING
  // ============================================================================

  /**
   * Initialize lineage for a record
   */
  initializeRecordLineage(
    executionId: string,
    record: DataRecord,
    sourceSystem: string
  ): RecordLineage {
    const recordLineage: RecordLineage = {
      recordId: record.id,
      sourceSystem,
      nodes: [
        {
          id: `node_source_${Date.now()}`,
          type: 'source',
          name: sourceSystem,
          timestamp: new Date(),
          status: 'success',
          metadata: { recordId: record.id, system: sourceSystem },
        },
      ],
      dataHistory: [
        {
          timestamp: new Date(),
          stage: 'source',
          data: { ...record.data },
        },
      ],
      qualityHistory: [
        {
          timestamp: new Date(),
          stage: 'source',
          score: record.quality.score,
        },
      ],
    };

    const graph = this.lineageGraphs.get(executionId);
    if (graph) {
      graph.recordLineages.set(record.id, recordLineage);
    }

    this.addToIndex(executionId, record.id);
    return recordLineage;
  }

  /**
   * Add transformation node to lineage
   */
  addTransformationNode(
    executionId: string,
    recordId: string,
    ruleName: string,
    duration: number,
    status: 'success' | 'failed' | 'partial',
    dataAfter: Record<string, any>,
    metadata?: Record<string, any>
  ): void {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return;

    let recordLineage = graph.recordLineages.get(recordId);
    if (!recordLineage) return;

    const node: LineageNode = {
      id: `node_transform_${Date.now()}`,
      type: 'transform',
      name: ruleName,
      timestamp: new Date(),
      duration,
      status,
      metadata: metadata || {},
    };

    recordLineage.nodes.push(node);
    recordLineage.dataHistory.push({
      timestamp: new Date(),
      stage: `transform_${ruleName}`,
      data: { ...dataAfter },
    });

    if (!graph.transformationChain.find((n) => n.name === ruleName)) {
      graph.transformationChain.push(node);
    }

    graph.recordLineages.set(recordId, recordLineage);
  }

  /**
   * Add validation node to lineage
   */
  addValidationNode(
    executionId: string,
    recordId: string,
    valid: boolean,
    qualityScore: number,
    issues: Array<{ field: string; message: string }>,
    duration: number
  ): void {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return;

    let recordLineage = graph.recordLineages.get(recordId);
    if (!recordLineage) return;

    const node: LineageNode = {
      id: `node_validate_${Date.now()}`,
      type: 'validate',
      name: 'Data Validation',
      timestamp: new Date(),
      duration,
      status: valid ? 'success' : 'partial',
      metadata: {
        valid,
        qualityScore,
        issueCount: issues.length,
        issues,
      },
    };

    recordLineage.nodes.push(node);
    recordLineage.qualityHistory.push({
      timestamp: new Date(),
      stage: 'validation',
      score: qualityScore,
    });

    graph.recordLineages.set(recordId, recordLineage);
  }

  /**
   * Add load node to lineage
   */
  addLoadNode(
    executionId: string,
    recordId: string,
    target: string,
    success: boolean,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return;

    let recordLineage = graph.recordLineages.get(recordId);
    if (!recordLineage) return;

    const node: LineageNode = {
      id: `node_load_${Date.now()}`,
      type: 'load',
      name: `Load to ${target}`,
      timestamp: new Date(),
      duration,
      status: success ? 'success' : 'failed',
      metadata: { target, ...metadata },
    };

    recordLineage.nodes.push(node);
    graph.recordLineages.set(recordId, recordLineage);
  }

  // ============================================================================
  // LINEAGE RETRIEVAL & ANALYSIS
  // ============================================================================

  /**
   * Get record lineage
   */
  getRecordLineage(executionId: string, recordId: string): RecordLineage | undefined {
    const graph = this.lineageGraphs.get(executionId);
    return graph?.recordLineages.get(recordId);
  }

  /**
   * Get all lineages for an execution
   */
  getExecutionLineages(executionId: string): RecordLineage[] {
    const graph = this.lineageGraphs.get(executionId);
    return graph ? Array.from(graph.recordLineages.values()) : [];
  }

  /**
   * Trace record history through pipeline
   */
  traceRecordHistory(executionId: string, recordId: string): {
    path: LineageNode[];
    dataTimeline: Array<{ timestamp: Date; stage: string; data: any }>;
    qualityTimeline: Array<{ timestamp: Date; stage: string; score: number }>;
  } {
    const lineage = this.getRecordLineage(executionId, recordId);
    if (!lineage) {
      return {
        path: [],
        dataTimeline: [],
        qualityTimeline: [],
      };
    }

    return {
      path: lineage.nodes,
      dataTimeline: lineage.dataHistory,
      qualityTimeline: lineage.qualityHistory,
    };
  }

  /**
   * Find all records from a specific source
   */
  findRecordsBySource(executionId: string, sourceSystem: string): RecordLineage[] {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return [];

    return Array.from(graph.recordLineages.values()).filter(
      (l) => l.sourceSystem === sourceSystem
    );
  }

  /**
   * Find records affected by a transformation rule
   */
  findRecordsAffectedByTransformation(
    executionId: string,
    transformationName: string
  ): RecordLineage[] {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return [];

    return Array.from(graph.recordLineages.values()).filter((lineage) =>
      lineage.nodes.some(
        (n) =>
          n.type === 'transform' &&
          n.name.toLowerCase().includes(transformationName.toLowerCase())
      )
    );
  }

  /**
   * Find records with validation failures
   */
  findFailedRecords(executionId: string): RecordLineage[] {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return [];

    return Array.from(graph.recordLineages.values()).filter((lineage) => {
      const validationNode = lineage.nodes.find((n) => n.type === 'validate');
      return validationNode && validationNode.status !== 'success';
    });
  }

  /**
   * Get transformation chain for execution
   */
  getTransformationChain(executionId: string): LineageNode[] {
    const graph = this.lineageGraphs.get(executionId);
    return graph?.transformationChain || [];
  }

  // ============================================================================
  // STATISTICS & ANALYTICS
  // ============================================================================

  /**
   * Get lineage statistics
   */
  getLineageStatistics(executionId: string): {
    totalRecords: number;
    recordsTracked: number;
    averageNodes: number;
    stageStatistics: {
      source: number;
      transform: number;
      validate: number;
      load: number;
    };
    qualityTrend: { initial: number; final: number; change: number };
  } {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) {
      return {
        totalRecords: 0,
        recordsTracked: 0,
        averageNodes: 0,
        stageStatistics: { source: 0, transform: 0, validate: 0, load: 0 },
        qualityTrend: { initial: 0, final: 0, change: 0 },
      };
    }

    const lineages = Array.from(graph.recordLineages.values());
    const stageStats = { source: 0, transform: 0, validate: 0, load: 0 };
    let totalNodes = 0;
    const initialQuality: number[] = [];
    const finalQuality: number[] = [];

    lineages.forEach((lineage) => {
      totalNodes += lineage.nodes.length;
      lineage.nodes.forEach((node) => {
        stageStats[node.type as keyof typeof stageStats]++;
      });

      if (lineage.qualityHistory.length > 0) {
        initialQuality.push(lineage.qualityHistory[0].score);
        finalQuality.push(
          lineage.qualityHistory[lineage.qualityHistory.length - 1].score
        );
      }
    });

    const avgInitial =
      initialQuality.length > 0
        ? initialQuality.reduce((a, b) => a + b, 0) / initialQuality.length
        : 0;
    const avgFinal =
      finalQuality.length > 0
        ? finalQuality.reduce((a, b) => a + b, 0) / finalQuality.length
        : 0;

    return {
      totalRecords: graph.recordCount,
      recordsTracked: lineages.length,
      averageNodes: lineages.length > 0 ? totalNodes / lineages.length : 0,
      stageStatistics: stageStats,
      qualityTrend: {
        initial: Math.round(avgInitial * 100) / 100,
        final: Math.round(avgFinal * 100) / 100,
        change: Math.round((avgFinal - avgInitial) * 100) / 100,
      },
    };
  }

  /**
   * Export lineage as graph format
   */
  exportLineageGraph(executionId: string): {
    nodes: any[];
    edges: any[];
  } {
    const graph = this.lineageGraphs.get(executionId);
    if (!graph) return { nodes: [], edges: [] };

    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeIdMap = new Map<string, string>();

    // Create source nodes
    nodes.push({
      id: 'source',
      label: 'Data Source',
      type: 'source',
      size: 30,
    });

    // Create stage nodes from transformation chain
    graph.transformationChain.forEach((node, index) => {
      const nodeId = `stage_${index}`;
      nodeIdMap.set(node.id, nodeId);

      nodes.push({
        id: nodeId,
        label: node.name,
        type: node.type,
        status: node.status,
        size: 25,
      });

      if (index === 0) {
        edges.push({ source: 'source', target: nodeId });
      } else {
        edges.push({
          source: `stage_${index - 1}`,
          target: nodeId,
        });
      }
    });

    // Create target node
    nodes.push({
      id: 'target',
      label: 'Data Warehouse',
      type: 'load',
      size: 30,
    });

    if (graph.transformationChain.length > 0) {
      edges.push({
        source: `stage_${graph.transformationChain.length - 1}`,
        target: 'target',
      });
    } else {
      edges.push({ source: 'source', target: 'target' });
    }

    return { nodes, edges };
  }

  /**
   * Clear old lineage graphs (keep only recent ones)
   */
  cleanup(retentionDays: number = 30): void {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - retentionDays);

    let deletedCount = 0;
    for (const [executionId, graph] of this.lineageGraphs) {
      if (graph.endTime && graph.endTime < cutoffTime) {
        this.lineageGraphs.delete(executionId);
        deletedCount++;
      }
    }

    console.log(
      `[DataLineageTracker] Cleanup completed: ${deletedCount} old graphs removed`
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private addToIndex(executionId: string, recordId: string): void {
    if (!this.lineageIndex.has(executionId)) {
      this.lineageIndex.set(executionId, new Set());
    }
    this.lineageIndex.get(executionId)!.add(recordId);
  }

  /**
   * Get total executions tracked
   */
  getExecutionCount(): number {
    return this.lineageGraphs.size;
  }

  /**
   * Get total records tracked
   */
  getTotalRecordsTracked(): number {
    let total = 0;
    this.lineageGraphs.forEach((graph) => {
      total += graph.recordLineages.size;
    });
    return total;
  }
}

export const dataLineageTracker = new DataLineageTracker();
export default DataLineageTracker;
