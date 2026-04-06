import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StandardsConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  category: "learning_analytics" | "roster" | "general";
}

export interface StandardsState {
  enabledStandards: StandardsConfig[];
  dataQualityMetrics: {
    xapi: {
      compliance: number;
      recordsProcessed: number;
      errors: number;
      lastSync: string;
    };
    caliper: {
      compliance: number;
      recordsProcessed: number;
      errors: number;
      lastSync: string;
    };
    lis_v2: {
      compliance: number;
      recordsProcessed: number;
      errors: number;
      lastSync: string;
    };
    oneroster: {
      compliance: number;
      recordsProcessed: number;
      errors: number;
      lastSync: string;
    };
  };
  institutionSettings: {
    primaryStandard: string;
    requireCompliance: boolean;
    complianceThreshold: number;
    autoCorrection: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: StandardsState = {
  enabledStandards: [
    {
      id: "xapi",
      name: "Experience API",
      version: "1.0.3",
      enabled: true,
      description:
        "Experience API for learning records - tracks learner interactions and engagement",
      category: "learning_analytics",
    },
    {
      id: "caliper",
      name: "Caliper Analytics",
      version: "1.2",
      enabled: true,
      description:
        "Caliper Analytics framework for measuring learning and providing actionable insights",
      category: "learning_analytics",
    },
    {
      id: "lis_v2",
      name: "Learning Information Services",
      version: "2.0",
      enabled: true,
      description:
        "LIS v2 for exchanging learning and student information between systems",
      category: "roster",
    },
    {
      id: "oneroster",
      name: "OneRoster",
      version: "1.2",
      enabled: true,
      description:
        "OneRoster for standardized student and class roster information",
      category: "roster",
    },
  ],
  dataQualityMetrics: {
    xapi: {
      compliance: 98.5,
      recordsProcessed: 2450,
      errors: 34,
      lastSync: "2026-04-04T14:30:00Z",
    },
    caliper: {
      compliance: 97.2,
      recordsProcessed: 1820,
      errors: 51,
      lastSync: "2026-04-04T14:25:00Z",
    },
    lis_v2: {
      compliance: 99.1,
      recordsProcessed: 5230,
      errors: 47,
      lastSync: "2026-04-04T14:20:00Z",
    },
    oneroster: {
      compliance: 96.8,
      recordsProcessed: 3410,
      errors: 108,
      lastSync: "2026-04-04T14:15:00Z",
    },
  },
  institutionSettings: {
    primaryStandard: "xapi",
    requireCompliance: true,
    complianceThreshold: 95,
    autoCorrection: true,
  },
  loading: false,
  error: null,
};

const standardsSlice = createSlice({
  name: "standards",
  initialState,
  reducers: {
    toggleStandard: (
      state,
      action: PayloadAction<{ standardId: string; enabled: boolean }>
    ) => {
      const standard = state.enabledStandards.find(
        (s) => s.id === action.payload.standardId
      );
      if (standard) {
        standard.enabled = action.payload.enabled;
      }
    },
    updateInstitutionSettings: (
      state,
      action: PayloadAction<Partial<typeof initialState.institutionSettings>>
    ) => {
      state.institutionSettings = {
        ...state.institutionSettings,
        ...action.payload,
      };
    },
    updateDataQualityMetrics: (
      state,
      action: PayloadAction<{
        standard: keyof typeof initialState.dataQualityMetrics;
        metrics: (typeof initialState.dataQualityMetrics)[keyof typeof initialState.dataQualityMetrics];
      }>
    ) => {
      state.dataQualityMetrics[action.payload.standard] =
        action.payload.metrics;
    },
    synchronizeMetrics: (
      state,
      action: PayloadAction<{
        recordsProcessed: number;
        errorsFound: number;
      }>
    ) => {
      const compliance =
        ((action.payload.recordsProcessed - action.payload.errorsFound) /
          action.payload.recordsProcessed) *
        100;

      const now = new Date().toISOString();
      const standards = ["xapi", "caliper", "lis_v2", "oneroster"] as const;

      standards.forEach((std) => {
        state.dataQualityMetrics[std] = {
          compliance: Math.round(compliance * 10) / 10,
          recordsProcessed: action.payload.recordsProcessed,
          errors: action.payload.errorsFound,
          lastSync: now,
        };
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetStandards: (state) => {
      state.enabledStandards = initialState.enabledStandards;
      state.institutionSettings = initialState.institutionSettings;
    },
  },
});

export const {
  toggleStandard,
  updateInstitutionSettings,
  updateDataQualityMetrics,
  synchronizeMetrics,
  setLoading,
  setError,
  resetStandards,
} = standardsSlice.actions;

export default standardsSlice.reducer;
