import { useState } from "react";
import { MainContent, Card, Button, TextInput, Badge } from "..";
import { Table } from "../dashboard";
import type { TableColumn } from "../dashboard/Table";
import { generateDummyStudents } from "../../data/dummyGenerator";

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  gpa: number;
  status: "active" | "graduated" | "suspended";
  enrollmentDate: string;
}

const students = generateDummyStudents(50).map((student) => ({
  id: student.id,
  name: student.name,
  email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@institution.edu`,
  program: student.program,
  gpa: student.gpa,
  status: student.status,
  enrollmentDate: "2025-01-15",
}));

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>("");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = filterProgram ? student.program === filterProgram : true;
    return matchesSearch && matchesProgram;
  });

  const programs = Array.from(new Set(students.map((s) => s.program))).sort();

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
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Students</h1>
        <p className="text-lg text-on-surface-variant">
          Manage and view student records
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Search by Name or ID"
            placeholder="Search..."
            icon="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border-b-2 border-outline-variant focus:border-primary outline-none transition rounded-none text-on-surface"
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
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-on-surface-variant text-sm">Total Students</p>
          <p className="text-3xl font-bold text-primary">{filteredStudents.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-on-surface-variant text-sm">Active</p>
          <p className="text-3xl font-bold text-tertiary">
            {filteredStudents.filter((s) => s.status === "active").length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-on-surface-variant text-sm">Avg GPA</p>
          <p className="text-3xl font-bold text-secondary">
            {(
              filteredStudents.reduce((sum, s) => sum + s.gpa, 0) /
              (filteredStudents.length || 1)
            ).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Data Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Student Records</h2>
        <Table
          columns={columns}
          data={filteredStudents}
          keyExtractor={(row) => row.id}
          onRowClick={setSelectedStudent}
        />
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
              <p className="font-bold text-primary">{selectedStudent.gpa.toFixed(2)}</p>
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
              <p className="text-on-surface-variant">Enrollment Date</p>
              <p className="font-bold">{selectedStudent.enrollmentDate}</p>
            </div>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
