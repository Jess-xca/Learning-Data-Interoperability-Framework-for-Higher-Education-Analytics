import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import type { User } from "../store/slices/authSlice";
import type { Student, Course, Program } from "../store/slices/dataSlice";

type UserRole = User["role"];
type EntityData = Student | Course | Program;

/**
 * Reusable hook for pages that fetch data based on user role
 * Handles: data fetching, error handling, role-based filtering
 */
export function useEntityPage<T extends { id: string }>(
  entityKey: "students" | "courses" | "programs" | "analytics" | "reports",
  allowedRoles: UserRole[],
  fetchThunk: ReturnType<any>, // AsyncThunk
) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const data = useAppSelector((state) => state.data);
  const entities =
    (data[entityKey as keyof typeof data] as EntityData[] | null) ?? [];
  const loading = data.loading;
  const error = data.error;

  // Verify user has access
  useEffect(() => {
    if (user?.role && !allowedRoles.includes(user.role)) {
      throw new Error(`Access denied for role: ${user.role}`);
    }
  }, [user?.role, allowedRoles]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchThunk);
  }, [dispatch, fetchThunk]);

  // Role-based filter function
  const applyRoleFilter = useCallback(
    (data: T[]): T[] => {
      if (user?.role === "hod") {
        return data.filter((item) => {
          // Filter logic based on entity type
          if ("program" in item && "department" in item) {
            return item.department === user.department;
          }
          if ("program" in item) {
            return item.program === user.department;
          }
          return true;
        });
      }

      if (user?.role === "lecturer") {
        // Lecturers see limited data (e.g., first N items)
        return data.slice(0, 20);
      }

      return data;
    },
    [user?.role, user?.department],
  );

  const filteredByRole = useMemo(
    () => applyRoleFilter(entities as unknown as T[]),
    [entities, applyRoleFilter],
  );

  return {
    data: entities,
    filteredByRole,
    loading,
    error,
    userRole: user?.role,
    userDepartment: user?.department,
  };
}
