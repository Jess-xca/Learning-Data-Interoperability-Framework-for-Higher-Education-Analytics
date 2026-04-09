import { useState } from "react";
import { Alert, TextInput, FormCard } from "..";
import { useAppDispatch } from "../../hooks/useRedux";
import { loginSuccess } from "../../store/slices/authSlice";
import { BookOpen, CheckCircle2, ChevronDown, Award, Loader, ArrowRight, BarChart3 } from "lucide-react";
import type { User } from "../../store/slices/authSlice";

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

export default function RegistrationPage() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<
    "institution" | "credentials" | "verification"
  >("institution");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const selectedInstitution = institutions.find((i) => i.value === institution);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleInstitutionNext = () => {
    if (!institution || !role) {
      setError("Please select both institution and role");
      return;
    }
    setError("");
    setStep("credentials");
  };

  const handleCredentialsSubmit = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordStrength < 3) {
      setError(
        "Password is too weak. Use uppercase, lowercase, numbers, and symbols.",
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep("verification");
    }, 1000);
  };

  const handleVerification = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(
        loginSuccess({
          id: `${role}-${Date.now()}`,
          email,
          name: fullName,
          role: role as User["role"],
          institution: selectedInstitution?.label ?? institution,
          mfaEnabled: true,
        }),
      );
    }, 1000);
  };

  const fieldClass =
    "w-full h-9 pl-3 pr-3 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none shadow-sm";

  const strengthColors = [
    "bg-error",
    "bg-error",
    "bg-primary",
    "bg-on-tertiary-container",
  ];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-on-tertiary-container to-primary z-50" /> */}

      <main className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xl bg-surface-container-low shadow-glass">
        {/* Branding panel */}
        <section className="hidden md:flex md:col-span-5 relative flex-col justify-between p-10 bg-primary-container">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <BookOpen className="w-8 h-8 text-surface-container-lowest" />
              <h1 className="text-lg font-extrabold tracking-tighter text-surface-container-lowest">
                Academic Curator
              </h1>
            </div>
            <h2 className="text-xl font-bold text-surface-bright leading-tight">
              Join the future of{" "}
              <span className="text-on-tertiary-container">
                institutional intelligence
              </span>
              .
            </h2>
            <p className="mt-5 mb-5 text-on-primary-container text-xs max-w-sm leading-relaxed">
              Create your account and unlock data-driven insights for your
              institution.
            </p>
          </div>
          <div className="relative z-10 space-y-3">
            {[
              {
                icon: "verified_user",
                title: "Secure by Design",
                sub: "Enterprise-grade encryption & compliance",
              },
              {
                icon: "analytics",
                title: "Instant Insights",
                sub: "Real-time analytics from day one",
              },
            ].map((item) => {
              const iconMap: Record<string, React.ReactNode> = {
                verified_user: <CheckCircle2 className="w-5 h-5 text-on-tertiary-container" />,
                analytics: <BarChart3 className="w-5 h-5 text-on-tertiary-container" />,
              };
              return (
                <div
                  key={item.icon}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  {iconMap[item.icon]}
                  <div className="text-xs">
                    <p className="text-surface-bright font-bold">{item.title}</p>
                    <p className="text-on-primary-container">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Form panel */}
        <FormCard
          variant="primary"
          title="Create Account"
          subtitle={`Step ${step === "institution" ? "1" : step === "credentials" ? "2" : "3"} of 3`}
          maxWidth="sm"
        >
          {error && (
            <div className="mb-3">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {step === "institution" && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Select Institution
                </label>
                <div className="relative">
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={`w-full h-9 pl-3 pr-8 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none appearance-none cursor-pointer shadow-sm`}
                  >
                    <option value="" disabled>
                      Choose your institution
                    </option>
                    {institutions.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1.5 text-outline pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Your Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as User["role"])}
                    className={`w-full h-9 pl-3 pr-8 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none appearance-none cursor-pointer shadow-sm`}
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
                  <span className="absolute right-2 top-1.5 text-outline pointer-events-none">
                    <Award className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <button
                onClick={handleInstitutionNext}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 border border-primary/20"
              >
                Continue{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === "credentials" && (
            <div className="space-y-3.5">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                icon="person"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextInput
                label="Email Address"
                placeholder="john@institution.edu"
                type="email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <TextInput
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon="lock"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-outline-variant/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      Strength:{" "}
                      {strengthLabels[passwordStrength - 1] || "Too weak"}
                    </p>
                  </div>
                )}
              </div>
              <TextInput
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                icon="lock"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                onClick={handleCredentialsSubmit}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 border border-primary/20"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account{" "}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep("institution")}
                className="w-full h-8 text-primary font-semibold text-xs hover:bg-surface-container-low rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {step === "verification" && (
            <div className="space-y-3.5">
              <Alert variant="info" icon="mail">
                We've sent a 6-digit verification code to{" "}
                <strong>{email}</strong>
              </Alert>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className={`${fieldClass} text-center text-sm tracking-[0.2em] font-bold`}
                />
              </div>
              <button
                onClick={handleVerification}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 border border-primary/20"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Verify &amp; Complete{" "}
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep("credentials")}
                className="w-full h-8 text-primary font-semibold text-xs hover:bg-surface-container-low rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          <footer className="mt-6 pt-4 border-t border-outline-variant flex flex-col items-center gap-3">
            <p className="text-on-surface-variant text-xs">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </a>
            </p>
          </footer>
        </FormCard>
      </main>
    </div>
  );
}
