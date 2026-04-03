interface NavItem {
  icon: string;
  label: string;
  id: string;
}

interface SidebarProps {
  activeNav?: string;
  onNavClick?: (id: string) => void;
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", id: "dashboard" },
  { icon: "people", label: "Students", id: "students" },
  { icon: "school", label: "Programs", id: "programs" },
  { icon: "group_work", label: "Courses", id: "courses" },
  { icon: "analytics", label: "Analytics", id: "analytics" },
  { icon: "description", label: "Reports", id: "reports" },
  { icon: "gavel", label: "Governance", id: "governance" },
  { icon: "settings", label: "Settings", id: "settings" },
];

export default function Sidebar({
  activeNav = "dashboard",
  onNavClick,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/20 z-50">
      {/* Branding */}
      <div className="p-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary uppercase tracking-tight">
              Academic Curator
            </h1>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">
          System Administration
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick?.(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 w-full text-left ${
                isActive
                  ? "bg-white shadow-sm text-primary font-bold"
                  : "text-on-surface-variant hover:bg-white/50 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info Bottom */}
      <div className="mt-auto pt-6 px-6 pb-6 border-t border-outline-variant/20">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">
              Admin User
            </p>
            <p className="text-xs text-on-surface-variant">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
