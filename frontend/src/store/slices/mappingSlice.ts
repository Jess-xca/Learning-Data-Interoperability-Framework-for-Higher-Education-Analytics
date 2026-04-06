import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  dataType: "string" | "number" | "boolean" | "date" | "array";
  transformation?: string;
  required: boolean;
  description?: string;
}

export interface StandardMapping {
  id: string;
  name: string;
  sourceSystemId: string;
  targetStandard: "xapi" | "caliper" | "lis_v2" | "oneroster";
  mappings: FieldMapping[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MappingState {
  standards: StandardMapping[];
  selectedStandardId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MappingState = {
  standards: [
    {
      id: "mapping_1",
      name: "Canvas to xAPI",
      sourceSystemId: "canvas_lms",
      targetStandard: "xapi",
      enabled: true,
      mappings: [
        {
          id: "field_1",
          sourceField: "user.email",
          targetField: "actor.mbox",
          dataType: "string",
          required: true,
          description: "Student email for xAPI actor",
        },
        {
          id: "field_2",
          sourceField: "user.name",
          targetField: "actor.name",
          dataType: "string",
          required: true,
        },
        {
          id: "field_3",
          sourceField: "course.id",
          targetField: "object.id",
          dataType: "string",
          required: true,
        },
        {
          id: "field_4",
          sourceField: "course.name",
          targetField: "object.definition.name",
          dataType: "string",
          required: true,
        },
        {
          id: "field_5",
          sourceField: "score",
          targetField: "result.score.raw",
          dataType: "number",
          required: false,
          transformation: "Math.round(value * 100)",
        },
      ],
      createdAt: "2026-04-04T10:00:00Z",
      updatedAt: "2026-04-04T10:00:00Z",
    },
    {
      id: "mapping_2",
      name: "Banner to OneRoster",
      sourceSystemId: "banner_sis",
      targetStandard: "oneroster",
      enabled: true,
      mappings: [
        {
          id: "field_6",
          sourceField: "student.banner_id",
          targetField: "sourcedId",
          dataType: "string",
          required: true,
        },
        {
          id: "field_7",
          sourceField: "student.username",
          targetField: "username",
          dataType: "string",
          required: true,
        },
        {
          id: "field_8",
          sourceField: "student.email",
          targetField: "email",
          dataType: "string",
          required: true,
        },
        {
          id: "field_9",
          sourceField: "student.first_name",
          targetField: "givenName",
          dataType: "string",
          required: true,
        },
        {
          id: "field_10",
          sourceField: "student.last_name",
          targetField: "familyName",
          dataType: "string",
          required: true,
        },
      ],
      createdAt: "2026-04-04T10:30:00Z",
      updatedAt: "2026-04-04T10:30:00Z",
    },
  ],
  selectedStandardId: "mapping_1",
  loading: false,
  error: null,
};

const mappingSlice = createSlice({
  name: "mappings",
  initialState,
  reducers: {
    addMapping: (state, action: PayloadAction<StandardMapping>) => {
      state.standards.push(action.payload);
    },
    updateMapping: (state, action: PayloadAction<StandardMapping>) => {
      const index = state.standards.findIndex(
        (m) => m.id === action.payload.id,
      );
      if (index >= 0) {
        state.standards[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteMapping: (state, action: PayloadAction<string>) => {
      state.standards = state.standards.filter((m) => m.id !== action.payload);
      if (state.selectedStandardId === action.payload) {
        state.selectedStandardId = state.standards[0]?.id || null;
      }
    },
    addFieldMapping: (
      state,
      action: PayloadAction<{ standardId: string; field: FieldMapping }>,
    ) => {
      const standard = state.standards.find(
        (m) => m.id === action.payload.standardId,
      );
      if (standard) {
        standard.mappings.push(action.payload.field);
        standard.updatedAt = new Date().toISOString();
      }
    },
    updateFieldMapping: (
      state,
      action: PayloadAction<{
        standardId: string;
        fieldId: string;
        field: FieldMapping;
      }>,
    ) => {
      const standard = state.standards.find(
        (m) => m.id === action.payload.standardId,
      );
      if (standard) {
        const fIndex = standard.mappings.findIndex(
          (f) => f.id === action.payload.fieldId,
        );
        if (fIndex >= 0) {
          standard.mappings[fIndex] = action.payload.field;
          standard.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteFieldMapping: (
      state,
      action: PayloadAction<{ standardId: string; fieldId: string }>,
    ) => {
      const standard = state.standards.find(
        (m) => m.id === action.payload.standardId,
      );
      if (standard) {
        standard.mappings = standard.mappings.filter(
          (f) => f.id !== action.payload.fieldId,
        );
        standard.updatedAt = new Date().toISOString();
      }
    },
    toggleMappingStatus: (
      state,
      action: PayloadAction<{ standardId: string; enabled: boolean }>,
    ) => {
      const standard = state.standards.find(
        (m) => m.id === action.payload.standardId,
      );
      if (standard) {
        standard.enabled = action.payload.enabled;
        standard.updatedAt = new Date().toISOString();
      }
    },
    selectStandard: (state, action: PayloadAction<string>) => {
      state.selectedStandardId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loadMappingsSuccess: (state, action: PayloadAction<StandardMapping[]>) => {
      state.standards = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  addMapping,
  updateMapping,
  deleteMapping,
  addFieldMapping,
  updateFieldMapping,
  deleteFieldMapping,
  toggleMappingStatus,
  selectStandard,
  setLoading,
  setError,
  loadMappingsSuccess,
} = mappingSlice.actions;

export default mappingSlice.reducer;
