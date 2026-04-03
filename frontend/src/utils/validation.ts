export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation rules
export const validators = {
  required: (value: string | number | boolean | null | undefined, fieldName: string): ValidationError | null => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  },

  email: (value: string, fieldName: string): ValidationError | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return { field: fieldName, message: "Invalid email address" };
    }
    return null;
  },

  minLength: (
    min: number,
    fieldName: string,
  ): ((value: string) => ValidationError | null) => {
    return (value: string) => {
      if (value && value.length < min) {
        return {
          field: fieldName,
          message: `${fieldName} must be at least ${min} characters`,
        };
      }
      return null;
    };
  },

  pattern: (
    regex: RegExp,
    fieldName: string,
    message?: string,
  ): ((value: string) => ValidationError | null) => {
    return (value: string) => {
      if (value && !regex.test(value)) {
        return {
          field: fieldName,
          message: message || `${fieldName} format is invalid`,
        };
      }
      return null;
    };
  },

  gpa: (value: number, fieldName: string): ValidationError | null => {
    if (value < 0 || value > 4.0) {
      return {
        field: fieldName,
        message: "GPA must be between 0 and 4.0",
      };
    }
    return null;
  },

  studentId: (value: string): ValidationError | null => {
    const idRegex = /^\d{8}S[A-Z]{3}\d{3}$/;
    if (value && !idRegex.test(value)) {
      return {
        field: "studentId",
        message: "Invalid student ID format (YYYYSSDDDNNN)",
      };
    }
    return null;
  },
};

// Validation schema builder
export interface ValidationSchema {
  [fieldName: string]: ((value: unknown) => ValidationError | null)[];
}

export function validateForm(
  data: Record<string, unknown>,
  schema: ValidationSchema,
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const [fieldName, validationFns] of Object.entries(schema)) {
    const value = data[fieldName];

    for (const validationFn of validationFns) {
      const error = validationFn(value);
      if (error) {
        errors.push(error);
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Get error by field name
export function getFieldError(
  errors: ValidationError[],
  fieldName: string,
): string | null {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
}
