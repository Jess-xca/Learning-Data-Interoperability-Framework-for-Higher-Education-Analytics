import { http, HttpResponse } from "msw";
import { generateDummyStudents } from "../../data/dummyGenerator";
import { getHECPrograms, getHECInstitutions } from "../../data/hecDummyData";

// Use relative URLs for MSW to intercept properly
const API_BASE = "/api";

// Mock data
const mockStudents = generateDummyStudents(800); // Serve 800 rich dummy students

const mockCourses = [
  {
    id: "SENG101",
    code: "SENG101",
    name: "Introduction to Programming",
    instructor: "Dr. Kagame",
    credits: 3,
    enrollment: 45,
  },
  {
    id: "SENG102",
    code: "SENG102",
    name: "Data Structures",
    instructor: "Eng. Kubwimana",
    credits: 4,
    enrollment: 38,
  },
  {
    id: "BUS101",
    code: "BUS101",
    name: "Business Management",
    instructor: "Prof. Tsingyun",
    credits: 3,
    enrollment: 52,
  },
  {
    id: "MAT101",
    code: "MAT101",
    name: "Calculus I",
    instructor: "Dr. Gasana",
    credits: 4,
    enrollment: 120,
  },
  {
    id: "PHY101",
    code: "PHY101",
    name: "General Physics",
    instructor: "Prof. Nsabimana",
    credits: 4,
    enrollment: 85,
  },
  {
    id: "CSC201",
    code: "CSC201",
    name: "Algorithms",
    instructor: "Eng. Kubwimana",
    credits: 3,
    enrollment: 30,
  },
];

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email && body.password) {
      return HttpResponse.json({
        success: true,
        user: {
          id: "admin-001",
          email: body.email,
          name: "System Administrator",
          role: "admin",
          institution: "UNIVERS ITE DE KIGALI",
          mfaEnabled: false,
        },
      });
    }
    return HttpResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }),

  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Students endpoints
  http.get(`${API_BASE}/students`, () => {
    return HttpResponse.json({ success: true, data: mockStudents });
  }),

  http.get(`${API_BASE}/students/:id`, ({ params }) => {
    const student = mockStudents.find((s) => s.id === params.id);
    if (student) {
      return HttpResponse.json({ success: true, data: student });
    }
    return HttpResponse.json(
      { success: false, error: "Student not found" },
      { status: 404 },
    );
  }),

  http.post(`${API_BASE}/students`, async ({ request }) => {
    const newStudent = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { success: true, data: { id: "new-id", ...newStudent } },
      { status: 201 },
    );
  }),

  http.put(`${API_BASE}/students/:id`, async ({ request, params }) => {
    const updatedStudent = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: { id: params.id, ...updatedStudent },
    });
  }),

  // Courses endpoints
  http.get(`${API_BASE}/courses`, () => {
    return HttpResponse.json({ success: true, data: mockCourses });
  }),

  http.get(`${API_BASE}/courses/:id`, ({ params }) => {
    const course = mockCourses.find((c) => c.id === params.id);
    if (course) {
      return HttpResponse.json({ success: true, data: course });
    }
    return HttpResponse.json(
      { success: false, error: "Course not found" },
      { status: 404 },
    );
  }),

  // Programs endpoints
  http.get(`${API_BASE}/programs`, () => {
    const heckPrograms = getHECPrograms();
    // Transform HEC programs to match expected Program interface
    const transformedPrograms = heckPrograms.map((prog) => ({
      id: prog.id,
      code: prog.id.replace("prog_", "").toUpperCase(),
      name: prog.name,
      department: prog.discipline,
      totalCourses: Math.floor(prog.duration * 6), // Estimate: ~6 courses per year
    }));
    return HttpResponse.json({ success: true, data: transformedPrograms });
  }),

  http.get(`${API_BASE}/programs/:id`, ({ params }) => {
    const heckPrograms = getHECPrograms();
    const prog = heckPrograms.find((p) => p.id === params.id);
    if (prog) {
      const transformed = {
        id: prog.id,
        code: prog.id.replace("prog_", "").toUpperCase(),
        name: prog.name,
        department: prog.discipline,
        totalCourses: Math.floor(prog.duration * 6),
      };
      return HttpResponse.json({ success: true, data: transformed });
    }
    return HttpResponse.json(
      { success: false, error: "Program not found" },
      { status: 404 },
    );
  }),

  // Institutions endpoints
  http.get(`${API_BASE}/institutions`, () => {
    const institutions = getHECInstitutions();
    return HttpResponse.json({ success: true, data: institutions });
  }),

  // Dashboard metrics
  http.get(`${API_BASE}/metrics/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalStudents: 1250,
        graduationRate: 84.2,
        facultyToStudent: 18,
        programsActive: 42,
        trends: {
          students: 5.2,
          graduation: 2.1,
          faculty: -1.5,
          programs: 8.3,
        },
      },
    });
  }),

  http.get(`${API_BASE}/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalStudents: 1250,
        graduationRate: 84.2,
        facultyToStudent: 18,
        programsActive: 42,
        trends: {
          students: 5.2,
          graduation: 2.1,
          faculty: -1.5,
          programs: 8.3,
        },
      },
    });
  }),

  // Analytics endpoints
  http.get(`${API_BASE}/analytics/summary`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        students: 1250,
        programs: 42,
        courses: 284,
        enrollment: 95.3,
      },
    });
  }),

  http.get(`${API_BASE}/analytics/enrollment`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { month: "Jan", engineering: 320, business: 240, science: 280 },
        { month: "Feb", engineering: 330, business: 250, science: 290 },
        { month: "Mar", engineering: 350, business: 270, science: 310 },
        { month: "Apr", engineering: 380, business: 290, science: 330 },
      ],
    });
  }),

  // Reports endpoints
  http.get(`${API_BASE}/reports`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: "rpt_001",
          name: "Enrollment Report",
          date: "2024-01-15",
          status: "Generated",
        },
        {
          id: "rpt_002",
          name: "Performance Report",
          date: "2024-01-20",
          status: "Generated",
        },
      ],
    });
  }),

  // External API: DiceBear Avatars (used for user profile pictures)
  http.get("https://api.dicebear.com/9.x/avataaars/svg", () => {
    // Return a simple SVG placeholder avatar
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#6366f1"/>
        <circle cx="50" cy="35" r="15" fill="#fff"/>
        <ellipse cx="50" cy="65" rx="25" ry="20" fill="#fff"/>
      </svg>
    `;
    return HttpResponse.text(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }),
];
