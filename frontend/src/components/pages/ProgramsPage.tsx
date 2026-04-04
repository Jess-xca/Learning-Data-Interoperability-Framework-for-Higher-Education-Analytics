import { useState, useEffect } from "react";
import { MainContent, Card, Button, Footer } from "..";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { useToast } from "../../context/useToast";
import { fetchPrograms } from "../../store/thunks/dataThunks";
import { SkeletonGrid, SkeletonMetricCard } from "../common/SkeletonLoaders";
import type { Program } from "../../store/slices/dataSlice";

export default function ProgramsPage() {
  // Role guard - only admin, hod, qa can access
  useRoleGuard(["admin", "hod", "qa"]);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const programs = useAppSelector((state) => {
    const data = state.data.programs;
    return Array.isArray(data) ? data : [];
  });
  const loading = useAppSelector((state) => state.data.loading);
  const error = useAppSelector((state) => state.data.error);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Fetch programs on component mount
  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  // Handle error display
  useEffect(() => {
    if (error) {
      addToast(error, "error", 3000);
    }
  }, [error, addToast]);

  // Filter programs based on role
  let filteredPrograms = programs;
  if (userRole === "hod") {
    // HOD only sees their department
    filteredPrograms = programs.filter(
      (p) => p.department === user?.department,
    );
  }

  return (
    <>
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Programs</h1>
        <p className="text-lg text-on-surface-variant">
          View and manage academic programs
        </p>
      </div>

      {/* Summary Stats - Show skeletons while loading */}
      {loading && programs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SkeletonMetricCard />
          <SkeletonMetricCard />
          <SkeletonMetricCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-on-surface-variant text-sm mb-2">
              Total Programs
            </p>
            <p className="text-4xl font-bold text-primary">
              {filteredPrograms.length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-on-surface-variant text-sm mb-2">
              Total Courses
            </p>
            <p className="text-4xl font-bold text-secondary">
              {filteredPrograms.reduce((sum, p) => sum + p.totalCourses, 0)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-on-surface-variant text-sm mb-2">
              Avg Courses per Program
            </p>
            <p className="text-4xl font-bold text-tertiary">
              {Math.round(
                filteredPrograms.reduce((sum, p) => sum + p.totalCourses, 0) /
                  (filteredPrograms.length || 1),
              )}
            </p>
          </Card>
        </div>
      )}

      {/* Programs Grid */}
      {loading && filteredPrograms.length === 0 ? (
        <SkeletonGrid />
      ) : filteredPrograms.length === 0 ? (
        <Card className="p-8 text-center mb-8">
          <p className="text-on-surface-variant">No programs found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredPrograms.map((program) => (
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
                    {program.totalCourses}
                  </p>
                  <p className="text-xs text-on-surface-variant">Courses</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                <div className="text-center">
                  <p className="text-on-surface-variant text-xs">Department</p>
                  <p className="font-bold text-secondary text-sm">
                    {program.department}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-on-surface-variant text-xs">Courses</p>
                  <p className="font-bold text-tertiary">
                    {program.totalCourses}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Program Details */}
      {selectedProgram && (
        <Card className="p-8 border-l-4 border-primary space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-1">
                {selectedProgram.name}
              </h2>
              <p className="text-sm text-on-surface-variant">
                Program Code: {selectedProgram.code} | Department:{" "}
                {selectedProgram.department}
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

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">
                Total Courses
              </p>
              <p className="text-3xl font-bold text-primary">
                {selectedProgram.totalCourses}
              </p>
            </div>
            <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Department</p>
              <p className="text-xl font-bold text-tertiary">
                {selectedProgram.department}
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

          {/* Program Courses */}
          <div className="border-t border-outline-variant/20 pt-6">
            <h3 className="font-bold text-primary mb-4">Program Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { code: "CS101", name: "Intro to Programming", credits: 3 },
                { code: "CS201", name: "Data Structures", credits: 3 },
                { code: "CS301", name: "Algorithms", credits: 4 },
                { code: "CS401", name: "Software Engineering", credits: 4 },
              ].map((course) => (
                <div
                  key={course.code}
                  className="p-3 rounded-lg bg-surface-container-highest"
                >
                  <p className="text-sm font-bold text-on-surface-variant uppercase">
                    {course.code}
                  </p>
                  <p className="font-semibold text-primary">{course.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {course.credits} Credits
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Program Stats */}
          <div className="border-t border-outline-variant/20 pt-6">
            <h3 className="font-bold text-primary mb-4">Program Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-surface-container-highest">
                <p className="text-on-surface-variant text-sm mb-2">
                  Enrolled Students
                </p>
                <p className="text-2xl font-bold text-primary">142</p>
                <p className="text-xs text-on-surface-variant mt-2">
                  ↑ 5% from last semester
                </p>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-highest">
                <p className="text-on-surface-variant text-sm mb-2">
                  Pass Rate
                </p>
                <p className="text-2xl font-bold text-secondary">94.5%</p>
                <p className="text-xs text-on-surface-variant mt-2">
                  ↑ 2% from last year
                </p>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-highest">
                <p className="text-on-surface-variant text-sm mb-2">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold text-tertiary">4.2 years</p>
                <p className="text-xs text-on-surface-variant mt-2">
                  Standard completion time
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Programs Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-primary mb-6">
          All Programs Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-primary mb-4">Enrollment Trends</h3>
            <div className="space-y-3">
              {filteredPrograms.slice(0, 4).map((p) => (
                <div key={p.code} className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    {p.name}
                  </span>
                  <div className="w-32 bg-surface-container-highest rounded-full h-2 flex-1 mx-3">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(p.totalCourses / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{p.totalCourses}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-primary mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Programs</span>
                <span className="font-bold">{filteredPrograms.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Courses</span>
                <span className="font-bold">
                  {filteredPrograms.reduce((sum, p) => sum + p.totalCourses, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Departments</span>
                <span className="font-bold">
                  {new Set(filteredPrograms.map((p) => p.department)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Avg Courses</span>
                <span className="font-bold">
                  {(
                    filteredPrograms.reduce(
                      (sum, p) => sum + p.totalCourses,
                      0,
                    ) / (filteredPrograms.length || 1)
                  ).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainContent>
    <Footer variant="minimal" />
    </>
  );
}
