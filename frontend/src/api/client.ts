import axios, { AxiosError } from "axios";

// Base URL - in development, requests are handled by MSW
const BASE_URL = "/api";
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Determines if a request should be retried based on error type
 * Retries only idempotent operations (GET, PUT, DELETE) with specific error codes
 */
function isRetryableError(error: AxiosError): boolean {
  if (!error.config) return false;

  // Only retry safe methods
  const method = error.config.method?.toUpperCase();
  if (!["GET", "PUT", "DELETE", "HEAD"].includes(method || "")) {
    return false;
  }

  // Retry on network errors or specific HTTP status codes
  const status = error.response?.status;
  const hasNetworkError = !error.response;

  return (
    hasNetworkError ||
    status === 408 || // Request Timeout
    status === 429 || // Too Many Requests
    status === 500 || // Internal Server Error
    status === 502 || // Bad Gateway
    status === 503 || // Service Unavailable
    status === 504 // Gateway Timeout
  );
}

/**
 * Retry logic for failed requests
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count
    if (!config.headers["X-Retry-Count"]) {
      config.headers["X-Retry-Count"] = "0";
    }

    const currentRetry = parseInt(
      config.headers["X-Retry-Count"] as string,
      10,
    );

    // Check if should retry
    if (isRetryableError(error) && currentRetry < MAX_RETRIES) {
      // Increment retry count
      config.headers["X-Retry-Count"] = (currentRetry + 1).toString();

      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY * Math.pow(2, currentRetry);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(config);
    }

    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
