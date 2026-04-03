import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./useRedux";

export type UserRole =
  | "admin"
  | "qa"
  | "analyst"
  | "hod"
  | "lecturer"
  | "student";

// Define which roles can access which routes
const rolePermissions: Record<string, UserRole[]> = {
  "/dashboard": ["admin", "qa", "analyst", "hod", "lecturer", "student"],
  "/students": ["admin", "hod", "lecturer"],
  "/programs": ["admin", "hod"],
  "/courses": ["admin", "hod", "lecturer", "student"],
  "/analytics": ["admin", "analyst", "hod", "qa"],
  "/reports": ["admin", "qa", "analyst"],
  "/governance": ["admin", "qa"],
  "/settings": ["admin", "lecturer", "student"],
};

/**
 * Hook to guard routes based on user role
 * Redirects to dashboard if user lacks permission
 */
export function useRoleGuard(requiredRoles?: UserRole[]): boolean {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  useEffect(() => {
    // If we specify required roles for this component
    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      navigate("/dashboard", { replace: true });
    }
  }, [userRole, requiredRoles, navigate]);

  return Boolean(userRole);
}

/**
 * Check if user has permission for a specific route
 */
export function canAccessRoute(
  role: UserRole | undefined,
  path: string,
): boolean {
  if (!role) return false;
  const allowedRoles = rolePermissions[path];
  return allowedRoles ? allowedRoles.includes(role) : true;
}

/**
 * Get permission level for role-based feature access
 */
export function getRolePermissionLevel(role: UserRole | undefined): number {
  const levels: Record<UserRole, number> = {
    admin: 5,
    qa: 4,
    analyst: 3,
    hod: 2,
    lecturer: 1,
    student: 0,
  };
  return role ? levels[role] : -1;
}
