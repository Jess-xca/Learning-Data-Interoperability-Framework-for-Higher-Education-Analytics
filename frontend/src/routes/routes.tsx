import type { RouteObject } from "react-router-dom";
import {
  DashboardPage,
  StudentsPage,
  ProgramsPage,
  CoursesPage,
  AnalyticsPage,
  ReportsPage,
  GovernancePage,
  SettingsPage,
} from "../components/pages";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/students",
    element: <StudentsPage />,
  },
  {
    path: "/programs",
    element: <ProgramsPage />,
  },
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
  },
  {
    path: "/reports",
    element: <ReportsPage />,
  },
  {
    path: "/governance",
    element: <GovernancePage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
];
