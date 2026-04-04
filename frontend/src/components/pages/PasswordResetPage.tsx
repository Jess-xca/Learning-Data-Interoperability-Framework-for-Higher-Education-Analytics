import { useState } from "react";
import { Alert, TextInput } from "..";

export default function PasswordResetPage() {
  const [step, setStep] = useState<"email" | "code" | "newPassword" | "success">("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (pwd: string) => {
    setNewPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleEmailSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 1000);
  };

  const handleCodeSubmit = () => {
    if (!resetCode || resetCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("newPassword");
    }, 1000);
  };

  const handlePasswordSubmit = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordStrength < 3) {
      setError("Password is too weak");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1000);
  };

  const fieldClass = "w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none";
  const strengthColors = ["bg-error", "bg-error", "bg-primary", "bg-on-tertiary-container"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-on-tertiary-container to-primary z-50" />

      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 shadow-glass">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
          <div>
            <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
            <p className="text-sm text-on-surface-variant">Step {step === "email" ? "1" : step === "code" ? "2" : step === "newPassword" ? "3" : "4"} of 4</p>
          </div>
        </div>

        {error && <div className="mb-6"><Alert variant="error">{error}</Alert></div>}

        {step === "email" && (
          <div className="space-y-5">
            <p className="text-on-surface-variant">Enter your email address and we'll send you a reset code.</p>
            <TextInput label="Email Address" placeholder="your@institution.edu" type="email" icon="mail" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleEmailSubmit} disabled={loading}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Send Reset Code"}
            </button>
            <a href="/login" className="block text-center text-sm text-primary font-semibold hover:underline">
              ← Back to login
            </a>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-5">
            <Alert variant="info" icon="mail">
              We've sent a 6-digit code to <strong>{email}</strong>
            </Alert>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-primary">Reset Code</label>
              <input type="text" value={resetCode} onChange={e => setResetCode(e.target.value.slice(0, 6))}
                placeholder="000000" maxLength={6}
                className={`${fieldClass} text-center text-2xl tracking-[0.5em] font-bold`} />
            </div>
            <button onClick={handleCodeSubmit} disabled={loading}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Verify Code"}
            </button>
            <button onClick={() => setStep("email")} className="w-full text-sm text-primary font-semibold hover:underline">
              ← Back
            </button>
          </div>
        )}

        {step === "newPassword" && (
          <div className="space-y-5">
            <p className="text-on-surface-variant">Create a strong new password for your account.</p>
            <div>
              <TextInput label="New Password" placeholder="••••••••" type="password" icon="lock" value={newPassword} onChange={e => handlePasswordChange(e.target.value)} />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-outline-variant/30"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant">Strength: {strengthLabels[passwordStrength - 1] || "Too weak"}</p>
                </div>
              )}
            </div>
            <TextInput label="Confirm Password" placeholder="••••••••" type="password" icon="lock" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <button onClick={handlePasswordSubmit} disabled={loading}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Reset Password"}
            </button>
            <button onClick={() => setStep("code")} className="w-full text-sm text-primary font-semibold hover:underline">
              ← Back
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-tertiary-container/20 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-on-tertiary-container text-4xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary mb-2">Password Reset Complete</h2>
              <p className="text-on-surface-variant">Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>
            <a href="/login"
              className="block w-full h-12 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              Sign In <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
      <footer className="mt-10 pt-8 border-t border-outline-variant text-center">
        <p className="text-sm text-on-surface-variant">
          Remember your password?{" "}
          <a href="/login" className="text-primary font-bold hover:underline">Sign in</a>
        </p>
      </footer>
    </div>
  );
}
