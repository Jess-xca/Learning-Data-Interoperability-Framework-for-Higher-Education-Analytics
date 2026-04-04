import { useState } from "react";
import { useTOTP } from "../../hooks/useTOTP";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import { useAppSelector } from "../../hooks/useRedux";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Badge from "../common/Badge";

export default function MFASetupPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { mfaSetup, isVerifying, verificationError, generateSecret, setupTOTP, disableTOTP } =
    useTOTP(user?.id || "");
  const { isLoading: isResettingPassword, error: resetError, successMessage, changePassword, clearMessages } =
    usePasswordReset();

  const [activeTab, setActiveTab] = useState<"totp" | "password">("totp");
  const [totpSecret, setTotpSecret] = useState<ReturnType<typeof generateSecret> | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fieldClass =
    "w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

  const handleGenerateTOTP = () => {
    const secret = generateSecret();
    setTotpSecret(secret);
    setVerificationCode("");
  };

  const handleVerifyAndSetupTOTP = async () => {
    if (!totpSecret || !verificationCode) return;
    const success = await setupTOTP(totpSecret.secret, verificationCode);
    if (success) {
      setTotpSecret(null);
      setVerificationCode("");
    }
  };

  const handleChangePassword = async () => {
    clearMessages();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    await changePassword(currentPassword, newPassword);
    if (!resetError) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Security Settings</h1>
        <p className="text-on-surface-variant mt-1">
          Manage multi-factor authentication and password security
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-outline">
        <button
          onClick={() => {
            setActiveTab("totp");
            clearMessages();
          }}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === "totp"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">security</span>
            Two-Factor Authentication
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("password");
            clearMessages();
          }}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === "password"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">lock</span>
            Password
          </span>
        </button>
      </div>

      {/* TOTP Tab */}
      {activeTab === "totp" && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Authenticator App (TOTP)
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Use an authenticator app like Google Authenticator or Authy for two-factor auth
                </p>
              </div>
              {mfaSetup?.enabled && (
                <Badge variant="success">Active</Badge>
              )}
            </div>

            {mfaSetup?.enabled ? (
              // TOTP is enabled
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-tertiary-fixed/30 border border-tertiary">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-tertiary flex-shrink-0">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-on-tertiary">
                        Two-factor authentication is enabled
                      </p>
                      <p className="text-sm text-on-tertiary-variant mt-1">
                        Setup on {new Date(mfaSetup.setupDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-on-tertiary-variant">
                        Backup codes remaining: {mfaSetup.backupCodesRemaining}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm("Disable two-factor authentication? You'll need to set it up again to re-enable.")) {
                      disableTOTP();
                    }
                  }}
                  className="w-full h-10 border border-error text-error hover:bg-error-container rounded-lg font-semibold transition-colors"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            ) : totpSecret ? (
              // Setup form
              <div className="space-y-6">
                <Alert variant="info" icon="info">
                  Scan the QR code with your authenticator app, then verify with the 6-digit code
                </Alert>

                {/* QR Code */}
                <div className="flex justify-center p-6 bg-surface-container rounded-lg">
                  <img
                    src={totpSecret.qrCodeUrl}
                    alt="TOTP QR Code"
                    className="w-64 h-64"
                  />
                </div>

                {/* Manual entry (if QR fails) */}
                <div className="p-4 rounded-lg bg-surface-container border border-outline-variant">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2">
                    Can't scan? Enter manually:
                  </p>
                  <code className="text-sm font-mono text-on-surface break-all">
                    {totpSecret.secret}
                  </code>
                </div>

                {/* Verification code input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Enter 6-digit code from app
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className={`${fieldClass} text-center text-2xl tracking-[0.5em] font-bold`}
                  />
                </div>

                {verificationError && (
                  <Alert variant="error">{verificationError}</Alert>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyAndSetupTOTP}
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="flex-1 h-10 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">
                          hourglass_empty
                        </span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">check</span>
                        Verify & Enable
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setTotpSecret(null)}
                    className="flex-1 h-10 border border-outline text-on-surface rounded-lg font-semibold hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Setup button
              <button
                onClick={handleGenerateTOTP}
                className="w-full h-10 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Setup Authenticator
              </button>
            )}
          </Card>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-on-surface mb-6">Change Password</h3>

            {resetError && (
              <Alert variant="error" className="mb-6">
                {resetError}
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="mb-6">
                {successMessage}
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={fieldClass}
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <Alert variant="error">Passwords do not match</Alert>
              )}

              <div className="p-4 rounded-lg bg-warning-container/20 border border-warning">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-warning flex-shrink-0">
                    info
                  </span>
                  <p className="text-sm text-on-surface">
                    You'll be logged out after changing your password. You'll need to sign in again.
                  </p>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={
                  isResettingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className="w-full h-10 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isResettingPassword ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      hourglass_empty
                    </span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Update Password
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
