# Dummy Data Schema Specification

## Overview

This document defines the data structure for the dummy data generator. All schemas are designed for a Rwandan university context with international applicability.

---

## Core Entities

### 1. Student Entity

```javascript
{
  // Identification
  studentId: "202502SENG001",          // Format: YYYYSSDDDNNN
  firstName: "Jean",
  middleName: "Paul",
  lastName: "Umucyo",
  email: "jean.umucyo@university.rw",
  phone: "+250788123456",
  alternateEmail: null,

  // Demographics
  gender: "M" | "F" | "Other",
  dateOfBirth: "2003-05-15",
  nationality: "Rwandan" | "International",
  province: "Kigali" | "Southern", // If Rwandan

  // Academic Information
  programId: "PROG001",
  departmentId: "DEPT001",
  academicYear: 2025,
  currentSemester: 1 | 2,
  enrollmentStatus: "Active" | "On_Leave" | "Graduated" | "Withdrawn",
  enrollmentDate: "2023-09-01",
  expectedGraduationDate: "2027-12-15",

  // Academic Performance
  cumulativeGPA: 3.45,
  currentSemesterGPA: 3.52,
  totalCreditsEarned: 45,
  totalCreditsRequired: 120,

  // Engagement Metrics
  lmsLoginFrequency: 25,              // times per month
  assignmentCompletionRate: 0.95,     // percentage
  attendanceRate: 0.92,               // percentage

  // Contact & Emergency
  mailingAddress: "KN 123 St, Kigali",
  emergencyContact: "Fatima Umucyo",
  emergencyPhone: "+250789654321",

  // System
  isInternational: false,
  hasFeesPaymentPlan: false,
  createdDate: "2023-09-01T00:00:00Z",
  lastModified: "2025-02-28T14:23:00Z",
  status: "Active"
}
```

---

### 2. Course Entity

```javascript
{
  // Identification
  courseId: "SENG101",
  courseCode: "SENG101",
  courseTitle: "Introduction to Software Engineering",
  courseDescription: "Fundamentals of software development...",
  creditHours: 3,
  semester: 1 | 2,
  academicYear: 2025,

  // Program & Department
  departmentId: "DEPT001",
  programIds: ["PROG001", "PROG002"],

  // Instructor
  instructorId: "INSTR001",
  instructorName: "Dr. Theogene Rwema",

  // Prerequisites
  prerequisites: ["SENG100"],
  corequisites: [],

  // Enrollment
  enrollmentCapacity: 40,
  currentEnrollment: 38,
  offeredSemesters: [1, 2],

  // Assessment
  gradeBreakdown: {
    participation: 10,        // percentage
    assignments: 20,
    projects: 20,
    midterm: 20,
    finalExam: 30
  },

  // Learning Outcomes
  learningOutcomes: [
    "Understand software development lifecycle",
    "Apply design patterns",
    "Develop testing strategies"
  ],

  // System
  createdDate: "2023-01-15T00:00:00Z",
  lastModified: "2025-02-20T10:30:00Z"
}
```

---

### 3. Enrollment Entity

```javascript
{
  // Identification
  enrollmentId: "ENROLL001",
  studentId: "202502SENG001",
  courseId: "SENG101",
  academicYear: 2025,
  semester: 1,

  // Status
  enrollmentStatus: "Active" | "Dropped" | "Completed",
  enrollmentDate: "2025-02-03",
  completionDate: null,

  // Performance
  currentGrade: "A",                  // A, B+, B, C+, C, D, F
  gradePoints: 4.0,
  credits: 3,
  gradeEarned: null,                 // Final grade
  credits_earned: null,              // Final credits

  // Attendance
  classesAttended: 28,
  totalClassSessions: 30,
  attendancePercentage: 0.93,

  // Submission Data
  assignmentsSubmitted: 12,
  assignmentsTotal: 12,
  lastSubmissionDate: "2025-02-25T18:45:00Z",

  // System
  createdDate: "2025-02-03T08:00:00Z",
  lastModified: "2025-02-28T20:15:00Z"
}
```

---

### 4. Program Entity

```javascript
{
  // Identification
  programId: "PROG001",
  programCode: "BSC-SE",
  programName: "Bachelor of Science in Software Engineering",
  programType: "Bachelor" | "Master" | "Diploma",
  degreeAwarded: "BSc Software Engineering",

  // Department & Institution
  departmentId: "DEPT001",
  departmentName: "School of Engineering",

  // Academic Information
  totalCreditsRequired: 120,
  durationInYears: 4,
  accreditationStatus: "Accredited" | "Provisional",

  // Learning Outcomes
  programLearningOutcomes: [
    "Design scalable software systems",
    "Apply software development best practices",
    "Contribute to professional engineering"
  ],

  // Curriculum
  requiredCourses: ["SENG101", "SENG102", ...],
  electiveCourses: 12,
  coopTermRequired: true,
  thesisRequired: true,

  // Program Metrics
  totalEnrolled: 200,
  graduationRate: 0.87,
  employmentRate: 0.92,

  // System
  createdDate: "2020-01-01T00:00:00Z",
  lastModified: "2025-01-15T09:30:00Z"
}
```

---

### 5. Assessment Entity

```javascript
{
  // Identification
  assessmentId: "ASSESS001",
  courseId: "SENG101",
  assessmentName: "Assignment 1: Design Pattern Analysis",
  assessmentType: "Assignment" | "Quiz" | "Exam" | "Project",

  // Timing
  releaseDate: "2025-02-10T08:00:00Z",
  dueDate: "2025-02-17T23:59:59Z",
  gradeReleaseDate: "2025-02-20T10:00:00Z",

  // Configuration
  totalPoints: 100,
  weightage: 0.20,                   // 20% of course grade
  rubric: {
    "Code Quality": 40,
    "Documentation": 30,
    "Testing": 20,
    "Submission": 10
  },

  // Enrollment Data (Many-to-many)
  studentSubmissions: [
    {
      studentId: "202502SENG001",
      submissionDate: "2025-02-16T14:30:00Z",
      pointsEarned: 92,
      feedback: "Excellent work. Good code structure...",
      status: "Graded"
    }
  ],

  // System
  createdDate: "2025-01-20T00:00:00Z",
  lastModified: "2025-02-28T15:00:00Z"
}
```

---

### 6. Department Entity

```javascript
{
  // Identification
  departmentId: "DEPT001",
  departmentCode: "ENG",
  departmentName: "School of Engineering",

  // Head
  departmentHeadId: "INSTR002",
  departmentHeadName: "Prof. Jean Karangwa",
  email: "jean.karangwa@university.rw",

  // Structure
  programs: ["PROG001", "PROG002"],
  courses: ["SENG101", "SENG102", ...],
  instructorCount: 12,

  // Metrics
  totalEnrolledStudents: 450,
  totalGraduatedStudents: 90,

  // System
  createdDate: "2018-01-01T00:00:00Z",
  lastModified: "2025-02-20T11:00:00Z"
}
```

---

### 7. LMS Activity Entity

```javascript
{
  // Identification
  activityId: "ACTIVITY001",
  studentId: "202502SENG001",
  courseId: "SENG101",

  // Activity Tracking
  activityType: "View" | "Submit" | "Forum_Post" | "Download" | "Quiz",
  activityName: "Viewed Lecture 5: Design Patterns",
  timestamp: "2025-02-25T14:30:00Z",

  // Engagement Metrics
  durationMinutes: 45,
  ipAddress: "192.168.1.100",
  deviceType: "Computer" | "Tablet" | "Mobile",

  // System
  createdDate: "2025-02-25T14:30:00Z"
}
```

---

### 8. Attendance Entity

```javascript
{
  // Identification
  attendanceId: "ATTEND001",
  studentId: "202502SENG001",
  courseId: "SENG101",

  // Session
  sessionDate: "2025-02-25",
  sessionNumber: 15,
  totalSessionsThisSemester: 30,

  // Status
  attendanceStatus: "Present" | "Absent" | "Late" | "Excused",
  signInTime: "2025-02-25T08:05:00Z",
  signOutTime: "2025-02-25T09:50:00Z",

  // System
  recordedBy: "INSTR001",
  createdDate: "2025-02-25T09:55:00Z"
}
```

---

## Data Generation Guidelines

### Student Generation (500-1000 records)

- **Names**: Mix of Rwandan, East African, and international names
- **Email Pattern**: `firstname.lastname@university.rw`
- **Student IDs**: Sequential by department and semester
- **Demographics**:
  - 40% Female, 60% Male
  - 70% Rwandan, 30% International
  - Years 1-4 distribution across programs
- **GPA Distribution**: Normal distribution (mean 3.2, std 0.5)
- **Engagement**: Varied realism (high, medium, low performers)

### Course Generation (50-100 records)

- **Distribution**:
  - Engineering: 20 courses
  - Business: 15 courses
  - Science: 15 courses
  - General Studies: 10 courses
  - Languages: 5 courses
- **Credit Hours**: 1-4 credits per course
- **Instructors**: Mix of male/female, local/international

### Enrollment Generation

- Students enrolled in 4-6 courses per semester
- 85% completion rate for active students
- GPA correlates with attendance (0.7-0.8 correlation)
- Some dropouts and late enrollments (realistic scenarios)

### Assessment Generation

- 3-5 assessments per course per semester
- Varied assessment types (assignments, quizzes, exams, projects)
- Grade distribution follows course average

### LMS Activity Generation

- 5-20 logins per month per course
- Activity spikes near submission deadlines
- Realistic time-of-day patterns
- Correlates with course grade

---

## Database Relations

```
STUDENT (1) ─── (N) ENROLLMENT
COURSE (1) ─── (N) ENROLLMENT
COURSE (1) ─── (N) ASSESSMENT
STUDENT (1) ─── (N) ASSESSMENT_SUBMISSION
STUDENT (1) ─── (N) LMS_ACTIVITY
STUDENT (1) ─── (N) ATTENDANCE
INSTRUCTOR (1) ─── (N) COURSE
DEPARTMENT (1) ─── (N) COURSE
DEPARTMENT (1) ─── (N) PROGRAM
PROGRAM (1) ─── (N) STUDENT
```

---

## Sample Data Count for MVP

| Entity             | MVP Count | Purpose                               |
| ------------------ | --------- | ------------------------------------- |
| **Students**       | 1000      | Full cohort testing, analytics volume |
| **Courses**        | 80        | Multi-department representation       |
| **Programs**       | 5         | Full department coverage              |
| **Departments**    | 6         | Institution structure                 |
| **Enrollments**    | 4000      | Multiple registrations per student    |
| **Assessments**    | 240       | 3 per course per semester             |
| **LMS Activities** | 50000+    | Realistic engagement tracking         |
| **Attendance**     | 100000+   | Full semester tracking                |

---

## Implementation Notes

1. **Date Generation**: Use realistic academic calendar (Sep-May and Feb-June)
2. **Temporal Realism**: LMS activity should cluster around deadlines
3. **Identifier Uniqueness**: All IDs must be unique and consistent
4. **Referential Integrity**: All foreign keys must reference valid records
5. **Privacy**: No real personal data used; all generated synthetically

---

**Last Updated**: April 3, 2026
