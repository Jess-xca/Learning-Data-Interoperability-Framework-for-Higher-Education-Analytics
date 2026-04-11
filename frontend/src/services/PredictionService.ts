/**
 * Prediction Service (Refactored for Modularity)
 * Uses centralized dummyGenerator for data consistency
 * Provides prediction-specific methods and calculations
 */

import {
  generateDummyStudents,
  generateAnalyticsData,
  getAllPredictions,
  getPrediction,
  getInterventions,
  getAllEarlyWarnings,
} from '../data/dummyGenerator';
import type {
  StudentSuccessPrediction,
  CohortRiskProfile,
} from '../types/prediction';

class PredictionServiceClass {
  private _initialized = false;

  private init(): void {
    if (this._initialized) return;
    const students = generateDummyStudents(50);
    generateAnalyticsData(students);
    this._initialized = true;
  }

  /**
   * Get all student predictions
   */
  getAllPredictions(): StudentSuccessPrediction[] {
    this.init();
    return getAllPredictions();
  }

  /**
   * Get prediction for specific student
   */
  getPrediction(studentId: string): StudentSuccessPrediction | undefined {
    this.init();
    return getPrediction(studentId);
  }

  /**
   * Get recommendations for specific student
   */
  getRecommendations(studentId: string) {
    this.init();
    return getInterventions(studentId);
  }

  /**
   * Get early warnings for student or all students
   */
  getAllEarlyWarnings() {
    this.init();
    return getAllEarlyWarnings();
  }

  /**
   * Filter predictions by risk level
   */
  getPredictionsByRiskLevel(riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'no-risk'): StudentSuccessPrediction[] {
    return this.getAllPredictions().filter(p => p.riskLevel === riskLevel);
  }

  /**
   * Get risk statistics for dashboard
   */
  getRiskStatistics() {
    const predictions = this.getAllPredictions();
    return {
      total: predictions.length,
      critical: predictions.filter(p => p.riskLevel === 'critical').length,
      high: predictions.filter(p => p.riskLevel === 'high').length,
      medium: predictions.filter(p => p.riskLevel === 'medium').length,
      low: predictions.filter(p => p.riskLevel === 'low').length,
      noRisk: predictions.filter(p => p.riskLevel === 'no-risk').length,
      avgSuccessProbability: predictions.length > 0 
        ? predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length 
        : 0,
    };
  }

  /**
   * Get cohort risk profile
   */
  getCohortRiskProfile(cohortId?: string): CohortRiskProfile {
    const students = generateDummyStudents(50);
    const predictions = this.getAllPredictions();
    const stats = this.getRiskStatistics();

    return {
      cohortId: cohortId || 'cohort-2024',
      cohortName: `Class of ${new Date().getFullYear()}`,
      academicTerm: `Fall ${new Date().getFullYear()}`,
      totalStudents: students.length,
      riskDistribution: {
        critical: stats.critical,
        high: stats.high,
        medium: stats.medium,
        low: stats.low,
        noRisk: stats.noRisk,
      },
      averageRiskScore: predictions.length > 0
        ? Math.round(predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length)
        : 0,
      averageSuccessProbability: stats.avgSuccessProbability as any,
      topRisks: [
        {
          riskFactor: 'Low Engagement',
          studentCount: Math.floor(students.length * 0.15),
          affectedPercent: 15,
        },
        {
          riskFactor: 'Low GPA',
          studentCount: Math.floor(students.length * 0.12),
          affectedPercent: 12,
        },
        {
          riskFactor: 'Poor Attendance',
          studentCount: Math.floor(students.length * 0.08),
          affectedPercent: 8,
        },
      ],
      recommendedGroupInterventions: [
        'Study skills workshops',
        'Peer mentoring program',
        'Financial aid counseling',
      ],
      comparisonToPreviousCohort: {
        riskScoreChange: -5,
        successRateChange: 2.3,
        trend: 'improving',
      },
    };
  }

  /**
   * Generate sample data (initialize service on app startup)
   */
  generateSamplePredictionData(): void {
    this.init();
  }
}

export const predictionService = new PredictionServiceClass();
