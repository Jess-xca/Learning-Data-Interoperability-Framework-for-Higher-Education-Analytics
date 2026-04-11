/**
 * Analytics Service (Refactored for Modularity)
 * Uses centralized dummyGenerator for data consistency
 * Provides analytics-specific queries and aggregations
 */

import {
  generateDummyStudents,
  generateAnalyticsData,
  getPerformanceMetric,
  getAllPerformanceMetrics,
  getEngagementMetric,
  getAllEngagementMetrics,
  getDashboardData,
} from '../data/dummyGenerator';
import type {
  StudentPerformanceMetric,
  EngagementMetric,
} from '../types/analytics';

class AnalyticsServiceClass {
  private _initialized = false;

  private init(): void {
    if (this._initialized) return;
    const students = generateDummyStudents(50);
    generateAnalyticsData(students);
    this._initialized = true;
  }

  /**
   * Get performance metric for student-course
   */
  calculateStudentPerformance(studentId: string, courseId: string): StudentPerformanceMetric | undefined {
    this.init();
    return getPerformanceMetric(studentId, courseId);
  }

  /**
   * Get all student performance metrics
   */
  getAllStudentPerformance(): StudentPerformanceMetric[] {
    this.init();
    return getAllPerformanceMetrics();
  }

  /**
   * Get engagement metric for student-course
   */
  calculateEngagementMetrics(studentId: string, courseId: string): EngagementMetric | undefined {
    this.init();
    return getEngagementMetric(studentId, courseId);
  }

  /**
   * Get all engagement metrics
   */
  getStudentEngagement(): EngagementMetric[] {
    this.init();
    return getAllEngagementMetrics();
  }

  /**
   * Get all course analytics
   */
  getAllCourseAnalytics() {
    const courses = ['MATH101', 'CS201', 'BUS301', 'ENG101', 'PHY201'];
    return courses.map(courseId => ({
      courseId,
      courseName: this.getCourseNameFromId(courseId),
      totalStudents: 50,
      averagePerformance: 72.5,
      engagementRate: 78,
      completionRate: 85,
    }));
  }

  /**
   * Get performance dashboard data
   */
  getPerformanceDashboard() {
    this.init();
    const dashboardData = getDashboardData();
    return {
      ...dashboardData,
      insights: [
        'Critical risk students increased by 3% - immediate interventions recommended',
        'Engagement scores show strong correlation with course completion rates',
      ],
      chartData: {
        studentsByRisk: [
          { level: 'Critical', count: dashboardData.criticalRisk },
          { level: 'High', count: dashboardData.highRisk },
          { level: 'Medium', count: dashboardData.totalStudents * 0.3 },
          { level: 'Low', count: dashboardData.totalStudents * 0.2 },
        ],
        performanceTrend: [65, 68, 70, 72, 73, 75],
      },
    };
  }

  /**
   * Get cohort analysis
   */
  getCohortAnalysis(cohortId: string = 'cohort-2024') {
    return {
      cohortId,
      cohortName: `Cohort ${cohortId}`,
      retentionRate: 91.5,
      completionRate: 87.2,
      employmentRate: 88.0,
      averageGPA: 3.15,
      demographicAnalysis: {
        totalStudents: 50,
        byProgram: [
          { program: 'Computer Science', count: 12 },
          { program: 'Engineering', count: 10 },
          { program: 'Business', count: 8 },
          { program: 'Education', count: 6 },
          { program: 'Science', count: 14 },
        ],
      },
      performanceDistribution: {
        excellent: 15,
        good: 18,
        average: 12,
        needsImprovement: 5,
      },
    };
  }

  /**
   * Generate sample analytics data
   */
  generateSampleAnalyticsData(): void {
    this.init();
  }

  /**
   * Helper: Get course name from ID
   */
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
}

export const analyticsService = new AnalyticsServiceClass();
