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

  /**
   * Transform generic user data to LIS User format
   */
  transformToLISUser(sourceUser: any): LISUser {
    const id = sourceUser.id || `user-${Date.now()}`;
    const email = sourceUser.email || sourceUser.userEmail || '';
    const firstName = sourceUser.firstName || sourceUser.givenName || '';
    const lastName = sourceUser.lastName || sourceUser.familyName || '';

    return {
      sourcedId: id,
      userId: sourceUser.userId || id,
      email: email,
      givenName: firstName,
      familyName: lastName,
      fullName: `${firstName} ${lastName}`.trim() || sourceUser.fullName || sourceUser.name || 'Unknown User',
      tel: sourceUser.phone || sourceUser.tel,
      sms: sourceUser.sms,
      timezone: sourceUser.timezone || 'UTC',
      userSourcedIds: [id],
      cidSource: 'academic-curator',
    };
  }

  /**
   * Transform generic user data to OneRoster User format
   */
  transformToOneRosterUser(sourceUser: any): OneRosterUser {
    const id = sourceUser.id || `user-${Date.now()}`;
    const email = sourceUser.email || sourceUser.userEmail || '';
    const firstName = sourceUser.firstName || sourceUser.givenName || '';
    const lastName = sourceUser.lastName || sourceUser.familyName || '';
    const username = sourceUser.username || email.split('@')[0] || id;

    return {
      sourcedId: id,
      username: username,
      email: email,
      givenName: firstName,
      familyName: lastName,
      middleName: sourceUser.middleName,
      identifiers: {
        userId: sourceUser.userId || id,
        systemId: 'academic-curator',
      },
      orgSourcedIds: sourceUser.orgIds || [],
    };
  }

  /**
   * Transform generic course data to LIS Course format
   */
  transformToLISCourse(sourceCourse: any): LISCourse {
    const id = sourceCourse.id || `course-${Date.now()}`;
    const code = sourceCourse.code || sourceCourse.courseCode || id;

    return {
      sourcedId: id,
      courseCode: code,
      label: code,
      title: sourceCourse.title || sourceCourse.name || 'Unknown Course',
      shortDescription: sourceCourse.shortDescription || sourceCourse.description,
      longDescription: sourceCourse.description || sourceCourse.longDescription,
      term: sourceCourse.term || sourceCourse.semester || 'Unknown',
      subjectAreas: sourceCourse.subjectAreas || [sourceCourse.subject || 'General'],
      credits: sourceCourse.credits?.toString() || '3',
      dept: sourceCourse.department || sourceCourse.dept || 'Unknown',
    };
  }

  /**
   * Transform generic enrollment data to LIS Enrollment format
   */
  transformToLISEnrollment(sourceEnrollment: any): LISEnrollment {
    const roleMap: { [key: string]: LISEnrollment['role'] } = {
      student: '01',
      instructor: '02',
      teacher: '02',
      ta: '03',
      aide: '03',
      parent: '04',
      admin: '05',
      administrator: '05',
    };

    const role =
      roleMap[sourceEnrollment.role?.toLowerCase() || 'student'] || '01';

    return {
      sourcedId: sourceEnrollment.id || `enroll-${Date.now()}`,
      classSourcedId: sourceEnrollment.courseId || sourceEnrollment.classId || '',
      userSourcedId: sourceEnrollment.userId || sourceEnrollment.studentId || '',
      role: role,
      status:
        sourceEnrollment.status === 'active' ||
        sourceEnrollment.status === 'Active'
          ? 'Active'
          : sourceEnrollment.status === 'inactive' ||
              sourceEnrollment.status === 'Inactive'
            ? 'Inactive'
            : 'Pending',
      dateTime: sourceEnrollment.enrolledDate || new Date().toISOString(),
    };
  }

  /**
   * Transform generic course data to OneRoster Class format
   */
  transformToOneRosterClass(sourceCourse: any): OneRosterClass {
    const id = sourceCourse.id || `course-${Date.now()}`;
    const code = sourceCourse.code || sourceCourse.courseCode || id;

    return {
      sourcedId: id,
      schoolSourcedId: sourceCourse.schoolId || 'school-001',
      title: sourceCourse.title || sourceCourse.name || 'Unknown Class',
      description: sourceCourse.description,
      grades: sourceCourse.grades || ['9-12'],
      subjectCodes: sourceCourse.subjectAreas || [sourceCourse.subject || 'GENERAL'],
      classCode: code,
      classType: sourceCourse.classType || 'scheduled',
    };
  }

  /**
   * Transform generic enrollment data to OneRoster Enrollment format
   */
  transformToOneRosterEnrollment(
    sourceEnrollment: any,
  ): OneRosterEnrollment {
    const roleMap: { [key: string]: OneRosterEnrollment['role'] } = {
      student: 'student',
      instructor: 'teacher',
      teacher: 'teacher',
      ta: 'aide',
      aide: 'aide',
      parent: 'parent',
      guardian: 'guardian',
      admin: 'proctor',
    };

    const role =
      roleMap[sourceEnrollment.role?.toLowerCase() || 'student'] || 'student';

    return {
      sourcedId: sourceEnrollment.id || `enroll-${Date.now()}`,
      classSourcedId: sourceEnrollment.courseId || sourceEnrollment.classId || '',
      userSourcedId: sourceEnrollment.userId || sourceEnrollment.studentId || '',
      role: role,
      status:
        sourceEnrollment.status === 'active' ||
        sourceEnrollment.status === 'Active'
          ? 'active'
          : sourceEnrollment.status === 'inactive' ||
              sourceEnrollment.status === 'Inactive'
            ? 'inactive'
            : 'pending',
      primary: sourceEnrollment.primary || true,
    };
  }

  /**
   * Batch transform users to LIS format
   */
  batchTransformToLISUsers(sourceUsers: any[]): LISUser[] {
    return sourceUsers.map((user) => this.transformToLISUser(user));
  }

  /**
   * Batch transform courses to LIS format
   */
  batchTransformToLISCourses(sourceCourses: any[]): LISCourse[] {
    return sourceCourses.map((course) => this.transformToLISCourse(course));
  }

  /**
   * Batch transform enrollments to LIS format
   */
  batchTransformToLISEnrollments(sourceEnrollments: any[]): LISEnrollment[] {
    return sourceEnrollments.map((enrollment) =>
      this.transformToLISEnrollment(enrollment),
    );
  }

  /**
   * Batch transform users to OneRoster format
   */
  batchTransformToOneRosterUsers(sourceUsers: any[]): OneRosterUser[] {
    return sourceUsers.map((user) => this.transformToOneRosterUser(user));
  }

  /**
   * Batch transform courses to OneRoster format
   */
  batchTransformToOneRosterClasses(sourceCourses: any[]): OneRosterClass[] {
    return sourceCourses.map((course) =>
      this.transformToOneRosterClass(course),
    );
  }

  /**
   * Batch transform enrollments to OneRoster format
   */
  batchTransformToOneRosterEnrollments(
    sourceEnrollments: any[],
  ): OneRosterEnrollment[] {
    return sourceEnrollments.map((enrollment) =>
      this.transformToOneRosterEnrollment(enrollment),
    );
  }

  /**
   * Export data in XML format (IMS-compliant)
   */
  exportAsXML(
    users: LISUser[],
    courses: LISCourse[],
    enrollments: LISEnrollment[],
  ): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<LearningInformationServices version="2.0">
  <Users>
`;

    users.forEach((user) => {
      xml += `    <User sourcedId="${user.sourcedId}">
      <UserId>${user.userId}</UserId>
      <Email>${user.email}</Email>
      <GivenName>${user.givenName}</GivenName>
      <FamilyName>${user.familyName}</FamilyName>
      <FullName>${user.fullName}</FullName>
    </User>
`;
    });

    xml += `  </Users>
  <Courses>
`;

    courses.forEach((course) => {
      xml += `    <Course sourcedId="${course.sourcedId}">
      <CourseCode>${course.courseCode}</CourseCode>
      <Label>${course.label}</Label>
      <Title>${course.title}</Title>
    </Course>
`;
    });

    xml += `  </Courses>
  <Enrollments>
`;

    enrollments.forEach((enrollment) => {
      xml += `    <Enrollment sourcedId="${enrollment.sourcedId}">
      <ClassSourcedId>${enrollment.classSourcedId}</ClassSourcedId>
      <UserSourcedId>${enrollment.userSourcedId}</UserSourcedId>
      <Role>${enrollment.role}</Role>
      <Status>${enrollment.status}</Status>
    </Enrollment>
`;
    });

    xml += `  </Enrollments>
</LearningInformationServices>`;

    return xml;
  }

  /**
   * Export data as JSON
   */
  exportAsJSON(
    users: LISUser[],
    courses: LISCourse[],
    enrollments: LISEnrollment[],
  ): string {
    return JSON.stringify(
      {
        users,
        courses,
        enrollments,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
  }

  /**
   * Export data as CSV
   */
  exportAsCSV(data: any[], headers: string[]): string {
    const csvHeaders = headers.join(',');
    const csvRows = data.map((row) =>
      headers.map((header) => `"${row[header] || ''}"`).join(','),
    );
    return [csvHeaders, ...csvRows].join('\n');
  }
}

export const imsGlobalService = new IMSGlobalServiceClass();
