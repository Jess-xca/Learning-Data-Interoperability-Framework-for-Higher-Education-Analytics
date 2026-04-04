import { useState } from "react";
import { Alert } from "..";
import RegistrationPage from "./RegistrationPage";
import { useAppDispatch } from "../../hooks/useRedux";
import { loginSuccess } from "../../store/slices/authSlice";
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

const roleNames: Record<User["role"], string> = {
  admin: "Academic Administrator",
  qa: "QA Officer",
  analyst: "Data Analyst",
  hod: "Department Head",
  lecturer: "Lecturer",
  student: "Student",
};

export default function LoginPage() {
  // All hooks must be called at the top level, before conditionals
  const dispatch = useAppDispatch();
  const [showRegister, setShowRegister] = useState(false);
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"form" | "mfa">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Conditionally render components, but hooks are already called
  if (showRegister) {
    return <RegistrationPage onSwitchToLogin={() => setShowRegister(false)} />;
  }

  const selectedInstitution = institutions.find((i) => i.value === institution);

  const handleSubmit = () => {
    if (!institution || !role || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("mfa");
    }, 1000);
  };

  const handleMFA = () => {
    if (!mfaCode) {
      setError("Please enter your MFA code.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(
        loginSuccess({
          id: `${role}-001`,
          email,
          name: email
            .split("@")[0]
            .replace(/\./g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          role: role as User["role"],
          institution: selectedInstitution?.label ?? institution,
          mfaEnabled: true,
        }),
      );
    }, 1000);
  };

  const fieldClass =
    "w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none";

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-on-tertiary-container to-primary z-50" />

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xl bg-surface-container-low shadow-glass">
        {/* Branding panel */}
        <section className="hidden md:flex md:col-span-5 relative flex-col justify-between p-12 bg-primary-container overflow-hidden">
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
                school
              </span>
              <h1 className="text-2xl font-extrabold tracking-tighter text-surface-container-lowest">
                Academic Curator
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-surface-bright leading-tight">
              Transforming raw institutional data into{" "}
              <span className="text-on-tertiary-container">
                curated intelligence
              </span>
              .
            </h2>
            <p className="mt-6 text-on-primary-container text-base max-w-sm leading-relaxed">
              Experience the framework v2.1 — where academic rigor meets data
              precision.
            </p>
          </div>
          <div className="relative z-10 space-y-4">
            {[
              {
                icon: "verified_user",
                title: "Encrypted Governance",
                sub: "ISO 27001 Certified Analytics Node",
              },
              {
                icon: "hub",
                title: "Multi-System Integration",
                sub: "LMS · SIS · ERP · Assessment Platforms",
              },
            ].map((item) => (
              <div
                key={item.icon}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <span className="material-symbols-outlined text-on-tertiary-container">
                  {item.icon}
                </span>
                <div className="text-xs">
                  <p className="text-surface-bright font-bold">{item.title}</p>
                  <p className="text-on-primary-container">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form panel */}
        <section className="col-span-1 md:col-span-7 bg-surface-container-lowest p-8 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10">
              <div className="flex items-center gap-3 md:hidden mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">
                  school
                </span>
                <span className="text-xl font-extrabold text-primary tracking-tight">
                  Academic Curator
                </span>
              </div>
              <h3 className="text-3xl font-bold text-primary tracking-tight">
                Institutional Access
              </h3>
              <p className="text-on-surface-variant mt-2">
                Welcome to the central authentication gateway.
              </p>
            </header>

            {error && (
              <div className="mb-6">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            {step === "form" ? (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-primary">
                    Partner Institution
                  </label>
                  <div className="relative">
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className={`${fieldClass} pr-10 appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select your university
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

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-primary">
                    Administrative Role
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as User["role"])}
                      className={`${fieldClass} pr-10 appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select your designation
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

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-primary">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.edu"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-primary">
                      Security Credential
                    </label>
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={fieldClass}
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-sm">
                    lock_person
                  </span>
                  <p className="text-[10px] leading-tight font-medium uppercase tracking-wider">
                    Multi-factor authentication will be prompted upon
                    validation.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <>
                      Sign In to Framework{" "}
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {role && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-sm">
                      {roleNames[role as User["role"]].charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {email}
                      </p>
                      <p className="text-xs text-on-tertiary-container font-bold uppercase tracking-wider">
                        {roleNames[role as User["role"]]}
                      </p>
                    </div>
                  </div>
                )}
                <Alert variant="info" icon="security">
                  A 6-digit verification code has been sent to your registered
                  email and authenticator app.
                </Alert>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-primary">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className={`${fieldClass} text-center text-2xl tracking-[0.5em] font-bold`}
                  />
                </div>
                <button
                  onClick={handleMFA}
                  disabled={loading}
                  className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <>
                      Verify &amp; Sign In{" "}
                      <span className="material-symbols-outlined">
                        verified_user
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setStep("form");
                    setError("");
                  }}
                  className="w-full h-10 text-primary font-semibold text-sm hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            )}

            <footer className="mt-10 pt-8 border-t border-outline-variant flex flex-col items-center gap-4">
              <p className="text-on-surface-variant text-sm">
                New to the Academic Curator ecosystem?
              </p>
              <button
                onClick={() => setShowRegister(true)}
                className="text-primary font-bold border-2 border-primary/10 px-6 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-sm"
              >
                Create New Account
              </button>
              <div className="flex gap-6 mt-2">
                {["Legal Framework", "Privacy Policy", "System Status"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-xs text-outline hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  ),
                )}
              </div>
            </footer>
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 pointer-events-none hidden lg:block opacity-5">
        <span className="material-symbols-outlined text-[12rem] text-primary">
          account_balance
        </span>
      </div>
    </div>
  );
}
