/**
 * HEC-Compliant Dummy Data for LDIF
 * Rwanda-specific, based on AUCA (African University for Christ-Centered Education) template
 * Follows HEC (Higher Education Council) Rwanda standards
 */

// HEC Registration Categories
export interface HECInstitution {
  id: string;
  name: string;
  registrationNumber: string;
  category: "University" | "Polytechnic" | "Teacher Training College" | "Other";
  location: {
    city: string;
    district: string;
    province: string;
  };
  contactEmail: string;
  phone: string;
  website?: string;
  established: number;
  accreditationStatus:
    | "Accredited"
    | "Provisionally Accredited"
    | "Under Review";
  totalStudents: number;
  faculties: string[];
}

// HEC Study Levels/Programs
export interface HECProgram {
  id: string;
  name: string;
  level: "Diploma" | "Bachelor" | "Master" | "PhD";
  duration: number; // years
  discipline:
    | "Science"
    | "Engineering"
    | "Business"
    | "Education"
    | "Health"
    | "Law"
    | "Art & Humanities";
  accreditationStatus:
    | "Accredited"
    | "Provisionally Accredited"
    | "Under Review";
  nqfLevel: number; // 3-10 per Rwanda NQF
}

export interface HECStudent {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    nationalId: string;
    email: string;
    phone: string;
    placeOfBirth: string;
    dateOfBirth: string; // ISO date
  };
  enrollment: {
    enrollmentNumber: string;
    institutionId: string;
    programId: string;
    enrollmentDate: string; // ISO date
    expectedGraduationDate: string; // ISO date
    academicYear: number;
    status: "Active" | "Graduated" | "Suspended" | "Withdrawn";
  };
  academic: {
    gpa: number;
    credits: number;
    completedCredits: number;
    courses: {
      courseCode: string;
      courseName: string;
      grade: string;
      credits: number;
    }[];
  };
  riskIndicators: {
    riskScore: number; // 0-100
    predictionStatus: "Low Risk" | "Medium Risk" | "High Risk" | "Critical";
    attendanceRate: number; // 0-100
    engagementScore: number; // 0-100
    lastActivity: string; // ISO date
  };
}

export interface HECCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  level: "100" | "200" | "300" | "400" | "500";
  instructor: string;
  semester: number;
}

// AUCA-based HEC Institution
export const AUCA_INSTITUTION: HECInstitution = {
  id: "inst_001_auca",
  name: "African University for Christ-Centered Education (AUCA)",
  registrationNumber: "HER/HED/2002/00002",
  category: "University",
  location: {
    city: "Kigali",
    district: "Gasabo",
    province: "Kigali City",
  },
  contactEmail: "info@auca.ac.rw",
  phone: "+250 (0) 788 560 000",
  website: "www.auca.ac.rw",
  established: 2001,
  accreditationStatus: "Accredited",
  totalStudents: 1800,
  faculties: [
    "Engineering",
    "Business & Economics",
    "Education",
    "Law",
    "Arts & Sciences",
  ],
};

// HEC-aligned Programs (NQF Levels)
export const HEC_PROGRAMS: HECProgram[] = [
  {
    id: "prog_eng_101",
    name: "Bachelor of Engineering Science - Civil Engineering",
    level: "Bachelor",
    duration: 4,
    discipline: "Engineering",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_eng_102",
    name: "Bachelor of Engineering Science - Electrical Engineering",
    level: "Bachelor",
    duration: 4,
    discipline: "Engineering",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_eng_103",
    name: "Bachelor of Engineering Science - Mechanical Engineering",
    level: "Bachelor",
    duration: 4,
    discipline: "Engineering",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_bus_201",
    name: "Bachelor of Business Administration",
    level: "Bachelor",
    duration: 3,
    discipline: "Business",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_bus_202",
    name: "Bachelor of Accountancy",
    level: "Bachelor",
    duration: 3,
    discipline: "Business",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_edu_301",
    name: "Bachelor of Education - Secondary Education",
    level: "Bachelor",
    duration: 3,
    discipline: "Education",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_law_401",
    name: "Bachelor of Laws (LL.B)",
    level: "Bachelor",
    duration: 4,
    discipline: "Law",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_sci_501",
    name: "Bachelor of Science - Computer Science",
    level: "Bachelor",
    duration: 3,
    discipline: "Science",
    accreditationStatus: "Accredited",
    nqfLevel: 7,
  },
  {
    id: "prog_mas_601",
    name: "Master of Business Administration (MBA)",
    level: "Master",
    duration: 2,
    discipline: "Business",
    accreditationStatus: "Accredited",
    nqfLevel: 9,
  },
  {
    id: "prog_mas_602",
    name: "Master of Engineering Management",
    level: "Master",
    duration: 2,
    discipline: "Engineering",
    accreditationStatus: "Provisionally Accredited",
    nqfLevel: 9,
  },
];

// Rwanda Names (Kinyarwanda-origin)
const RWANDAN_FIRST_NAMES = [
  "Jean",
  "Marie",
  "Paul",
  "Anne",
  "Pierre",
  "Claire",
  "David",
  "Christine",
  "Michel",
  "Isabelle",
  "Robert",
  "Martine",
  "Claude",
  "Véronique",
  "Timothée",
  "Sophie",
  "Jérôme",
  "Sylvie",
  "Grégoire",
  "Florence",
  "Alphonse",
  "Justine",
  "Félicien",
  "Nadège",
  "Innocent",
  "Diane",
  "Valentin",
  "Carole",
  "Vital",
  "Delphine",
];

const RWANDAN_LAST_NAMES = [
  "Habimana",
  "Mugisha",
  "Kamanzi",
  "Kubwimana",
  "Nsabimana",
  "Makuza",
  "Gasana",
  "Bizimungu",
  "Kagame",
  "Mukabaranga",
  "Ntambara",
  "Tumusiime",
  "Kamanda",
  "Mpindi",
  "Mpago",
  "Nkubito",
  "Ingabire",
  "Mugenzi",
  "Rukundo",
  "Kayumba",
  "Ndagijimana",
  "Nyakarundi",
  "Uwitonze",
  "Habineza",
  "Rusatira",
  "Mugenzi",
  "Ngabire",
  "Karasira",
  "Ndabaneze",
  "Mutabaruka",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateNationalId(): string {
  // Rwanda National ID format: 1 YYMMLLDNNNN
  const year = Math.floor(Math.random() * 50) + 1950;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const region = String(Math.floor(Math.random() * 30)).padStart(2, "0");
  const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  return `1${year}${month}${day}${region}${sequence}`;
}

function generateEnrollmentNumber(
  institutionId: string,
  year: number,
  index: number,
): string {
  // Format: [INST_CODE]/[YEAR]/[INDEX]
  const instCode = institutionId.split("_")[2].toUpperCase();
  const paddedIndex = String(index).padStart(4, "0");
  return `${instCode}/${year}/${paddedIndex}`;
}

function generateRandomGPA(): number {
  return parseFloat((Math.random() * 4.0).toFixed(2));
}

function calculateCompletedCredits(
  yearEnrolled: number,
  currentYear: number = new Date().getFullYear(),
): number {
  const yearsCompleted = Math.min(currentYear - yearEnrolled, 4);
  return yearsCompleted * 30; // ~30 credits per year
}

export function generateHECStudents(
  count: number = 50,
  institutionId: string = AUCA_INSTITUTION.id,
  programId: string = HEC_PROGRAMS[0].id,
): HECStudent[] {
  const students: HECStudent[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(RWANDAN_FIRST_NAMES);
    const lastName = getRandomItem(RWANDAN_LAST_NAMES);
    const enrollmentYear = currentYear - Math.floor(Math.random() * 4);
    const gpa = generateRandomGPA();
    const completedCredits = calculateCompletedCredits(
      enrollmentYear,
      currentYear,
    );

    const riskScore =
      Math.random() > 0.7
        ? Math.floor(Math.random() * 100)
        : Math.floor(Math.random() * 40);
    const predictionStatus =
      riskScore < 25
        ? "Low Risk"
        : riskScore < 50
          ? "Medium Risk"
          : riskScore < 75
            ? "High Risk"
            : "Critical";

    const student: HECStudent = {
      id: `std_${i + 1}`,
      personalInfo: {
        firstName,
        lastName,
        nationalId: generateNationalId(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.auca.ac.rw`,
        phone: `+250${Math.floor(Math.random() * 900000000)
          .toString()
          .padStart(9, "0")}`,
        placeOfBirth: getRandomItem([
          "Kigali",
          "Butare",
          "Gitarama",
          "Muhanga",
          "Gisenyi",
          "Ruhengeri",
          "Kisumu",
          "Rusumo",
        ]),
        dateOfBirth: new Date(
          currentYear - Math.floor(Math.random() * 10) - 18,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ).toISOString(),
      },
      enrollment: {
        enrollmentNumber: generateEnrollmentNumber(
          institutionId,
          enrollmentYear,
          i,
        ),
        institutionId,
        programId,
        enrollmentDate: new Date(enrollmentYear, 0, 15).toISOString(),
        expectedGraduationDate: new Date(
          enrollmentYear + 4,
          5,
          30,
        ).toISOString(),
        academicYear: currentYear,
        status:
          Math.random() > 0.95
            ? "Suspended"
            : Math.random() > 0.9
              ? "Graduated"
              : "Active",
      },
      academic: {
        gpa,
        credits: 120,
        completedCredits,
        courses: [
          {
            courseCode: "ENG101",
            courseName: "Introduction to Engineering",
            grade: "A",
            credits: 3,
          },
          {
            courseCode: "MTH201",
            courseName: "Calculus II",
            grade: String.fromCharCode(65 + Math.floor(Math.random() * 3)),
            credits: 4,
          },
          {
            courseCode: "ENG202",
            courseName: "Structural Analysis",
            grade: String.fromCharCode(65 + Math.floor(Math.random() * 4)),
            credits: 3,
          },
          {
            courseCode: "GEN301",
            courseName: "Professional Ethics",
            grade: "B",
            credits: 2,
          },
        ],
      },
      riskIndicators: {
        riskScore,
        predictionStatus,
        attendanceRate: Math.floor(Math.random() * 30) + 70,
        engagementScore: Math.floor(Math.random() * 40) + 60,
        lastActivity: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        ).toISOString(),
      },
    };

    students.push(student);
  }

  return students;
}

export function generateHECCourses(
  _programId: string = HEC_PROGRAMS[0].id,
): HECCourse[] {
  const courseTypes = [
    { code: "MTH", name: "Mathematics" },
    { code: "PHY", name: "Physics" },
    { code: "CHM", name: "Chemistry" },
    { code: "ENG", name: "Engineering" },
    { code: "BUS", name: "Business" },
    { code: "GEN", name: "General Education" },
  ];

  const courses: HECCourse[] = [];
  const instructors = [
    "Dr. Jean Habimana",
    "Prof. Marie Kamanzi",
    "Dr. Paul Mugisha",
    "Prof. Claire Makuza",
    "Dr. Michel Gasana",
  ];

  let courseId = 1;
  for (let level = 100; level <= 400; level += 100) {
    for (let i = 0; i < 5; i++) {
      const type = getRandomItem(courseTypes);
      courses.push({
        id: `crs_${courseId++}`,
        code: `${type.code}${level}`,
        name: `${type.name} ${level === 100 ? "I" : level === 200 ? "II" : level === 300 ? "III" : "IV"}`,
        credits: Math.random() > 0.5 ? 3 : 4,
        level: (level / 100).toString() as
          | "100"
          | "200"
          | "300"
          | "400"
          | "500",
        instructor: getRandomItem(instructors),
        semester: Math.floor(Math.random() * 2) + 1,
      });
    }
  }

  return courses;
}

// Export sample data generators
export function getHECInstitutions(): HECInstitution[] {
  return [AUCA_INSTITUTION];
}

export function getHECPrograms(): HECProgram[] {
  return HEC_PROGRAMS;
}

// Generate comprehensive HEC dataset
export function generateComprehensiveHECDataset() {
  return {
    institutions: getHECInstitutions(),
    programs: getHECPrograms(),
    students: generateHECStudents(75),
    courses: generateHECCourses(),
  };
}
