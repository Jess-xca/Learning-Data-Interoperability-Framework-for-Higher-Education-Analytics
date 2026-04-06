import { useState, useCallback } from "react";
import { useAppSelector } from "./useRedux";

export interface PasswordResetRequest {
  email: string;
  token: string;
  expiresAt: string;
  attempts: number;
}

const STORAGE_KEY = "ac_password_resets";
const MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY_MINUTES = 15;

export function usePasswordReset() {
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Request password reset (send email with reset link)
   */
  const requestReset = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
      }

      // Generate mock reset token
      const token = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");

      const expiresAt = new Date(
        Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000,
      ).toISOString();

      // Store reset request
      const resetRequest: PasswordResetRequest = {
        email,
        token,
        expiresAt,
        attempts: 0,
      };

      // In production, store in backend database
      // For now, use localStorage (dev only!)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetRequest));

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(
        `Reset link sent to ${email}. Check your inbox (valid for ${TOKEN_EXPIRY_MINUTES} minutes).`,
      );
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Verify reset token
   */
  const verifyToken = useCallback((token: string): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setError("Reset link has expired or is invalid");
        return false;
      }

      const resetRequest: PasswordResetRequest = JSON.parse(stored);

      // Check if token matches
      if (resetRequest.token !== token) {
        resetRequest.attempts++;
        if (resetRequest.attempts >= MAX_ATTEMPTS) {
          localStorage.removeItem(STORAGE_KEY);
          setError("Too many failed attempts. Request a new reset link.");
          return false;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resetRequest));
        setError("Invalid reset token");
        return false;
      }

      // Check expiry
      if (new Date(resetRequest.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        setError("Reset link has expired");
        return false;
      }

      return true;
    } catch {
      setError("Verification failed");
      return false;
    }
  }, []);

  /**
   * Complete password reset
   */
  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        // Verify token first
        if (!verifyToken(token)) {
          throw new Error("Invalid reset token");
        }

        // Validate password
        if (newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }

        // Simulate password update
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear reset request
        localStorage.removeItem(STORAGE_KEY);

        setSuccessMessage("Password reset successfully. Please log in again.");
        setIsLoading(false);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Reset failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [verifyToken],
  );

  /**
   * Change password (for authenticated users)
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        if (!user) {
          throw new Error("Not authenticated");
        }

        // Validate passwords
        if (currentPassword.length < 8) {
          throw new Error("Current password is invalid");
        }

        if (newPassword.length < 8) {
          throw new Error("New password must be at least 8 characters");
        }

        if (currentPassword === newPassword) {
          throw new Error("New password must be different from current");
        }

        // In production, verify current password on backend
        // For mock, just accept it
        await new Promise((resolve) => setTimeout(resolve, 800));

        setSuccessMessage("Password changed successfully");
        setIsLoading(false);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Change failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [user],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    isLoading,
    error,
    successMessage,
    requestReset,
    verifyToken,
    resetPassword,
    changePassword,
    clearMessages,
  };
}
