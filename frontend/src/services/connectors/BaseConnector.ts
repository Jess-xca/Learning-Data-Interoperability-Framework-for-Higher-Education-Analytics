/**
 * Base Connector Interface
 * Abstract base class for all data source connectors
 * Defines the contract that all LMS/SIS connectors must implement
 */

import type { DataSourceTestResult, DataSourceOperationResult } from "../../types/datasources";

export interface LMSUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "instructor" | "admin";
}

export interface LMSCourse {
  id: string;
  code: string;
  name: string;
  description?: string;
  term?: string;
  credits?: number;
}

export interface LMSEnrollment {
  id: string;
  userId: string;
  courseId: string;
  role: "student" | "instructor" | "ta";
  status: "active" | "inactive" | "completed";
  enrolledDate?: Date;
  completedDate?: Date;
}

export interface LMSActivity {
  id: string;
  userId: string;
  courseId: string;
  type: "login" | "assignment_submit" | "forum_post" | "content_view" | "quiz_attempt";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export abstract class BaseConnector {
  protected sourceId: string;
  protected baseUrl: string;
  protected credentials: Record<string, string>;

  constructor(sourceId: string, baseUrl: string, credentials: Record<string, string>) {
    this.sourceId = sourceId;
    this.baseUrl = baseUrl;
    this.credentials = credentials;
  }

  /**
   * Test the connection to the LMS
   */
  abstract testConnection(): Promise<DataSourceTestResult>;

  /**
   * Fetch all users from the LMS
   */
  abstract fetchUsers(): Promise<LMSUser[]>;

  /**
   * Fetch all courses from the LMS
   */
  abstract fetchCourses(): Promise<LMSCourse[]>;

  /**
   * Fetch all enrollments from the LMS
   */
  abstract fetchEnrollments(): Promise<LMSEnrollment[]>;

  /**
   * Fetch recent activity from the LMS
   */
  abstract fetchActivity(): Promise<LMSActivity[]>;

  /**
   * Sync data from LMS
   */
  abstract sync(): Promise<DataSourceOperationResult>;

  /**
   * Get connector name
   */
  abstract getName(): string;

  /**
   * Get connector version
   */
  abstract getVersion(): string;
}

export default BaseConnector;
