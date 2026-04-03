import { http, HttpResponse } from "msw";

const API_BASE = "http://localhost:3000/api";

// Mock data
const mockStudents = [
  {
    id: "202502SENG001",
    name: "Jean Umucyo",
    email: "jean@institution.edu",
    gpa: 3.92,
    program: "Engineering",
    enrollmentYear: 2022,
    status: "active" as const,
  },
  {
    id: "202502SENG002",
    name: "Claire Habimana",
    email: "claire@institution.edu",
    gpa: 3.65,
    program: "Engineering",
    enrollmentYear: 2022,
    status: "active" as const,
  },
  {
    id: "202502BUS001",
    name: "David Mugisha",
    email: "david@institution.edu",
    gpa: 3.45,
    program: "Business",
    enrollmentYear: 2023,
    status: "active" as const,
  },
];

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

  http.put(`${API_BASE}/students/:id`, async ({ request }) => {
    const updatedStudent = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: { id: (request as any).params.id, ...updatedStudent },
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

  // Reports/Analytics
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
];
