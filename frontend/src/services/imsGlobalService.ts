/**
 * IMS Global Standards Service
 * Validates and transforms data against IMS Global standards
 * - LIS v2 (Learning Information Services)
 * - OneRoster v1.2 (Roster Information)
 * Reference: https://www.imsglobal.org/standards
 */

export interface LISUser {
  sourcedId: string;
  userId: string;
  email: string;
  givenName: string;
  familyName: string;
  fullName: string;
  tel?: string;
  sms?: string;
  timezone?: string;
  userSourcedIds?: string[];
  cidSource?: string;
  basePath?: string;
}

export interface LISCourse {
  sourcedId: string;
  courseCode: string;
  label: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  term?: string;
  subjectAreas?: string[];
  credits?: string;
  dept?: string;
}

export interface LISEnrollment {
  sourcedId: string;
  classSourcedId: string;
  userSourcedId: string;
  role: "01" | "02" | "03" | "04" | "05"; // 01=Student, 02=Instructor, 03=Aide, 04=Parent, 05=Administrator
  status: "Active" | "Inactive" | "Pending";
  dateTime?: string;
  restricToOneCourse?: string;
}

export interface OneRosterUser {
  sourcedId: string;
  username: string;
  email: string;
  givenName: string;
  familyName: string;
  middleName?: string;
  identifiers?: {
    [key: string]: string;
  };
  orgSourcedIds?: string[];
}

export interface OneRosterClass {
  sourcedId: string;
  schoolSourcedId: string;
  title: string;
  description?: string;
  grades?: string[];
  subjectCodes?: string[];
  classCode?: string;
  classType: "homeroom" | "scheduled";
}

export interface OneRosterEnrollment {
  sourcedId: string;
  classSourcedId: string;
  userSourcedId: string;
  role: "student" | "teacher" | "aide" | "proctor" | "parent" | "guardian";
  status: "active" | "inactive" | "pending" | "tobedeleted";
  primary?: boolean;
}

class IMSGlobalServiceClass {
  /**
   * Validate user data against LIS v2 schema
   */
  validateLISUser(user: Partial<LISUser>): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!user.sourcedId)
      errors.push("LIS: Missing sourcedId (unique identifier)");
    if (!user.userId) errors.push("LIS: Missing userId");
    if (!user.email) errors.push("LIS: Missing email");
    if (!user.givenName) errors.push("LIS: Missing givenName");
    if (!user.familyName) errors.push("LIS: Missing familyName");
    if (!user.fullName) warnings.push("LIS: Missing fullName (recommended)");

    // Email format validation
    if (user.email && !this.isValidEmail(user.email)) {
      errors.push("LIS: Invalid email format");
    }

    // Timezone validation
    if (user.timezone && !this.isValidTimezone(user.timezone)) {
      warnings.push("LIS: Invalid timezone format");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate course data against LIS v2 schema
   */
  validateLISCourse(course: Partial<LISCourse>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!course.sourcedId) errors.push("LIS: Missing sourcedId");
    if (!course.courseCode) errors.push("LIS: Missing courseCode");
    if (!course.label) errors.push("LIS: Missing label");
    if (!course.title) errors.push("LIS: Missing title");

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate enrollment data against LIS v2
   */
  validateLISEnrollment(enrollment: Partial<LISEnrollment>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const validRoles = ["01", "02", "03", "04", "05"];
    const validStatuses = ["Active", "Inactive", "Pending"];

    if (!enrollment.sourcedId) errors.push("LIS: Missing sourcedId");
    if (!enrollment.classSourcedId) errors.push("LIS: Missing classSourcedId");
    if (!enrollment.userSourcedId) errors.push("LIS: Missing userSourcedId");
    if (enrollment.role && !validRoles.includes(enrollment.role)) {
      errors.push(
        `LIS: Invalid role. Must be one of: ${validRoles.join(", ")}`,
      );
    }
    if (enrollment.status && !validStatuses.includes(enrollment.status)) {
      errors.push(
        `LIS: Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user data against OneRoster v1.2
   */
  validateOneRosterUser(user: Partial<OneRosterUser>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!user.sourcedId) errors.push("OneRoster: Missing sourcedId");
    if (!user.username) errors.push("OneRoster: Missing username");
    if (!user.email) errors.push("OneRoster: Missing email");
    if (!user.givenName) errors.push("OneRoster: Missing givenName");
    if (!user.familyName) errors.push("OneRoster: Missing familyName");

    if (user.email && !this.isValidEmail(user.email)) {
      errors.push("OneRoster: Invalid email format");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate class data against OneRoster v1.2
   */
  validateOneRosterClass(classData: Partial<OneRosterClass>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const validClassTypes = ["homeroom", "scheduled"];

    if (!classData.sourcedId) errors.push("OneRoster: Missing sourcedId");
    if (!classData.schoolSourcedId)
      errors.push("OneRoster: Missing schoolSourcedId");
    if (!classData.title) errors.push("OneRoster: Missing title");
    if (classData.classType && !validClassTypes.includes(classData.classType)) {
      errors.push(
        `OneRoster: Invalid classType. Must be one of: ${validClassTypes.join(", ")}`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate enrollment against OneRoster v1.2
   */
  validateOneRosterEnrollment(enrollment: Partial<OneRosterEnrollment>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const validRoles = [
      "student",
      "teacher",
      "aide",
      "proctor",
      "parent",
      "guardian",
    ];
    const validStatuses = ["active", "inactive", "pending", "tobedeleted"];

    if (!enrollment.sourcedId) errors.push("OneRoster: Missing sourcedId");
    if (!enrollment.classSourcedId)
      errors.push("OneRoster: Missing classSourcedId");
    if (!enrollment.userSourcedId)
      errors.push("OneRoster: Missing userSourcedId");
    if (enrollment.role && !validRoles.includes(enrollment.role)) {
      errors.push(
        `OneRoster: Invalid role. Must be one of: ${validRoles.join(", ")}`,
      );
    }
    if (enrollment.status && !validStatuses.includes(enrollment.status)) {
      errors.push(
        `OneRoster: Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Map internal user object to LIS format
   */
  mapToLISUser(
    user: Record<string, unknown>,
    mappings: { [key: string]: string },
  ): Partial<LISUser> {
    return {
      sourcedId: (user[mappings.sourcedId] as string | undefined) || (user.id as string | undefined),
      userId: (user[mappings.userId] as string | undefined) || (user.id as string | undefined),
      email: (user[mappings.email] as string | undefined) || (user.email as string | undefined),
      givenName: (user[mappings.givenName] as string | undefined) || (user.firstName as string | undefined),
      familyName: (user[mappings.familyName] as string | undefined) || (user.lastName as string | undefined),
      fullName: (user[mappings.fullName] as string | undefined) || `${user.firstName} ${user.lastName}`,
      tel: (user[mappings.tel] as string | undefined) || (user.phone as string | undefined),
    };
  }

  /**
   * Map internal user object to OneRoster format
   */
  mapToOneRosterUser(
    user: Record<string, unknown>,
    mappings: { [key: string]: string },
  ): Partial<OneRosterUser> {
    const email = (user[mappings.email] as string | undefined) || (user.email as string | undefined);
    return {
      sourcedId: (user[mappings.sourcedId] as string | undefined) || (user.id as string | undefined),
      username: (user[mappings.username] as string | undefined) || (email?.split("@")[0]),
      email: email,
      givenName: (user[mappings.givenName] as string | undefined) || (user.firstName as string | undefined),
      familyName: (user[mappings.familyName] as string | undefined) || (user.lastName as string | undefined),
      middleName: (user[mappings.middleName] as string | undefined),
    };
  }

  /**
   * Map internal course to LIS format
   */
  mapToLISCourse(
    course: Record<string, unknown>,
    mappings: { [key: string]: string },
  ): Partial<LISCourse> {
    return {
      sourcedId: (course[mappings.sourcedId] as string | undefined) || (course.id as string | undefined),
      courseCode: (course[mappings.courseCode] as string | undefined) || (course.code as string | undefined),
      label: (course[mappings.label] as string | undefined) || (course.code as string | undefined),
      title: (course[mappings.title] as string | undefined) || (course.name as string | undefined),
      shortDescription: (course[mappings.shortDescription] as string | undefined) || (course.description as string | undefined),
      term: (course[mappings.term] as string | undefined),
    };
  }

  /**
   * Check for data quality issues in batch
   */
  checkDataQuality(
    records: unknown[],
    type: "user" | "course" | "enrollment",
    schema: "lis" | "oneroster",
  ): {
    passCount: number;
    failCount: number;
    requiredFieldsMissing: { [key: string]: number };
    invalidFormats: { [key: string]: string[] };
  } {
    const stats = {
      passCount: 0,
      failCount: 0,
      requiredFieldsMissing: {} as { [key: string]: number },
      invalidFormats: {} as { [key: string]: string[] },
    };

    records.forEach((record) => {
      let validation;

      if (type === "user") {
        validation =
          schema === "lis"
            ? this.validateLISUser(record as Partial<LISUser>)
            : this.validateOneRosterUser(record as Partial<OneRosterUser>);
      } else if (type === "course") {
        validation = this.validateLISCourse(record as Partial<LISCourse>);
      } else {
        validation =
          schema === "lis"
            ? this.validateLISEnrollment(record as Partial<LISEnrollment>)
            : this.validateOneRosterEnrollment(record as Partial<OneRosterEnrollment>);
      }

      if (validation.valid) {
        stats.passCount++;
      } else {
        stats.failCount++;
        validation.errors.forEach((error) => {
          const field = error.split(":")[1]?.trim() || "unknown";
          stats.requiredFieldsMissing[field] =
            (stats.requiredFieldsMissing[field] || 0) + 1;
        });
      }
    });

    return stats;
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(
    records: unknown[],
    type: "user" | "course" | "enrollment",
    schema: "lis" | "oneroster",
  ): {
    compliant: boolean;
    passRate: number;
    totalRecords: number;
    issues: Array<{
      recordIndex: number;
      field: string;
      issue: string;
    }>;
  } {
    const issues: Array<{
      recordIndex: number;
      field: string;
      issue: string;
    }> = [];

    records.forEach((record, index) => {
      let validation;

      if (type === "user") {
        validation =
          schema === "lis"
            ? this.validateLISUser(record as Partial<LISUser>)
            : this.validateOneRosterUser(record as Partial<OneRosterUser>);
      } else if (type === "course") {
        validation = this.validateLISCourse(record as Partial<LISCourse>);
      } else {
        validation =
          schema === "lis"
            ? this.validateLISEnrollment(record as Partial<LISEnrollment>)
            : this.validateOneRosterEnrollment(record as Partial<OneRosterEnrollment>);
      }

      validation.errors.forEach((error) => {
        const [, msg] = error.split(": ");
        issues.push({
          recordIndex: index,
          field: msg?.split("Missing ")[1] || "unknown",
          issue: msg || error,
        });
      });
    });

    const passRate = ((records.length - issues.length) / records.length) * 100;

    return {
      compliant: passRate === 100,
      passRate: Math.round(passRate),
      totalRecords: records.length,
      issues,
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate timezone format (IANA timezone)
   */
  private isValidTimezone(tz: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }
}

export const imsGlobalService = new IMSGlobalServiceClass();
