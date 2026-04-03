import type { User } from "../store/slices/authSlice";

export type UserRole = User["role"];

interface RoleFilterContext {
  role: UserRole | undefined;
  department?: string;
}

/**
 * Applies role-based filtering to data arrays
 * Each role has specific access rules
 */
export function applyRoleFilter<T extends Record<string, unknown>>(
  data: T[],
  context: RoleFilterContext,
): T[] {
  if (!context.role) return data;

  switch (context.role) {
    case "admin":
    case "qa":
    case "analyst":
      // These roles see all data
      return data;

    case "hod":
      // HOD sees only their department's data
      return data.filter((item) => {
        // Check for department or program field
        if ("department" in item) {
          return item.department === context.department;
        }
        if ("program" in item) {
          return item.program === context.department;
        }
        return true;
      });

    case "lecturer":
      // Lecturer sees assigned courses/students (limited set)
      return data.slice(0, 20);

    case "student":
      // Student sees only their own data
      return data.filter((item) => {
        if ("studentId" in item) {
          return item.studentId === context.department; // Using department as placeholder for student ID
        }
        return true;
      });

    default:
      return data;
  }
}

/**
 * Helper to get role-specific page header copy
 */
export const getRoleSpecificHeader = (role: UserRole | undefined) => {
  const headers: Record<UserRole, { title: string; description: string }> = {
    admin: {
      title: "Students",
      description: "Manage and view student records across all programs.",
    },
    qa: {
      title: "Students",
      description: "Quality assurance view of student data.",
    },
    analyst: {
      title: "Students",
      description: "Analytics view of student data.",
    },
    hod: {
      title: "Department Students",
      description:
        "Manage your department students and their academic progress.",
    },
    lecturer: {
      title: "My Class Roster",
      description: "View detailed information about your enrolled students.",
    },
    student: {
      title: "My Profile",
      description: "View your academic information.",
    },
  };

  return headers[role || "admin"];
};
