import { useState, useEffect } from "react";
import { MainContent, Card, Button, TextInput, Badge } from "..";
import { Table } from "../dashboard";
import type { TableColumn } from "../dashboard/Table";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { useToast } from "../../context/ToastContext";
import { fetchStudents } from "../../store/thunks/dataThunks";
import { SkeletonTable, SkeletonMetricCard } from "../common/SkeletonLoaders";
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
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[2.75rem] font-black text-primary leading-tight tracking-tight">
            {header.title}
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            {header.desc}
          </p>
        </div>
        {userRole === "admin" && (
          <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
            <span className="material-symbols-outlined text-sm">
              person_add
            </span>
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
                <span className="material-symbols-outlined">people</span>
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
                <span className="material-symbols-outlined">check_circle</span>
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
                <span className="material-symbols-outlined">grade</span>
              </div>
            </div>
          </Card>
        </div>
      )}

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
              <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none text-sm">
                expand_more
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
              {error ? "Try loading again." : "Start by adding a student."}
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
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-on-surface-variant">Student ID</p>
              <p className="font-bold text-primary">{selectedStudent.id}</p>
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
              <p className="font-bold">{selectedStudent.enrollmentYear}</p>
            </div>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
