import { useState } from "react";
import { Alert, FormCard } from "..";
import { useAppDispatch } from "../../hooks/useRedux";
import { loginSuccess } from "../../store/slices/authSlice";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Award,
  Loader,
  ArrowRight,
  Building2,
} from "lucide-react";
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
  const dispatch = useAppDispatch();
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"form" | "mfa">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // const fieldClass = (no longer used - now using inline classes);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex items-center justify-center p-4">
      <main className="min-w-sm max-w-3xl h-full md:h-auto grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xl bg-surface-container-low shadow-glass">
        {/* Branding panel */}
        <section className="hidden md:flex md:col-span-5 relative flex-col justify-between p-10 bg-secondary-container overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #adc7f7 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00b47d 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <BookOpen className="w-8 h-8 text-surface-container-lowest" />
              <h1 className="text-lg font-extrabold tracking-tighter text-surface-container-lowest">
                Academic Curator
              </h1>
            </div>
            <h2 className="text-xl font-bold text-surface-bright leading-tight">
              Transforming raw institutional data into{" "}
              <span className="text-on-tertiary-container">
                curated intelligence
              </span>
              .
            </h2>
            <p className="mt-5 mb-5 text-on-secondary-container text-xs max-w-sm leading-relaxed\">
              Transform your institution's data into actionable intelligence
              with precision and confidence.
            </p>
          </div>
          <div className="relative z-10 space-y-3">
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
            ].map((item) => {
              const iconMap: Record<string, React.ReactNode> = {
                verified_user: (
                  <CheckCircle2 className="w-5 h-5 text-on-tertiary-container" />
                ),
                hub: <Award className="w-5 h-5 text-on-tertiary-container" />,
              };
              return (
                <div
                  key={item.icon}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  {iconMap[item.icon]}
                  <div className="text-xs">
                    <p className="text-surface-bright font-bold">
                      {item.title}
                    </p>
                    <p className="text-on-secondary-container">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Form panel */}
        <FormCard
          variant="primary"
          title="Institutional Access"
          subtitle="Welcome to the central authentication gateway."
          maxWidth="sm"
        >
          {error && (
            <div className="mb-3">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {step === "form" ? (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Partner Institution
                </label>
                <div className="relative">
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={`w-full h-9 pl-3 pr-8 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none appearance-none cursor-pointer shadow-sm`}
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
                  <span className="absolute right-2 top-1.5 text-outline pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Administrative Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as User["role"])}
                    className={`w-full h-9 pl-3 pr-8 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none appearance-none cursor-pointer shadow-sm`}
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
                  <span className="absolute right-1 top-1 text-outline pointer-events-none">
                    <Award className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full h-9 pl-3 pr-3 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <label className="block text-xs font-semibold text-primary">
                    Security Credential
                  </label>
                  <a
                    href="/reset-password"
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 pl-3 pr-3 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-xs transition-all font-medium outline-none shadow-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 border border-primary/20"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {role && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-black text-xs">
                    {roleNames[role as User["role"]].charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{email}</p>
                    <p className="text-[10px] text-on-tertiary-container font-bold uppercase tracking-wider">
                      {roleNames[role as User["role"]]}
                    </p>
                  </div>
                </div>
              )}
              <Alert variant="warning" icon="security">
                A 6-digit verification code has been sent to your registered
                email and authenticator app.
              </Alert>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full h-9 bg-surface-container-low/80 backdrop-blur-sm border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-on-surface rounded-t text-sm text-center tracking-[0.2em] font-bold transition-all outline-none shadow-sm"
                />
              </div>
              <button
                onClick={handleMFA}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 text-on-primary rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 border border-primary/20"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-xs">
                    progress_activity
                  </span>
                ) : (
                  <>
                    Verify &amp; Sign In{" "}
                    <span className="material-symbols-outlined text-xs">
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
                className="w-full h-8 text-primary font-semibold text-xs hover:bg-surface-container-low rounded-lg transition-colors"
              >
                ← Back to login
              </button>
            </div>
          )}

          <footer className="pt-6 flex flex-col items-center gap-3">
            <p className="text-on-surface-variant text-xs">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary font-bold hover:underline"
              >
                Create one
              </a>
            </p>
          </footer>
        </FormCard>
      </main>

      <div className="fixed bottom-8 right-8 pointer-events-none hidden lg:block opacity-5">
        <Building2 className="w-48 h-48 text-primary" />
      </div>
    </div>
  );
}
