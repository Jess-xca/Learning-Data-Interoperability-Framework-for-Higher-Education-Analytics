/**
 * Analytics Types
 * Data structures for learning analytics, performance metrics, and engagement tracking
 */

export type MetricType = 'engagement' | 'performance' | 'completion' | 'activity' | 'retention';
export type TimeRange = 'day' | 'week' | 'month' | 'semester' | 'year';
export type CohortSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface StudentPerformanceMetric {
  studentId: string;
  courseName: string;
  courseId: string;
  enrollmentDate: Date;
  currentGrade: number; // 0-100
  averageScore: number; // 0-100
  assignmentCompletion: number; // % completed
  assessmentCount: number;
  lastActivityDate: Date;
  totalActivityHours: number;
  engagementScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
}

export interface EngagementMetric {
  studentId: string;
  courseId: string;
  courseName: string;
  logins: number;
  assignmentsSubmitted: number;
  forumPostsCount: number;
  videosWatched: number;
  timeSpentMinutes: number;
  resourcesAccessed: number;
  lastLoginDate: Date;
  engagementLevel: 'high' | 'medium' | 'low' | 'inactive';
}

export interface CoursePerformanceAnalysis {
  courseId: string;
  courseName: string;
  courseCode: string;
  instructorName: string;
  enrollmentCount: number;
  completionRate: number; // % of students who completed
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  studentEngagementAverage: number;
  assessmentAverageScore: number;
  courseEffectivenessScore: number; // 0-100
  topicPerformance: Array<{
    topic: string;
    averageScore: number;
    studentCount: number;
  }>;
}

export interface CohortAnalysis {
  cohortId: string;
  cohortName: string;
  academicTerm: string;
  studentCount: number;
  programName: string;
  averageGPA: number;
  retentionRate: number; // %
  completionRate: number; // %
  employmentRate?: number; // %
  timeToCompletionDays: number;
  engagementMetrics: {
    averageLoginFrequency: number;
    averageTimeSpentPerWeek: number;
    assignmentSubmissionRate: number;
  };
  performanceDistribution: {
    highPerformers: number; // % GPA >= 3.5
    averagePerformers: number; // % 2.5-3.5
    atRiskStudents: number; // % < 2.5
  };
}

export interface AtRiskIndicator {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number; // 0-100
  riskFactors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendedInterventions: string[];
  lastReviewDate: Date;
  currentGrade?: number;
  attendanceRate?: number;
  engagementScore?: number;
}

export interface AnalyticsInsight {
  id: string;
  type: 'performance' | 'engagement' | 'retention' | 'completion' | 'intervention';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  affectedStudents: number;
  actionable: boolean;
  recommendation?: string;
  dataDriven: boolean;
  generatedDate: Date;
  timeRange: TimeRange;
}

export interface PerformanceDashboardData {
  totalStudents: number;
  averageGPA: number;
  enrollmentTrend: number; // % change
  completionRate: number; // %
  retentionRate: number; // %
  topCourses: CoursePerformanceAnalysis[];
  bottomCourses: CoursePerformanceAnalysis[];
  insights: AnalyticsInsight[];
  chartData: {
    gradeDistribution: Array<{ grade: string; count: number }>;
    engagementTrend: Array<{ date: string; score: number }>;
    completionRateTrend: Array<{ week: number; rate: number }>;
  };
}

export interface EnrollmentMetrics {
  courseId: string;
  courseName: string;
  totalEnrolled: number;
  activeStudents: number;
  inactiveStudents: number;
  completedStudents: number;
  withdrawnStudents: number;
  enrollmentGrowth: number; // % weekly
  averageTimeToFirstLogin: number; // days
  averageTimeToFirstSubmission: number; // days
}

export interface LearningOutcomeMetric {
  outcomeId: string;
  outcomeDescription: string;
  courseId: string;
  courseName: string;
  studentsMeasured: number;
  achievementRate: number; // % of students who achieved
  averageScore: number;
  improvementTrend: number; // % change from previous term
  byDemographic: Array<{
    group: string;
    achievementRate: number;
  }>;
}
