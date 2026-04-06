import React, { useState } from "react";

interface ReportingAnalyticsModalProps {
  reportId: string;
  reportName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsStat {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

const ReportingAnalyticsModal: React.FC<ReportingAnalyticsModalProps> = ({
  reportId,
  reportName,
  isOpen,
  onClose,
}) => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  if (!isOpen) return null;

  // Mock analytics data
  const analyticsData = {
    totalAccess: 45,
    totalDownloads: 23,
    avgReadTime: 12,
    uniqueViewers: 18,
    shareCount: 7,
    commentCount: 3,
  };

  const stats: AnalyticsStat[] = [
    {
      label: "Total Access",
      value: analyticsData.totalAccess,
      icon: "visibility",
      color: "emerald",
    },
    {
      label: "Downloads",
      value: analyticsData.totalDownloads,
      icon: "download",
      color: "blue",
    },
    {
      label: "Avg Read Time",
      value: `${analyticsData.avgReadTime}m`,
      icon: "schedule",
      color: "purple",
    },
    {
      label: "Unique Viewers",
      value: analyticsData.uniqueViewers,
      icon: "people",
      color: "orange",
    },
    {
      label: "Shared",
      value: analyticsData.shareCount,
      icon: "share",
      color: "pink",
    },
    {
      label: "Comments",
      value: analyticsData.commentCount,
      icon: "comment",
      color: "indigo",
    },
  ];

  const accessTrend = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 6 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 10 },
    { day: "Fri", count: 9 },
    { day: "Sat", count: 5 },
    { day: "Sun", count: 3 },
  ];

  const maxCount = Math.max(...accessTrend.map((t) => t.count));

  const topViewers = [
    { name: "John Smith", department: "Academic Affairs", views: 12 },
    { name: "Sarah Johnson", department: "Administration", views: 8 },
    { name: "Michael Chen", department: "Finance", views: 6 },
    { name: "Emily Davis", department: "Research", views: 5 },
  ];

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      emerald: "from-emerald-600 to-teal-600",
      blue: "from-blue-600 to-cyan-600",
      purple: "from-purple-600 to-pink-600",
      orange: "from-orange-600 to-red-600",
      pink: "from-pink-600 to-rose-600",
      indigo: "from-indigo-600 to-purple-600",
    };
    return colorMap[color] || "from-gray-600 to-gray-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-bold">Report Analytics</h2>
            <p className="text-sm opacity-90 mt-1">{reportName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Time Range Filter */}
          <div className="flex gap-2 mb-8">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range === "week"
                  ? "Last 7 Days"
                  : range === "month"
                    ? "Last 30 Days"
                    : "All Time"}
              </button>
            ))}
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-br ${getColorClass(
                      stat.color
                    )} text-white p-3 rounded-lg`}
                  >
                    <span className="material-symbols-outlined">
                      {stat.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Access Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Weekly Access Trend
            </h3>
            <div className="flex items-end gap-4 h-48">
              {accessTrend.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-600 rounded-t-lg transition-all hover:from-emerald-700 hover:to-teal-700"
                      style={{ height: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">{item.day}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Viewers */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Viewers</h3>
            <div className="space-y-3">
              {topViewers.map((viewer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold">
                      {viewer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{viewer.name}</p>
                      <p className="text-sm text-gray-600">{viewer.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">
                      visibility
                    </span>
                    <span className="font-bold text-gray-900">{viewer.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Summary */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-600 flex-shrink-0">
                info
              </span>
              <div>
                <p className="font-semibold text-blue-900">Analytics Summary</p>
                <p className="text-sm text-blue-800 mt-1">
                  This report has been viewed {analyticsData.totalAccess} times
                  with {analyticsData.uniqueViewers} unique viewers. It has been
                  downloaded {analyticsData.totalDownloads} times and shared{" "}
                  {analyticsData.shareCount} times. The average read time is{" "}
                  {analyticsData.avgReadTime} minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 px-8 py-6 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportingAnalyticsModal;
