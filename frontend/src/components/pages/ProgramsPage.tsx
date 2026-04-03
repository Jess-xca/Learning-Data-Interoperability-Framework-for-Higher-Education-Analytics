import { useState } from "react";
import { MainContent, Card, Button } from "..";
import { useAppSelector } from "../../hooks/useRedux";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { generateDummyStudents } from "../../data/dummyGenerator";

interface Program {
  name: string;
  code: string;
  enrollmentCount: number;
  avgGPA: number;
  activeCount: number;
  graduatedCount: number;
}

const allStudents = generateDummyStudents(1000);
const allPrograms: Program[] = Array.from(
  new Set(allStudents.map((s) => s.program)),
)
  .map((programName) => {
    const programStudents = allStudents.filter(
      (s) => s.program === programName,
    );
    return {
      name: programName,
      code: programName.substring(0, 3).toUpperCase(),
      enrollmentCount: programStudents.length,
      avgGPA:
        programStudents.reduce((sum, s) => sum + s.gpa, 0) /
        programStudents.length,
      activeCount: programStudents.filter((s) => s.status === "active").length,
      graduatedCount: programStudents.filter((s) => s.status === "graduated")
        .length,
    };
  })
  .sort((a, b) => b.enrollmentCount - a.enrollmentCount);

export default function ProgramsPage() {
  // Role guard - only admin, hod, qa can access
  useRoleGuard(["admin", "hod", "qa"]);
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Filter programs based on role
  let programs = allPrograms;
  if (userRole === "hod") {
    // HOD only sees their department
    programs = allPrograms.filter((p) => p.name === "Engineering");
  }

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Programs</h1>
        <p className="text-lg text-on-surface-variant">
          View and manage academic programs
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Total Programs</p>
          <p className="text-4xl font-bold text-primary">{programs.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">
            Total Enrollment
          </p>
          <p className="text-4xl font-bold text-secondary">
            {programs.reduce((sum, p) => sum + p.enrollmentCount, 0)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">
            Avg Program Size
          </p>
          <p className="text-4xl font-bold text-tertiary">
            {Math.round(
              programs.reduce((sum, p) => sum + p.enrollmentCount, 0) /
                programs.length,
            )}
          </p>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {programs.map((program) => (
          <Card
            key={program.code}
            className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all"
            onClick={() => setSelectedProgram(program)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {program.name}
                </h3>
                <p className="text-sm text-on-surface-variant uppercase tracking-wider">
                  Code: {program.code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {program.enrollmentCount}
                </p>
                <p className="text-xs text-on-surface-variant">Students</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
              <div className="text-center">
                <p className="text-on-surface-variant text-xs">Avg GPA</p>
                <p className="font-bold text-secondary">
                  {program.avgGPA.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-on-surface-variant text-xs">Active</p>
                <p className="font-bold text-tertiary">{program.activeCount}</p>
              </div>
              <div className="text-center">
                <p className="text-on-surface-variant text-xs">Graduated</p>
                <p className="font-bold text-primary-container">
                  {program.graduatedCount}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Program Details */}
      {selectedProgram && (
        <Card className="p-8 border-l-4 border-primary space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-1">
                {selectedProgram.name}
              </h2>
              <p className="text-sm text-on-surface-variant">
                Program Code: {selectedProgram.code}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProgram(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">
                Total Enrollment
              </p>
              <p className="text-3xl font-bold text-primary">
                {selectedProgram.enrollmentCount}
              </p>
            </div>
            <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-tertiary">
                {selectedProgram.activeCount}
              </p>
            </div>
            <div className="bg-secondary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Graduated</p>
              <p className="text-3xl font-bold text-secondary">
                {selectedProgram.graduatedCount}
              </p>
            </div>
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Avg GPA</p>
              <p className="text-3xl font-bold text-primary">
                {selectedProgram.avgGPA.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined">download</span>
              Export Data
            </Button>
            <Button variant="secondary" size="md">
              <span className="material-symbols-outlined">edit</span>
              Edit Program
            </Button>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
