import React, { useState, useId } from "react";
import type { FieldMapping } from "../store/slices/mappingSlice";
import Button from "./forms/Button";
import TextInput from "./forms/TextInput";

interface FieldMappingEditorProps {
  mapping?: FieldMapping;
  onSave: (mapping: FieldMapping) => void;
  onCancel: () => void;
  validationErrors: string[];
}

const FieldMappingEditor: React.FC<FieldMappingEditorProps> = ({
  mapping,
  onSave,
  onCancel,
  validationErrors,
}) => {
  const newId = useId();
  const [formData, setFormData] = useState<FieldMapping>(
    mapping || {
      id: `field_${newId}`,
      sourceField: "",
      targetField: "",
      dataType: "string",
      required: false,
    }
  );

  const handleChange = (field: keyof FieldMapping, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const dataTypes: Array<FieldMapping["dataType"]> = [
    "string",
    "number",
    "boolean",
    "date",
    "array",
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="mb-5 pb-3 border-b-2 border-gray-200">
        <h3 className="text-lg text-gray-900 m-0 font-semibold">
          {mapping ? "Edit Field Mapping" : "New Field Mapping"}
        </h3>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded p-3 mb-4">
          {validationErrors.map((error, idx) => (
            <div key={idx} className="text-red-700 text-sm flex items-center gap-2 my-1">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-700 text-white text-xs flex items-center justify-center font-bold">
                !
              </div>
              {error}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1.5 text-sm">
            Source Field *
          </label>
          <TextInput
            placeholder="e.g., user.email or course.id"
            value={formData.sourceField}
            onChange={(e) => handleChange("sourceField", e.target.value)}
          />
          <small className="text-gray-600 text-xs mt-1">
            Use dot notation for nested fields
          </small>
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1.5 text-sm">
            Target Field *
          </label>
          <TextInput
            placeholder="e.g., actor.mbox or object.id"
            value={formData.targetField}
            onChange={(e) => handleChange("targetField", e.target.value)}
          />
          <small className="text-gray-600 text-xs mt-1">
            Use dot notation for nested fields
          </small>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1.5 text-sm">
              Data Type
            </label>
            <select
              className="px-3 py-2 border border-gray-400 rounded text-sm font-medium transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              value={formData.dataType}
              onChange={(e) =>
                handleChange(
                  "dataType",
                  e.target.value as FieldMapping["dataType"]
                )
              }
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer accent-primary"
                checked={formData.required}
                onChange={(e) => handleChange("required", e.target.checked)}
              />
              <span className="text-sm font-normal">Required Field</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1.5 text-sm">
            Transformation (Optional)
          </label>
          <textarea
            className="px-3 py-2 border border-gray-400 rounded text-sm font-mono transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder='e.g., Math.round(value * 100) or value.toUpperCase()'
            value={formData.transformation || ""}
            onChange={(e) => handleChange("transformation", e.target.value)}
            rows={3}
          />
          <small className="text-gray-600 text-xs mt-1">
            JavaScript expression to transform the value
          </small>
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1.5 text-sm">
            Description
          </label>
          <textarea
            className="px-3 py-2 border border-gray-400 rounded text-sm transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="Optional description of what this mapping does"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mapping ? "Update" : "Create"} Mapping
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FieldMappingEditor;
