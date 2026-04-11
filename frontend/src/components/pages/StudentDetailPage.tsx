import { useParams, useNavigate } from "react-router-dom";
import { MainContent } from "..";
import { useAppSelector } from "../../hooks/useRedux";
import { Student360Profile } from "./Student360Profile";
import { ChevronRight } from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const students = useAppSelector((state) => {
    const data = state.data.students;
    return Array.isArray(data) ? data : [];
  });

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <MainContent maxWidth="full">
        <div className="space-y-6 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/students")}
              className="text-primary hover:underline font-medium"
            >
              Students
            </button>
            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            <span className="text-on-surface-variant">Student Profile</span>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-on-surface-variant">Student not found</p>
            <button
              onClick={() => navigate("/students")}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90"
            >
              Back to Students
            </button>
          </div>
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent maxWidth="full">
      <div className="space-y-6 pb-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate("/students")}
            className="text-primary hover:underline font-medium"
          >
            Students
          </button>
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
          <span className="text-on-surface-variant">{student.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/students")}
          className="px-4 py-2 text-sm font-semibold border border-outline rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Students
        </button>

        {/* Student 360 Profile */}
        <Student360Profile
          studentData={{
            name: student.name,
            semester: `Year ${Math.floor(Math.random() * 4) + 1}`,
            id: student.id,
            department: student.program,
            concentration: `${student.program} Specialization`,
            cumulativeGPA: student.gpa,
            majorGPA: student.gpa + (Math.random() * 0.3 - 0.15),
            creditsEarned: Math.floor(Math.random() * 120),
            creditsRequired: 120,
            successProbability: Math.floor(Math.random() * 100),
            trendPercentage: Math.random() * 5,
            advisorName: `Dr. ${["Smith", "Johnson", "Williams", "Brown"][Math.floor(Math.random() * 4)]}`,
            lmsLogins: Math.floor(Math.random() * 40),
            assessmentAvg: Math.floor(Math.random() * 40) + 60,
            attendance: Math.floor(Math.random() * 30) + 70,
          }}
        />
      </div>
    </MainContent>
  );
}
