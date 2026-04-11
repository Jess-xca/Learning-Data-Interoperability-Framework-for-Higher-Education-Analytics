/**
 * Caliper Analytics Service
 * Generates Caliper Events for learning analytics
 * https://www.imsglobal.org/activity/caliper
 */

export interface CaliperEntity {
  id: string;
  type: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface CaliperPerson extends CaliperEntity {
  type: "Person";
  email?: string;
  affiliation?: string[];
}

export interface CaliperCourse extends CaliperEntity {
  type: "CourseOffering";
  courseNumber?: string;
  academicSession?: string;
}

export interface CaliperAssignment extends CaliperEntity {
  type: "Assessment";
  dateCreated?: string;
  dateModified?: string;
  maxScore?: number;
}

export interface CaliperEvent {
  "@context": string;
  type: string;
  id: string;
  actor: CaliperEntity;
  action: string;
  object: CaliperEntity;
  eventTime: string;
  edApp?: CaliperEntity;
  group?: CaliperEntity;
  generated?: CaliperEntity;
  target?: CaliperEntity;
  federatedSession?: string;
  referrer?: CaliperEntity;
  extensions?: {
    [key: string]: unknown;
  };
}

const CALIPER_CONTEXT = "https://purl.imsglobal.org/ctx/caliper/v1p2";

class CaliperServiceClass {
  /**
   * Create enrollment event
   */
  createEnrollmentEvent(
    studentId: string,
    studentName: string,
    studentEmail: string,
    courseId: string,
    courseName: string,
    affiliations: string[] = ["Student"],
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
        email: studentEmail,
        affiliation: affiliations,
      },
      action: "Registered",
      object: {
        id: courseId,
        type: "CourseOffering",
        name: courseName,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Create completion event
   */
  createCompletionEvent(
    studentId: string,
    studentName: string,
    courseId: string,
    courseName: string,
    score: number,
    maxScore: number,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: "Completed",
      object: {
        id: courseId,
        type: "CourseOffering",
        name: courseName,
      },
      generated: {
        id: `${courseId}/grade`,
        type: "Outcome",
        resultScore: score / maxScore,
        score: score,
        maxScore: maxScore,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Create assignment submission event
   */
  createSubmissionEvent(
    studentId: string,
    studentName: string,
    assignmentId: string,
    assignmentName: string,
    courseId: string,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: "Submitted",
      object: {
        id: assignmentId,
        type: "Assessment",
        name: assignmentName,
      },
      target: {
        id: courseId,
        type: "CourseOffering",
      },
      generated: {
        id: `${assignmentId}/submission/${eventId}`,
        type: "Attempt",
        assignable: assignmentId,
        actor: studentId,
        dateCreated: new Date().toISOString(),
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Create grading event
   */
  createGradingEvent(
    instructorId: string,
    instructorName: string,
    studentId: string,
    studentName: string,
    assignmentId: string,
    assignmentName: string,
    score: number,
    maxScore: number,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: instructorId,
        type: "Person",
        name: instructorName,
        affiliation: ["Instructor"],
      },
      action: "Graded",
      object: {
        id: `${assignmentId}/submission/${studentId}`,
        type: "Attempt",
        name: `${studentName} submission for ${assignmentName}`,
      },
      generated: {
        id: `${assignmentId}/grade/${studentId}`,
        type: "Results",
        score: score,
        maxScore: maxScore,
        resultScore: score / maxScore,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Create view event (page, video, resource)
   */
  createViewEvent(
    studentId: string,
    studentName: string,
    resourceId: string,
    resourceName: string,
    resourceType: "Document" | "VideoObject" | "WebPage",
    courseId?: string,
  ): CaliperEvent {
    const eventId = this.generateId();

    const event: CaliperEvent = {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: "Viewed",
      object: {
        id: resourceId,
        type: resourceType,
        name: resourceName,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };

    if (courseId) {
      event.group = {
        id: courseId,
        type: "CourseOffering",
      };
    }

    return event;
  }

  /**
   * Create assessment attempt event
   */
  createAssessmentAttemptEvent(
    studentId: string,
    studentName: string,
    quizId: string,
    quizName: string,
    courseId: string,
    attemptNumber: number,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: "Started",
      object: {
        id: quizId,
        type: "Assessment",
        name: quizName,
      },
      generated: {
        id: `${quizId}/attempt/${attemptNumber}`,
        type: "Attempt",
        assignable: quizId,
        actor: studentId,
        count: attemptNumber,
      },
      target: {
        id: courseId,
        type: "CourseOffering",
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Create assessment completed event
   */
  createAssessmentCompletedEvent(
    studentId: string,
    studentName: string,
    quizId: string,
    quizName: string,
    score: number,
    maxScore: number,
    attemptNumber: number,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: "Completed",
      object: {
        id: quizId,
        type: "Assessment",
        name: quizName,
      },
      generated: {
        id: `${quizId}/result/${studentId}`,
        type: "Results",
        assignable: quizId,
        actor: studentId,
        attempt: {
          id: `${quizId}/attempt/${attemptNumber}`,
          type: "Attempt",
          count: attemptNumber,
        },
        score: score,
        maxScore: maxScore,
        resultScore: score / maxScore,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
    };
  }

  /**
   * Generate unique event ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate Caliper event
   */
  validateEvent(event: CaliperEvent): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!event["@context"]) errors.push("Missing @context");
    if (!event.type) errors.push("Missing type");
    if (!event.id) errors.push("Missing id");
    if (!event.actor) errors.push("Missing actor");
    if (!event.action) errors.push("Missing action");
    if (!event.object) errors.push("Missing object");
    if (!event.eventTime) errors.push("Missing eventTime");

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Batch create enrollment events
   */
  batchCreateEnrollmentEvents(
    enrollments: Array<{
      studentId: string;
      studentName: string;
      studentEmail: string;
      courseId: string;
      courseName: string;
    }>,
  ): CaliperEvent[] {
    return enrollments.map((enrollment) =>
      this.createEnrollmentEvent(
        enrollment.studentId,
        enrollment.studentName,
        enrollment.studentEmail,
        enrollment.courseId,
        enrollment.courseName,
      ),
    );
  }

  /**
   * Batch create completion events
   */
  batchCreateCompletionEvents(
    completions: Array<{
      studentId: string;
      studentName: string;
      courseId: string;
      courseName: string;
      score: number;
      maxScore: number;
    }>,
  ): CaliperEvent[] {
    return completions.map((completion) =>
      this.createCompletionEvent(
        completion.studentId,
        completion.studentName,
        completion.courseId,
        completion.courseName,
        completion.score,
        completion.maxScore,
      ),
    );
  }

  /**
   * Export events as JSON-LD
   */
  exportAsJSONLD(events: CaliperEvent[]): string {
    return JSON.stringify(
      {
        "@context": CALIPER_CONTEXT,
        events: events,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
  }

  /**
   * Export events as CSV
   */
  exportAsCSV(events: CaliperEvent[]): string {
    const headers = [
      "timestamp",
      "event_id",
      "actor_id",
      "actor_name",
      "action",
      "object_id",
      "object_type",
      "object_name",
    ];

    const rows = events.map((event) => [
      event.eventTime || new Date().toISOString(),
      event.id,
      (event.actor as any)?.id || "",
      (event.actor as any)?.name || "",
      event.action,
      (event.object as any)?.id || "",
      (event.object as any)?.type || "",
      (event.object as any)?.name || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ];

    return csv.join("\n");
  }

  /**
   * Validate batch of events
   */
  validateBatch(events: CaliperEvent[]): {
    totalEvents: number;
    validEvents: number;
    invalidEvents: number;
    errors: Array<{ eventIndex: number; errors: string[] }>;
  } {
    const errors: Array<{ eventIndex: number; errors: string[] }> = [];
    let validCount = 0;

    events.forEach((event, index) => {
      const validation = this.validateEvent(event);
      if (validation.valid) {
        validCount++;
      } else {
        errors.push({
          eventIndex: index,
          errors: validation.errors,
        });
      }
    });

    return {
      totalEvents: events.length,
      validEvents: validCount,
      invalidEvents: events.length - validCount,
      errors,
    };
  }

  /**
   * Get action types for Caliper events
   */
  getStandardActions(): string[] {
    return [
      "Viewed",
      "Submitted",
      "Started",
      "Completed",
      "Graded",
      "Registered",
      "Attempted",
      "Interacted",
      "Responded",
      "Endorsed",
    ];
  }

  /**
   * Create custom event with flexible properties
   */
  createCustomEvent(
    studentId: string,
    studentName: string,
    action: string,
    objectId: string,
    objectType: string,
    objectName: string,
    additionalProperties?: Record<string, unknown>,
  ): CaliperEvent {
    const eventId = this.generateId();

    return {
      "@context": CALIPER_CONTEXT,
      type: "Event",
      id: eventId,
      actor: {
        id: studentId,
        type: "Person",
        name: studentName,
      },
      action: action,
      object: {
        id: objectId,
        type: objectType,
        name: objectName,
      },
      eventTime: new Date().toISOString(),
      edApp: {
        id: "https://academic-curator.example.com",
        type: "SoftwareApplication",
        name: "Academic Curator",
      },
      ...additionalProperties,
    };
  }
}

export const caliperService = new CaliperServiceClass();
