/**
 * Data Source Service
 * Manages connections to external data sources (LMS, SIS, etc.)
 * Handles CRUD operations, sync scheduling, and status tracking
 */

import type {
  DataSource,
  DataSourceConnection,
  DataSourceTestResult,
  DataSourceOperationResult,
  SyncHistory,
  DataSourceRecordCounts,
} from "../types/datasources";

class DataSourceService {
  private dataSources: Map<string, DataSource> = new Map();
  private connections: Map<string, DataSourceConnection> = new Map();
  private syncHistory: Map<string, SyncHistory> = new Map();

  /**
   * Add a new data source
   */
  async addDataSource(config: Partial<DataSource>): Promise<DataSource> {
    const id = `ds-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newSource: DataSource = {
      id,
      type: config.type || "mock",
      name: config.name || "Unnamed Source",
      description: config.description,
      url: config.url || "",
      credentials: config.credentials || {},
      status: "disconnected",
      recordCounts: config.recordCounts || {
        students: 0,
        courses: 0,
        enrollments: 0,
      },
      syncFrequency: config.syncFrequency || "manual",
      enabled: config.enabled !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: config.organization,
      contactEmail: config.contactEmail,
    };

    this.dataSources.set(id, newSource);
    this.initializeSyncHistory(id);

    return newSource;
  }

  /**
   * Get all data sources
   */
  getAllDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Get a specific data source
   */
  async getDataSource(sourceId: string): Promise<DataSource | null> {
    return this.dataSources.get(sourceId) || null;
  }

  /**
   * Update a data source
   */
  async updateDataSource(
    sourceId: string,
    updates: Partial<DataSource>
  ): Promise<DataSource | null> {
    const source = this.dataSources.get(sourceId);
    if (!source) return null;

    const updated: DataSource = {
      ...source,
      ...updates,
      id: source.id, // Never change ID
      createdAt: source.createdAt, // Never change creation time
      updatedAt: new Date(),
    };

    this.dataSources.set(sourceId, updated);
    return updated;
  }

  /**
   * Delete a data source
   */
  async deleteDataSource(sourceId: string): Promise<boolean> {
    if (!this.dataSources.has(sourceId)) return false;

    this.dataSources.delete(sourceId);
    this.connections.delete(sourceId);
    this.syncHistory.delete(sourceId);

    return true;
  }

  /**
   * Test connection to data source
   */
  async testConnection(sourceId: string): Promise<DataSourceTestResult> {
    const source = await this.getDataSource(sourceId);
    if (!source) {
      return {
        success: false,
        message: "Data source not found",
        executionTime: 0,
        errors: ["Source ID invalid"],
      };
    }

    const startTime = performance.now();

    // Simulate connection test
    // In real implementation, would call actual connector
    return new Promise((resolve) => {
      setTimeout(() => {
        const testResult: DataSourceTestResult = {
          success: true,
          message: `Successfully connected to ${source.name}`,
          recordsRetrieved: Math.floor(Math.random() * 1000) + 100,
          executionTime: performance.now() - startTime,
        };

        // Update connection status
        this.connections.set(sourceId, {
          sourceId,
          isHealthy: true,
          credentialsValid: true,
          lastCheckTime: new Date(),
        });

        resolve(testResult);
      }, 1500); // Simulate network delay
    });
  }

  /**
   * Manually trigger a sync
   */
  async syncNow(sourceId: string): Promise<DataSourceOperationResult> {
    const source = await this.getDataSource(sourceId);
    if (!source) {
      return {
        success: false,
        message: "Data source not found",
        errors: ["Source ID invalid"],
      };
    }

    // Update status to syncing
    await this.updateDataSource(sourceId, { status: "disconnected" });

    // Simulate sync operation
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Mock: Generate sample data counts
        const newCounts: DataSourceRecordCounts = {
          students: Math.floor(Math.random() * 5000) + 500,
          courses: Math.floor(Math.random() * 500) + 50,
          enrollments: Math.floor(Math.random() * 15000) + 1000,
        };

        // Update source with new data and sync time
        await this.updateDataSource(sourceId, {
          status: "connected",
          recordCounts: newCounts,
          lastSync: new Date(),
        });

        resolve({
          success: true,
          message: `Successfully synced ${source.name}`,
          affectedRecords: newCounts.students + newCounts.courses + newCounts.enrollments,
        });
      }, 2000); // Simulate sync time
    });
  }

  /**
   * Get data source connection status
   */
  async getConnectionStatus(sourceId: string): Promise<DataSourceConnection | null> {
    return this.connections.get(sourceId) || null;
  }

  /**
   * Get sync history for a data source
   */
  async getSyncHistory(sourceId: string): Promise<SyncHistory | null> {
    return this.syncHistory.get(sourceId) || null;
  }

  /**
   * Enable/disable a data source
   */
  async toggleDataSource(sourceId: string, enabled: boolean): Promise<DataSource | null> {
    return this.updateDataSource(sourceId, { enabled });
  }

  /**
   * Get statistics across all data sources
   */
  getStatistics() {
    const sources = this.getAllDataSources();
    const totalRecords = sources.reduce(
      (sum, src) => ({
        students: sum.students + src.recordCounts.students,
        courses: sum.courses + src.recordCounts.courses,
        enrollments: sum.enrollments + src.recordCounts.enrollments,
      }),
      { students: 0, courses: 0, enrollments: 0 }
    );

    const connectedCount = sources.filter((s) => s.status === "connected").length;
    const errorCount = sources.filter((s) => s.status === "error").length;

    return {
      totalSources: sources.length,
      connectedSources: connectedCount,
      errorSources: errorCount,
      totalRecords,
      averageSyncTime:
        sources.reduce((sum, src) => sum + (src.updatedAt.getTime() - src.createdAt.getTime()), 0) /
          sources.length || 0,
    };
  }

  /**
   * Initialize sync history for a data source
   */
  private initializeSyncHistory(sourceId: string): void {
    this.syncHistory.set(sourceId, {
      sourceId,
      syncs: [],
      successRate: 100,
      avgSyncTime: 0,
    });
  }

  /**
   * Create sample data sources for testing
   */
  createSampleDataSources(): DataSource[] {
    const now = new Date();
    const samples: Partial<DataSource>[] = [
      {
        type: "moodle",
        name: "Moodle LMS - Main Campus",
        description: "Primary Moodle instance for main campus",
        url: "https://moodle.university.edu",
        organization: "University of Excellence",
        contactEmail: "lms-admin@university.edu",
        syncFrequency: "hourly",
        enabled: true,
        recordCounts: {
          students: 2850,
          courses: 145,
          enrollments: 8540,
        },
      },
      {
        type: "canvas",
        name: "Canvas LMS - Branch Campus",
        description: "Canvas instance for branch campus",
        url: "https://canvas.branch.university.edu",
        organization: "University of Excellence - Branch",
        contactEmail: "lms-branch@university.edu",
        syncFrequency: "daily",
        enabled: true,
        recordCounts: {
          students: 1240,
          courses: 68,
          enrollments: 3850,
        },
      },
      {
        type: "blackboard",
        name: "Blackboard - Professional Programs",
        description: "Blackboard instance for professional and graduate programs",
        url: "https://blackboard.professional.university.edu",
        organization: "University of Excellence",
        contactEmail: "professional-programs@university.edu",
        syncFrequency: "daily",
        enabled: true,
        recordCounts: {
          students: 580,
          courses: 42,
          enrollments: 1820,
        },
      },
      {
        type: "sis",
        name: "Banner SIS",
        description: "Student Information System - Banner ERP",
        url: "https://banner.university.edu",
        organization: "University of Excellence",
        contactEmail: "sis-admin@university.edu",
        syncFrequency: "daily",
        enabled: true,
        recordCounts: {
          students: 4500,
          courses: 280,
          enrollments: 13200,
        },
      },
      {
        type: "moodle",
        name: "Moodle - Online Learning",
        description: "Moodle instance for online courses",
        url: "https://moodle-online.university.edu",
        organization: "University of Excellence",
        contactEmail: "online-learning@university.edu",
        syncFrequency: "hourly",
        enabled: true,
        recordCounts: {
          students: 1950,
          courses: 85,
          enrollments: 5200,
        },
      },
    ];

    const created: DataSource[] = [];
    samples.forEach(async (sample) => {
      const source = await this.addDataSource(sample);
      // Mark as connected and set last sync time
      await this.updateDataSource(source.id, {
        status: "connected",
        lastSync: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
      });
      created.push(source);
    });

    return created;
  }
}

// Export singleton instance
export const dataSourceService = new DataSourceService();
export default DataSourceService;
