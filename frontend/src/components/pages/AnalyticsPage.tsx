import { MainContent, Card, Button, Footer, PerformanceTrendChart, PredictiveInsights, CohortComparison } from "..";
import { ChartCard } from "../dashboard";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { generateDummyStudents } from "../../data/dummyGenerator";
import {
  BarChart3,
  Download,
  Plus,
  MoreVertical,
  TrendingUp,
  Printer,
  Calendar,
} from "lucide-react";

const students = generateDummyStudents(1000);

interface AnalyticsMetrics {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  avgGPA: number;
  enrollmentGrowth: number;
  retentionRate: number;
}

const metrics: AnalyticsMetrics = {
  totalStudents: students.length,
  activeStudents: students.filter((s) => s.status === "active").length,
  graduatedStudents: students.filter((s) => s.status === "graduated").length,
  avgGPA: parseFloat(
    (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
  ),
  enrollmentGrowth: 12.5,
  retentionRate: 92.3,
};

const programAnalytics = Array.from(new Set(students.map((s) => s.program)))
  .map((program) => {
    const programStudents = students.filter((s) => s.program === program);
    const total = programStudents.length;
    const active = programStudents.filter((s) => s.status === "active").length;
    return {
      program,
      students: total,
      avgGPA: parseFloat(
        (programStudents.reduce((sum, s) => sum + s.gpa, 0) / total).toFixed(2),
      ),
      enrollmentRate: Math.round((active / total) * 100),
    };
  })
  .sort((a, b) => b.students - a.students);

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

const statusDistribution: StatusDistribution[] = [
  {
    status: "Active",
    count: metrics.activeStudents,
    percentage: Math.round(
      (metrics.activeStudents / metrics.totalStudents) * 100,
    ),
  },
  {
    status: "Graduated",
    count: metrics.graduatedStudents,
    percentage: Math.round(
      (metrics.graduatedStudents / metrics.totalStudents) * 100,
    ),
  },
  {
    status: "Suspended",
    count:
      metrics.totalStudents -
      metrics.activeStudents -
      metrics.graduatedStudents,
    percentage:
      100 -
      Math.round((metrics.activeStudents / metrics.totalStudents) * 100) -
      Math.round((metrics.graduatedStudents / metrics.totalStudents) * 100),
  },
];

interface GPADistribution {
  range: string;
  count: number;
}

const gpaDistribution: GPADistribution[] = [
  {
    range: "3.5+",
    count: students.filter((s) => s.gpa >= 3.5).length,
  },
  {
    range: "3.0-3.5",
    count: students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.5).length,
  },
  {
    range: "2.5-3.0",
    count: students.filter((s) => s.gpa >= 2.5 && s.gpa < 3.0).length,
  },
  {
    range: "2.0-2.5",
    count: students.filter((s) => s.gpa >= 2.0 && s.gpa < 2.5).length,
  },
  {
    range: "< 2.0",
    count: students.filter((s) => s.gpa < 2.0).length,
  },
];

export default function AnalyticsPage() {
  // Role guard - admin, analyst, hod, qa, student can access
  useRoleGuard(["admin", "analyst", "hod", "qa", "student"]);
  return (
    <>
      <MainContent>
        {/* Page Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="h-page text-primary">Analytics</h1>
            <p className="text-on-surface-variant font-medium mt-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-on-tertiary-container" />
              Advanced institutional analytics and performance intelligence.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-primary font-semibold flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-sm">
              <Plus className="w-4 h-4" />
              Create Insight
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">
              Total Students
            </p>
            <p className="text-2xl font-bold text-primary">
              {metrics.totalStudents}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">Active</p>
            <p className="text-2xl font-bold text-tertiary">
              {metrics.activeStudents}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">Graduated</p>
            <p className="text-2xl font-bold text-secondary">
              {metrics.graduatedStudents}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">Avg GPA</p>
            <p className="text-2xl font-bold text-primary">
              {metrics.avgGPA.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">Growth</p>
            <p className="text-2xl font-bold text-tertiary">
              +{metrics.enrollmentGrowth}%
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-on-surface-variant text-xs mb-1">Retention</p>
            <p className="text-2xl font-bold text-secondary">
              {metrics.retentionRate}%
            </p>
          </Card>
        </div>

        {/* Charts and Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <ChartCard
            title="Student Status Distribution"
            subtitle="Current enrollment breakdown"
            actions={
              <button className="text-primary text-sm font-bold hover:bg-surface-container-low p-2 rounded">
                <Download className="w-4 h-4" />
              </button>
            }
          >
            <div className="flex items-center justify-around h-full p-4">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      i === 0
                        ? "bg-gradient-to-br from-tertiary-fixed to-surface-container"
                        : i === 1
                          ? "bg-gradient-to-br from-secondary to-surface-container"
                          : "bg-gradient-to-br from-error to-surface-container"
                    }`}
                  >
                    {item.percentage}%
                  </div>
                  <span className="text-xs text-on-surface-variant text-center">
                    {item.status}
                  </span>
                  <span className="text-sm font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* GPA Distribution */}
          <ChartCard
            title="GPA Distribution"
            subtitle="Performance across student body"
            actions={
              <button className="text-primary text-sm font-bold hover:bg-surface-container-low p-2 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
          >
            <div className="flex flex-col justify-around h-full p-4">
              {gpaDistribution.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">
                      {item.range}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-outline-variant/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full"
                      style={{
                        width: `${(item.count / Math.max(...gpaDistribution.map((d) => d.count))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Program Analytics */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Program-Level Analytics
          </h2>
          <div className="overflow-x-auto rounded-lg border border-outline-variant/20">
            <table className="w-full text-sm">
              <thead className="bg-primary-container text-on-primary-container border-b border-outline-variant/20">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase">
                    Enrollment
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase">
                    Avg GPA
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase">
                    Active Rate
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {programAnalytics.map((program, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0
                        ? "bg-surface"
                        : "bg-surface-container-lowest"
                    } border-b border-outline-variant/20 hover:bg-surface-container-low transition`}
                  >
                    <td className="px-4 py-3 font-bold text-primary">
                      {program.program}
                    </td>
                    <td className="px-4 py-3">{program.students}</td>
                    <td className="px-4 py-3 font-bold text-secondary">
                      {program.avgGPA.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-outline-variant/20 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-tertiary h-full"
                            style={{
                              width: `${program.enrollmentRate}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold">
                          {program.enrollmentRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TrendingUp className="w-5 h-5 text-tertiary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Enhanced Phase 6 Analytics Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PerformanceTrendChart />
          </div>
          <div>
            <PredictiveInsights />
          </div>
        </div>

        {/* Cohort Comparison */}
        <CohortComparison />

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" size="md">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="secondary" size="md">
            <Printer className="w-4 h-4" />
            Print Analytics
          </Button>
          <Button variant="ghost" size="md">
            <Calendar className="w-4 h-4" />
            Schedule Report
          </Button>
        </div>
      </MainContent>
      <Footer variant="minimal" />
    </>
  );
}
