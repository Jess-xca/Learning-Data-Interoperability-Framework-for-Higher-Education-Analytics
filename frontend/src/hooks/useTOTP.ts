import { useState, useCallback } from "react";

export interface TOTPSecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFASetup {
  userId: string;
  enabled: boolean;
  method: "totp" | "sms" | "email";
  setupDate: string;
  lastVerified: string;
  backupCodesRemaining: number;
}

const STORAGE_KEY_PREFIX = "ac_mfa_";

export function useTOTP(userId: string) {
  const [mfaSetup, setMFASetup] = useState<MFASetup | null>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    return stored ? JSON.parse(stored) : null;
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  /**
   * Generate a mock TOTP secret
   * In production, use speakeasy or similar library
   */
  const generateSecret = useCallback((): TOTPSecret => {
    const secret = Array.from(
      { length: 32 },
      () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[Math.floor(Math.random() * 32)],
    ).join("");

    const backupCodes = Array.from({ length: 10 }, () =>
      Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join(""),
    );

    // Mock QR code URL (in production, generate real QR code)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=otpauth://totp/Academic%20Curator:${userId}?secret=${secret}&issuer=Academic%20Curator`;

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }, [userId]);

  /**
   * Verify TOTP code
   */
  const verifyCode = useCallback(async (code: string): Promise<boolean> => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      // Mock verification - accept any 6-digit code
      if (!/^\d{6}$/.test(code)) {
        throw new Error("Code must be 6 digits");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In production, verify against TOTP algorithm
      // For now, accept any valid code
      setIsVerifying(false);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      setVerificationError(message);
      setIsVerifying(false);
      return false;
    }
  }, []);

  /**
   * Disable TOTP (logout from all sessions)
   */
  const disableTOTP = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
    setMFASetup(null);
  }, [userId]);

  /**
   * Setup new TOTP
   */
  const setupTOTP = useCallback(
    async (_secret: string, verificationCode: string): Promise<boolean> => {
      setIsVerifying(true);
      setVerificationError(null);

      try {
        if (!/^\d{6}$/.test(verificationCode)) {
          throw new Error("Code must be 6 digits");
        }

        const newSetup: MFASetup = {
          userId,
          enabled: true,
          method: "totp",
          setupDate: new Date().toISOString(),
          lastVerified: new Date().toISOString(),
          backupCodesRemaining: 10,
        };

        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${userId}`,
          JSON.stringify(newSetup),
        );
        setMFASetup(newSetup);
        setIsVerifying(false);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Setup failed";
        setVerificationError(message);
        setIsVerifying(false);
        return false;
      }
    },
    [userId],
  );

  /**
   * Use a backup code (reduces count)
   */
  const useBackupCode = useCallback((): boolean => {
    if (!mfaSetup || mfaSetup.backupCodesRemaining <= 0) {
      setVerificationError("No backup codes remaining");
      return false;
    }

    // In production, validate against stored backup codes
    const updated: MFASetup = {
      ...mfaSetup,
      backupCodesRemaining: mfaSetup.backupCodesRemaining - 1,
      lastVerified: new Date().toISOString(),
    };

    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(updated),
    );
    setMFASetup(updated);
    return true;
  }, [mfaSetup, userId]);

  return {
    mfaSetup,
    isVerifying,
    verificationError,
    generateSecret,
    verifyCode,
    setupTOTP,
    disableTOTP,
    useBackupCode,
  };
}
