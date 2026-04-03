# API Mocks & Mock Service Worker (MSW) Configuration

## Overview

This document defines the mock API endpoints that will be intercepted by Mock Service Worker (MSW). These mocks simulate backend APIs during frontend development.

---

## Authentication Endpoints

### POST /api/auth/login

**Request**:
```json
{
  "email": "user@university.rw",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "USER001",
    "email": "user@university.rw",
    "firstName": "Jean",
    "lastName": "Umucyo",
    "role": "ACADEMIC_ADMIN",
    "department": "SENG",
    "institution": "University of Rwanda"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "mfaRequired": false
}
```

**Response (401)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### POST /api/auth/register

**Request**:
```json
{
  "firstName": "Jean",
  "lastName": "Umucyo",
  "email": "jean.umucyo@university.rw",
  "password": "SecurePassword123!",
  "role": "ACADEMIC_ADMIN",
  "department": "SENG",
  "institution": "University of Rwanda",
  "phone": "+250788123456"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "USER002",
    "email": "jean.umucyo@university.rw",
    "role": "ACADEMIC_ADMIN"
  }
}
```

---

### POST /api/auth/logout

**Request**: (Bearer token in Authorization header)

**Response (200)**:
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### POST /api/auth/mfa/setup

**Request**:
```json
{
  "method": "TOTP"
}
```

**Response (200)**:
```json
{
  "success": true,
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qrCode": "data:image/png;base64,..."
}
```

---

### POST /api/auth/mfa/verify

**Request**:
```json
{
  "code": "123456",
  "sessionToken": "..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Student Endpoints

### GET /api/students

**Query Parameters**:
- `page`: default 1
- `pageSize`: default 20
- `search`: search by name/ID
- `department`: filter by department
- `status`: Active, Graduated, Withdrawn

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "studentId": "202502SENG001",
      "firstName": "Jean",
      "lastName": "Umucyo",
      "email": "jean.umucyo@university.rw",
      "gender": "M",
      "department": "SENG",
      "program": "BSc Software Engineering",
      "enrollmentStatus": "Active",
      "cumulativeGPA": 3.45,
      "currentSemesterGPA": 3.52
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

---

### GET /api/students/:studentId

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "studentId": "202502SENG001",
    "firstName": "Jean",
    "lastName": "Umucyo",
    "email": "jean.umucyo@university.rw",
    "phone": "+250788123456",
    "gender": "M",
    "dateOfBirth": "2003-05-15",
    "nationality": "Rwandan",
    "program": "BSc Software Engineering",
    "department": "SENG",
    "enrollmentStatus": "Active",
    "enrollmentDate": "2023-09-01",
    "expectedGraduationDate": "2027-12-15",
    "cumulativeGPA": 3.45,
    "currentSemesterGPA": 3.52,
    "totalCreditsEarned": 45,
    "totalCreditsRequired": 120,
    "lmsLoginFrequency": 25,
    "assignmentCompletionRate": 0.95,
    "attendanceRate": 0.92
  }
}
```

---

### GET /api/students/:studentId/record

**Response (200)** - Complete Student 360° Record:
```json
{
  "success": true,
  "data": {
    "student": { /* basic info */ },
    "enrollmentHistory": [
      {
        "enrollmentId": "ENROLL001",
        "courseId": "SENG101",
        "courseTitle": "Introduction to Software Engineering",
        "semester": "2025-02",
        "grade": "A",
        "gradePoints": 4.0,
        "credits": 3
      }
    ],
    "assessments": [
      {
        "assessmentId": "ASSESS001",
        "courseId": "SENG101",
        "name": "Assignment 1",
        "pointsEarned": 92,
        "totalPoints": 100,
        "submissionDate": "2025-02-16T14:30:00Z"
      }
    ],
    "attendance": [
      {
        "courseId": "SENG101",
        "sessionDate": "2025-02-25",
        "status": "Present",
        "signInTime": "2025-02-25T08:05:00Z"
      }
    ],
    "lmsActivity": {
      "totalLogins": 25,
      "lastLogin": "2025-02-28T14:30:00Z",
      "assignmentsSubmitted": 12,
      "forumsPostsCount": 8
    }
  }
}
```

---

## Course Endpoints

### GET /api/courses

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "courseId": "SENG101",
      "courseCode": "SENG101",
      "courseTitle": "Introduction to Software Engineering",
      "creditHours": 3,
      "semester": 1,
      "departmentName": "School of Engineering",
      "instructorName": "Dr. Theogene Rwema",
      "enrollmentCount": 38,
      "enrollmentCapacity": 40
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### GET /api/courses/:courseId

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "courseId": "SENG101",
    "courseTitle": "Introduction to Software Engineering",
    "description": "Fundamentals of software development...",
    "creditHours": 3,
    "instructor": "Dr. Theogene Rwema",
    "enrolledStudents": 38,
    "capacity": 40,
    "learningOutcomes": [
      "Understand software development lifecycle",
      "Apply design patterns",
      "Develop testing strategies"
    ],
    "gradeBreakdown": {
      "participation": 10,
      "assignments": 20,
      "projects": 20,
      "midterm": 20,
      "finalExam": 30
    }
  }
}
```

---

## Analytics Endpoints

### GET /api/analytics/dashboard

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalStudents": 1250,
    "activeEnrollments": 1180,
    "averageGPA": 3.32,
    "averageAttendance": 0.89,
    "atRiskStudentsCount": 45,
    "systemHealth": {
      "dataFreshness": "2025-02-28T14:30:00Z",
      "syncStatus": "healthy",
      "lastSyncTime": "2025-02-28T14:25:00Z",
      "connectedSystems": {
        "lms": "connected",
        "sis": "connected",
        "assessment": "connected"
      }
    }
  }
}
```

---

### GET /api/analytics/learning

**Query Parameters**:
- `programId`: Filter by program
- `departmentId`: Filter by department
- `startDate`, `endDate`: Date range

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "studentPerformance": {
      "gpaDistribution": {
        "excellent": 200,
        "good": 450,
        "satisfactory": 400,
        "needs_improvement": 100,
        "failing": 30
      },
      "averageGPA": 3.32,
      "completionRate": 0.94
    },
    "engagement": {
      "averageLMSLogin": 18,
      "assignmentCompletionRate": 0.93,
      "attendanceRate": 0.89
    },
    "coursePerformance": [
      {
        "courseId": "SENG101",
        "courseTitle": "Introduction to Software Engineering",
        "averageGrade": "B+",
        "completionRate": 0.96,
        "studentCount": 38
      }
    ]
  }
}
```

---

### GET /api/analytics/success

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "studentId": "202502SENG001",
        "successProbability": 0.92,
        "riskLevel": "low",
        "riskFactors": [],
        "recommendedInterventions": []
      },
      {
        "studentId": "202502BUS045",
        "successProbability": 0.38,
        "riskLevel": "high",
        "riskFactors": [
          "Low GPA (2.0)",
          "Poor attendance (60%)",
          "Limited LMS engagement"
        ],
        "recommendedInterventions": [
          "Academic tutoring",
          "Attendance monitoring",
          "Study skills workshop"
        ]
      }
    ],
    "modelStats": {
      "accuracy": 0.87,
      "precision": 0.84,
      "recall": 0.89,
      "lastUpdated": "2025-02-28T14:30:00Z"
    }
  }
}
```

---

### GET /api/analytics/curriculum

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "programMetrics": [
      {
        "programId": "PROG001",
        "programName": "Bachelor of Science in Software Engineering",
        "enrollmentCount": 450,
        "graduationRate": 0.87,
        "employmentRate": 0.92,
        "learningOutcomeAchievement": {
          "outcome1": 0.91,
          "outcome2": 0.88,
          "outcome3": 0.85
        }
      }
    ],
    "courseMetrics": [
      {
        "courseId": "SENG101",
        "courseTitle": "Introduction to Software Engineering",
        "enrollmentTrend": [120, 125, 128, 130, ...],
        "completionRate": 0.96,
        "averageGrade": "B+",
        "prerequisiteSuccess": 0.89
      }
    ]
  }
}
```

---

## Data Governance Endpoints

### GET /api/data-governance/quality

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "overallQualityScore": 0.92,
    "bySource": {
      "lms": {
        "score": 0.95,
        "recordsProcessed": 50000,
        "lastSync": "2025-02-28T14:25:00Z",
        "issues": 2
      },
      "sis": {
        "score": 0.88,
        "recordsProcessed": 12000,
        "lastSync": "2025-02-28T14:20:00Z",
        "issues": 5
      }
    },
    "dataIssues": [
      {
        "issueId": "ISSUE001",
        "severity": "minor",
        "description": "Missing email for 5 students",
        "recordCount": 5,
        "status": "pending"
      }
    ]
  }
}
```

---

### GET /api/data-governance/lineage

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "lms",
        "label": "LMS (Moodle)",
        "type": "source",
        "recordCount": 50000
      },
      {
        "id": "sis",
        "label": "SIS",
        "type": "source",
        "recordCount": 12000
      },
      {
        "id": "transform",
        "label": "ETL Transform",
        "type": "process",
        "transformations": 5
      },
      {
        "id": "record",
        "label": "Student Record",
        "type": "target",
        "recordCount": 1000
      }
    ],
    "edges": [
      { "from": "lms", "to": "transform" },
      { "from": "sis", "to": "transform" },
      { "from": "transform", "to": "record" }
    ]
  }
}
```

---

## Compliance Endpoints

### GET /api/compliance/accreditation

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "programId": "PROG001",
        "programName": "Bachelor of Science in Software Engineering",
        "accreditationStatus": "accredited",
        "standardsCompliance": {
          "standard1": { "achieved": true, "evidence": 3 },
          "standard2": { "achieved": true, "evidence": 2 },
          "standard3": { "achieved": false, "evidence": 0 }
        }
      }
    ],
    "evidenceItems": [
      {
        "evidenceId": "EV001",
        "standardName": "Program Learning Outcomes",
        "description": "Evidence of SLO assessment",
        "linkedPrograms": ["PROG001", "PROG002"],
        "status": "submitted",
        "lastUpdated": "2025-02-20T10:00:00Z"
      }
    ]
  }
}
```

---

### GET /api/compliance/hec-reports

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "enrollmentReport": {
      "totalEnrolled": 1250,
      "byGender": { "M": 750, "F": 500 },
      "byNationality": { "rwandan": 875, "international": 375 },
      "byProgram": { "PROG001": 200, "PROG002": 180, ... }
    },
    "graduationReport": {
      "totalGraduated": 250,
      "graduationRate": 0.87,
      "byProgram": { "PROG001": 0.89, "PROG002": 0.85, ... }
    },
    "facultyReport": {
      "totalFaculty": 85,
      "byQualification": { "PhD": 45, "Masters": 35, "Bachelors": 5 },
      "facultyToStudentRatio": 1.0
    }
  }
}
```

---

## Error Response Format

All endpoints follow this error format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

---

## MSW Handler Setup

### Example Handler File (authHandlers.js)

```javascript
import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return HttpResponse.json({
        success: false,
        error: 'Missing email or password'
      }, { status: 400 });
    }
    
    // Mock authentication
    const user = dummyUsers.find(u => u.email === body.email);
    if (!user || !validatePassword(body.password, user.password)) {
      return HttpResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
    return HttpResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: generateToken(user),
      mfaRequired: false
    }, { status: 200 });
  }),
  
  // More handlers...
];
```

---

## Response Time Simulation

Add artificial delay to simulate network latency:

```javascript
http.post('/api/auth/login', async ({ request }) => {
  // Simulate 500ms network delay
  await delay(500);
  
  // Return response
  return HttpResponse.json({...});
}),
```

---

**Last Updated**: April 3, 2026
