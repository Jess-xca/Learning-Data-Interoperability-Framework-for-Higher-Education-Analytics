/**
 * Prediction Types
 * Data structures for student success prediction, risk modeling, and intervention recommendations
 */

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'no-risk';
export type SuccessProbability = number; // 0-100
export type InterventionType = 'academic' | 'financial' | 'personal' | 'tech-support' | 'career-counseling' | 'tutoring';

export interface StudentSuccessPrediction {
  studentId: string;
  studentName: string;
  cohortId: string;
  cohortName: string;
  currentTerm: string;
  successProbability: SuccessProbability; // % chance of completing program
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  predictedGPA: number; // Based on current performance
  completionProbability: SuccessProbability; // % chance of completing current term
  retentionProbability: SuccessProbability; // % chance of continuing next term
  predictionConfidence: number; // 0-100 (model confidence)
  lastUpdated: Date;
  nextReviewDate: Date;
}

export interface RiskModel {
  id: string;
  name: string;
  description: string;
  version: string;
  accuracy: number; // % - historical accuracy
  features: RiskFactor[];
  weights: Record<string, number>; // Feature importance weights
  threshold: number; // Risk score threshold
  lastTrainedDate: Date;
  modelType: 'logistic-regression' | 'decision-tree' | 'random-forest' | 'neural-network';
}

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  dataSource: string; // Where this metric comes from
  weight: number; // 0-1, importance in model
  threshold?: number;
  direction: 'positive' | 'negative'; // Does high value = more risk?
  category: 'academic' | 'engagement' | 'behavioral' | 'demographic' | 'financial';
}

export interface PredictionExplanation {
  studentId: string;
  riskLevel: RiskLevel;
  successProbability: SuccessProbability;
  topContributingFactors: Array<{
    factor: string;
    impact: number; // -100 to 100, how much it swings prediction
    direction: 'negative' | 'positive';
    description: string;
  }>;
  protectiveFactors: string[]; // Things helping the student
  riskFactors: string[]; // Things hurting the student
  interpretation: string; // Natural language explanation
}

export interface InterventionRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  riskLevel: RiskLevel;
  interventionType: InterventionType;
  interventionName: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedImpact: number; // % improvement expected
  timeToImplement: string; // "1 day", "1 week", etc.
  recommendedBy: string; // Which risk factor triggered this
  acceptanceStatus: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdDate: Date;
  targetCompletionDate?: Date;
  owner?: string; // Advisor or staff member assigned
}

export interface EarlyWarningIndicator {
  studentId: string;
  courseId: string;
  courseName: string;
  warningType: 'grade-drop' | 'low-engagement' | 'attendance-issue' | 'assessment-failure' | 'pattern-violation';
  severity: 'critical' | 'warning' | 'notice';
  detectedDate: Date;
  triggeringMetric: string;
  currentValue: number;
  expectedValue: number;
  daysUntilAtRisk: number; // Estimated days until student becomes at-risk
  actionItems: string[];
}

export interface StudentSuccessDrivers {
  studentId: string;
  courseId: string;
  positiveDrivers: Array<{
    driver: string;
    strength: 'very-strong' | 'strong' | 'moderate';
    impact: number; // Contribution to success %
  }>;
  negativeDrivers: Array<{
    driver: string;
    severity: 'critical' | 'significant' | 'moderate';
    impact: number; // Reduction to success %
  }>;
  overallSuccessPotential: number; // 0-100
  actionableInsights: string[];
}

export interface InterventionEffectivenessAnalysis {
  interventionId: string;
  interventionName: string;
  interventionType: InterventionType;
  studentCount: number; // How many students received this
  completionRate: number; // % who completed the intervention
  successImpact: number; // % improvement in success rate
  retentionImpact: number; // % improvement in retention
  gpaImpact: number; // Average GPA improvement
  costPerStudent: number; // If applicable
  roi: number; // Return on investment %
  studentFeedbackScore: number; // 0-100
  timeToImpact: string; // How long before seeing results
}

export interface CohortRiskProfile {
  cohortId: string;
  cohortName: string;
  academicTerm: string;
  totalStudents: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    noRisk: number;
  };
  averageRiskScore: number;
  averageSuccessProbability: SuccessProbability;
  topRisks: Array<{
    riskFactor: string;
    studentCount: number;
    affectedPercent: number;
  }>;
  recommendedGroupInterventions: string[];
  comparisonToPreviousCohort: {
    riskScoreChange: number; // % change
    successRateChange: number; // % change
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface PredictionMetrics {
  truePositives: number; // At-risk correctly identified
  trueNegatives: number; // Not at-risk correctly identified
  falsePositives: number; // Not at-risk but predicted as at-risk
  falseNegatives: number; // At-risk but not predicted
  precision: number; // TP/(TP+FP)
  recall: number; // TP/(TP+FN)
  f1Score: number; // Harmonic mean of precision and recall
  accuracy: number; // (TP+TN)/(TP+TN+FP+FN)
}

export interface SuccessPathway {
  studentId: string;
  currentMilestone: string;
  nextMilestones: string[];
  estimatedCompletionDate: Date;
  recommendedCourseSequence: Array<{
    courseId: string;
    courseName: string;
    prerequisitesMet: boolean;
    recommendedTerm: string;
    estimatedGrade: number;
  }>;
  potentialChallenges: string[];
  supportResourcesNeeded: string[];
}

export interface StudentCohortComparison {
  studentId: string;
  studentName: string;
  cohortId: string;
  cohortName: string;
  metricsVsCohort: {
    gpaPercentile: number; // Where student ranks in cohort (0-100)
    engagementPercentile: number;
    completionRatePercentile: number;
    successProbabilityPercentile: number;
  };
  performanceVsCohort: 'above-average' | 'at-average' | 'below-average';
  riskVsCohort: 'less-risk' | 'similar-risk' | 'more-risk';
  interventionNeeds: string[];
}
