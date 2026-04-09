import { useState, useEffect } from "react";
import { MainContent, Card, Button, TextInput, Badge, Footer } from "..";
import { Table } from "../dashboard";
import type { TableColumn } from "../dashboard/Table";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { useToast } from "../../context/useToast";
import { fetchStudents } from "../../store/thunks/dataThunks";
import { SkeletonTable, SkeletonMetricCard } from "../common/SkeletonLoaders";
import {
  UserPlus,
  Users,
  CheckCircle,
  Award,
  ChevronDown,
  X,
  Edit2,
  Mail,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import type { Student } from "../../store/slices/dataSlice";

export default function StudentsPage() {
  // Role guard - only admin, hod, lecturer can access
  useRoleGuard(["admin", "hod", "lecturer"]);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const students = useAppSelector((state) => {
    const data = state.data.students;
    return Array.isArray(data) ? data : [];
  });
  const loading = useAppSelector((state) => state.data.loading);
  const error = useAppSelector((state) => state.data.error);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"database" | "reports">(
    "database",
  );

  // Fetch students on component mount
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Handle error display
  useEffect(() => {
    if (error) {
      addToast(error, "error", 3000);
    }
  }, [error, addToast]);

  // Filter students based on role
  let filteredByRole = students;
  if (userRole === "hod") {
    // HOD only sees students from their department (Engineering)
    filteredByRole = students.filter((s) => s.program === "Engineering");
  } else if (userRole === "lecturer") {
    // Lecturer sees a subset as their class roster
    filteredByRole = students.slice(0, 20);
  }

  const filteredStudents = filteredByRole.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = filterProgram
      ? student.program === filterProgram
      : true;
    return matchesSearch && matchesProgram;
  });

  const programs = Array.from(
    new Set(filteredByRole.map((s) => s.program)),
  ).sort();

  // Role-aware page header
  const headerConfig: Record<string, { title: string; desc: string }> = {
    admin: {
      title: "Students",
      desc: "Manage and view student records across all programs.",
    },
    hod: {
      title: "Department Students",
      desc: "Manage engineering department students and their academic progress.",
    },
    lecturer: {
      title: "My Class Roster",
      desc: "View detailed information about your enrolled students.",
    },
  };

  const header = headerConfig[userRole || "admin"] || headerConfig.admin;

  const columns: TableColumn<Student>[] = [
    { key: "id", label: "Student ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "program", label: "Program", sortable: true },
    {
      key: "gpa",
      label: "GPA",
      render: (value: unknown) => (
        <span className="font-bold text-primary">{String(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => {
        const status = String(value) as "active" | "graduated" | "suspended";
        const variantMap = {
          active: "success",
          graduated: "primary",
          suspended: "error",
        } as const;
        return <Badge variant={variantMap[status]}>{String(value)}</Badge>;
      },
    },
  ];

  return (
    <>
      <MainContent>
        {/* Page Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="h-page text-primary">{header.title}</h1>
            <p className="text-on-surface-variant font-medium mt-2">
              {header.desc}
            </p>
          </div>
          {userRole === "admin" && (
            <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          )}
        </div>

        {/* Stats - Show skeletons while loading */}
        {loading && students.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-on-tertiary-container">
              <div className="text-xs font-bold uppercase text-on-surface-variant tracking-widest mb-3">
                Total Students
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-black text-primary">
                  {filteredStudents.length}
                </p>
                <div className="w-10 h-10 bg-tertiary-container/10 rounded-full flex items-center justify-center text-on-tertiary-container">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </Card>
            <Card className="border-l-4 border-primary">
              <div className="text-xs font-bold uppercase text-on-surface-variant tracking-widest mb-3">
                Active
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-black text-primary">
                  {filteredStudents.filter((s) => s.status === "active").length}
                </p>
                <div className="w-10 h-10 bg-primary-fixed/30 rounded-full flex items-center justify-center text-primary">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </Card>
            <Card className="border-l-4 border-secondary">
              <div className="text-xs font-bold uppercase text-on-surface-variant tracking-widest mb-3">
                Avg GPA
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-black text-primary">
                  {(
                    filteredStudents.reduce((sum, s) => sum + s.gpa, 0) /
                    (filteredStudents.length || 1)
                  ).toFixed(2)}
                </p>
                <div className="w-10 h-10 bg-secondary-container/30 rounded-full flex items-center justify-center text-secondary">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-6 mb-8 border-b-2 border-outline-variant/10">
          <button
            onClick={() => setActiveTab("database")}
            className={`pb-4 font-bold text-sm transition-colors relative ${
              activeTab === "database"
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Student Database
            {activeTab === "database" && (
              <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-4 font-bold text-sm transition-colors relative ${
              activeTab === "reports"
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Intelligence Reports
            {activeTab === "reports" && (
              <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === "database" && (
          <div>
            {/* Filters */}
            <div className="bg-surface-container-low rounded-xl p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Search by Name or ID"
                  placeholder="Search students..."
                  icon="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Filter by Program
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg transition-all font-medium appearance-none cursor-pointer outline-none"
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                    >
                      <option value="">All Programs</option>
                      {programs.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-3 text-on-surface-variant pointer-events-none text-sm">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table - Show skeleton while loading, error state if failed */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-primary tracking-tight">
                  Student Records
                </h2>
                <span className="text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full uppercase">
                  {loading && students.length === 0
                    ? "Loading..."
                    : `${filteredStudents.length} results`}
                </span>
              </div>

              {loading && students.length === 0 ? (
                <SkeletonTable />
              ) : students.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-on-surface-variant">
                    No students found.{" "}
                    {error
                      ? "Try loading again."
                      : "Start by adding a student."}
                  </p>
                </Card>
              ) : (
                <Table
                  columns={columns}
                  data={filteredStudents}
                  keyExtractor={(row) => row.id}
                  onRowClick={setSelectedStudent}
                />
              )}
            </div>

            {/* Selected Student Detail */}
            {selectedStudent && (
              <Card className="p-6 border-l-4 border-primary space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary">
                    {selectedStudent.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-on-surface-variant">Student ID</p>
                    <p className="font-bold text-primary">
                      {selectedStudent.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Email</p>
                    <p className="font-bold">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Program</p>
                    <p className="font-bold">{selectedStudent.program}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">GPA</p>
                    <p className="font-bold text-primary">
                      {selectedStudent.gpa.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Status</p>
                    <Badge
                      variant={
                        selectedStudent.status === "active"
                          ? "success"
                          : selectedStudent.status === "graduated"
                            ? "primary"
                            : "error"
                      }
                    >
                      {selectedStudent.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Enrollment Year</p>
                    <p className="font-bold">
                      {selectedStudent.enrollmentYear}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                  {userRole === "admin" && (
                    <>
                      <Button variant="primary" size="sm" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Student
                      </Button>
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send Message
                      </Button>
                      <Button variant="danger" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Related Courses Section */}
            {selectedStudent && (
              <div className="mt-8">
                <h3 className="text-xl font-black text-primary mb-4">
                  Enrolled Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: "C001",
                      code: "CS101",
                      name: "Intro to Programming",
                      instructor: "Dr. Smith",
                    },
                    {
                      id: "C002",
                      code: "CS201",
                      name: "Data Structures",
                      instructor: "Prof. Johnson",
                    },
                    {
                      id: "C003",
                      code: "MATH301",
                      name: "Calculus III",
                      instructor: "Dr. Williams",
                    },
                  ].map((course) => (
                    <Card
                      key={course.id}
                      className="p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-on-surface-variant uppercase">
                            {course.code}
                          </p>
                          <p className="font-bold text-primary">
                            {course.name}
                          </p>
                        </div>
                        <Badge variant="primary">Current</Badge>
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        Instructor: {course.instructor}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Section */}
            <div className="mt-12 mb-8">
              <h3 className="text-xl font-black text-primary mb-6">
                Student Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="font-bold text-primary mb-4">
                    GPA Distribution
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-on-surface-variant">
                          4.0 - 3.8
                        </span>
                        <span className="font-bold">
                          {Math.ceil(
                            filteredStudents.filter((s) => s.gpa >= 3.8).length,
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(filteredStudents.filter((s) => s.gpa >= 3.8).length / filteredStudents.length || 0) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-on-surface-variant">
                          3.8 - 3.5
                        </span>
                        <span className="font-bold">
                          {Math.ceil(
                            filteredStudents.filter(
                              (s) => s.gpa >= 3.5 && s.gpa < 3.8,
                            ).length,
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full"
                          style={{
                            width: `${(filteredStudents.filter((s) => s.gpa >= 3.5 && s.gpa < 3.8).length / filteredStudents.length || 0) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-on-surface-variant">
                          Below 3.5
                        </span>
                        <span className="font-bold">
                          {Math.ceil(
                            filteredStudents.filter((s) => s.gpa < 3.5).length,
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2">
                        <div
                          className="bg-tertiary h-2 rounded-full"
                          style={{
                            width: `${(filteredStudents.filter((s) => s.gpa < 3.5).length / filteredStudents.length || 0) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-bold text-primary mb-4">
                    Status Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Active</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="font-bold">
                          {
                            filteredStudents.filter(
                              (s) => s.status === "active",
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Graduated</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="font-bold">
                          {
                            filteredStudents.filter(
                              (s) => s.status === "graduated",
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Suspended</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-error"></div>
                        <span className="font-bold">
                          {
                            filteredStudents.filter(
                              (s) => s.status === "suspended",
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-primary mb-4">
              Enrollment & Retention Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report 1: Enrollment Summary */}
              <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-primary group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Enrollment Summary
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Complete enrollment statistics by program and semester
                    </p>
                  </div>
                  <Badge variant="primary">Monthly</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                  <span>PDF</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>CSV</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>EXCEL</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant">
                      Last Generated
                    </p>
                    <p className="text-sm font-black text-primary">
                      April 1, 2025
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </Card>

              {/* Report 2: Retention Analysis */}
              <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-tertiary group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Retention Analysis
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Student retention rates and progression tracking
                    </p>
                  </div>
                  <Badge variant="success">Monthly</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                  <span>PDF</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>CSV</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Dashboard</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant">
                      Last Generated
                    </p>
                    <p className="text-sm font-black text-primary">
                      March 15, 2025
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </MainContent>
      <Footer variant="minimal" />
    </>
  );
}
