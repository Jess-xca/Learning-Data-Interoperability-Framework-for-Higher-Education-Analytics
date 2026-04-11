/**
 * Data Validation Service
 * Comprehensive validation rules engine for educational data
 * Ensures data quality before transformation and loading
 */

import type { ValidationRule, RecordValidationResult, ValidationViolation } from '../types/etl';

export interface ValidationProfile {
  id: string;
  name: string;
  description?: string;
  rules: ValidationRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DataQualityReport {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  qualityScore: number; // 0-100
  violations: ValidationViolation[];
  recommendations: string[];
}

class DataValidationServiceClass {
  private profiles: Map<string, ValidationProfile> = new Map();
  private defaultRules: ValidationRule[] = this.getDefaultRules();

  /**
   * Get default validation rules for common educational data
   */
  private getDefaultRules(): ValidationRule[] {
    return [
      {
        id: 'rule-user-id',
        field: 'id',
        type: 'required',
        config: { dataType: 'string' },
        errorMessage: 'User ID is required',
        criticalLevel: 'error',
      },
      {
        id: 'rule-email',
        field: 'email',
        type: 'format',
        config: { formatPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
        errorMessage: 'Invalid email format',
        criticalLevel: 'error',
      },
      {
        id: 'rule-name',
        field: 'name',
        type: 'required',
        config: { dataType: 'string' },
        errorMessage: 'Name is required',
        criticalLevel: 'error',
      },
      {
        id: 'rule-first-name',
        field: 'firstName',
        type: 'required',
        config: { dataType: 'string' },
        errorMessage: 'First name is required',
        criticalLevel: 'error',
      },
      {
        id: 'rule-last-name',
        field: 'lastName',
        type: 'required',
        config: { dataType: 'string' },
        errorMessage: 'Last name is required',
        criticalLevel: 'error',
      },
      {
        id: 'rule-role',
        field: 'role',
        type: 'required',
        config: {
          allowedValues: ['student', 'instructor', 'admin', 'ta', 'parent'],
        },
        errorMessage: 'Invalid role',
        criticalLevel: 'error',
      },
      {
        id: 'rule-course-id',
        field: 'courseId',
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
        criticalLevel: 'warning',
      },
      {
        id: 'rule-enrollment-status',
        field: 'status',
        type: 'required',
        config: { allowedValues: ['active', 'inactive', 'pending', 'completed'] },
        errorMessage: 'Invalid enrollment status',
        criticalLevel: 'error',
      },
      {
        id: 'rule-score-range',
        field: 'score',
        type: 'range',
        config: { min: 0, max: 100 },
        errorMessage: 'Score must be between 0 and 100',
        criticalLevel: 'warning',
      },
    ];
  }

  /**
   * Create validation profile
   */
  createProfile(name: string, rules: ValidationRule[]): ValidationProfile {
    const profile: ValidationProfile = {
      id: `profile-${Date.now()}`,
      name,
      rules,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Get validation profile
   */
  getProfile(profileId: string): ValidationProfile | undefined {
    return this.profiles.get(profileId);
  }

  /**
   * List all profiles
   */
  getAllProfiles(): ValidationProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Validate single record against rules
   */
  validateRecord(
    record: any,
    rules: ValidationRule[] = this.defaultRules,
  ): RecordValidationResult {
    const violations: ValidationViolation[] = [];

    for (const rule of rules) {
      const violation = this.checkRule(record, rule);
      if (violation) {
        violations.push(violation);
      }
    }

    // Calculate quality score (0-100)
    const score = Math.max(
      0,
      100 - violations.filter((v) => v.severity === 'error').length * 10,
    );

    return {
      recordId: record.id || 'unknown',
      isValid: violations.filter((v) => v.severity === 'error').length === 0,
      violations,
      score,
    };
  }

  /**
   * Check single validation rule
   */
  private checkRule(record: any, rule: ValidationRule): ValidationViolation | null {
    const value = record[rule.field];

    // Required check
    if (rule.type === 'required') {
      if (value === undefined || value === null || value === '') {
        return {
          field: rule.field,
          ruleId: rule.id,
          message: rule.errorMessage,
          severity: rule.criticalLevel,
          value,
          expected: 'not empty',
        };
      }
    }

    // Type check
    if (rule.type === 'type' && value !== undefined && value !== null) {
      const expectedType = rule.config.dataType;
      const actualType = typeof value;

      if (!(
        (expectedType === 'string' && actualType === 'string') ||
        (expectedType === 'number' && actualType === 'number') ||
        (expectedType === 'boolean' && actualType === 'boolean')
      )) {
        return {
          field: rule.field,
          ruleId: rule.id,
          message: rule.errorMessage,
          severity: rule.criticalLevel,
          value,
          expected: expectedType,
        };
      }
    }

    // Format check
    if (rule.type === 'format' && value !== undefined && value !== null) {
      const pattern = rule.config.formatPattern;
      if (pattern && !new RegExp(pattern).test(String(value))) {
        return {
          field: rule.field,
          ruleId: rule.id,
          message: rule.errorMessage,
          severity: rule.criticalLevel,
          value,
          expected: pattern,
        };
      }
    }

    // Unique check
    if (rule.type === 'unique' && value !== undefined && value !== null) {
      // In production, would check against database
      // For now, just pass
    }

    // Range check
    if (rule.type === 'range' && value !== undefined && value !== null) {
      const min = rule.config.min;
      const max = rule.config.max;
      const numValue = Number(value);

      if ((min !== undefined && numValue < min) || (max !== undefined && numValue > max)) {
        return {
          field: rule.field,
          ruleId: rule.id,
          message: rule.errorMessage,
          severity: rule.criticalLevel,
          value,
          expected: `between ${min} and ${max}`,
        };
      }
    }

    // Allowed values check
    if (
      rule.config.allowedValues &&
      value !== undefined &&
      value !== null
    ) {
      if (!rule.config.allowedValues.includes(value)) {
        return {
          field: rule.field,
          ruleId: rule.id,
          message: rule.errorMessage,
          severity: rule.criticalLevel,
          value,
          expected: rule.config.allowedValues.join(', '),
        };
      }
    }

    return null;
  }

  /**
   * Validate batch of records
   */
  validateBatch(
    records: any[],
    rules: ValidationRule[] = this.defaultRules,
  ): DataQualityReport {
    const results = records.map((record) => this.validateRecord(record, rules));

    const validRecords = results.filter((r) => r.isValid).length;
    const invalidRecords = results.filter((r) => !r.isValid).length;
    const avgScore =
      results.reduce((sum, r) => sum + r.score, 0) / records.length;

    // Collect all violations for reporting
    const allViolations = results.flatMap((r) => r.violations);
    const fieldViolations = new Map<string, number>();
    allViolations.forEach((v) => {
      fieldViolations.set(
        v.field,
        (fieldViolations.get(v.field) || 0) + 1,
      );
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      fieldViolations,
      invalidRecords,
      records.length,
    );

    return {
      totalRecords: records.length,
      validRecords,
      invalidRecords,
      qualityScore: Math.round(avgScore),
      violations: allViolations,
      recommendations,
    };
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(
    fieldViolations: Map<string, number>,
    invalidCount: number,
    totalCount: number,
  ): string[] {
    const recommendations: string[] = [];
    const invalidPercent = (invalidCount / totalCount) * 100;

    // Critical issues
    if (invalidPercent > 50) {
      recommendations.push('⚠️ More than 50% of records failed validation. Review data source.');
    }

    if (invalidPercent > 10) {
      recommendations.push('⚠️ Consider reviewing data quality in source system.');
    }

    // Field-specific recommendations
    fieldViolations.forEach((count, field) => {
      if (count > totalCount * 0.1) {
        recommendations.push(
          `✓ ${((count / totalCount) * 100).toFixed(1)}% records missing '${field}' field`,
        );
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('✓ Data quality is excellent (99%+ valid records)');
    }

    return recommendations;
  }

  /**
   * Get validation statistics
   */
  getValidationStats(results: RecordValidationResult[]): {
    totalValidation: number;
    errorCount: number;
    warningCount: number;
    highestSeverity: string[];
    averageScore: number;
  } {
    const allViolations = results.flatMap((r) => r.violations);
    const errorViolations = allViolations.filter((v) => v.severity === 'error');
    const warningViolations = allViolations.filter((v) => v.severity === 'warning');

    // Find fields with most errors
    const errorFields = new Map<string, number>();
    errorViolations.forEach((v) => {
      errorFields.set(v.field, (errorFields.get(v.field) || 0) + 1);
    });

    const highestSeverity = Array.from(errorFields.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([field]) => field);

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    return {
      totalValidation: results.length,
      errorCount: errorViolations.length,
      warningCount: warningViolations.length,
      highestSeverity,
      averageScore: Math.round(avgScore),
    };
  }

  /**
   * Create a user validation profile
   */
  createUserProfile(): ValidationProfile {
    return this.createProfile('User Data Validation', [
      this.defaultRules[0], // id
      this.defaultRules[1], // email
      this.defaultRules[3], // firstName
      this.defaultRules[4], // lastName
      this.defaultRules[5], // role
    ]);
  }

  /**
   * Create a course validation profile
   */
  createCourseProfile(): ValidationProfile {
    return this.createProfile('Course Data Validation', [
      this.defaultRules[6], // courseId
      this.defaultRules[7], // courseCode
    ]);
  }

  /**
   * Create an enrollment validation profile
   */
  createEnrollmentProfile(): ValidationProfile {
    return this.createProfile('Enrollment Data Validation', [
      this.defaultRules[0], // id
      this.defaultRules[5], // role
      this.defaultRules[8], // status
    ]);
  }
}

export const dataValidationService = new DataValidationServiceClass();
