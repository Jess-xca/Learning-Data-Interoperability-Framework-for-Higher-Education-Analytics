// Student ID format: YYYYSSDDDNNN
// YYYY = Enrollment year
// SS = Semester (01, 02)
// DDD = Department code (ENG, BUS, SCI, etc.)
// NNN = Sequential number (001-999)

import type {
  StudentPerformanceMetric,
  EngagementMetric,
} from '../types/analytics';
import type {
  StudentSuccessPrediction,
  InterventionRecommendation,
  EarlyWarningIndicator,
} from '../types/prediction';

const DEPARTMENT_CODES: Record<string, string> = {
  Engineering: "ENG",
  "Business Administration": "BUS",
  "Computer Science": "CSC",
  "Information Technology": "ITE",
  Medicine: "MED",
  Law: "LAW",
  Education: "EDU",
  Agriculture: "AGR",
  Science: "SCI",
};

export function generateStudentId(
  enrollmentYear: number,
  semester: number,
  department: string,
  sequenceNumber: number,
): string {
  const deptCode = DEPARTMENT_CODES[department] || "GEN";
  const semesterCode = semester.toString().padStart(2, "0");
  const deptPart = deptCode.substring(0, 3);
  const seqPart = sequenceNumber.toString().padStart(3, "0");

  return `${enrollmentYear}${semesterCode}${deptPart}${seqPart}`;
}

export interface DummyStudent {
  id: string;
  name: string;
  email: string;
  gpa: number;
  program: string;
  enrollmentYear: number;
  status: "active" | "graduated" | "suspended";
  phone?: string;
  address?: string;
  // Enhanced metrics
  riskScore: number; // 0-100
  predictionStatus: "low" | "medium" | "high" | "critical";
  engagementScore: number; // 0-100
  attendanceRate: number; // 0-100
  lastActivity: string; // ISO date
  activities: { date: string; type: string; details: string; impact: "positive" | "negative" | "neutral" }[];
}

const FIRST_NAMES = [
  "Jean",
  "Claire",
  "David",
  "Marie",
  "Pierre",
  "Anne",
  "Michel",
  "Sophie",
  "Robert",
  "Isabelle",
  "Philippe",
  "Catherine",
  "Georges",
  "Édith",
  "André",
  "Martine",
  "Claudette",
  "Alain",
  "Véronique",
  "Dominique",
  "Marcus",
  "Julia",
  "Lucas",
  "Emma",
];

const LAST_NAMES = [
  "Umucyo",
  "Habimana",
  "Mugisha",
  "Kamanzi",
  "Kubwimana",
  "Tsingyun",
  "Nsabimana",
  "Makuza",
  "Gasana",
  "Bizimungu",
  "Kagame",
  "Tutsi",
  "Hutu",
  "Twa",
  "Bantu",
  "Swahili",
  "Kinyarwanda",
  "Ikinyarwanda",
  "Ikirundi",
  "Kinande",
  "Kinyabwisha",
  "Ashanti",
];

const PROGRAMS = [
  "Engineering",
  "Business Administration",
  "Computer Science",
  "Information Technology",
  "Medicine",
  "Law",
  "Education",
  "Agriculture",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomGPA(): number {
  return parseFloat((Math.random() * 4.0).toFixed(2));
}

export function generateDummyStudents(count: number = 1000): DummyStudent[] {
  const students: DummyStudent[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(FIRST_NAMES);
    const lastName = getRandomItem(LAST_NAMES);
    const program = getRandomItem(PROGRAMS);
    const enrollmentYear = currentYear - Math.floor(Math.random() * 4);
    const semester = Math.floor(Math.random() * 2) + 1;
    const sequenceNum = (i % 999) + 1;

    const riskScore = Math.floor(Math.random() * 100);
    const predictionStatus =
      riskScore < 30
        ? "low"
        : riskScore < 60
          ? "medium"
          : riskScore < 85
            ? "high"
            : "critical";

    const student: DummyStudent = {
      id: generateStudentId(enrollmentYear, semester, program, sequenceNum),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.institution.edu`,
      gpa: generateRandomGPA(),
      program,
      enrollmentYear,
      status:
        Math.random() > 0.9
          ? "suspended"
          : Math.random() > 0.8
            ? "graduated"
            : "active",
      phone: `+250${Math.floor(Math.random() * 900000000)
        .toString()
        .padStart(9, "0")}`,
      address: `Kigali, Rwanda`,
      riskScore,
      predictionStatus,
      engagementScore: Math.floor(Math.random() * 40) + 60,
      attendanceRate: Math.floor(Math.random() * 30) + 70,
      lastActivity: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      activities: [
        {
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          type: "Assignment",
          details: "Submitted Quiz 4",
          impact: "positive",
        },
        {
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          type: "LMS",
          details: "Logged into Canvas LMS",
          impact: "neutral",
        },
        {
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          type: "Attendance",
          details: "Missed Calculus III lecture",
          impact: "negative",
        },
      ],
    };

    students.push(student);
  }

  return students;
}

export function getDummyStudentsByProgram(
  students: DummyStudent[],
  program: string,
): DummyStudent[] {
  return students.filter((s) => s.program === program);
}

export function getDummyStudentsByStatus(
  students: DummyStudent[],
  status: DummyStudent["status"],
): DummyStudent[] {
  return students.filter((s) => s.status === status);
}

// ===== Analytics & Prediction Data Generation =====
// All data generation in one place for consistency and reusability

const analyticsCache = {
  performance: new Map<string, StudentPerformanceMetric>(),
  engagement: new Map<string, EngagementMetric>(),
  predictions: new Map<string, StudentSuccessPrediction>(),
  interventions: new Map<string, InterventionRecommendation[]>(),
  earlyWarnings: [] as EarlyWarningIndicator[],
  initialized: false,
};

/**
 * Generate all analytics and prediction data for students
 * Single initialization - reused across all pages
 */
export function generateAnalyticsData(students: DummyStudent[]): void {
  if (analyticsCache.initialized) return;

  const courseIds = ['MATH101', 'CS201', 'BUS301', 'ENG101', 'PHY201'];

  students.forEach((student) => {
    // Generate performance metrics
    courseIds.forEach((courseId) => {
      const key = `${student.id}-${courseId}`;
      const metric: StudentPerformanceMetric = {
        studentId: student.id,
        courseName: getCourseNameFromId(courseId),
        courseId,
        enrollmentDate: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
        currentGrade: calculateGradeFromGPA(student.gpa),
        averageScore: Math.round(calculateGradeFromGPA(student.gpa) * 0.95),
        assignmentCompletion: Math.min(100, student.attendanceRate + Math.random() * 20),
        assessmentCount: Math.floor(Math.random() * 15) + 5,
        lastActivityDate: new Date(student.lastActivity),
        totalActivityHours: Math.floor(Math.random() * 80) + 20,
        engagementScore: student.engagementScore,
        trend: student.gpa > 3.0 ? 'improving' : student.gpa > 2.0 ? 'stable' : 'declining',
      };
      analyticsCache.performance.set(key, metric);

      // Generate engagement metrics
      const engKey = `${student.id}-${courseId}`;
      const engagement: EngagementMetric = {
        studentId: student.id,
        courseId,
        courseName: getCourseNameFromId(courseId),
        logins: Math.floor(Math.random() * 30) + 5,
        assignmentsSubmitted: Math.floor(Math.random() * 20) + 3,
        forumPostsCount: Math.floor(Math.random() * 15),
        videosWatched: Math.floor(Math.random() * 50) + 10,
        timeSpentMinutes: Math.floor(Math.random() * 200) + 50,
        resourcesAccessed: Math.floor(Math.random() * 100) + 20,
        lastLoginDate: new Date(student.lastActivity),
        engagementLevel: getEngagementLevel(student.engagementScore),
      };
      analyticsCache.engagement.set(engKey, engagement);
    });

    // Generate predictions
    const successProbability = Math.max(10, 100 - student.riskScore);
    
    // Calculate predicted GPA based on success probability
    let predictedGPA = 4.0;
    if (successProbability < 20) {
      predictedGPA = 1.5 + Math.random() * 0.4; // 1.5-1.9
    } else if (successProbability < 40) {
      predictedGPA = 1.8 + Math.random() * 0.7; // 1.8-2.5
    } else if (successProbability < 60) {
      predictedGPA = 2.3 + Math.random() * 0.8; // 2.3-3.1
    } else if (successProbability < 80) {
      predictedGPA = 2.8 + Math.random() * 0.9; // 2.8-3.7
    } else {
      predictedGPA = 3.3 + Math.random() * 0.7; // 3.3-4.0
    }
    predictedGPA = Math.min(4.0, Math.max(0, parseFloat(predictedGPA.toFixed(2))));
    
    const prediction: StudentSuccessPrediction = {
      studentId: student.id,
      studentName: student.name,
      cohortId: 'cohort-2024',
      cohortName: `Class of ${new Date().getFullYear()}`,
      currentTerm: `Fall ${new Date().getFullYear()}`,
      riskLevel: student.predictionStatus as any,
      riskScore: student.riskScore,
      successProbability: Math.round(successProbability * 100) / 100,
      predictedGPA,
      completionProbability: Math.min(100, Math.round((successProbability + Math.random() * 20) * 100) / 100),
      retentionProbability: Math.min(100, Math.round((successProbability + Math.random() * 15) * 100) / 100),
      predictionConfidence: Math.floor(Math.random() * 20) + 80,
      lastUpdated: new Date(student.lastActivity),
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    analyticsCache.predictions.set(student.id, prediction);

    // Generate interventions
    const interventionTypes = ['tutoring', 'academic', 'personal', 'tech-support', 'financial', 'career-counseling'] as const;
    const priority = student.riskScore > 85 ? 'urgent' : student.riskScore > 60 ? 'high' : 'medium';
    const recommendations: InterventionRecommendation[] = [];

    interventionTypes.slice(0, student.riskScore > 75 ? 4 : 3).forEach((type, index) => {
      recommendations.push({
        id: `rec-${student.id}-${type}-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        courseId: 'general',
        courseName: 'Overall Program',
        riskLevel: student.predictionStatus as any,
        interventionType: type,
        interventionName: getInterventionName(type),
        description: getInterventionDescription(type),
        priority,
        estimatedImpact: Math.round((Math.random() * 30 + 15) * 100) / 100,
        timeToImplement: ['1 day', '3 days', '1 week'][index % 3],
        recommendedBy: 'Risk Model',
        acceptanceStatus: Math.random() > 0.3 ? 'pending' : 'accepted',
        createdDate: new Date(),
        targetCompletionDate: new Date(Date.now() + (type === 'tutoring' ? 7 : 14) * 24 * 60 * 60 * 1000),
      });
    });
    analyticsCache.interventions.set(student.id, recommendations);

    // Generate early warnings for at-risk students
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
          analyticsCache.earlyWarnings.push(warning);
        }
      });
    }
  });

  analyticsCache.initialized = true;
}

// ===== Public API for Data Retrieval =====

export function getPerformanceMetric(studentId: string, courseId: string): StudentPerformanceMetric | undefined {
  return analyticsCache.performance.get(`${studentId}-${courseId}`);
}

export function getAllPerformanceMetrics(): StudentPerformanceMetric[] {
  return Array.from(analyticsCache.performance.values());
}

export function getEngagementMetric(studentId: string, courseId: string): EngagementMetric | undefined {
  return analyticsCache.engagement.get(`${studentId}-${courseId}`);
}

export function getAllEngagementMetrics(): EngagementMetric[] {
  return Array.from(analyticsCache.engagement.values());
}

export function getAllPredictions(): StudentSuccessPrediction[] {
  return Array.from(analyticsCache.predictions.values());
}

export function getPrediction(studentId: string): StudentSuccessPrediction | undefined {
  return analyticsCache.predictions.get(studentId);
}

export function getInterventions(studentId: string): InterventionRecommendation[] {
  return analyticsCache.interventions.get(studentId) || [];
}

export function getAllEarlyWarnings(): EarlyWarningIndicator[] {
  return analyticsCache.earlyWarnings;
}

export function getDashboardData() {
  const predictions = getAllPredictions();
  return {
    totalStudents: Array.from(analyticsCache.predictions.keys()).length,
    criticalRisk: predictions.filter(p => p.riskLevel === 'critical').length,
    highRisk: predictions.filter(p => p.riskLevel === 'high').length,
    atRiskCount: analyticsCache.earlyWarnings.length,
    avgSuccessProbability: predictions.length > 0 
      ? predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length 
      : 0,
  };
}

// ===== Helper Functions =====

function getCourseNameFromId(courseId: string): string {
  const courses: Record<string, string> = {
    MATH101: 'Calculus I',
    CS201: 'Data Structures',
    BUS301: 'Business Strategy',
    ENG101: 'English Composition',
    PHY201: 'Physics II',
  };
  return courses[courseId] || courseId;
}

function calculateGradeFromGPA(gpa: number): number {
  return Math.max(0, Math.min(100, (gpa / 4.0) * 100));
}

function getEngagementLevel(score: number): 'high' | 'medium' | 'low' | 'inactive' {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  if (score >= 25) return 'low';
  return 'inactive';
}

function getInterventionName(type: string): string {
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

function getInterventionDescription(type: string): string {
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
