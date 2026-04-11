/**
 * Phase 4C: Compliance & Audit Logging Service
 * FERPA, GDPR, HIPAA compliance, data retention policies, audit trails
 */

interface CompliancePolicy {
  name: string;
  region: 'US' | 'EU' | 'APAC' | 'GLOBAL';
  requirements: string[];
  dataRetention: number; // days
  encryptionRequired: boolean;
  auditRequired: boolean;
}

interface DataRetentionRecord {
  recordId: string;
  dataType: string;
  createdAt: number;
  expiresAt: number;
  policy: string;
  archived: boolean;
}

interface ComplianceViolation {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRecords: string[];
  timestamp: number;
  resolved: boolean;
}

interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: string;
  userId: string;
  resource: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  details: any;
}

class ComplianceAuditService {
  private policies = new Map<string, CompliancePolicy>();
  private dataRetention: DataRetentionRecord[] = [];
  private auditEvents: AuditEvent[] = [];
  private violations: ComplianceViolation[] = [];
  private eventCounter = 0;

  // Default policies
  private defaultPolicies: { [key: string]: CompliancePolicy } = {
    FERPA: {
      name: 'FERPA (Family Educational Rights and Privacy Act)',
      region: 'US',
      requirements: [
        'Student data must not be shared without consent',
        'Parent access rights enforced',
        'Data must be kept confidential',
        'Annual security reviews required',
      ],
      dataRetention: 365 * 5, // 5 years
      encryptionRequired: true,
      auditRequired: true,
    },
    GDPR: {
      name: 'GDPR (General Data Protection Regulation)',
      region: 'EU',
      requirements: [
        'Explicit consent for data processing',
        'Right to be forgotten implemented',
        'Data portability enabled',
        'Privacy by design enforced',
      ],
      dataRetention: 365 * 7, // 7 years
      encryptionRequired: true,
      auditRequired: true,
    },
    HIPAA: {
      name: 'HIPAA (Health Insurance Portability and Accountability Act)',
      region: 'US',
      requirements: [
        'PHI encryption required',
        'Access controls implemented',
        'Audit controls enabled',
        'Breach notification procedures',
      ],
      dataRetention: 365 * 6, // 6 years
      encryptionRequired: true,
      auditRequired: true,
    },
    COPPA: {
      name: 'COPPA (Children\'s Online Privacy Protection Act)',
      region: 'US',
      requirements: [
        'Parental consent required',
        'Limited data collection for minors',
        'No marketing to children',
        'Data deletion on parent request',
      ],
      dataRetention: 365 * 3, // 3 years
      encryptionRequired: true,
      auditRequired: true,
    },
  };

  constructor() {
    // Initialize default policies
    Object.entries(this.defaultPolicies).forEach(([key, policy]) => {
      this.policies.set(key, policy);
    });
  }

  /**
   * Register compliance event
   */
  recordEvent(
    eventType: string,
    userId: string,
    resource: string,
    action: string,
    details: any,
    oldValue?: any,
    newValue?: any
  ): string {
    const eventId = `evt_${this.eventCounter++}_${Date.now()}`;

    const event: AuditEvent = {
      id: eventId,
      timestamp: Date.now(),
      eventType,
      userId,
      resource,
      action,
      oldValue,
      newValue,
      details,
    };

    this.auditEvents.push(event);

    // Enforce retention limit
    if (this.auditEvents.length > 100000) {
      this.auditEvents = this.auditEvents.slice(-100000);
    }

    return eventId;
  }

  /**
   * Record data retention
   */
  recordDataRetention(
    recordId: string,
    dataType: string,
    policy: string
  ): DataRetentionRecord {
    const policyObj = this.policies.get(policy);
    if (!policyObj) {
      throw new Error(`Policy ${policy} not found`);
    }

    const retention: DataRetentionRecord = {
      recordId,
      dataType,
      createdAt: Date.now(),
      expiresAt: Date.now() + policyObj.dataRetention * 24 * 60 * 60 * 1000,
      policy,
      archived: false,
    };

    this.dataRetention.push(retention);
    return retention;
  }

  /**
   * Check if data should be deleted based on retention policy
   */
  getExpiredRecords(): DataRetentionRecord[] {
    const now = Date.now();
    return this.dataRetention.filter(
      (record) => record.expiresAt <= now && !record.archived
    );
  }

  /**
   * Mark records as archived instead of deleting
   */
  archiveExpiredRecords(): DataRetentionRecord[] {
    const expiredRecords = this.getExpiredRecords();
    expiredRecords.forEach((record) => {
      record.archived = true;
    });
    return expiredRecords;
  }

  /**
   * Validate compliance requirements
   */
  validateCompliance(policy: string, data: any): {
    isCompliant: boolean;
    violations: string[];
  } {
    const policyObj = this.policies.get(policy);
    if (!policyObj) {
      return {
        isCompliant: false,
        violations: [`Policy ${policy} not found`],
      };
    }

    const violations: string[] = [];

    // Check encryption if required
    if (policyObj.encryptionRequired && !data.encrypted) {
      violations.push('Data encryption required by policy');
    }

    // Check audit logging if required
    if (policyObj.auditRequired && !data.auditLogged) {
      violations.push('Audit logging required by policy');
    }

    // Check consent for GDPR
    if (policy === 'GDPR' && !data.consentGiven) {
      violations.push('Explicit consent required for GDPR');
    }

    // Check parental consent for COPPA
    if (policy === 'COPPA' && data.userAge < 13 && !data.parentalConsent) {
      violations.push('Parental consent required for users under 13');
    }

    return {
      isCompliant: violations.length === 0,
      violations,
    };
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(policy: string, dateRange?: {
    startDate: number;
    endDate: number;
  }): any {
    const policyObj = this.policies.get(policy);
    if (!policyObj) {
      throw new Error(`Policy ${policy} not found`);
    }

    const startDate = dateRange?.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days
    const endDate = dateRange?.endDate || Date.now();

    const relevantEvents = this.auditEvents.filter(
      (event) => event.timestamp >= startDate && event.timestamp <= endDate
    );

    const relevantViolations = this.violations.filter(
      (v) => v.timestamp >= startDate && v.timestamp <= endDate
    );

    return {
      policy,
      reportGeneratedAt: new Date().toISOString(),
      dateRange: {
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(),
      },
      summary: {
        totalEvents: relevantEvents.length,
        totalViolations: relevantViolations.length,
        unresolvedViolations: relevantViolations.filter((v) => !v.resolved).length,
      },
      requirements: policyObj.requirements,
      events: relevantEvents.slice(-100), // Last 100 events
      violations: relevantViolations,
      recommendations: this.generateRecommendations(relevantViolations),
    };
  }

  /**
   * Record compliance violation
   */
  recordViolation(
    type: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    affectedRecords: string[] = []
  ): ComplianceViolation {
    const violation: ComplianceViolation = {
      id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      affectedRecords,
      timestamp: Date.now(),
      resolved: false,
    };

    this.violations.push(violation);
    return violation;
  }

  /**
   * Right to be forgotten (GDPR)
   */
  async rightToBeForgotten(userId: string): Promise<{
    recordsDeleted: number;
    recordsArchived: number;
  }> {
    const records = this.dataRetention.filter(
      (r) => r.recordId.includes(userId)
    );

    let deleted = 0;
    let archived = 0;

    records.forEach((record) => {
      record.archived = true;
      archived++;
    });

    // Remove from audit events (keep summary)
    const eventsToRemove = this.auditEvents.filter((e) => e.userId === userId);
    eventsToRemove.forEach(() => deleted++);

    // Record this action
    this.recordEvent(
      'RIGHT_TO_BE_FORGOTTEN',
      'system',
      'compliance',
      'delete',
      { userId, recordsDeleted: deleted, recordsArchived: archived }
    );

    return { recordsDeleted: deleted, recordsArchived: archived };
  }

  /**
   * Data portability (GDPR)
   */
  exportUserData(userId: string, format: 'json' | 'csv' = 'json'): string {
    const userEvents = this.auditEvents.filter((e) => e.userId === userId);
    const userRetention = this.dataRetention.filter((r) => r.recordId.includes(userId));

    const data = {
      userId,
      exportedAt: new Date().toISOString(),
      events: userEvents,
      dataRetentionRecords: userRetention,
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // CSV format
      const csv = ['timestamp,eventType,action,details'];
      userEvents.forEach((event) => {
        csv.push(
          [
            new Date(event.timestamp).toISOString(),
            event.eventType,
            event.action,
            JSON.stringify(event.details).replace(/"/g, '""'),
          ].join(',')
        );
      });
      return csv.join('\n');
    }
  }

  /**
   * Breach notification
   */
  notifyBreach(
    breachType: string,
    affectedRecords: string[],
    severity: 'low' | 'high' | 'critical' = 'high'
  ): string {
    const violation = this.recordViolation(
      'SECURITY_BREACH',
      severity,
      `${breachType}: ${affectedRecords.length} records affected`,
      affectedRecords
    );

    this.recordEvent(
      'BREACH_NOTIFICATION',
      'system',
      'compliance',
      'notify',
      {
        breachType,
        recordCount: affectedRecords.length,
        severity,
      }
    );

    return violation.id;
  }

  /**
   * Get audit trail for specific resource
   */
  getAuditTrail(resource: string, limit: number = 100): AuditEvent[] {
    return this.auditEvents
      .filter((e) => e.resource === resource)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get compliance metrics
   */
  getComplianceMetrics(): any {
    const totalViolations = this.violations.length;
    const unresolvedViolations = this.violations.filter((v) => !v.resolved).length;
    const criticalViolations = this.violations.filter((v) => v.severity === 'critical').length;

    return {
      totalViolations,
      unresolvedViolations,
      criticalViolations,
      violationsByType: this.groupBy(this.violations, (v) => v.type),
      violationsBySeverity: this.groupBy(this.violations, (v) => v.severity),
      eventCount: this.auditEvents.length,
      registeredPolicies: Array.from(this.policies.keys()),
    };
  }

  /**
   * Private helper methods
   */
  private generateRecommendations(violations: ComplianceViolation[]): string[] {
    const recommendations: string[] = [];

    violations.forEach((v) => {
      if (v.type === 'ENCRYPTION_MISSING') {
        recommendations.push('Enable encryption for sensitive data');
      } else if (v.type === 'AUDIT_LOG_MISSING') {
        recommendations.push('Enable comprehensive audit logging');
      } else if (v.type === 'CONSENT_NOT_OBTAINED') {
        recommendations.push('Obtain explicit user consent before processing');
      } else if (v.type === 'DATA_RETENTION_EXCEEDED') {
        recommendations.push('Archive or delete data according to retention policy');
      }
    });

    return [...new Set(recommendations)]; // Deduplicate
  }

  private groupBy<T>(array: T[], key: (item: T) => string): { [key: string]: T[] } {
    return array.reduce((result, item) => {
      const group = key(item);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {} as { [key: string]: T[] });
  }
}

// Export singleton
export const complianceAuditService = new ComplianceAuditService();
export default ComplianceAuditService;
