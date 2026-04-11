import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, state } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    role: "data_analyst" as UserRole,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: "academic_admin",
      label: "Academic Administrator",
      description: "Manage academic operations and institutions",
    },
    {
      value: "qa_officer",
      label: "QA Officer",
      description: "Quality assurance and compliance oversight",
    },
    {
      value: "data_analyst",
      label: "Data Analyst",
      description: "Analyze and report on institutional data",
    },
    {
      value: "department_head",
      label: "Department Head",
      description: "Manage departmental operations",
    },
    {
      value: "system_admin",
      label: "System Administrator",
      description: "System configuration and management",
    },
  ];

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      alert(
        "Password is too weak. Use at least 12 characters with uppercase, lowercase, numbers, and symbols.",
      );
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      console.error("Registration failed");
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-slate-200";
    if (passwordStrength <= 2) return "bg-error";
    if (passwordStrength <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary mb-4">
            <span className="material-symbols-outlined text-white text-3xl">
              school
            </span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-primary">
            Create Account
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Join the Academic Curator Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm space-y-6">
          {/* Error Message */}
          {state.error && (
            <div className="p-4 bg-error-container rounded-lg border border-error/30">
              <p className="text-sm font-medium text-error">{state.error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  disabled={state.isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@university.edu"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  disabled={state.isLoading}
                />
              </div>
            </div>

            {/* Institution & Department Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                  Institution *
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  placeholder="University Name"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  disabled={state.isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Computer Science"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={state.isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={state.isLoading}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-3 uppercase tracking-widest">
                Select Your Role *
              </label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-start gap-3 p-3 rounded-lg border-2 border-outline-variant/20 cursor-pointer hover:bg-surface-container-low transition-all"
                    style={{
                      borderColor:
                        formData.role === r.value
                          ? "var(--primary)"
                          : undefined,
                      backgroundColor:
                        formData.role === r.value
                          ? "var(--surface-container-low)"
                          : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={formData.role === r.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="mt-1"
                      disabled={state.isLoading}
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {r.label}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {r.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                disabled={state.isLoading}
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor() : "bg-slate-200"}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {passwordStrength === 0 && "Very weak"}
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                    {passwordStrength === 5 && "Very strong"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                disabled={state.isLoading}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-error mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state.isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    person_add
                  </span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:text-primary-container font-semibold transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
