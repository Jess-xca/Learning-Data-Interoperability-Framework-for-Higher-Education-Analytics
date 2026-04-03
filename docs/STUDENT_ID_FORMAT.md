# Student ID Format Specification

## Format Definition

**Pattern**: `YYYYSSDDDNNN`

Where:

- **YYYY** = Academic Year (4 digits)
- **SS** = Semester (2 digits: 01 or 02)
- **DDD** = Department Code (3 letters)
- **NNN** = Sequential Number (3 digits, 001-999)

---

## Component Details

### Academic Year (YYYY)

- **Format**: 4-digit calendar year or fiscal year
- **Examples**: 2024, 2025, 2026
- **Notes**:
  - Should match enrollment year
  - Used to identify student cohort

### Semester (SS)

- **Format**: 2-digit month/semester indicator
- **Values**:
  - `01` = First semester (typically Jan-May in Rwanda)
  - `02` = Second semester (typically Jun-Dec in Rwanda)
- **Alternative Scenarios**:
  - Could use `09` (September start) and `02` (February start)
  - Adapt based on institution's academic calendar

### Department Code (DDD)

- **Format**: 3-letter uppercase abbreviation
- **Examples**:
  - `SENG` = Software Engineering
  - `CENG` = Civil Engineering
  - `EENG` = Electrical Engineering
  - `BUS` = Business Administration
  - `SCI` = Science (General)
  - `ARTS` = Arts & Humanities
  - `MED` = Medicine
  - `LAW` = Law

**Department Code Table**:

| Code | Department             | Facility    |
| ---- | ---------------------- | ----------- |
| SENG | Software Engineering   | Computing   |
| CENG | Civil Engineering      | Engineering |
| EENG | Electrical Engineering | Engineering |
| MENG | Mechanical Engineering | Engineering |
| BUS  | Business Management    | Business    |
| ECO  | Economics              | Business    |
| ACC  | Accounting             | Business    |
| SCI  | General Science        | Science     |
| BIO  | Biology                | Science     |
| CHEM | Chemistry              | Science     |
| PHYS | Physics                | Science     |
| MATH | Mathematics            | Science     |
| ARTS | Arts & Humanities      | Arts        |
| ENG  | English Language       | Arts        |
| HIST | History                | Arts        |
| MED  | Medicine               | Health      |
| NUR  | Nursing                | Health      |
| DENT | Dentistry              | Health      |
| LAW  | Law                    | Law         |
| AGR  | Agriculture            | Agriculture |
| VET  | Veterinary             | Agriculture |

---

### Sequential Number (NNN)

- **Format**: 3-digit zero-padded number
- **Range**: 001 to 999
- **Assignment**: Sequential within department + year + semester
- **Reset**: Typically resets each semester or year (depends on policy)

**Examples**:

- `201502SENG001` = First engineering student enrolled in 2015/semester 2
- `202501BUS150` = 150th business student enrolled in 2025/semester 1
- `202502LAW001` = First law student enrolled in 2025/semester 2

---

## Full Examples

### Example 1: Engineering Student

```
Student ID: 202502SENG001

Breakdown:
├── Year: 2025
├── Semester: 02 (June-December)
├── Department: SENG (Software Engineering)
└── Sequential #: 001

Meaning: First Software Engineering student enrolled in 2025, semester 2
```

### Example 2: Business Student

```
Student ID: 202401BUS045

Breakdown:
├── Year: 2024
├── Semester: 01 (January-May)
├── Department: BUS (Business)
└── Sequential #: 045

Meaning: 45th Business student enrolled in 2024, semester 1
```

### Example 3: Medical Student

```
Student ID: 202502MED018

Breakdown:
├── Year: 2025
├── Semester: 02 (June-December)
├── Department: MED (Medicine)
└── Sequential #: 018

Meaning: 18th Medicine student enrolled in 2025, semester 2
```

---

## Generation Logic

### Algorithm

```javascript
function generateStudentId(year, semester, departmentCode, sequentialNumber) {
  // Validate inputs
  if (!/^\d{4}$/.test(year)) throw new Error("Invalid year");
  if (!["01", "02"].includes(semester)) throw new Error("Invalid semester");
  if (!/^[A-Z]{3}$/.test(departmentCode)) throw new Error("Invalid department");
  if (
    !Number.isInteger(sequentialNumber) ||
    sequentialNumber < 1 ||
    sequentialNumber > 999
  ) {
    throw new Error("Invalid sequential number (1-999)");
  }

  // Format sequential number with leading zeros
  const paddedNumber = String(sequentialNumber).padStart(3, "0");

  // Concatenate components
  return `${year}${semester}${departmentCode}${paddedNumber}`;
}

// Example usage:
const studentId = generateStudentId(2025, "02", "SENG", 1);
console.log(studentId); // Output: 202502SENG001
```

### TypeScript Implementation

```typescript
interface StudentIdComponents {
  year: number;
  semester: "01" | "02";
  departmentCode: string;
  sequentialNumber: number;
}

interface StudentIdValidator {
  isValid(id: string): boolean;
  parse(id: string): StudentIdComponents | null;
  generate(components: StudentIdComponents): string;
}

class StudentIdValidator implements StudentIdValidator {
  private readonly pattern = /^(\d{4})(01|02)([A-Z]{3})(\d{3})$/;

  isValid(id: string): boolean {
    return this.pattern.test(id);
  }

  parse(id: string): StudentIdComponents | null {
    const match = id.match(this.pattern);
    if (!match) return null;

    return {
      year: parseInt(match[1]),
      semester: match[2] as "01" | "02",
      departmentCode: match[3],
      sequentialNumber: parseInt(match[4]),
    };
  }

  generate(components: StudentIdComponents): string {
    const paddedNumber = String(components.sequentialNumber).padStart(3, "0");
    return `${components.year}${components.semester}${components.departmentCode}${paddedNumber}`;
  }
}
```

---

## Usage in the System

### Student Registration

```javascript
// During registration:
const enrollmentData = {
  year: 2025,
  semester: 2, // Current semester
  department: "SENG",
  // Sequential number assigned by system
};

// System auto-generates ID
const nextSequentialNumber = getNextSequentialNumber(2025, 2, "SENG");
// Result: 1 (first student), 2 (second student), etc.

const studentId = generateStudentId(2025, "02", "SENG", nextSequentialNumber);
// Result: 202502SENG001
```

### ID Validation on Login

```javascript
function validateStudentId(id) {
  if (!validator.isValid(id)) {
    throw new Error("Invalid student ID format");
  }

  const components = validator.parse(id);
  const { year, semester, departmentCode, sequentialNumber } = components;

  // Additional checks:
  if (year < 2015) throw new Error("Year out of range");
  if (year > new Date().getFullYear() + 1) throw new Error("Year in future");

  return true;
}
```

### Dummy Data Generation

```javascript
function generateDummyStudentIds(count = 1000) {
  const students = [];
  const departments = ["SENG", "CENG", "BUS", "SCI", "ARTS", "MED"];

  for (let i = 0; i < count; i++) {
    const randomYear = Math.floor(Math.random() * 4) + 2022;
    const randomSemester = Math.random() > 0.5 ? "01" : "02";
    const randomDept =
      departments[Math.floor(Math.random() * departments.length)];

    // Track sequential numbers per department+year+semester
    const seq = getNextSequentialNumber(randomYear, randomSemester, randomDept);

    const studentId = generateStudentId(
      randomYear,
      randomSemester,
      randomDept,
      seq,
    );
    students.push({
      studentId,
      name: generateRandomName(),
      email: `${studentId}@university.rw`,
      // ... other fields
    });
  }

  return students;
}
```

---

## Database Storage

### Schema

```sql
CREATE TABLE Students (
  student_id VARCHAR(12) PRIMARY KEY,
  -- Components (for indexing and reporting)
  enrollment_year INT NOT NULL,
  enrollment_semester ENUM('01', '02') NOT NULL,
  department_code VARCHAR(3) NOT NULL,
  sequential_number INT NOT NULL,
  -- Other fields
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  -- ... other fields

  -- Indexes for fast lookup
  INDEX idx_enrollment_year (enrollment_year),
  INDEX idx_department (department_code),
  UNIQUE INDEX idx_dept_year_sem_seq (department_code, enrollment_year, enrollment_semester, sequential_number)
);
```

### Query Examples

```sql
-- Find all students from 2025, semester 2
SELECT * FROM Students
WHERE enrollment_year = 2025 AND enrollment_semester = '02';

-- Find all engineering students
SELECT * FROM Students
WHERE department_code = 'SENG';

-- Get student by full ID
SELECT * FROM Students
WHERE student_id = '202502SENG001';

-- Get last sequential number for a department
SELECT MAX(sequential_number) FROM Students
WHERE enrollment_year = 2025
  AND enrollment_semester = '02'
  AND department_code = 'SENG';
```

---

## Reporting & Analytics

### Student ID in Reports

Student IDs are displayed in various reports:

1. **Enrollment Reports**: Group by department (first 3 digits after year/semester)
2. **Cohort Analysis**: Group by year (first 4 digits)
3. **Time Series**: Compare semesters (digits 5-6)
4. **Department Reports**: Filter by department code (digits 7-9)

### Sample Report Query

```javascript
function getEnrollmentStats(year, semester) {
  const students = db.Students.find({
    enrollment_year: year,
    enrollment_semester: semester,
  });

  const statsByDepartment = {};

  for (const student of students) {
    const dept = student.department_code;
    if (!statsByDepartment[dept]) {
      statsByDepartment[dept] = { count: 0, ids: [] };
    }
    statsByDepartment[dept].count++;
    statsByDepartment[dept].ids.push(student.student_id);
  }

  return statsByDepartment;
}

// Output:
// {
//   SENG: { count: 150, ids: ['202502SENG001', '202502SENG002', ...] },
//   BUS: { count: 120, ids: [...] },
//   SCI: { count: 95, ids: [...] },
//   ...
// }
```

---

## Internationalization

The Student ID format is consistent across regions and languages:

- **Digits** (0-9): Universal across all languages
- **Department codes**: English abbreviations for international consistency
- **No special characters**: Ensures compatibility across systems

**Multi-language Label Examples**:

- English: "Student ID"
- Kiswahili: "Kitambulisho cha Mwanafunzi"
- French: "Numéro d'Étudiant"
- Kinyarwanda: "Umubare w'Umwanafunzi"

---

## Validation Rules

### Input Validation

- Length must be exactly 12 characters
- Characters 1-4 must be digits (year)
- Characters 5-6 must be "01" or "02" (semester)
- Characters 7-9 must be uppercase letters (department)
- Characters 10-12 must be digits (sequential number)

### Business Logic Validation

- Year must be between institution's founding year and current year + 1
- Department code must exist in approved department list
- Sequential number must be unique within (year, semester, department)

### Error Messages

```javascript
const validationErrors = {
  INVALID_FORMAT: "Student ID must be 12 characters in format YYYYSSDDDNNN",
  INVALID_YEAR: "Year must be between 2015 and 2026",
  INVALID_SEMESTER: "Semester must be 01 or 02",
  INVALID_DEPARTMENT: "Department code not recognized",
  INVALID_SEQUENTIAL: "Sequential number must be between 001 and 999",
  DUPLICATE_ID: "This student ID already exists",
};
```

---

## Migration Path (Future)

If the format needs to change:

1. New students get new format
2. Old student IDs remain valid
3. System maintains mapping between old and new formats
4. Reports can use either format (with conversion)
5. Gradual phaseout of old format over 3-5 years

---

**Last Updated**: April 3, 2026
