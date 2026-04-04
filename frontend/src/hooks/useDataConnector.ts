import { useState, useCallback } from "react";

export interface ConnectorConfig {
  id: string;
  name: string;
  type: "lms" | "sis" | "library" | "crm" | "custom";
  endpoint: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  oauthScope?: string;
  headers?: Record<string, string>;
  retryAttempts: number;
  timeout: number;
}

export interface ConnectorHealth {
  lastChecked: string;
  status: "healthy" | "degraded" | "unhealthy";
  latency: number;
  uptime: number;
  errorCount: number;
  successCount: number;
}

const STORAGE_KEY = "ac_connectors";

export function useDataConnector() {
  const [connectors, setConnectors] = useState<ConnectorConfig[]>([]);
  const [health, setHealth] = useState<Record<string, ConnectorHealth>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load connectors from localStorage
  const loadConnectors = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConnectors(JSON.parse(stored));
      }
    } catch {
      setError("Failed to load connectors");
    }
  }, []);

  // Save connectors to localStorage
  const saveConnectors = useCallback((updated: ConnectorConfig[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setConnectors(updated);
    } catch {
      setError("Failed to save connectors");
    }
  }, []);

  // Test connection to a data source
  const testConnection = useCallback(
    async (config: ConnectorConfig): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call with mock delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock validation - check for required fields
        if (!config.endpoint || (!config.apiKey && !config.clientId)) {
          throw new Error("Invalid connection configuration");
        }

        // Simulate occasional failures for testing
        const random = Math.random();
        if (random < 0.1) {
          throw new Error("Connection timeout - server not responding");
        }

        setIsLoading(false);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  // Add a new connector
  const addConnector = useCallback(
    async (config: ConnectorConfig): Promise<boolean> => {
      const isValid = await testConnection(config);
      if (!isValid) return false;

      const updated = [...connectors, config];
      saveConnectors(updated);

      // Initialize health data
      const newHealth: ConnectorHealth = {
        lastChecked: new Date().toISOString(),
        status: "healthy",
        latency: Math.floor(Math.random() * 200) + 50,
        uptime: 99.9,
        errorCount: 0,
        successCount: 1,
      };
      setHealth({ ...health, [config.id]: newHealth });

      return true;
    },
    [connectors, health, testConnection, saveConnectors]
  );

  // Update an existing connector
  const updateConnector = useCallback(
    async (id: string, config: Partial<ConnectorConfig>): Promise<boolean> => {
      const connector = connectors.find((c) => c.id === id);
      if (!connector) {
        setError("Connector not found");
        return false;
      }

      const updated = { ...connector, ...config };
      const isValid = await testConnection(updated as ConnectorConfig);
      if (!isValid) return false;

      const updatedList = connectors.map((c) => (c.id === id ? updated : c));
      saveConnectors(updatedList as ConnectorConfig[]);
      return true;
    },
    [connectors, testConnection, saveConnectors]
  );

  // Remove a connector
  const removeConnector = useCallback(
    (id: string) => {
      const updated = connectors.filter((c) => c.id !== id);
      saveConnectors(updated);

      const updatedHealth = { ...health };
      delete updatedHealth[id];
      setHealth(updatedHealth);
    },
    [connectors, health, saveConnectors]
  );

  // Check health of a connector
  const checkHealth = useCallback(
    async (connectorId: string): Promise<ConnectorHealth | null> => {
      const connector = connectors.find((c) => c.id === connectorId);
      if (!connector) return null;

      // Simulate health check
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const latency = Math.floor(Math.random() * 300) + 20;
      const status =
        latency > 200
          ? ("degraded" as const)
          : latency > 100
            ? ("healthy" as const)
            : ("healthy" as const);

      const healthData: ConnectorHealth = {
        lastChecked: new Date().toISOString(),
        status,
        latency,
        uptime: 99.5 + Math.random() * 0.5,
        errorCount: status === "healthy" ? 0 : 2,
        successCount: Math.floor(Math.random() * 100) + 50,
      };

      setHealth({ ...health, [connectorId]: healthData });
      return healthData;
    },
    [connectors, health]
  );

  // Get connector by ID
  const getConnector = useCallback(
    (id: string): ConnectorConfig | undefined => {
      return connectors.find((c) => c.id === id);
    },
    [connectors]
  );

  return {
    connectors,
    health,
    isLoading,
    error,
    loadConnectors,
    saveConnectors,
    testConnection,
    addConnector,
    updateConnector,
    removeConnector,
    checkHealth,
    getConnector,
  };
}
