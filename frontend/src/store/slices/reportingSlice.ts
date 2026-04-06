import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ReportTemplate {
  id: string;
  name: string;
  type: "accreditation" | "compliance" | "quality" | "performance";
  sections: string[];
}

export interface ReportDistribution {
  id: string;
  reportId: string;
  recipientEmail: string;
  sentDate: string;
  status: "pending" | "sent" | "failed";
  accessCount: number;
}

export interface ReportAnalytics {
  id: string;
  reportId: string;
  generatedDate: string;
  accessCount: number;
  downloadCount: number;
  avgReadTime: number;
  recipients: number;
}

export interface InstitutionalReport {
  id: string;
  name: string;
  type: "accreditation" | "compliance" | "quality" | "performance";
  status: "draft" | "completed" | "submitted" | "approved";
  completionPercentage: number;
  createdDate: string;
  submissionDeadline: string;
  lastModified: string;
  distributions: ReportDistribution[];
  analytics: ReportAnalytics | null;
}

export interface ReportingState {
  reports: InstitutionalReport[];
  templates: ReportTemplate[];
  distributions: ReportDistribution[];
  analyticsData: ReportAnalytics[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportingState = {
  reports: [
    {
      id: "rep_1",
      name: "HEC Accreditation Self-Study 2026",
      type: "accreditation",
      status: "completed",
      completionPercentage: 65,
      createdDate: "2026-02-01",
      submissionDeadline: "2026-06-30",
      lastModified: "2026-04-06",
      distributions: [],
      analytics: null,
    },
    {
      id: "rep_2",
      name: "Annual Quality Assurance Report",
      type: "quality",
      status: "draft",
      completionPercentage: 45,
      createdDate: "2026-03-15",
      submissionDeadline: "2026-05-31",
      lastModified: "2026-04-05",
      distributions: [],
      analytics: null,
    },
  ],
  templates: [
    {
      id: "tpl_1",
      name: "Standard Accreditation Report",
      type: "accreditation",
      sections: ["Coverage", "Compliance", "Recommendations", "Summary"],
    },
    {
      id: "tpl_2",
      name: "Quality Assurance Report",
      type: "quality",
      sections: ["Findings", "Analysis", "Action Items", "Timeline"],
    },
  ],
  distributions: [],
  analyticsData: [],
  loading: false,
  error: null,
};

const reportingSlice = createSlice({
  name: "reporting",
  initialState,
  reducers: {
    addReport: (state, action: PayloadAction<InstitutionalReport>) => {
      state.reports.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<InstitutionalReport>) => {
      const index = state.reports.findIndex((r) => r.id === action.payload.id);
      if (index > -1) {
        state.reports[index] = action.payload;
      }
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter((r) => r.id !== action.payload);
    },
    addDistribution: (state, action: PayloadAction<ReportDistribution>) => {
      state.distributions.push(action.payload);
      const report = state.reports.find(
        (r) => r.id === action.payload.reportId,
      );
      if (report) {
        report.distributions.push(action.payload);
      }
    },
    updateDistribution: (state, action: PayloadAction<ReportDistribution>) => {
      const index = state.distributions.findIndex(
        (d) => d.id === action.payload.id,
      );
      if (index > -1) {
        state.distributions[index] = action.payload;
      }
      const report = state.reports.find(
        (r) => r.id === action.payload.reportId,
      );
      if (report) {
        const distIndex = report.distributions.findIndex(
          (d) => d.id === action.payload.id,
        );
        if (distIndex > -1) {
          report.distributions[distIndex] = action.payload;
        }
      }
    },
    setAnalytics: (state, action: PayloadAction<ReportAnalytics>) => {
      state.analyticsData.push(action.payload);
      const report = state.reports.find(
        (r) => r.id === action.payload.reportId,
      );
      if (report) {
        report.analytics = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addReport,
  updateReport,
  deleteReport,
  addDistribution,
  updateDistribution,
  setAnalytics,
  setLoading,
  setError,
} = reportingSlice.actions;

export default reportingSlice.reducer;
