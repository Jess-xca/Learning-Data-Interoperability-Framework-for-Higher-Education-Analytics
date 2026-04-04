import { useState } from "react";
import { Alert } from "..";
import { useAppDispatch } from "../../hooks/useRedux";
import { loginSuccess } from "../../store/slices/authSlice";
import { createUserSuccess } from "../../store/slices/usersSlice";
import type { User } from "../../store/slices/authSlice";
import type { SystemUser } from "../../store/slices/usersSlice";

const institutions = [
  { value: "univ-kigali", label: "Université de Kigali" },
  {
    value: "kigali-institute",
    label: "Kigali Institute of Science & Technology",
  },
  { value: "aub", label: "African University of Business" },
  { value: "demo", label: "Demo Institution (Testing)" },
];

const roles: { value: User["role"]; label: string }[] = [
  { value: "admin", label: "Academic Administrator" },
  { value: "qa", label: "Quality Assurance Officer" },
  { value: "analyst", label: "Data Analyst" },
  { value: "hod", label: "Department Head" },
  { value: "lecturer", label: "Lecturer" },
];

interface RegistrationPageProps {
  onSwitchToLogin: () => void;
}

export default function RegistrationPage({
  onSwitchToLogin,
}: RegistrationPageProps) {
  const dispatch = useAppDispatch();
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"details" | "verification">("details");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedInstitution = institutions.find((i) => i.value === institution);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleRegisterSubmit = () => {
    setError("");
    setSuccess("");

    if (
      !institution ||
      !role ||
      !email ||
      !name ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate email verification
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Verification code sent to your email. Check your inbox.");
      setStep("verification");
    }, 1500);
  };

  const handleVerificationSubmit = () => {
    setError("");
    setSuccess("");

    if (!verificationCode || verificationCode.length < 4) {
      setError("Please enter a valid verification code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Create new user
      const newUser: SystemUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: role as User["role"],
        institution: selectedInstitution?.label ?? institution,
        department: department || undefined,
        phone: phone || undefined,
        mfaEnabled: false,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to users list
      dispatch(createUserSuccess(newUser));

      // Auto-login after registration
      dispatch(
        loginSuccess({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          institution: newUser.institution,
          department: newUser.department,
          mfaEnabled: false,
        }),
      );
    }, 1500);
  };

  const fieldClass =
    "w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none";

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-on-tertiary-container to-secondary z-50" />

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xl bg-surface-container-low shadow-glass">
        {/* Branding panel */}
        <section className="hidden md:flex md:col-span-5 relative flex-col justify-between p-12 bg-secondary-container overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #adc7f7 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00b47d 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <span className="material-symbols-outlined text-surface-container-lowest text-4xl">
                how_to_reg
              </span>
              <h1 className="text-2xl font-extrabold tracking-tighter text-surface-container-lowest">
                Create Account
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-surface-bright leading-tight">
              Join the{" "}
              <span className="text-on-tertiary-container">
                Academic Curator
              </span>{" "}
              network.
            </h2>
            <p className="mt-6 text-on-secondary-container text-base max-w-sm leading-relaxed">
              Register your institutional account to access unified learning
              records and predictive analytics.
            </p>
          </div>
        </section>

        {/* Form panel */}
        <section className="col-span-1 md:col-span-7 bg-surface-container-lowest p-8 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10">
              <div className="flex items-center gap-3 md:hidden mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">
                  how_to_reg
                </span>
                <span className="text-xl font-extrabold text-secondary tracking-tight">
                  Register
                </span>
              </div>
              <h3 className="text-3xl font-bold text-secondary tracking-tight">
                {step === "details" ? "Account Setup" : "Verify Email"}
              </h3>
              <p className="text-on-surface-variant mt-2">
                {step === "details"
                  ? "Create your institutional account"
                  : "Enter the code sent to your email"}
              </p>
            </header>

            {error && (
              <div className="mb-6">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            {success && (
              <div className="mb-6">
                <Alert variant="success">{success}</Alert>
              </div>
            )}

            {step === "details" ? (
              <div className="space-y-5">
                {/* Institution Selection */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Partner Institution *
                  </label>
                  <div className="relative">
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className={`${fieldClass} pr-10 appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select your institution
                      </option>
                      {institutions.map((i) => (
                        <option key={i.value} value={i.value}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">
                      unfold_more
                    </span>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Administrative Role *
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as User["role"])}
                      className={`${fieldClass} pr-10 appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">
                      badge
                    </span>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={fieldClass}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@institution.ac.rw"
                    className={fieldClass}
                  />
                </div>

                {/* Department (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-on-surface-variant">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science (Optional)"
                    className={fieldClass}
                  />
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-on-surface-variant">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 78X XXX XXX (Optional)"
                    className={fieldClass}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={fieldClass}
                  />
                  <p className="text-xs text-on-surface-variant">
                    Must contain at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={fieldClass}
                  />
                </div>

                {/* Register Button */}
                <button
                  onClick={handleRegisterSubmit}
                  disabled={loading}
                  className="w-full mt-8 h-12 px-6 rounded-lg bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-secondary font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        hourglass_empty
                      </span>
                      Registering...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        how_to_reg
                      </span>
                      Create Account
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="text-center mt-6">
                  <p className="text-sm text-on-surface-variant">
                    Already have an account?{" "}
                    <button
                      onClick={onSwitchToLogin}
                      className="text-secondary font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Verification Step
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-secondary-container/30 border border-secondary/20">
                  <p className="text-sm text-on-surface">
                    We sent a verification code to <strong>{email}</strong>.
                    Check your inbox and spam folder.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-secondary">
                    Verification Code *
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={fieldClass}
                  />
                  <p className="text-xs text-on-surface-variant">
                    The code will be valid for 10 minutes
                  </p>
                </div>

                <button
                  onClick={handleVerificationSubmit}
                  disabled={loading}
                  className="w-full mt-8 h-12 px-6 rounded-lg bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-secondary font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        hourglass_empty
                      </span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        check_circle
                      </span>
                      Verify Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setStep("details");
                    setError("");
                    setSuccess("");
                    setVerificationCode("");
                  }}
                  className="w-full text-secondary font-semibold hover:underline text-sm"
                >
                  Back to Registration
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
