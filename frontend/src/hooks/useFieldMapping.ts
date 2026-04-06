import { useState, useCallback } from "react";
import {
  addFieldMapping,
  deleteFieldMapping,
  updateFieldMapping,
} from "../store/slices/mappingSlice";
import type { FieldMapping } from "../store/slices/mappingSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

interface TransformationResult {
  success: boolean;
  value: any;
  error?: string;
}

export const useFieldMapping = () => {
  const dispatch = useAppDispatch();
  const standards = useAppSelector((state) => state.mappings.standards);
  const selectedStandardId = useAppSelector(
    (state) => state.mappings.selectedStandardId,
  );

  const [validationErrors, setValidationErrors] = useState<
    { fieldId: string; error: string }[]
  >([]);

  /**
   * Apply a transformation function to a value
   */
  const applyTransformation = useCallback(
    (value: any, transformation?: string): TransformationResult => {
      if (!transformation) {
        return { success: true, value };
      }

      try {
        // Create a safe function context with common utilities
        const transformFn = new Function("value", `return ${transformation}`);
        const result = transformFn(value);
        return { success: true, value: result };
      } catch (error) {
        return {
          success: false,
          value: null,
          error: `Transformation error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    },
    [],
  );

  /**
   * Map source data to target format using field mappings
   */
  const mapData = useCallback(
    (
      sourceData: Record<string, any>,
      standardId: string,
    ): { success: boolean; data: any; errors: string[] } => {
      const standard = standards.find((s) => s.id === standardId);
      if (!standard) {
        return {
          success: false,
          data: null,
          errors: ["Standard mapping not found"],
        };
      }

      const errors: string[] = [];
      const targetData: Record<string, any> = {};

      standard.mappings.forEach((mapping) => {
        const sourceValue = getNestedValue(sourceData, mapping.sourceField);

        if (sourceValue === undefined && mapping.required) {
          errors.push(`Missing required field: ${mapping.sourceField}`);
          return;
        }

        if (sourceValue !== undefined) {
          const transformed = applyTransformation(
            sourceValue,
            mapping.transformation,
          );

          if (!transformed.success) {
            errors.push(`${mapping.sourceField}: ${transformed.error}`);
          } else {
            setNestedValue(
              targetData,
              mapping.targetField,
              transformed.value,
              mapping.dataType,
            );
          }
        }
      });

      return {
        success: errors.length === 0,
        data: targetData,
        errors,
      };
    },
    [standards, applyTransformation],
  );

  /**
   * Validate field mapping configuration
   */
  const validateMapping = useCallback(
    (mapping: FieldMapping): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!mapping.sourceField) errors.push("Source field is required");
      if (!mapping.targetField) errors.push("Target field is required");
      if (
        !["string", "number", "boolean", "date", "array"].includes(
          mapping.dataType,
        )
      ) {
        errors.push("Invalid data type");
      }

      // Test transformation if provided
      if (mapping.transformation) {
        const result = applyTransformation("test", mapping.transformation);
        if (!result.success) {
          errors.push(`Invalid transformation: ${result.error}`);
        }
      }

      return { valid: errors.length === 0, errors };
    },
    [applyTransformation],
  );

  /**
   * Add new field mapping
   */
  const addField = useCallback(
    (field: FieldMapping): boolean => {
      if (!selectedStandardId) return false;

      const validation = validateMapping(field);
      if (!validation.valid) {
        setValidationErrors(
          validation.errors.map((e) => ({ fieldId: field.id, error: e })),
        );
        return false;
      }

      dispatch(addFieldMapping({ standardId: selectedStandardId, field }));
      setValidationErrors([]);
      return true;
    },
    [selectedStandardId, dispatch, validateMapping],
  );

  /**
   * Update existing field mapping
   */
  const updateField = useCallback(
    (fieldId: string, updates: Partial<FieldMapping>): boolean => {
      if (!selectedStandardId) return false;

      const standard = standards.find((s) => s.id === selectedStandardId);
      if (!standard) return false;

      const currentField = standard.mappings.find((f) => f.id === fieldId);
      if (!currentField) return false;

      const updatedField = { ...currentField, ...updates };
      const validation = validateMapping(updatedField);

      if (!validation.valid) {
        setValidationErrors(
          validation.errors.map((e) => ({ fieldId, error: e })),
        );
        return false;
      }

      dispatch(
        updateFieldMapping({
          standardId: selectedStandardId,
          fieldId,
          field: updatedField,
        }),
      );
      setValidationErrors([]);
      return true;
    },
    [selectedStandardId, standards, dispatch, validateMapping],
  );

  /**
   * Delete field mapping
   */
  const deleteField = useCallback(
    (fieldId: string): void => {
      if (selectedStandardId) {
        dispatch(
          deleteFieldMapping({ standardId: selectedStandardId, fieldId }),
        );
      }
    },
    [selectedStandardId, dispatch],
  );

  /**
   * Get nested value from object using dot notation
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  /**
   * Set nested value in object using dot notation
   */
  const setNestedValue = (
    obj: any,
    path: string,
    value: any,
    dataType: string,
  ) => {
    const parts = path.split(".");
    const last = parts.pop()!;
    const target = parts.reduce((acc, part) => {
      acc[part] = acc[part] || {};
      return acc[part];
    }, obj);

    // Type coercion
    switch (dataType) {
      case "number":
        target[last] = Number(value);
        break;
      case "boolean":
        target[last] = Boolean(value);
        break;
      case "date":
        target[last] = new Date(value).toISOString();
        break;
      default:
        target[last] = value;
    }
  };

  return {
    standards,
    selectedStandard: standards.find((s) => s.id === selectedStandardId),
    mapData,
    validateMapping,
    addField,
    updateField,
    deleteField,
    applyTransformation,
    validationErrors,
  };
};
