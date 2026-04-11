/**
 * Health Monitor Service
 * Tracks data source health, credential expiration, and connection quality
 */

import type { DataSourceConnection } from "../types/datasources";

interface HealthAlert {
  sourceId: string;
  type: "connection_error" | "credential_expiring" | "high_error_rate" | "slow_response";
  severity: "warning" | "critical";
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

class HealthMonitorService {
  private alerts: Map<string, HealthAlert[]> = new Map();
  private lastCheckTime: Map<string, Date> = new Map();

  /**
   * Check health of a specific data source
   */
  async checkSourceHealth(
    sourceId: string,
    connection: DataSourceConnection
  ): Promise<HealthAlert[]> {
    const sourceAlerts: HealthAlert[] = [];

    // Check if connection is healthy
    if (!connection.isHealthy) {
      sourceAlerts.push({
        sourceId,
        type: "connection_error",
        severity: "critical",
        message: `Connection unhealthy: ${connection.errorDetails || "Unknown error"}`,
        timestamp: new Date(),
        dismissed: false,
      });
    }

    // Check credential validity
    if (!connection.credentialsValid) {
      sourceAlerts.push({
        sourceId,
        type: "connection_error",
        severity: "critical",
        message: "Credentials invalid. Please re-authenticate.",
        timestamp: new Date(),
        dismissed: false,
      });
    }

    // Check credential expiration
    if (connection.credentialExpiresAt) {
      const daysUntilExpiry = Math.floor(
        (connection.credentialExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        sourceAlerts.push({
          sourceId,
          type: "credential_expiring",
          severity: "warning",
          message: `Credentials expire in ${daysUntilExpiry} days`,
          timestamp: new Date(),
          dismissed: false,
        });
      } else if (daysUntilExpiry <= 0) {
        sourceAlerts.push({
          sourceId,
          type: "credential_expiring",
          severity: "critical",
          message: "Credentials have expired. Please renew.",
          timestamp: new Date(),
          dismissed: false,
        });
      }
    }

    // Check response time (if specified)
    if (connection.responseTime && connection.responseTime > 5000) {
      sourceAlerts.push({
        sourceId,
        type: "slow_response",
        severity: "warning",
        message: `Slow response time: ${connection.responseTime}ms`,
        timestamp: new Date(),
        dismissed: false,
      });
    }

    // Store alerts
    this.alerts.set(sourceId, sourceAlerts);
    this.lastCheckTime.set(sourceId, new Date());

    return sourceAlerts;
  }

  /**
   * Get current alerts for a data source
   */
  getAlerts(sourceId: string): HealthAlert[] {
    return this.alerts.get(sourceId) || [];
  }

  /**
   * Get all active alerts
   */
  getAllAlerts(): HealthAlert[] {
    return Array.from(this.alerts.values()).flat();
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(sourceId: string, alertIndex: number): void {
    const alerts = this.alerts.get(sourceId);
    if (alerts && alerts[alertIndex]) {
      alerts[alertIndex].dismissed = true;
    }
  }

  /**
   * Get health score for a source (0-100)
   */
  calculateHealthScore(connection: DataSourceConnection): number {
    let score = 100;

    if (!connection.isHealthy) score -= 50;
    if (!connection.credentialsValid) score -= 25;
    if (connection.responseTime && connection.responseTime > 5000) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Format health status for display
   */
  getHealthStatus(connection: DataSourceConnection): {
    status: "healthy" | "warning" | "critical";
    color: "green" | "yellow" | "red";
    message: string;
  } {
    const score = this.calculateHealthScore(connection);

    if (score >= 80) {
      return {
        status: "healthy",
        color: "green",
        message: "All systems operational",
      };
    } else if (score >= 50) {
      return {
        status: "warning",
        color: "yellow",
        message: "Minor issues detected",
      };
    } else {
      return {
        status: "critical",
        color: "red",
        message: "Critical issues detected",
      };
    }
  }

  /**
   * Start health monitoring (would run in background in real app)
   */
  startMonitoring(): void {
    // In production, this would set up intervals to periodically check health
    console.log("Health monitoring started");
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    console.log("Health monitoring stopped");
  }
}

export const healthMonitorService = new HealthMonitorService();
export default HealthMonitorService;
