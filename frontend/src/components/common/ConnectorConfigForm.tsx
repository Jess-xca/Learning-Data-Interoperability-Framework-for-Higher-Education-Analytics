import { useState } from "react";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Badge from "../common/Badge";
import { Button, TextInput } from "../forms";
import type { ConnectorConfig } from "../../hooks/useDataConnector";

interface ConnectorConfigFormProps {
  onSubmit: (config: ConnectorConfig) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ConnectorConfigForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: ConnectorConfigFormProps) {
  const [step, setStep] = useState<"type" | "config" | "test">("type");
  const [connectorType, setConnectorType] = useState<
    "lms" | "sis" | "library" | "crm" | "custom" | ""
  >("");
  const [config, setConfig] = useState<Partial<ConnectorConfig>>(() => ({
    id: `connector_${Date.now()}`,
    name: "",
    endpoint: "",
    apiKey: "",
    clientId: "",
    clientSecret: "",
    retryAttempts: 3,
    timeout: 30000,
  }));
  const [testResult, setTestResult] = useState<
    "pending" | "success" | "failure"
  >("pending");

  const connectorTypes = [
    {
      type: "lms" as const,
      name: "Learning Management Systems",
      options: ["Canvas", "Moodle", "Blackboard", "Brightspace"],
      description: "Integrate course and student data",
    },
    {
      type: "sis" as const,
      name: "Student Information Systems",
      options: ["Banner", "Workday", "PeopleSoft", "Colleague"],
      description: "Sync enrollment and registration data",
    },
    {
      type: "library" as const,
      name: "Library Systems",
      options: ["ExLibris Alma", "Koha", "Evergreen"],
      description: "Integrate library and resource data",
    },
    {
      type: "crm" as const,
      name: "CRM Systems",
      options: ["Salesforce", "HubSpot", "Microsoft Dynamics"],
      description: "Manage alumni and donor data",
    },
    {
      type: "custom" as const,
      name: "Custom API",
      options: ["REST API", "GraphQL", "SOAP"],
      description: "Connect any HTTP-based system",
    },
  ];

  const handleTypeSelect = (type: string) => {
    setConnectorType(type as typeof connectorType);
    setStep("config");
  };

  const handleConfigChange = (field: string, value: string | number) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const handleTestConnection = async () => {
    setTestResult("pending");
    // Simulate test - in real scenario would call API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const isValid =
      config.name && config.endpoint && (config.apiKey || config.clientId);
    setTestResult(isValid ? "success" : "failure");
  };

  const handleSubmit = async () => {
    if (testResult !== "success") {
      return;
    }

    const finalConfig: ConnectorConfig = {
      id: config.id || `connector_${Date.now()}`,
      name: config.name || "Untitled Connector",
      type: connectorType as ConnectorConfig["type"],
      endpoint: config.endpoint || "",
      apiKey: config.apiKey,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      retryAttempts: config.retryAttempts || 3,
      timeout: config.timeout || 30000,
    };

    const success = await onSubmit(finalConfig);
    if (success) {
      // Reset form
      setStep("type");
      setConnectorType("");
      setConfig({
        id: `connector_${Date.now()}`,
        name: "",
        endpoint: "",
        apiKey: "",
        clientId: "",
        clientSecret: "",
        retryAttempts: 3,
        timeout: 30000,
      });
      setTestResult("pending");
    }
  };

  const fieldClass =
    "w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <Card className="w-full max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-primary">
            Connect Data Source
          </h3>
          <p className="text-on-surface-variant mt-2">
            Step {step === "type" ? 1 : step === "config" ? 2 : 3} of 3
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Step 1: Type Selection */}
        {step === "type" && (
          <div className="space-y-4">
            <h4 className="font-bold text-primary text-sm uppercase tracking-widest">
              Select Connector Type
            </h4>
            {connectorTypes.map((ct) => (
              <button
                key={ct.type}
                onClick={() => handleTypeSelect(ct.type)}
                className="w-full text-left p-4 rounded-lg border-2 border-outline hover:border-primary hover:bg-primary-container/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">{ct.name}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {ct.description}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Configuration */}
        {step === "config" && (
          <div className="space-y-4">
            <h4 className="font-bold text-primary text-sm uppercase tracking-widest">
              Configure Connection
            </h4>

            <TextInput
              label="Connection Name"
              placeholder="e.g., Canvas Production"
              value={config.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleConfigChange("name", e.target.value)
              }
            />

            <TextInput
              label="API Endpoint"
              placeholder="https://api.example.com/v1"
              value={config.endpoint || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleConfigChange("endpoint", e.target.value)
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="API Key (optional)"
                value={config.apiKey || ""}
                onChange={(e) => handleConfigChange("apiKey", e.target.value)}
                className={fieldClass}
              />
              <input
                type="password"
                placeholder="Client Secret (optional)"
                value={config.clientSecret || ""}
                onChange={(e) =>
                  handleConfigChange("clientSecret", e.target.value)
                }
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.retryAttempts || 3}
                  onChange={(e) =>
                    handleConfigChange(
                      "retryAttempts",
                      parseInt(e.target.value),
                    )
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                  Timeout (ms)
                </label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={config.timeout || 30000}
                  onChange={(e) =>
                    handleConfigChange("timeout", parseInt(e.target.value))
                  }
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Test Connection */}
        {step === "test" && (
          <div className="space-y-4">
            <h4 className="font-bold text-primary text-sm uppercase tracking-widest">
              Test Connection
            </h4>

            <div className="bg-surface-container-low p-6 rounded-lg">
              <div className="text-center">
                {testResult === "pending" && (
                  <>
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-4">
                      sync
                    </span>
                    <p className="text-sm font-bold">Testing connection...</p>
                  </>
                )}
                {testResult === "success" && (
                  <>
                    <span className="material-symbols-outlined text-4xl text-tertiary block mb-4">
                      check_circle
                    </span>
                    <p className="text-sm font-bold text-tertiary">
                      Connection successful!
                    </p>
                    <Badge variant="success" className="mt-3 inline-block">
                      Ready to configure
                    </Badge>
                  </>
                )}
                {testResult === "failure" && (
                  <>
                    <span className="material-symbols-outlined text-4xl text-error block mb-4">
                      error
                    </span>
                    <p className="text-sm font-bold text-error">
                      Connection test failed
                    </p>
                    <p className="text-xs text-on-surface-variant mt-2">
                      Please verify your configuration and try again
                    </p>
                  </>
                )}
              </div>
            </div>

            {testResult === "pending" && (
              <Alert variant="info">
                Testing connection to your data source...
              </Alert>
            )}
            {testResult === "failure" && (
              <Alert variant="error">
                Failed to connect. Check your API endpoint and credentials.
              </Alert>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/20">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-on-surface hover:bg-surface-container-low rounded transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {step !== "type" && (
              <button
                onClick={() =>
                  step === "config" ? setStep("type") : setStep("config")
                }
                className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary-container rounded transition-colors"
              >
                Back
              </button>
            )}

            {step === "type" && <div />}
            {step === "config" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep("test")}
                isLoading={isLoading}
              >
                Test Connection
              </Button>
            )}
            {step === "test" && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTestConnection()}
                  isLoading={isLoading}
                >
                  Retest
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={testResult !== "success"}
                >
                  Connect
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
