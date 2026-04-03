// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Individual validators
export const required = (
  value: unknown,
  fieldName: string,
): ValidationError | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
};

export const email = (
  value: string,
  fieldName: string,
): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return { field: fieldName, message: "Invalid email address" };
  }
  return null;
};

export const minLength = (
  min: number,
): ((value: string, fieldName: string) => ValidationError | null) => {
  return (value: string, fieldName: string) => {
    if (value && value.length < min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${min} characters`,
      };
    }
    return null;
  };
};

export const pattern = (
  regex: RegExp,
  message?: string,
): ((value: string, fieldName: string) => ValidationError | null) => {
  return (value: string, fieldName: string) => {
    if (value && !regex.test(value)) {
      return {
        field: fieldName,
        message: message || `${fieldName} format is invalid`,
      };
    }
    return null;
  };
};

export const gpa = (
  value: number,
  fieldName: string,
): ValidationError | null => {
  if (value !== undefined && (value < 0 || value > 4)) {
    return { field: fieldName, message: "GPA must be between 0 and 4" };
  }
  return null;
};

export const studentId = (
  value: string,
  fieldName: string,
): ValidationError | null => {
  const studentIdRegex = /^\d{4}(0[1-2])[a-zA-Z]{3}\d{3}$/;
  if (value && !studentIdRegex.test(value)) {
    return { field: fieldName, message: "Invalid student ID format" };
  }
  return null;
};

// Validation schema builder
type ValidatorFunction = (
  value: unknown,
  fieldName: string,
) => ValidationError | null;

export interface ValidationSchema {
  [fieldName: string]: ValidatorFunction[];
}

/**
 * Validate a form data object against a schema
 * @param data - The form data to validate
 * @param schema - The validation schema
 * @returns ValidationResult with isValid and errors array
 */
export function validateForm(
  data: Record<string, unknown>,
  schema: ValidationSchema,
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const [fieldName, validators] of Object.entries(schema)) {
    const value = data[fieldName];

    for (const validator of validators) {
      const error = validator(value, fieldName);
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

/**
 * Get error for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  fieldName: string,
): ValidationError | undefined {
  return errors.find((e) => e.field === fieldName);
}

// Pre-built schemas for common forms
export const SCHEMAS = {
  student: {
    name: [required],
    email: [required, email],
    gpa: [gpa],
    studentId: [studentId],
  },
  course: {
    code: [required],
    name: [required],
    instructor: [required],
  },
};
