import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Standard {
  id: string;
  name: string;
  version: string;
  category:
    | "learning_outcomes"
    | "enrollment"
    | "faculty"
    | "curriculum"
    | "facilities"
    | "support_services";
  status: "compliant" | "at_risk" | "non_compliant";
  complianceScore: number;
  deadline?: string;
  description: string;
}

export interface ComplianceArea {
  id: string;
  name: string;
  standards: Standard[];
  overallStatus: "compliant" | "at_risk" | "non_compliant";
  overallScore: number;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  standardId: string;
  documentName: string;
  documentPath: string;
  uploadedAt: string;
  uploadedBy: string;
  category: "document" | "report" | "audit" | "assessment" | "other";
  status: "pending" | "reviewed" | "approved" | "rejected";
  notes?: string;
}

export interface AccreditationReport {
  id: string;
  name: string;
  status: "draft" | "in_progress" | "submitted" | "under_review" | "approved";
  submissionDeadline: string;
  createdAt: string;
  lastModified: string;
  completionPercentage: number;
  standardsMapped: number;
  evidenceCollected: number;
}

interface AccreditationState {
  complianceAreas: ComplianceArea[];
  standards: Standard[];
  evidence: Evidence[];
  reports: AccreditationReport[];
  selectedStandardId: string | null;
  selectedAreaId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccreditationState = {
  complianceAreas: [
    {
      id: "learning_outcomes",
      name: "Learning Outcomes & Assessment",
      standards: [
        {
          id: "lo_1",
          name: "Documented Learning Outcomes",
          version: "1.0",
          category: "learning_outcomes",
          status: "compliant",
          complianceScore: 95,
          deadline: "2026-06-30",
          description:
            "All programs must have clearly documented learning outcomes aligned with curriculum",
        },
        {
          id: "lo_2",
          name: "Assessment Plan Implementation",
          version: "1.0",
          category: "learning_outcomes",
          status: "compliant",
          complianceScore: 88,
          deadline: "2026-06-30",
          description:
            "Institutions must implement comprehensive assessment plans for all programs",
        },
      ],
      overallStatus: "compliant",
      overallScore: 92,
    },
    {
      id: "enrollment",
      name: "Student Enrollment & Retention",
      standards: [
        {
          id: "enr_1",
          name: "Enrollment Data Integrity",
          version: "1.0",
          category: "enrollment",
          status: "compliant",
          complianceScore: 92,
          deadline: "2026-09-30",
          description:
            "Accurate and timely enrollment data collection and reporting",
        },
        {
          id: "enr_2",
          name: "Retention Rate Monitoring",
          version: "1.0",
          category: "enrollment",
          status: "at_risk",
          complianceScore: 68,
          deadline: "2026-09-30",
          description: "Track and analyze student retention rates by cohort",
        },
      ],
      overallStatus: "at_risk",
      overallScore: 80,
    },
    {
      id: "faculty",
      name: "Faculty Qualifications & Development",
      standards: [
        {
          id: "fac_1",
          name: "Faculty Credentials Verification",
          version: "1.0",
          category: "faculty",
          status: "compliant",
          complianceScore: 98,
          deadline: "2026-12-31",
          description:
            "All faculty must hold appropriate credentials and qualifications",
        },
        {
          id: "fac_2",
          name: "Professional Development Requirements",
          version: "1.0",
          category: "faculty",
          status: "compliant",
          complianceScore: 85,
          deadline: "2026-12-31",
          description:
            "Faculty must participate in ongoing professional development activities",
        },
      ],
      overallStatus: "compliant",
      overallScore: 92,
    },
    {
      id: "curriculum",
      name: "Curriculum Design & Delivery",
      standards: [
        {
          id: "cur_1",
          name: "Curriculum Review Process",
          version: "1.0",
          category: "curriculum",
          status: "compliant",
          complianceScore: 90,
          deadline: "2026-08-31",
          description: "Regular curriculum review and updating procedures",
        },
        {
          id: "cur_2",
          name: "Course Quality Standards",
          version: "1.0",
          category: "curriculum",
          status: "non_compliant",
          complianceScore: 45,
          deadline: "2026-08-31",
          description: "All courses must meet defined quality standards",
        },
      ],
      overallStatus: "non_compliant",
      overallScore: 68,
    },
  ],
  standards: [],
  evidence: [
    {
      id: "ev_1",
      title: "Learning Outcomes Document 2025-26",
      description:
        "Comprehensive learning outcomes for all undergraduate programs",
      standardId: "lo_1",
      documentName: "Learning_Outcomes_2025-26.pdf",
      documentPath: "/documents/evidence/learning_outcomes_2025.pdf",
      uploadedAt: "2026-03-15",
      uploadedBy: "Dr. Jane Smith",
      category: "document",
      status: "approved",
    },
    {
      id: "ev_2",
      title: "Assessment Results Report",
      description: "Comprehensive assessment data from 2025-2026 academic year",
      standardId: "lo_2",
      documentName: "Assessment_Results_2025-26.xlsx",
      documentPath: "/documents/evidence/assessment_results_2026.xlsx",
      uploadedAt: "2026-03-10",
      uploadedBy: "Dr. John Doe",
      category: "report",
      status: "approved",
    },
    {
      id: "ev_3",
      title: "Faculty Credentials Database",
      description:
        "Updated database of all faculty credentials and qualifications",
      standardId: "fac_1",
      documentName: "Faculty_Credentials_2026.xlsx",
      documentPath: "/documents/evidence/faculty_credentials_2026.xlsx",
      uploadedAt: "2026-03-12",
      uploadedBy: "HR Department",
      category: "document",
      status: "reviewed",
    },
  ],
  reports: [
    {
      id: "report_1",
      name: "HEC Accreditation Self-Study 2026",
      status: "in_progress",
      submissionDeadline: "2026-06-30",
      createdAt: "2026-02-01",
      lastModified: "2026-04-06",
      completionPercentage: 65,
      standardsMapped: 8,
      evidenceCollected: 3,
    },
  ],
  selectedStandardId: null,
  selectedAreaId: null,
  loading: false,
  error: null,
};

const accreditationSlice = createSlice({
  name: "accreditation",
  initialState,
  reducers: {
    selectStandard: (state, action: PayloadAction<string>) => {
      state.selectedStandardId = action.payload;
    },
    selectArea: (state, action: PayloadAction<string>) => {
      state.selectedAreaId = action.payload;
    },
    addEvidence: (state, action: PayloadAction<Evidence>) => {
      state.evidence.push(action.payload);
    },
    updateEvidenceStatus: (
      state,
      action: PayloadAction<{ id: string; status: Evidence["status"] }>,
    ) => {
      const evidence = state.evidence.find((e) => e.id === action.payload.id);
      if (evidence) {
        evidence.status = action.payload.status;
      }
    },
    updateStandardStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: Standard["status"];
        score: number;
      }>,
    ) => {
      state.complianceAreas.forEach((area) => {
        const standard = area.standards.find((s) => s.id === action.payload.id);
        if (standard) {
          standard.status = action.payload.status;
          standard.complianceScore = action.payload.score;
        }
      });
    },
    updateReport: (
      state,
      action: PayloadAction<Partial<AccreditationReport> & { id: string }>,
    ) => {
      const report = state.reports.find((r) => r.id === action.payload.id);
      if (report) {
        Object.assign(report, action.payload);
        report.lastModified = new Date().toISOString();
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
  selectStandard,
  selectArea,
  addEvidence,
  updateEvidenceStatus,
  updateStandardStatus,
  updateReport,
  setLoading,
  setError,
} = accreditationSlice.actions;

export default accreditationSlice.reducer;
