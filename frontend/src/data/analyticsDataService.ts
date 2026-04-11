/**
 * Centralized Analytics & Prediction Dummy Data Service
 * Single source of truth for all analytics and prediction data
 * Uses proper student format from dummyGenerator
 * Reusable across all pages and future backend integration
 */

import { generateDummyStudents, type DummyStudent } from './dummyGenerator';
import type {
  StudentPerformanceMetric,
  EngagementMetric,
} from '../types/analytics';
import type {
  StudentSuccessPrediction,
  InterventionRecommendation,
  EarlyWarningIndicator,
} from '../types/prediction';

class AnalyticsDataService {
  private students: DummyStudent[] = [];
  private performanceMetrics: Map<string, StudentPerformanceMetric> = new Map();
  private engagementMetrics: Map<string, EngagementMetric> = new Map();
  private predictions: Map<string, StudentSuccessPrediction> = new Map();
  private interventions: Map<string, InterventionRecommendation[]> = new Map();
  private earlyWarnings: EarlyWarningIndicator[] = [];
  private initialized = false;

  /**
   * Initialize data service - call once on app startup
   */
  initialize(): void {
    if (this.initialized) return;

    // Generate 50 students using proper format
    this.students = generateDummyStudents(50);

    // Generate analytics data for each student
    this.students.forEach((student) => {
      this.generatePerformanceMetrics(student);
      this.generateEngagementMetrics(student);
      this.generatePrediction(student);
      this.generateInterventions(student);
      this.generateEarlyWarnings(student);
    });

    this.initialized = true;
  }

  /**
   * Generate performance metrics based on student data
   */
  private generatePerformanceMetrics(student: DummyStudent): void {
    const courseIds = ['MATH101', 'CS201', 'BUS301', 'ENG101', 'PHY201'];

    courseIds.forEach((courseId) => {
      const key = `${student.id}-${courseId}`;
      const metric: StudentPerformanceMetric = {
        studentId: student.id,
        courseName: this.getCourseNameFromId(courseId),
        courseId,
        enrollmentDate: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
        currentGrade: this.calculateGradeFromGPA(student.gpa),
        averageScore: Math.round(this.calculateGradeFromGPA(student.gpa) * 0.95),
        assignmentCompletion: Math.min(100, student.attendanceRate + Math.random() * 20),
        assessmentCount: Math.floor(Math.random() * 15) + 5,
        lastActivityDate: new Date(student.lastActivity),
        totalActivityHours: Math.floor(Math.random() * 80) + 20,
        engagementScore: student.engagementScore,
        trend: student.gpa > 3.0 ? 'improving' : student.gpa > 2.0 ? 'stable' : 'declining',
      };
      this.performanceMetrics.set(key, metric);
    });
  }

  /**
   * Generate engagement metrics based on student data
   */
  private generateEngagementMetrics(student: DummyStudent): void {
    const courseIds = ['MATH101', 'CS201', 'BUS301', 'ENG101', 'PHY201'];

    courseIds.forEach((courseId) => {
      const key = `${student.id}-${courseId}`;
      const metric: EngagementMetric = {
        studentId: student.id,
        courseId,
        courseName: this.getCourseNameFromId(courseId),
        logins: Math.floor(Math.random() * 30) + 5,
        assignmentsSubmitted: Math.floor(Math.random() * 20) + 3,
        forumPostsCount: Math.floor(Math.random() * 15),
        videosWatched: Math.floor(Math.random() * 50) + 10,
        timeSpentMinutes: Math.floor(Math.random() * 200) + 50,
        resourcesAccessed: Math.floor(Math.random() * 100) + 20,
        lastLoginDate: new Date(student.lastActivity),
        engagementLevel: this.getEngagementLevel(student.engagementScore),
      };
      this.engagementMetrics.set(key, metric);
    });
  }

  /**
   * Generate student success prediction based on student data
   */
  private generatePrediction(student: DummyStudent): void {
    const successProbability = Math.max(10, 100 - student.riskScore);
    const prediction: StudentSuccessPrediction = {
      studentId: student.id,
      studentName: student.name,
      cohortId: 'cohort-2024',
      cohortName: `Class of ${new Date().getFullYear()}`,
      currentTerm: `Fall ${new Date().getFullYear()}`,
      riskLevel: student.predictionStatus as 'critical' | 'high' | 'medium' | 'low' | 'no-risk',
      riskScore: student.riskScore,
      successProbability,
      predictedGPA: Math.max(0, student.gpa + (Math.random() * 0.5 - 0.25)),
      completionProbability: Math.min(100, successProbability + Math.random() * 20) as any,
      retentionProbability: Math.min(100, successProbability + Math.random() * 15) as any,
      predictionConfidence: Math.floor(Math.random() * 20) + 80,
      lastUpdated: new Date(student.lastActivity),
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    this.predictions.set(student.id, prediction);
  }

  /**
   * Generate intervention recommendations based on student risk level
   */
  private generateInterventions(student: DummyStudent): void {
    const interventionTypes = ['tutoring', 'academic', 'personal', 'tech-support', 'financial', 'career-counseling'] as const;
    const recommendations: InterventionRecommendation[] = [];

    const priority = student.riskScore > 85 ? 'urgent' : student.riskScore > 60 ? 'high' : 'medium';

    interventionTypes.slice(0, student.riskScore > 75 ? 4 : 3).forEach((type, index) => {
      recommendations.push({
        id: `rec-${student.id}-${type}-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        courseId: 'general',
        courseName: 'Overall Program',
        riskLevel: student.predictionStatus as 'critical' | 'high' | 'medium' | 'low' | 'no-risk',
        interventionType: type,
        interventionName: this.getInterventionName(type),
        description: this.getInterventionDescription(type),
        priority,
        estimatedImpact: Math.floor(Math.random() * 30) + 15,
        timeToImplement: ['1 day', '3 days', '1 week'][index % 3],
        recommendedBy: 'Risk Model',
        acceptanceStatus: Math.random() > 0.3 ? 'pending' : 'accepted',
        createdDate: new Date(),
        targetCompletionDate: new Date(Date.now() + (type === 'tutoring' ? 7 : 14) * 24 * 60 * 60 * 1000),
      });
    });

    this.interventions.set(student.id, recommendations);
  }

  /**
   * Generate early warning indicators for at-risk students
   */
  private generateEarlyWarnings(student: DummyStudent): void {
    if (student.riskScore > 50) {
      const warningTypes = ['grade-drop', 'low-engagement', 'attendance-issue', 'assessment-failure'];

      warningTypes.forEach((type) => {
        if (Math.random() > 0.5) {
          const warning: EarlyWarningIndicator = {
            studentId: student.id,
            courseId: 'general',
            courseName: 'Overall Program',
            warningType: type as any,
            severity: student.riskScore > 80 ? 'critical' : 'warning',
            daysUntilAtRisk: Math.floor(Math.random() * 14) + 1,
            detectedDate: new Date(),
            triggeringMetric: type,
            currentValue: student.riskScore,
            expectedValue: 50,
            actionItems: ['Review recent performance', 'Schedule advising meeting', 'Explore support services'],
          };
          this.earlyWarnings.push(warning);
        }
      });
    }
  }

  /**
   * PUBLIC API: Get all students
   */
  getStudents(): DummyStudent[] {
    this.initialize();
    return this.students;
  }

  /**
   * PUBLIC API: Get performance metric for student-course
   */
  getPerformanceMetric(studentId: string, courseId: string): StudentPerformanceMetric | undefined {
    this.initialize();
    return this.performanceMetrics.get(`${studentId}-${courseId}`);
  }

  /**
   * PUBLIC API: Get all performance metrics
   */
  getAllPerformanceMetrics(): StudentPerformanceMetric[] {
    this.initialize();
    return Array.from(this.performanceMetrics.values());
  }

  /**
   * PUBLIC API: Get engagement metric for student-course
   */
  getEngagementMetric(studentId: string, courseId: string): EngagementMetric | undefined {
    this.initialize();
    return this.engagementMetrics.get(`${studentId}-${courseId}`);
  }

  /**
   * PUBLIC API: Get all engagement metrics
   */
  getAllEngagementMetrics(): EngagementMetric[] {
    this.initialize();
    return Array.from(this.engagementMetrics.values());
  }

  /**
   * PUBLIC API: Get prediction for student
   */
  getPrediction(studentId: string): StudentSuccessPrediction | undefined {
    this.initialize();
    return this.predictions.get(studentId);
  }

  /**
   * PUBLIC API: Get all predictions
   */
  getAllPredictions(): StudentSuccessPrediction[] {
    this.initialize();
    return Array.from(this.predictions.values());
  }

  /**
   * PUBLIC API: Get interventions for student
   */
  getInterventions(studentId: string): InterventionRecommendation[] {
    this.initialize();
    return this.interventions.get(studentId) || [];
  }

  /**
   * PUBLIC API: Get all early warnings
   */
  getEarlyWarnings(): EarlyWarningIndicator[] {
    this.initialize();
    return this.earlyWarnings;
  }

  /**
   * PUBLIC API: Get analytics dashboard data
   */
  getDashboardData() {
    this.initialize();
    return {
      totalStudents: this.students.length,
      criticalRisk: this.predictions.size > 0 ? Array.from(this.predictions.values()).filter(p => p.riskLevel === 'critical').length : 0,
      highRisk: this.predictions.size > 0 ? Array.from(this.predictions.values()).filter(p => p.riskLevel === 'high').length : 0,
      atRiskCount: this.earlyWarnings.length,
      avgSuccessProbability: this.predictions.size > 0 
        ? Array.from(this.predictions.values()).reduce((sum, p) => sum + p.successProbability, 0) / this.predictions.size 
        : 0,
    };
  }

  // Helper methods

  private getCourseNameFromId(courseId: string): string {
    const courses: Record<string, string> = {
      MATH101: 'Calculus I',
      CS201: 'Data Structures',
      BUS301: 'Business Strategy',
      ENG101: 'English Composition',
      PHY201: 'Physics II',
    };
    return courses[courseId] || courseId;
  }

  private calculateGradeFromGPA(gpa: number): number {
    // Convert GPA (0-4.0) to percentage (0-100)
    return Math.max(0, Math.min(100, (gpa / 4.0) * 100));
  }

  private getEngagementLevel(score: number): 'high' | 'medium' | 'low' | 'inactive' {
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    if (score >= 25) return 'low';
    return 'inactive';
  }

  private getInterventionName(type: string): string {
    const names: Record<string, string> = {
      tutoring: 'Peer Tutoring Program',
      academic: 'Academic Advising',
      personal: 'Counseling Support',
      'tech-support': 'Technology Workshop',
      financial: 'Financial Aid Review',
      'career-counseling': 'Career Planning',
    };
    return names[type] || 'Support Intervention';
  }

  private getInterventionDescription(type: string): string {
    const descriptions: Record<string, string> = {
      tutoring: 'One-on-one tutoring sessions to improve academic performance',
      academic: 'Academic advising and course planning support',
      personal: 'Personal counseling and mental health support',
      'tech-support': 'Technical assistance with learning management systems',
      financial: 'Financial aid consultation and support',
      'career-counseling': 'Career planning and professional development',
    };
    return descriptions[type] || 'Support intervention';
  }
}

// Export singleton instance
export const analyticsDataService = new AnalyticsDataService();
