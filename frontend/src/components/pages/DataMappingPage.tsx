import React, { useState } from "react";
import {
  selectStandard,
  type FieldMapping,
} from "../../store/slices/mappingSlice";
import { useFieldMapping } from "../../hooks/useFieldMapping";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { MainContent } from "../layout";
import FieldMappingEditor from "../FieldMappingEditor";
import Button from "../forms/Button";

const DataMappingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedStandardId = useAppSelector(
    (state) => state.mappings.selectedStandardId,
  );
  const {
    standards,
    selectedStandard,
    mapData,
    addField,
    updateField,
    deleteField,
    validationErrors,
  } = useFieldMapping();

  const [isEditing, setIsEditing] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [testData, setTestData] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data: unknown;
    errors: string[];
  } | null>(null);

  const handleSelectStandard = (id: string) => {
    dispatch(selectStandard(id));
    setIsEditing(false);
    setEditingFieldId(null);
  };

  const handleAddField = (field: FieldMapping) => {
    if (addField(field)) {
      setIsEditing(false);
    }
  };

  const handleUpdateField = (
    fieldId: string,
    updates: Partial<FieldMapping>,
  ) => {
    if (updateField(fieldId, updates)) {
      setEditingFieldId(null);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    deleteField(fieldId);
  };

  const handleTestMapping = () => {
    if (!testData || !selectedStandard) return;

    try {
      const sourceData = JSON.parse(testData);
      const result = mapData(sourceData, selectedStandardId!);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        data: null,
        errors: [
          `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        ],
      });
    }
  };

  if (!selectedStandard) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Mapping Selected
            </h2>
            <p className="text-gray-600">
              Please select a mapping standard to begin
            </p>
          </div>
        </div>
      </div>
    );
  }

  const editingField =
    editingFieldId && selectedStandard
      ? selectedStandard.mappings.find((f) => f.id === editingFieldId)
      : null;

  return (
    <MainContent>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-primary">Field Mapping Configuration</h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Configure how source system fields map to standards formats
        </p>
      </div>

      <div className="flex flex-1 gap-6 pb-8">
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Data Mapping Standards
            </h3>
            {standards.map((standard) => (
              <div
                key={standard.id}
                className={`p-3 mb-2 rounded cursor-pointer transition-all border-l-4 ${
                  standard.id === selectedStandardId
                    ? "bg-blue-50 border-l-blue-600"
                    : "hover:bg-gray-50 border-l-transparent"
                }`}
                onClick={() => handleSelectStandard(standard.id)}
              >
                <div className="font-medium text-gray-900 text-xs mb-1">
                  {standard.name}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                    {standard.targetStandard}
                  </span>
                  <span
                    className={`text-lg ${standard.enabled ? "text-green-500" : "text-gray-400"}`}
                  >
                    {standard.enabled ? "●" : "○"}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {standard.mappings.length} fields
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded shadow-sm p-6">
          {!isEditing && !editingField && (
            <>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl text-gray-900 font-bold m-0">
                    {selectedStandard.name}
                  </h2>
                  <p className="text-gray-600 text-sm m-0">
                    Mapping {selectedStandard.mappings.length} fields
                  </p>
                </div>
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  + Add Field Mapping
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {selectedStandard.mappings.map((field) => (
                  <div
                    key={field.id}
                    className="bg-gray-50 border border-gray-200 rounded overflow-hidden hover:shadow-md hover:border-indigo-600 transition-all"
                  >
                    <div className="flex justify-between items-start p-3 bg-gray-100 border-b border-gray-200">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold uppercase text-gray-600">
                            Source
                          </span>
                          <code className="text-xs bg-white px-1 rounded text-red-700">
                            {field.sourceField}
                          </code>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold uppercase text-gray-600">
                            Target
                          </span>
                          <code className="text-xs bg-white px-1 rounded text-red-700">
                            {field.targetField}
                          </code>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-gray-600 hover:text-indigo-600 text-sm font-bold px-2 py-1"
                          onClick={() => setEditingFieldId(field.id)}
                          title="Edit mapping"
                        >
                          ✎
                        </button>
                        <button
                          className="text-gray-600 hover:text-red-600 text-sm font-bold px-2 py-1"
                          onClick={() => handleDeleteField(field.id)}
                          title="Delete mapping"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-600 font-medium">
                          Type:
                        </span>
                        <span className="text-xs text-gray-900">
                          {field.dataType}
                        </span>
                      </div>
                      {field.required && (
                        <div className="text-xs text-red-600 font-semibold mb-2">
                          Required
                        </div>
                      )}
                      {field.transformation && (
                        <div className="mb-2">
                          <span className="text-xs text-gray-600 font-medium block mb-1">
                            Transform:
                          </span>
                          <code className="text-xs bg-white px-1 py-0.5 rounded block max-h-12 overflow-y-auto">
                            {field.transformation}
                          </code>
                        </div>
                      )}
                      {field.description && (
                        <p className="text-xs text-gray-700 mt-2">
                          {field.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Test Mapping
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source Data (JSON)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-400 rounded text-sm font-mono transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder='{"user": {"email": "test@example.com", "name": "John Doe"}, "course": {"id": "CS101", "name": "Intro to CS"}}'
                      value={testData}
                      onChange={(e) => setTestData(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleTestMapping}
                    disabled={!testData}
                  >
                    Test Mapping
                  </Button>
                </div>

                {testResult ? (
                  <div
                    className={`mt-4 p-4 rounded ${testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <h4
                      className={`font-bold mb-2 ${testResult.success ? "text-green-700" : "text-red-700"}`}
                    >
                      {testResult.success
                        ? "✓ Mapping Successful"
                        : "✕ Mapping Failed"}
                    </h4>
                    {testResult.errors && testResult.errors.length > 0 && (
                      <div className="mb-2">
                        {testResult.errors.map((error: string, idx: number) => (
                          <div key={idx} className="text-sm text-red-600 mb-1">
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    {testResult.success && testResult.data ? (
                      <div className="bg-white rounded p-2 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto">
                        <pre>{`${JSON.stringify(testResult.data, null, 2)}`}</pre>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </>
          )}

          {isEditing && (
            <FieldMappingEditor
              onSave={handleAddField}
              onCancel={() => setIsEditing(false)}
              validationErrors={validationErrors.map((e) => e.error)}
            />
          )}

          {editingField && (
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Field Mapping
              </h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1.5 text-sm">
                      Source Field
                    </label>
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-400 rounded text-sm transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      value={editingField.sourceField}
                      onChange={(e) =>
                        handleUpdateField(editingField.id, {
                          ...editingField,
                          sourceField: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1.5 text-sm">
                      Target Field
                    </label>
                    <input
                      type="text"
                      className="px-3 py-2 border border-gray-400 rounded text-sm transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      value={editingField.targetField}
                      onChange={(e) =>
                        handleUpdateField(editingField.id, {
                          ...editingField,
                          targetField: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1.5 text-sm">
                    Transformation
                  </label>
                  <textarea
                    className="px-3 py-2 border border-gray-400 rounded text-sm font-mono transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={editingField.transformation || ""}
                    onChange={(e) =>
                      handleUpdateField(editingField.id, {
                        ...editingField,
                        transformation: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-blue-300">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingFieldId(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDeleteField(editingField.id);
                      setEditingFieldId(null);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainContent>
  );
};

export default DataMappingPage;
