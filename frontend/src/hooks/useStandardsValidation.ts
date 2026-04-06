import { useState, useCallback } from "react";
import {
  toggleStandard,
  updateInstitutionSettings,
  updateDataQualityMetrics,
} from "../store/slices/standardsSlice";
import { xAPIService } from "../services/xAPIService";
import { caliperService } from "../services/caliperService";
import { imsGlobalService } from "../services/imsGlobalService";
import { useAppDispatch, useAppSelector } from "./useRedux";

export interface ValidationReport {
  standard: string;
  compliant: boolean;
  passRate: number;
  totalRecords: number;
  errors: Array<{
    recordIndex: number;
    field: string;
    issue: string;
  }>;
  timestamp: string;
}

export const useStandardsValidation = () => {
  const dispatch = useAppDispatch();
  const standards = useAppSelector((state) => state.standards.enabledStandards);
  const metrics = useAppSelector((state) => state.standards.dataQualityMetrics);
  const settings = useAppSelector(
    (state) => state.standards.institutionSettings,
  );

  const [validationReports, setValidationReports] = useState<
    ValidationReport[]
  >([]);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate xAPI statements
   */
  const validateXAPIStatements = useCallback(
    (statements: any[]): ValidationReport => {
      const errors: Array<{
        recordIndex: number;
        field: string;
        issue: string;
      }> = [];

      statements.forEach((statement, index) => {
        const validation = xAPIService.validateStatement(statement);
        if (!validation.valid) {
          validation.errors.forEach((error) => {
            const [, msg] = error.split(": ");
            errors.push({
              recordIndex: index,
              field: msg || "unknown",
              issue: error,
            });
          });
        }
      });

      const compliant = errors.length === 0;
      const passRate =
        ((statements.length - errors.length) / statements.length) * 100;

      return {
        standard: "xAPI",
        compliant,
        passRate: Math.round(passRate),
        totalRecords: statements.length,
        errors,
        timestamp: new Date().toISOString(),
      };
    },
    [],
  );

  /**
   * Validate Caliper events
   */
  const validateCaliperEvents = useCallback(
    (events: any[]): ValidationReport => {
      const errors: Array<{
        recordIndex: number;
        field: string;
        issue: string;
      }> = [];

      events.forEach((event, index) => {
        const validation = caliperService.validateEvent(event);
        if (!validation.valid) {
          validation.errors.forEach((error) => {
            const [, msg] = error.split(": ");
            errors.push({
              recordIndex: index,
              field: msg || "unknown",
              issue: error,
            });
          });
        }
      });

      const compliant = errors.length === 0;
      const passRate = ((events.length - errors.length) / events.length) * 100;

      return {
        standard: "Caliper",
        compliant,
        passRate: Math.round(passRate),
        totalRecords: events.length,
        errors,
        timestamp: new Date().toISOString(),
      };
    },
    [],
  );

  /**
   * Validate LIS v2 records
   */
  const validateLISRecords = useCallback(
    (
      records: any[],
      type: "user" | "course" | "enrollment",
    ): ValidationReport => {
      const report = imsGlobalService.generateComplianceReport(
        records,
        type,
        "lis",
      );

      return {
        standard: "LIS v2",
        compliant: report.compliant,
        passRate: report.passRate,
        totalRecords: report.totalRecords,
        errors: report.issues,
        timestamp: new Date().toISOString(),
      };
    },
    [],
  );

  /**
   * Validate OneRoster records
   */
  const validateOneRosterRecords = useCallback(
    (
      records: any[],
      type: "user" | "class" | "enrollment",
    ): ValidationReport => {
      const report = imsGlobalService.generateComplianceReport(
        records,
        type === "class" ? "course" : type,
        "oneroster",
      );

      return {
        standard: "OneRoster",
        compliant: report.compliant,
        passRate: report.passRate,
        totalRecords: report.totalRecords,
        errors: report.issues,
        timestamp: new Date().toISOString(),
      };
    },
    [],
  );

  /**
   * Run all validations on provided data
   */
  const runFullValidation = useCallback(
    async (data: {
      xapiStatements?: any[];
      caliperEvents?: any[];
      lisRecords?: { type: "user" | "course" | "enrollment"; data: any[] }[];
      oneRosterRecords?: {
        type: "user" | "class" | "enrollment";
        data: any[];
      }[];
    }): Promise<ValidationReport[]> => {
      setIsValidating(true);
      const reports: ValidationReport[] = [];

      try {
        if (data.xapiStatements?.length) {
          reports.push(validateXAPIStatements(data.xapiStatements));
        }

        if (data.caliperEvents?.length) {
          reports.push(validateCaliperEvents(data.caliperEvents));
        }

        if (data.lisRecords) {
          data.lisRecords.forEach((record) => {
            reports.push(validateLISRecords(record.data, record.type));
          });
        }

        if (data.oneRosterRecords) {
          data.oneRosterRecords.forEach((record) => {
            reports.push(validateOneRosterRecords(record.data, record.type));
          });
        }

        setValidationReports(reports);

        // Update metrics in Redux
        const avgPassRate = Math.round(
          reports.reduce((sum, r) => sum + r.passRate, 0) / reports.length,
        );

        dispatch(
          updateDataQualityMetrics({
            standard: "xapi",
            metrics: {
              compliance: avgPassRate,
              recordsProcessed: data.xapiStatements?.length || 0,
              errors: data.xapiStatements
                ? data.xapiStatements.length -
                  Math.round((data.xapiStatements.length * avgPassRate) / 100)
                : 0,
              lastSync: new Date().toISOString(),
            },
          }),
        );

        return reports;
      } finally {
        setIsValidating(false);
      }
    },
    [
      validateXAPIStatements,
      validateCaliperEvents,
      validateLISRecords,
      validateOneRosterRecords,
      dispatch,
    ],
  );

  /**
   * Check if data meets compliance threshold
   */
  const isCompliant = useCallback(
    (passRate: number): boolean => {
      return passRate >= settings.complianceThreshold;
    },
    [settings.complianceThreshold],
  );

  /**
   * Detect data quality issues in batch
   */
  const detectQualityIssues = useCallback(
    (records: any[]): { field: string; issueCount: number }[] => {
      const issues: { [key: string]: number } = {};

      records.forEach((record) => {
        Object.keys(record).forEach((key) => {
          if (record[key] === null || record[key] === undefined) {
            issues[key] = (issues[key] || 0) + 1;
          }
        });
      });

      return Object.entries(issues)
        .map(([field, issueCount]) => ({ field, issueCount }))
        .sort((a, b) => b.issueCount - a.issueCount);
    },
    [],
  );

  /**
   * Generate compliance summary
   */
  const generateComplianceSummary = useCallback(() => {
    const summary = {
      totalStandards: standards.length,
      enabledStandards: standards.filter((s) => s.enabled).length,
      averageCompliance: Math.round(
        Object.values(metrics).reduce((sum, m) => sum + m.compliance, 0) /
          Object.keys(metrics).length,
      ),
      metricsSnapshot: {
        xapi: metrics.xapi.compliance,
        caliper: metrics.caliper.compliance,
        lis_v2: metrics.lis_v2.compliance,
        oneroster: metrics.oneroster.compliance,
      },
      lastValidation: validationReports[0]?.timestamp || null,
      requiresAttention: Object.values(metrics).some(
        (m) => m.compliance < settings.complianceThreshold,
      ),
    };

    return summary;
  }, [standards, metrics, settings.complianceThreshold, validationReports]);

  /**
   * Toggle standard enabled/disabled
   */
  const enableStandard = useCallback(
    (standardId: string, enabled: boolean) => {
      dispatch(toggleStandard({ standardId, enabled }));
    },
    [dispatch],
  );

  /**
   * Update compliance settings
   */
  const updateComplianceSettings = useCallback(
    (updates: Partial<typeof settings>) => {
      dispatch(updateInstitutionSettings(updates));
    },
    [dispatch],
  );

  return {
    standards,
    metrics,
    settings,
    validationReports,
    isValidating,
    validateXAPIStatements,
    validateCaliperEvents,
    validateLISRecords,
    validateOneRosterRecords,
    runFullValidation,
    isCompliant,
    detectQualityIssues,
    generateComplianceSummary,
    enableStandard,
    updateComplianceSettings,
  };
};
