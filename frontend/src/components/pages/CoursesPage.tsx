import { useState } from "react";
import { MainContent, Card, Button, Badge, TextInput } from "..";

interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  credit: number;
  enrollment: number;
  capacity: number;
  semester: string;
  status: "active" | "archived" | "planned";
}

const courses: Course[] = [
  {
    id: "C001",
    code: "CS101",
    title: "Introduction to Computer Science",
    instructor: "Dr. Jane Smith",
    credit: 3,
    enrollment: 45,
    capacity: 50,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C002",
    code: "CS201",
    title: "Data Structures and Algorithms",
    instructor: "Prof. John Doe",
    credit: 4,
    enrollment: 38,
    capacity: 40,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C003",
    code: "MATH101",
    title: "Calculus I",
    instructor: "Dr. Maria Garcia",
    credit: 4,
    enrollment: 52,
    capacity: 50,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C004",
    code: "PHYS101",
    title: "Physics I",
    instructor: "Prof. Robert Wilson",
    credit: 4,
    enrollment: 40,
    capacity: 45,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C005",
    code: "ENG101",
    title: "English Composition",
    instructor: "Dr. Sarah Johnson",
    credit: 3,
    enrollment: 28,
    capacity: 30,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C006",
    code: "BIO101",
    title: "Biology I",
    instructor: "Prof. Michael Brown",
    credit: 4,
    enrollment: 35,
    capacity: 40,
    semester: "Spring 2025",
    status: "active",
  },
  {
    id: "C007",
    code: "CHEM101",
    title: "Chemistry I",
    instructor: "Dr. Emily Garcia",
    credit: 4,
    enrollment: 42,
    capacity: 45,
    semester: "Fall 2025",
    status: "planned",
  },
  {
    id: "C008",
    code: "HIST101",
    title: "World History",
    instructor: "Prof. David Lee",
    credit: 3,
    enrollment: 0,
    capacity: 35,
    semester: "Fall 2025",
    status: "planned",
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? course.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: Course["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "archived":
        return "error";
      case "planned":
        return "primary";
      default:
        return "primary";
    }
  };

  return (
    <MainContent>
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Courses</h1>
        <p className="text-lg text-on-surface-variant">
          Manage course offerings and schedules
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Search by Course Code or Title"
            placeholder="Search..."
            icon="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border-b-2 border-outline-variant focus:border-primary outline-none transition rounded-none text-on-surface"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="planned">Planned</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Total Courses</p>
          <p className="text-4xl font-bold text-primary">{filteredCourses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">Active Courses</p>
          <p className="text-4xl font-bold text-tertiary">
            {filteredCourses.filter((c) => c.status === "active").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-on-surface-variant text-sm mb-2">
            Total Enrollment
          </p>
          <p className="text-4xl font-bold text-secondary">
            {filteredCourses.reduce((sum, c) => sum + c.enrollment, 0)}
          </p>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-primary">Course Listings</h2>
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-outline-variant/20 hover:border-primary"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-primary">
                    {course.code}
                  </h3>
                  <Badge variant={getStatusVariant(course.status)}>
                    {course.status}
                  </Badge>
                </div>
                <p className="text-lg text-on-surface mb-1">{course.title}</p>
                <p className="text-sm text-on-surface-variant">
                  Instructor: {course.instructor}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary">
                  {course.enrollment}
                </p>
                <p className="text-xs text-on-surface-variant">
                  / {course.capacity} seats
                </p>
                <p className="text-xs text-on-surface-variant mt-2">
                  {Math.round((course.enrollment / course.capacity) * 100)}% Full
                </p>
              </div>
            </div>

            <div className="w-full bg-outline-variant/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${Math.min((course.enrollment / course.capacity) * 100, 100)}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-outline-variant/20 text-sm">
              <div>
                <p className="text-on-surface-variant">Credits</p>
                <p className="font-bold">{course.credit}</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Semester</p>
                <p className="font-bold">{course.semester}</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Capacity</p>
                <p className="font-bold">{course.capacity}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Course Details */}
      {selectedCourse && (
        <Card className="p-8 border-l-4 border-primary space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                {selectedCourse.code}: {selectedCourse.title}
              </h2>
              <p className="text-on-surface-variant">
                Instructor: {selectedCourse.instructor}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCourse(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Enrollment</p>
              <p className="text-3xl font-bold text-primary">
                {selectedCourse.enrollment}
              </p>
              <p className="text-xs text-on-surface-variant">
                / {selectedCourse.capacity}
              </p>
            </div>
            <div className="bg-secondary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Credits</p>
              <p className="text-3xl font-bold text-secondary">
                {selectedCourse.credit}
              </p>
            </div>
            <div className="bg-tertiary-fixed/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Occupancy</p>
              <p className="text-3xl font-bold text-tertiary">
                {Math.round((selectedCourse.enrollment / selectedCourse.capacity) * 100)}%
              </p>
            </div>
            <div className="bg-primary-container/10 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm mb-2">Semester</p>
              <p className="text-lg font-bold text-primary">
                {selectedCourse.semester}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined">edit</span>
              Edit Course
            </Button>
            <Button variant="secondary" size="md">
              <span className="material-symbols-outlined">people</span>
              View Students
            </Button>
          </div>
        </Card>
      )}
    </MainContent>
  );
}
