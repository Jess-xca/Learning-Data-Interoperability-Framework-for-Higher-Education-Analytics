/**
 * Mock LMS Connector
 * Development/testing connector that generates realistic mock data
 * Used for UI development without external LMS dependencies
 */

import type { DataSourceTestResult, DataSourceOperationResult } from "../../types/datasources";
import {
  BaseConnector,
  type LMSUser,
  type LMSCourse,
  type LMSEnrollment,
  type LMSActivity,
} from "./BaseConnector";

export class MockLMSConnector extends BaseConnector {
  /**
   * Test connection
   */
  async testConnection(): Promise<DataSourceTestResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Successfully connected to Mock LMS",
          recordsRetrieved: 2847,
          sampleData: [
            { type: "users", count: 1250 },
            { type: "courses", count: 85 },
            { type: "enrollments", count: 1512 },
          ],
          executionTime: 145,
        });
      }, 500);
    });
  }

  /**
   * Fetch mock users
   */
  async fetchUsers(): Promise<LMSUser[]> {
    const firstNames = ["Emma", "Michael", "Sarah", "James", "Lisa", "David", "Anna", "Robert"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];

    const users: LMSUser[] = [];
    for (let i = 0; i < 150; i++) {
      users.push({
        id: `user-${i + 1}`,
        email: `user${i + 1}@university.edu`,
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        role: i === 0 ? "admin" : i < 5 ? "instructor" : "student",
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(users), 800);
    });
  }

  /**
   * Fetch mock courses
   */
  async fetchCourses(): Promise<LMSCourse[]> {
    const courses: LMSCourse[] = [
      {
        id: "course-1",
        code: "CS-101",
        name: "Introduction to Computer Science",
        description: "Fundamentals of programming and algorithms",
        term: "Spring 2024",
        credits: 3,
      },
      {
        id: "course-2",
        code: "CS-201",
        name: "Data Structures",
        description: "Advanced data structures and algorithms",
        term: "Spring 2024",
        credits: 4,
      },
      {
        id: "course-3",
        code: "MATH-150",
        name: "Calculus I",
        description: "Differential calculus and applications",
        term: "Spring 2024",
        credits: 4,
      },
      {
        id: "course-4",
        code: "PHYS-101",
        name: "Physics I",
        description: "Mechanics and thermodynamics",
        term: "Spring 2024",
        credits: 4,
      },
      {
        id: "course-5",
        code: "ENG-101",
        name: "English Composition",
        description: "Writing and communication skills",
        term: "Spring 2024",
        credits: 3,
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => resolve(courses), 600);
    });
  }

  /**
   * Fetch mock enrollments
   */
  async fetchEnrollments(): Promise<LMSEnrollment[]> {
    const enrollments: LMSEnrollment[] = [];

    const courses = ["course-1", "course-2", "course-3", "course-4", "course-5"];
    let enrollmentId = 0;

    for (let i = 1; i <= 100; i++) {
      for (const courseId of courses) {
        if (Math.random() > 0.3) {
          // 70% enrollment rate
          enrollmentId++;
          enrollments.push({
            id: `enrollment-${enrollmentId}`,
            userId: `user-${i}`,
            courseId,
            role: i === 0 ? "instructor" : "student",
            status: Math.random() > 0.1 ? "active" : "completed",
            enrolledDate: new Date(2024, 0, 15),
          });
        }
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(enrollments), 700);
    });
  }

  /**
   * Fetch mock activity
   */
  async fetchActivity(): Promise<LMSActivity[]> {
    const activities: LMSActivity[] = [];
    const activityTypes: Array<LMSActivity["type"]> = [
      "login",
      "assignment_submit",
      "forum_post",
      "content_view",
      "quiz_attempt",
    ];

    for (let i = 0; i < 500; i++) {
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      activities.push({
        id: `activity-${i}`,
        userId: `user-${Math.floor(Math.random() * 100) + 1}`,
        courseId: `course-${Math.floor(Math.random() * 5) + 1}`,
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        timestamp,
        metadata: {
          duration: Math.floor(Math.random() * 3600),
          score: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : null,
        },
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(activities), 900);
    });
  }

  /**
   * Sync all data
   */
  async sync(): Promise<DataSourceOperationResult> {
    try {
      const users = await this.fetchUsers();
      const courses = await this.fetchCourses();
      const enrollments = await this.fetchEnrollments();
      await this.fetchActivity();

      return {
        success: true,
        message: `Successfully synced ${users.length} users, ${courses.length} courses, ${enrollments.length} enrollments`,
        affectedRecords: users.length + courses.length + enrollments.length,
      };
    } catch (error) {
      return {
        success: false,
        message: "Sync failed",
        errors: [(error as Error).message],
      };
    }
  }

  getName(): string {
    return "Mock LMS (Development)";
  }

  getVersion(): string {
    return "1.0.0";
  }
}

export default MockLMSConnector;
