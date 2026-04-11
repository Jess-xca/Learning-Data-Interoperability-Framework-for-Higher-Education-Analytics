/**
 * Transformation Service
 * Orchestrates data transformation across multiple educational standards
 * Handles mapping, validation, and export of standardized data
 */

import { imsGlobalService } from './imsGlobalService';
import type { LISUser, LISCourse, LISEnrollment } from './imsGlobalService';
import { xAPIService } from './xAPIService';
import type { xAPIStatement } from './xAPIService';
import { caliperService } from './caliperService';
import type { CaliperEvent } from './caliperService';

export interface TransformationConfig {
  dataSourceId: string;
  standards: ('ims_global' | 'xapi' | 'caliper')[];
  includeValidation: boolean;
  exportFormat: 'json' | 'csv' | 'xml';
}

export interface TransformationResult {
  dataSourceId: string;
  timestamp: Date;
  standards: {
    imsGlobal?: {
      users: LISUser[];
      courses: LISCourse[];
      enrollments: LISEnrollment[];
      validationReport?: {
        passCount: number;
        failCount: number;
      };
    };
    xapi?: {
      statements: xAPIStatement[];
      validationReport?: {
        totalStatements: number;
        validStatements: number;
        invalidStatements: number;
      };
    };
    caliper?: {
      events: CaliperEvent[];
      validationReport?: {
        totalEvents: number;
        validEvents: number;
        invalidEvents: number;
      };
    };
  };
  metrics: {
    transformationTime: number;
    recordsProcessed: number;
    errorsEncountered: number;
  };
}

export interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: 'direct' | 'concat' | 'format' | 'lookup';
  lookupMap?: Record<string, string>;
}

class TransformationServiceClass {
  private transformationHistory: Map<string, TransformationResult> = new Map();

  /**
   * Transform source data to standards
   */
  async transformData(
    sourceUsers: any[],
    sourceCourses: any[],
    sourceEnrollments: any[],
    config: TransformationConfig,
  ): Promise<TransformationResult> {
    const startTime = Date.now();
    const result: TransformationResult = {
      dataSourceId: config.dataSourceId,
      timestamp: new Date(),
      standards: {},
      metrics: {
        transformationTime: 0,
        recordsProcessed: 0,
        errorsEncountered: 0,
      },
    };

    try {
      // Transform to IMS Global if requested
      if (config.standards.includes('ims_global')) {
        result.standards.imsGlobal = this.transformToIMSGlobal(
          sourceUsers,
          sourceCourses,
          sourceEnrollments,
          config.includeValidation,
        );
      }

      // Transform to xAPI if requested
      if (config.standards.includes('xapi')) {
        result.standards.xapi = this.transformToXAPI(
          sourceUsers,
          sourceCourses,
          sourceEnrollments,
          config.includeValidation,
        );
      }

      // Transform to Caliper if requested
      if (config.standards.includes('caliper')) {
        result.standards.caliper = this.transformToCaliper(
          sourceUsers,
          sourceCourses,
          sourceEnrollments,
          config.includeValidation,
        );
      }

      result.metrics.transformationTime = Date.now() - startTime;
      result.metrics.recordsProcessed =
        sourceUsers.length + sourceCourses.length + sourceEnrollments.length;

      // Store in history
      this.transformationHistory.set(config.dataSourceId, result);

      return result;
    } catch (error) {
      result.metrics.errorsEncountered++;
      console.error('Transformation error:', error);
      throw error;
    }
  }

  /**
   * Transform to IMS Global format
   */
  private transformToIMSGlobal(
    sourceUsers: any[],
    sourceCourses: any[],
    sourceEnrollments: any[],
    includeValidation: boolean,
  ): TransformationResult['standards']['imsGlobal'] {
    const users = imsGlobalService.batchTransformToLISUsers(sourceUsers);
    const courses = imsGlobalService.batchTransformToLISCourses(sourceCourses);
    const enrollments =
      imsGlobalService.batchTransformToLISEnrollments(sourceEnrollments);

    const result: TransformationResult['standards']['imsGlobal'] = {
      users,
      courses,
      enrollments,
    };

    if (includeValidation) {
      const userValidation = imsGlobalService.checkDataQuality(
        users,
        'user',
        'lis',
      );
      result.validationReport = {
        passCount: userValidation.passCount,
        failCount: userValidation.failCount,
      };
    }

    return result;
  }

  /**
   * Transform to xAPI format
   */
  private transformToXAPI(
    sourceUsers: any[],
    sourceCourses: any[],
    sourceEnrollments: any[],
    includeValidation: boolean,
  ): TransformationResult['standards']['xapi'] {
    const statements: xAPIStatement[] = [];

    // Create enrollment statements for each enrollment
    sourceEnrollments.forEach((enrollment) => {
      const user = sourceUsers.find((u) => u.id === enrollment.userId);
      const course = sourceCourses.find((c) => c.id === enrollment.courseId);

      if (user && course) {
        const stmt = xAPIService.createEnrollmentStatement(
          user.email,
          user.fullName || `${user.firstName} ${user.lastName}`,
          course.id,
          course.name || course.title,
        );
        statements.push(stmt);
      }
    });

    const result: TransformationResult['standards']['xapi'] = {
      statements,
    };

    if (includeValidation) {
      const validation = xAPIService.validateBatch(statements);
      result.validationReport = {
        totalStatements: validation.totalStatements,
        validStatements: validation.validStatements,
        invalidStatements: validation.invalidStatements,
      };
    }

    return result;
  }

  /**
   * Transform to Caliper format
   */
  private transformToCaliper(
    sourceUsers: any[],
    sourceCourses: any[],
    sourceEnrollments: any[],
    includeValidation: boolean,
  ): TransformationResult['standards']['caliper'] {
    const events: CaliperEvent[] = [];

    // Create enrollment events for each enrollment
    sourceEnrollments.forEach((enrollment) => {
      const user = sourceUsers.find((u) => u.id === enrollment.userId);
      const course = sourceCourses.find((c) => c.id === enrollment.courseId);

      if (user && course) {
        const event = caliperService.createEnrollmentEvent(
          user.id,
          user.fullName || `${user.firstName} ${user.lastName}`,
          user.email,
          course.id,
          course.name || course.title,
        );
        events.push(event);
      }
    });

    const result: TransformationResult['standards']['caliper'] = {
      events,
    };

    if (includeValidation) {
      const validation = caliperService.validateBatch(events);
      result.validationReport = {
        totalEvents: validation.totalEvents,
        validEvents: validation.validEvents,
        invalidEvents: validation.invalidEvents,
      };
    }

    return result;
  }

  /**
   * Export transformed data
   */
  exportData(
    result: TransformationResult,
    standardType: 'ims_global' | 'xapi' | 'caliper',
    format: 'json' | 'csv' | 'xml',
  ): string {
    if (standardType === 'ims_global' && result.standards.imsGlobal) {
      const data = result.standards.imsGlobal;
      if (format === 'xml') {
        return imsGlobalService.exportAsXML(
          data.users,
          data.courses,
          data.enrollments,
        );
      } else if (format === 'csv') {
        // Export users as CSV
        return imsGlobalService.exportAsCSV(data.users, [
          'sourcedId',
          'userId',
          'email',
          'givenName',
          'familyName',
          'fullName',
        ]);
      } else {
        return imsGlobalService.exportAsJSON(
          data.users,
          data.courses,
          data.enrollments,
        );
      }
    } else if (standardType === 'xapi' && result.standards.xapi) {
      const statements = result.standards.xapi.statements;
      if (format === 'csv') {
        return xAPIService.exportAsCSV(statements);
      } else {
        return xAPIService.exportAsJSONLD(statements);
      }
    } else if (standardType === 'caliper' && result.standards.caliper) {
      const events = result.standards.caliper.events;
      if (format === 'csv') {
        return caliperService.exportAsCSV(events);
      } else {
        return caliperService.exportAsJSONLD(events);
      }
    }

    return '{}';
  }

  /**
   * Get transformation history for a data source
   */
  getTransformationHistory(dataSourceId: string): TransformationResult | undefined {
    return this.transformationHistory.get(dataSourceId);
  }

  /**
   * Clear transformation history
   */
  clearHistory(dataSourceId?: string): void {
    if (dataSourceId) {
      this.transformationHistory.delete(dataSourceId);
    } else {
      this.transformationHistory.clear();
    }
  }

  /**
   * Get sample data for preview
   */
  getSampleTransformation(): TransformationResult {
    const sampleUsers = [
      {
        id: 'user-001',
        email: 'student1@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
      },
      {
        id: 'user-002',
        email: 'instructor1@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
      },
    ];

    const sampleCourses = [
      {
        id: 'course-001',
        code: 'CS101',
        name: 'Introduction to Computer Science',
        description: 'Basic CS concepts',
      },
    ];

    const sampleEnrollments = [
      {
        id: 'enroll-001',
        userId: 'user-001',
        courseId: 'course-001',
        role: 'student',
        status: 'active',
      },
      {
        id: 'enroll-002',
        userId: 'user-002',
        courseId: 'course-001',
        role: 'instructor',
        status: 'active',
      },
    ];

    return {
      dataSourceId: 'sample-001',
      timestamp: new Date(),
      standards: {
        imsGlobal: this.transformToIMSGlobal(
          sampleUsers,
          sampleCourses,
          sampleEnrollments,
          true,
        ),
        xapi: this.transformToXAPI(
          sampleUsers,
          sampleCourses,
          sampleEnrollments,
          true,
        ),
        caliper: this.transformToCaliper(
          sampleUsers,
          sampleCourses,
          sampleEnrollments,
          true,
        ),
      },
      metrics: {
        transformationTime: 125,
        recordsProcessed: 5,
        errorsEncountered: 0,
      },
    };
  }

  /**
   * Compare data across standards
   */
  compareStandardTransformations(result: TransformationResult): {
    imsGlobalRecords: number;
    xapiStatements: number;
    caliperEvents: number;
    coverage: {
      users: number;
      courses: number;
      enrollments: number;
    };
  } {
    return {
      imsGlobalRecords:
        (result.standards.imsGlobal?.users.length || 0) +
        (result.standards.imsGlobal?.courses.length || 0) +
        (result.standards.imsGlobal?.enrollments.length || 0),
      xapiStatements: result.standards.xapi?.statements.length || 0,
      caliperEvents: result.standards.caliper?.events.length || 0,
      coverage: {
        users: result.standards.imsGlobal?.users.length || 0,
        courses: result.standards.imsGlobal?.courses.length || 0,
        enrollments: result.standards.imsGlobal?.enrollments.length || 0,
      },
    };
  }
}

export const transformationService = new TransformationServiceClass();
