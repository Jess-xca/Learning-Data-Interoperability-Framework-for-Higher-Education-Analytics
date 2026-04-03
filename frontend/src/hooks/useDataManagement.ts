import { useCallback, useMemo } from "react";
import { useAppSelector } from "./useRedux";
import { useToast } from "../context/useToast";
import { applyRoleFilter } from "../utils/roleFilters";

interface UseDataManagementProps<T> {
  dataSelector: (state: any) => T[];
  loadingSelector: (state: any) => boolean;
  errorSelector: (state: any) => string | null;
  allowedRoles: string[];
  onErrorChange?: (error: string | null) => void;
}

/**
 * Comprehensive hook for managing data fetching, filtering, searching, and error handling
 * Combines role-based filtering, search, sorting, and toast notifications
 * Performs all expensive computations with useMemo to prevent unnecessary re-renders
 */
export function useDataManagement<T extends { id: string }>(
  props: UseDataManagementProps<T>,
) {
  const { addToast } = useToast();
  const user = useAppSelector((state) => state.auth.user);

  // Get data from Redux
  const data = useAppSelector(props.dataSelector);
  const loading = useAppSelector(props.loadingSelector);
  const error = useAppSelector(props.errorSelector);

  // Notify on error
  useMemo(() => {
    if (error) {
      addToast(error, "error", 3000);
      props.onErrorChange?.(error);
    }
  }, [error, addToast, props]);

  // Apply role-based filtering (memoized)
  const filteredByRole = useMemo(() => {
    return applyRoleFilter(data, {
      role: user?.role,
      department: user?.department,
    });
  }, [data, user?.role, user?.department]);

  // Search functionality (memoized)
  const search = useCallback(
    (query: string, searchFields: string[]): T[] => {
      return filteredByRole.filter((item) =>
        searchFields.some((field) =>
          String((item as Record<string, any>)[field])
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
      );
    },
    [filteredByRole],
  );

  // Filtering functionality (memoized)
  const filter = useCallback(
    (predicate: (item: T) => boolean): T[] => {
      return filteredByRole.filter(predicate);
    },
    [filteredByRole],
  );

  // Sorting functionality (memoized)
  const sort = useCallback(
    (key: keyof T, direction: "asc" | "desc" = "asc"): T[] => {
      return [...filteredByRole].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    [filteredByRole],
  );

  // Combined search and filter (memoized)
  const searchAndFilter = useCallback(
    (
      query: string,
      searchFields: string[],
      filterPredicate?: (item: T) => boolean,
    ): T[] => {
      let result = search(query, searchFields);
      if (filterPredicate) {
        result = result.filter(filterPredicate);
      }
      return result;
    },
    [search],
  );

  return {
    data,
    filteredByRole,
    loading,
    error,
    userRole: user?.role,
    userDepartment: user?.department,
    search,
    filter,
    sort,
    searchAndFilter,
  };
}
