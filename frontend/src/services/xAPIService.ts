/**
 * xAPI (Experience API) Service
 * Generates xAPI statements for learning events
 * https://xapi.com/
 */

export interface Actor {
  objectType: "Agent" | "Group";
  account?: {
    homePage: string;
    name: string;
  };
  mbox?: string;
  mbox_sha1sum?: string;
  name?: string;
}

export interface Verb {
  id: string;
  display: {
    [key: string]: string;
  };
}

export interface Activity {
  objectType: "Activity";
  id: string;
  definition?: {
    name?: { [key: string]: string };
    description?: { [key: string]: string };
    type?: string;
    moreInfo?: string;
  };
}

export interface Result {
  score?: {
    scaled?: number;
    raw?: number;
    min?: number;
    max?: number;
  };
  success?: boolean;
  completion?: boolean;
  response?: string;
  duration?: string;
}

export interface Context {
  registration?: string;
  instructor?: Actor;
  team?: Actor;
  contextActivities?: {
    parent?: Activity[];
    grouping?: Activity[];
    related?: Activity[];
  };
  revision?: string;
  platform?: string;
  language?: string;
  statement?: string[];
}

export interface xAPIStatement {
  actor: Actor;
  verb: Verb;
  object: Activity;
  result?: Result;
  context?: Context;
  timestamp?: string;
  stored?: string;
  id?: string;
  version?: string;
}

class xAPIServiceClass {
  /**
   * Create a student enrollment statement
   */
  createEnrollmentStatement(
    studentEmail: string,
    studentName: string,
    courseId: string,
    courseName: string
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: studentName,
        mbox: `mailto:${studentEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/enrolled",
        display: { "en-US": "enrolled" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/courses/${courseId}`,
        definition: {
          type: "http://adlnet.gov/expapi/activities/course",
          name: { "en-US": courseName },
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a course completion statement
   */
  createCompletionStatement(
    studentEmail: string,
    studentName: string,
    courseId: string,
    courseName: string,
    score: number,
    totalScore: number
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: studentName,
        mbox: `mailto:${studentEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "en-US": "completed" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/courses/${courseId}`,
        definition: {
          type: "http://adlnet.gov/expapi/activities/course",
          name: { "en-US": courseName },
        },
      },
      result: {
        score: {
          scaled: score / totalScore,
          raw: score,
          max: totalScore,
        },
        success: score >= totalScore * 0.7,
        completion: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an assignment submission statement
   */
  createSubmissionStatement(
    studentEmail: string,
    studentName: string,
    assignmentId: string,
    assignmentName: string,
    courseId: string,
    courseName: string
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: studentName,
        mbox: `mailto:${studentEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/submitted",
        display: { "en-US": "submitted" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/assignments/${assignmentId}`,
        definition: {
          type: "http://adlnet.gov/expapi/activities/assessment",
          name: { "en-US": assignmentName },
        },
      },
      context: {
        contextActivities: {
          parent: [
            {
              objectType: "Activity",
              id: `https://academic-curator.example.com/courses/${courseId}`,
              definition: {
                type: "http://adlnet.gov/expapi/activities/course",
                name: { "en-US": courseName },
              },
            },
          ],
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a grading statement
   */
  createGradingStatement(
    instructorEmail: string,
    instructorName: string,
    studentEmail: string,
    studentName: string,
    assignmentId: string,
    assignmentName: string,
    score: number,
    totalScore: number
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: instructorName,
        mbox: `mailto:${instructorEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/graded",
        display: { "en-US": "graded" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/assignments/${assignmentId}`,
        definition: {
          type: "http://adlnet.gov/expapi/activities/assessment",
          name: { "en-US": assignmentName },
        },
      },
      result: {
        score: {
          scaled: score / totalScore,
          raw: score,
          max: totalScore,
        },
      },
      context: {
        contextActivities: {
          related: [
            {
              objectType: "Activity",
              id: `https://academic-curator.example.com/students/${studentEmail}`,
              definition: {
                name: { "en-US": `${studentName} submission` },
              },
            },
          ],
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a video viewed statement
   */
  createVideoViewedStatement(
    studentEmail: string,
    studentName: string,
    videoId: string,
    videoName: string,
    durationSeconds: number,
    progressPercent: number
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: studentName,
        mbox: `mailto:${studentEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/viewed",
        display: { "en-US": "viewed" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/videos/${videoId}`,
        definition: {
          type: "https://w3id.org/xapi/video/activity-type/video",
          name: { "en-US": videoName },
        },
      },
      result: {
        completion: progressPercent >= 100,
        response: `${progressPercent}% viewed`,
        duration: `PT${durationSeconds}S`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a quiz attempt statement
   */
  createQuizAttemptStatement(
    studentEmail: string,
    studentName: string,
    quizId: string,
    quizName: string,
    score: number,
    totalScore: number,
    attemptNumber: number
  ): xAPIStatement {
    return {
      actor: {
        objectType: "Agent",
        name: studentName,
        mbox: `mailto:${studentEmail}`,
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" },
      },
      object: {
        objectType: "Activity",
        id: `https://academic-curator.example.com/quizzes/${quizId}`,
        definition: {
          type: "http://adlnet.gov/expapi/activities/assessment",
          name: { "en-US": quizName },
        },
      },
      result: {
        score: {
          scaled: score / totalScore,
          raw: score,
          max: totalScore,
        },
        success: score >= totalScore * 0.7,
        completion: true,
      },
      context: {
        registration: `attempt-${attemptNumber}`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate xAPI statement structure
   */
  validateStatement(statement: xAPIStatement): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!statement.actor) errors.push("Missing actor");
    if (!statement.verb) errors.push("Missing verb");
    if (!statement.object) errors.push("Missing object");

    if (statement.actor && !statement.actor.objectType) {
      errors.push("Actor missing objectType");
    }

    if (statement.verb && !statement.verb.id) {
      errors.push("Verb missing id");
    }

    if (statement.object && !statement.object.id) {
      errors.push("Object missing id");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const xAPIService = new xAPIServiceClass();
