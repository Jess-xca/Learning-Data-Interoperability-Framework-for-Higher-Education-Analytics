// Student ID format: YYYYSSDDDNNN
// YYYY = Enrollment year
// SS = Semester (01, 02)
// DDD = Department code (ENG, BUS, SCI, etc.)
// NNN = Sequential number (001-999)

const DEPARTMENT_CODES: Record<string, string> = {
  'Engineering': 'ENG',
  'Business Administration': 'BUS',
  'Computer Science': 'CSC',
  'Information Technology': 'ITE',
  'Medicine': 'MED',
  'Law': 'LAW',
  'Education': 'EDU',
  'Agriculture': 'AGR',
  'Science': 'SCI',
};

export function generateStudentId(enrollmentYear: number, semester: number, department: string, sequenceNumber: number): string {
  const deptCode = DEPARTMENT_CODES[department] || 'GEN';
  const semesterCode = semester.toString().padStart(2, '0');
  const deptPart = deptCode.substring(0, 3);
  const seqPart = sequenceNumber.toString().padStart(3, '0');
  
  return `${enrollmentYear}${semesterCode}${deptPart}${seqPart}`;
}

export interface DummyStudent {
  id: string;
  name: string;
  email: string;
  gpa: number;
  program: string;
  enrollmentYear: number;
  status: 'active' | 'graduated' | 'suspended';
  phone?: string;
  address?: string;
}

const FIRST_NAMES = [
  'Jean', 'Claire', 'David', 'Marie', 'Pierre', 'Anne', 'Michel', 'Sophie',
  'Robert', 'Isabelle', 'Philippe', 'Catherine', 'Georges', 'Édith', 'André', 'Martine',
  'Claudette', 'Alain', 'Véronique', 'Dominique', 'Marcus', 'Julia', 'Lucas', 'Emma',
];

const LAST_NAMES = [
  'Umucyo', 'Habimana', 'Mugisha', 'Kamanzi', 'Kubwimana', 'Tsingyun', 'Nsabimana',
  'Makuza', 'Gasana', 'Bizimungu', 'Kagame', 'Tutsi', 'Hutu', 'Twa', 'Bantu',
  'Swahili', 'Kinyarwanda', 'Ikinyarwanda', 'Ikirundi', 'Kinande', 'Kinyabwisha', 'Ashanti',
];

const PROGRAMS = [
  'Engineering',
  'Business Administration',
  'Computer Science',
  'Information Technology',
  'Medicine',
  'Law',
  'Education',
  'Agriculture',
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

    const student: DummyStudent = {
      id: generateStudentId(enrollmentYear, semester, program, sequenceNum),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.institution.edu`,
      gpa: generateRandomGPA(),
      program,
      enrollmentYear,
      status: Math.random() > 0.9 ? 'suspended' : Math.random() > 0.8 ? 'graduated' : 'active',
      phone: `+250${Math.floor(Math.random() * 900000000).toString().padStart(9, '0')}`,
      address: `Kigali, Rwanda`,
    };

    students.push(student);
  }

  return students;
}

export function getDummyStudentsByProgram(students: DummyStudent[], program: string): DummyStudent[] {
  return students.filter(s => s.program === program);
}

export function getDummyStudentsByStatus(students: DummyStudent[], status: DummyStudent['status']): DummyStudent[] {
  return students.filter(s => s.status === status);
}
