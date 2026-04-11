import { useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Library,
  BarChart3,
  Brain,
  Cloud,
  Database,
  CheckCircle2,
  TrendingUp,
  Award,
  Check,
  Lock,
  Gavel,
  UserSearch,
  Bell,
  User as UserIcon,
  SettingsIcon,
  X,
  LogOut,
  UserPlus,
  GitBranch,
  Zap,
  Plus,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  iconName: string;
  label: string;
  id: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  activeNav?: string;
  onNavClick?: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// Icon mapping from name to Lucide component
const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    dashboard_customize: LayoutDashboard,
    people: Users,
    school: BookOpen,
    library_books: Library,
    analytics: BarChart3,
    psychology: Brain,
    cloud_sync: Cloud,
    data_usage: Database,
    verified_user: CheckCircle2,
    timeline: TrendingUp,
    badge: Award,
    data_check: Check,
    security: Lock,
    gavel: Gavel,
    person_search: UserSearch,
    notifications: Bell,
    person: UserIcon,
    lock: Lock,
    settings: SettingsIcon,
    close: X,
    logout: LogOut,
    person_add: UserPlus,
    dataset: Database,
    account_tree: GitBranch,
    rule: Zap,
    add: Plus,
    check_circle: CheckCircle2,
    error: XCircle,
  };
  return iconMap[iconName] || LayoutDashboard;
};

// Grouped nav for admin
const adminSections: NavSection[] = [
  {
    label: "",
    items: [
      { iconName: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    ],
  },
  {
    label: "ACADEMICS",
    items: [
      { iconName: "people", label: "Students", id: "students" },
      { iconName: "school", label: "Programs", id: "programs" },
      { iconName: "library_books", label: "Courses", id: "courses" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { iconName: "analytics", label: "Analytics", id: "analytics" },
      {
        iconName: "psychology",
        label: "Success Prediction",
        id: "success-prediction",
      },
    ],
  },
  {
    label: "DATA PLATFORM",
    items: [
      { iconName: "cloud_sync", label: "Data Sources", id: "data-sources" },
      { iconName: "data_usage", label: "Data Mapping", id: "data-mapping" },
      { iconName: "verified_user", label: "Data Quality", id: "data-quality" },
      { iconName: "timeline", label: "Pipeline", id: "pipeline" },
    ],
  },
  {
    label: "GOVERNANCE",
    items: [
      { iconName: "badge", label: "Accreditation", id: "accreditation" },
      {
        iconName: "data_check",
        label: "Data Governance",
        id: "data-governance",
      },
      {
        iconName: "security",
        label: "Security & Access",
        id: "security-access",
      },
      { iconName: "gavel", label: "Governance", id: "governance" },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { iconName: "person_search", label: "User Management", id: "users" },
    ],
  },
];

// Flat sections for other roles
function wrapFlat(items: NavItem[]): NavSection[] {
  return [{ label: "", items }];
}

const sectionsByRole: Record<UserRole, NavSection[]> = {
  academic_admin: adminSections,
  qa_officer: wrapFlat([
    { iconName: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    {
      iconName: "psychology",
      label: "Success Prediction",
      id: "success-prediction",
    },
    { iconName: "verified_user", label: "Accreditation", id: "accreditation" },
    { iconName: "analytics", label: "Data Quality", id: "data-quality" },
    { iconName: "data_usage", label: "Data Mapping", id: "data-mapping" },
    { iconName: "timeline", label: "Pipeline", id: "pipeline" },
    { iconName: "data_check", label: "Data Governance", id: "data-governance" },
    { iconName: "school", label: "Programs", id: "programs" },
  ]),
  data_analyst: wrapFlat([
    { iconName: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    {
      iconName: "psychology",
      label: "Success Prediction",
      id: "success-prediction",
    },
    { iconName: "analytics", label: "Analytics", id: "analytics" },
    { iconName: "people", label: "Students", id: "students" },
    { iconName: "school", label: "Programs", id: "programs" },
  ]),
  department_head: wrapFlat([
    { iconName: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { iconName: "people", label: "Students", id: "students" },
    { iconName: "library_books", label: "Courses", id: "courses" },
    { iconName: "school", label: "Programs", id: "programs" },
    {
      iconName: "psychology",
      label: "Success Prediction",
      id: "success-prediction",
    },
    { iconName: "analytics", label: "Faculty Analytics", id: "analytics" },
  ]),
  system_admin: wrapFlat([
    { iconName: "dashboard_customize", label: "Dashboard", id: "dashboard" },
    { iconName: "lock", label: "Security", id: "security" },
    { iconName: "settings", label: "System Settings", id: "settings" },
    { iconName: "people", label: "User Management", id: "users" },
    { iconName: "data_usage", label: "Data Mapping", id: "data-mapping" },
  ]),
};

// Bottom nav items (always shown)
const bottomItems: NavItem[] = [
  { iconName: "lock", label: "Security", id: "security" },
];

const roleLabels: Record<UserRole, string> = {
  academic_admin: "Academic Administration",
  qa_officer: "Quality Assurance",
  data_analyst: "Data Analytics",
  department_head: "Department Head",
  system_admin: "System Administration",
};

export default function Sidebar({
  onNavClick,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const { state, logout } = useAuth();
  const location = useLocation();
  const user = state.user;
  const role = user?.role ?? "system_admin";
  const sections = sectionsByRole[role];

  // Determine active nav based on current location
  const getCurrentActiveNav = () => {
    const path = location.pathname.replace(/^\//, ""); // Remove leading slash
    if (!path || path === "dashboard") return "dashboard";
    return path;
  };

  const currentActiveNav = getCurrentActiveNav();

  const renderNavItem = (item: NavItem) => {
    const isActive = currentActiveNav === item.id;
    const IconComponent = getIconComponent(item.iconName);
    return (
      <button
        key={item.id}
        onClick={() => {
          onNavClick?.(item.id);
          onClose?.();
        }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left text-sm ${
          isActive
            ? "bg-primary-container/40 text-on-primary font-bold border-l-[3px] border-primary"
            : "text-on-primary/60 hover:text-on-primary/90 hover:bg-primary-container/20 border-l-[3px] border-transparent"
        }`}
      >
        <IconComponent className="w-5 h-5" strokeWidth={2} />
        <span className="tracking-tight">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary z-50 flex flex-col transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile Close */}
        <button
          onClick={onClose}
          className="md:hidden absolute right-4 top-6 text-on-primary/40 hover:text-on-primary transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Branding */}
        <div className="px-6 pt-7 pb-6 border-b border-on-primary/10">
          <div className="text-base font-black text-on-primary uppercase tracking-wider">
            Academic Curator
          </div>
          <div className="text-[9px] font-bold text-on-primary/50 uppercase tracking-[0.2em] mt-1">
            {roleLabels[role]}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-4 overflow-y-auto scrollbar-thin">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? "mt-4" : ""}>
              {section.label && (
                <span className="text-[9px] font-bold text-on-primary/40 uppercase tracking-[0.2em] px-4 mb-2 block">
                  {section.label}
                </span>
              )}
              <div className="space-y-0.5">
                {section.items.map(renderNavItem)}
              </div>
            </div>
          ))}

          {/* Divider before bottom items */}
          <div className="mt-auto pt-4 border-t border-on-primary/10 space-y-0.5">
            {bottomItems.map(renderNavItem)}
          </div>
        </nav>

        {/* Support & Logout */}
        <div className="px-3 py-2 space-y-0.5 border-t border-on-primary/10">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left text-on-primary/60 hover:text-error hover:bg-error/10 transition-all duration-200 text-sm border-l-[3px] border-transparent"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="tracking-tight">Sign Out</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 pb-5 pt-3 border-t border-on-primary/10">
          <div className="flex items-center gap-3 p-3 bg-primary-container/20 rounded-xl">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.id ?? "user"}`}
              alt={user?.fullName ?? "User"}
              className="w-9 h-9 rounded-full flex-shrink-0 ring-2 ring-on-primary/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-primary truncate">
                {user?.fullName ?? "Guest User"}
              </p>
              <p className="text-[9px] text-on-primary/60 font-bold uppercase tracking-widest">
                {roleLabels[role]}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
