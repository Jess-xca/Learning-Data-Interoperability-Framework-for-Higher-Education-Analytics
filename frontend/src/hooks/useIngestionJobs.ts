import { useState, useCallback } from "react";

export interface IngestionJob {
  id: string;
  connectorId: string;
  connectorName: string;
  entityType: string;
  schedule: "once" | "hourly" | "daily" | "weekly";
  nextRun: string;
  lastRun?: string;
  status: "scheduled" | "running" | "completed" | "failed" | "paused";
  recordsProcessed: number;
  errorCount: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLog {
  jobId: string;
  connectorId: string;
  startTime: string;
  endTime?: string;
  status: "running" | "completed" | "failed";
  recordsProcessed: number;
  errorCount: number;
  errorDetails?: string;
  duration?: number;
}

const STORAGE_KEY = "ac_ingestion_jobs";
const LOGS_STORAGE_KEY = "ac_execution_logs";

export function useIngestionJobs() {
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load jobs from localStorage
  const loadJobs = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (stored) setJobs(JSON.parse(stored));
      if (storedLogs) setLogs(JSON.parse(storedLogs));
    } catch {
      setError("Failed to load jobs");
    }
  }, []);

  // Save jobs to localStorage
  const saveJobs = useCallback((updated: IngestionJob[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setJobs(updated);
    } catch {
      setError("Failed to save jobs");
    }
  }, []);

  // Save logs
  const saveLogs = useCallback((updated: ExecutionLog[]) => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
      setLogs(updated);
    } catch {
      setError("Failed to save logs");
    }
  }, []);

  // Create a new ingestion job
  const createJob = useCallback(
    (
      connectorId: string,
      connectorName: string,
      entityType: string,
      schedule: "once" | "hourly" | "daily" | "weekly"
    ): IngestionJob => {
      const now = new Date();
      const nextRun = new Date(now.getTime() + 3600000); // 1 hour from now

      const newJob: IngestionJob = {
        id: `job_${Date.now()}`,
        connectorId,
        connectorName,
        entityType,
        schedule,
        nextRun: nextRun.toISOString(),
        status: "scheduled",
        recordsProcessed: 0,
        errorCount: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const updated = [...jobs, newJob];
      saveJobs(updated);
      return newJob;
    },
    [jobs, saveJobs]
  );

  // Start a job execution
  const executeJob = useCallback(
    async (jobId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        setError("Job not found");
        setIsLoading(false);
        return false;
      }

      try {
        // Create execution log
        const startTime = new Date().toISOString();
        const executionLog: ExecutionLog = {
          jobId,
          connectorId: job.connectorId,
          startTime,
          status: "running",
          recordsProcessed: 0,
          errorCount: 0,
        };

        // Simulate job execution
        await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

        // Random success/failure
        const isSuccess = Math.random() > 0.1; // 90% success rate
        const recordsProcessed = Math.floor(Math.random() * 5000) + 100;
        const errorCount = isSuccess ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 50);
        const duration = Math.floor(Math.random() * 60) + 5;

        const endTime = new Date().toISOString();
        const completedLog: ExecutionLog = {
          ...executionLog,
          endTime,
          status: isSuccess ? "completed" : "failed",
          recordsProcessed,
          errorCount,
          duration,
        };

        // Update job
        const updatedJob: IngestionJob = {
          ...job,
          status: isSuccess ? "completed" : "failed",
          lastRun: endTime,
          recordsProcessed: job.recordsProcessed + recordsProcessed,
          errorCount: job.errorCount + errorCount,
          updatedAt: endTime,
        };

        const updatedJobs = jobs.map((j) => (j.id === jobId ? updatedJob : j));
        saveJobs(updatedJobs);

        const updatedLogs = [...logs, completedLog];
        saveLogs(updatedLogs);

        setIsLoading(false);
        return isSuccess;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Job execution failed");
        setIsLoading(false);
        return false;
      }
    },
    [jobs, logs, saveJobs, saveLogs]
  );

  // Pause a job
  const pauseJob = useCallback(
    (jobId: string) => {
      const updated = jobs.map((j) =>
        j.id === jobId ? { ...j, status: "paused" as const } : j
      );
      saveJobs(updated);
    },
    [jobs, saveJobs]
  );

  // Resume a paused job
  const resumeJob = useCallback(
    (jobId: string) => {
      const updated = jobs.map((j) =>
        j.id === jobId ? { ...j, status: "scheduled" as const } : j
      );
      saveJobs(updated);
    },
    [jobs, saveJobs]
  );

  // Delete a job
  const deleteJob = useCallback(
    (jobId: string) => {
      const updated = jobs.filter((j) => j.id !== jobId);
      saveJobs(updated);
    },
    [jobs, saveJobs]
  );

  // Get logs for a job
  const getJobLogs = useCallback(
    (jobId: string): ExecutionLog[] => {
      return logs.filter((log) => log.jobId === jobId);
    },
    [logs]
  );

  // Get jobs by connector
  const getConnectorJobs = useCallback(
    (connectorId: string): IngestionJob[] => {
      return jobs.filter((j) => j.connectorId === connectorId);
    },
    [jobs]
  );

  return {
    jobs,
    logs,
    isLoading,
    error,
    loadJobs,
    saveJobs,
    createJob,
    executeJob,
    pauseJob,
    resumeJob,
    deleteJob,
    getJobLogs,
    getConnectorJobs,
  };
}
