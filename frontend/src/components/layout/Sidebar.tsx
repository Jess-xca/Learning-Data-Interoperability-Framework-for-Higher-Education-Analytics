import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../store/slices/authSlice";
import type { User } from "../../store/slices/authSlice";

interface NavItem {
  icon: string;
  label: string;
  id: string;
}

interface SidebarProps {
  activeNav?: string;
  onNavClick?: (id: string) => void;
}

// Role-specific nav configurations
const navByRole: Record<User["role"], NavItem[]> = {
  admin: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "people", label: "Students", id: "students" },
    { icon: "school", label: "Programs", id: "programs" },
    { icon: "library_books", label: "Courses", id: "courses" },
    { icon: "analytics", label: "Analytics", id: "analytics" },
    { icon: "description", label: "Reports", id: "reports" },
    { icon: "person_search", label: "User Management", id: "users" },
    { icon: "cloud_sync", label: "Data Sources", id: "data-sources" },
    { icon: "data_usage", label: "Data Mapping", id: "data-mapping" },
    { icon: "verified_user", label: "Data Quality", id: "data-quality" },
    { icon: "timeline", label: "Pipeline", id: "pipeline" },
    { icon: "badge", label: "Accreditation", id: "accreditation" },
    { icon: "description", label: "Institutional Reporting", id: "institutional-reporting" },
    { icon: "gavel", label: "Governance", id: "governance" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
  qa: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "verified_user", label: "Accreditation", id: "accreditation" },
    { icon: "analytics", label: "Data Quality", id: "data-quality" },
    { icon: "data_usage", label: "Data Mapping", id: "data-mapping" },
    { icon: "timeline", label: "Pipeline", id: "pipeline" },
    { icon: "description", label: "Reports", id: "reports" },
    { icon: "description", label: "Institutional Reporting", id: "institutional-reporting" },
    { icon: "school", label: "Programs", id: "programs" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
  analyst: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "analytics", label: "Analytics", id: "analytics" },
    { icon: "description", label: "Reports", id: "reports" },
    { icon: "people", label: "Students", id: "students" },
    { icon: "school", label: "Programs", id: "programs" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
  hod: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "people", label: "Students", id: "students" },
    { icon: "library_books", label: "Courses", id: "courses" },
    { icon: "school", label: "Programs", id: "programs" },
    { icon: "analytics", label: "Faculty Analytics", id: "analytics" },
    { icon: "account_balance_wallet", label: "Budget", id: "reports" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
  lecturer: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "library_books", label: "My Courses", id: "courses" },
    { icon: "people", label: "My Students", id: "students" },
    { icon: "analytics", label: "Performance", id: "analytics" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
  student: [
    { icon: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { icon: "library_books", label: "My Courses", id: "courses" },
    { icon: "analytics", label: "My Progress", id: "analytics" },
    { icon: "settings", label: "Settings", id: "settings" },
  ],
};

const roleLabels: Record<User["role"], string> = {
  admin: "System Administration",
  qa: "Quality Assurance",
  analyst: "Data Analytics",
  hod: "Department Head",
  lecturer: "Lecturer Portal",
  student: "Student Portal",
};

const roleBadge: Record<User["role"], string> = {
  admin: "Superuser",
  qa: "QA Officer",
  analyst: "Analyst",
  hod: "Dept. Head",
  lecturer: "Lecturer",
  student: "Student",
};

export default function Sidebar({
  activeNav = "dashboard",
  onNavClick,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role ?? "admin") as keyof typeof navByRole;
  const navItems = navByRole[role];

  return (
    <aside className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-surface-container-low z-50">
      {/* Branding */}
      <div className="px-6 pt-7 pb-8">
        <div className="text-base font-black text-primary uppercase tracking-wider mb-0.5">
          Academic Curator
        </div>
        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          {roleLabels[role]}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={`${item.id}-${item.label}`}
              onClick={() => onNavClick?.(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
                isActive
                  ? "bg-surface-container-lowest shadow-sm text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest/60"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Support & Logout */}
      <div className="px-3 pb-2 space-y-0.5">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest/60 transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">
            contact_support
          </span>
          <span className="text-sm font-medium tracking-tight">Support</span>
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium tracking-tight">Sign Out</span>
        </button>
      </div>

      {/* User profile */}
      <div className="mt-2 pt-4 px-5 pb-6 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.id ?? "admin"}`}
            alt={user?.name ?? "User"}
            className="w-9 h-9 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">
              {user?.name ?? "Admin User"}
            </p>
            <p className="text-[10px] text-on-tertiary-container font-bold uppercase tracking-widest">
              {roleBadge[role]}
            </p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            more_vert
          </span>
        </div>
      </div>
    </aside>
  );
}
