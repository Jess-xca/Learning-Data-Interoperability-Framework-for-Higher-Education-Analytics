import { useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch } from "../../hooks/useRedux";
import { addStudent } from "../../store/slices/dataSlice";
import type { Student } from "../../store/slices/dataSlice";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROGRAMS = [
  "Engineering",
  "Business Administration",
  "Computer Science",
  "Information Technology",
  "Medicine",
  "Law",
  "Education",
  "Agriculture",
];

const STATUSES = ["active", "graduated", "suspended"];

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: PROGRAMS[0],
    gpa: 3.5,
    status: "active" as const,
    enrollmentYear: new Date().getFullYear(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gpa" ? parseFloat(value) : name === "enrollmentYear" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a unique student ID
    const deptCode = formData.program.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const studentId = `${formData.enrollmentYear}01${deptCode}${random}`;

    const newStudent: Student = {
      id: studentId,
      name: formData.name,
      email: formData.email,
      gpa: Math.min(4.0, Math.max(0, formData.gpa)),
      program: formData.program,
      enrollmentYear: formData.enrollmentYear,
      status: formData.status as "active" | "graduated" | "suspended",
      phone: `+250${Math.floor(Math.random() * 900000000)
        .toString()
        .padStart(9, "0")}`,
      address: "Kigali, Rwanda",
      riskScore: Math.floor(Math.random() * 100),
      predictionStatus: "medium",
      engagementScore: Math.floor(Math.random() * 40) + 60,
      attendanceRate: Math.floor(Math.random() * 30) + 70,
      lastActivity: new Date().toISOString(),
      activities: [],
    };

    dispatch(addStudent(newStudent));

    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      program: PROGRAMS[0],
      gpa: 3.5,
      status: "active",
      enrollmentYear: new Date().getFullYear(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Add New Student</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter student name"
              className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="student@institution.edu"
              className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Program *
            </label>
            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PROGRAMS.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                GPA *
              </label>
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                required
                min="0"
                max="4"
                step="0.01"
                placeholder="3.5"
                className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Enrollment Year *
            </label>
            <input
              type="number"
              name="enrollmentYear"
              value={formData.enrollmentYear}
              onChange={handleChange}
              required
              min="2020"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-outline rounded-lg font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
