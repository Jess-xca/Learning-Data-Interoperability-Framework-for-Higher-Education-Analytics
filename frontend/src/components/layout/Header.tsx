import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";

interface HeaderProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
}

const roleBadge: Record<string, string> = {
  academic_admin: "Academic Admin",
  qa_officer: "QA Officer",
  data_analyst: "Data Analyst",
  department_head: "Dept. Head",
  system_admin: "System Admin",
};

export default function Header({
  showSearch = true,
  onSearch,
  onMenuClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:ml-64 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm flex items-center gap-4 px-4 md:px-8 z-40 transition-all">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-slate-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100"
      >
        <Menu className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Global Search */}
      {showSearch && (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search system modules..."
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-sky-200 focus:border-sky-300 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="text-slate-400 hover:text-primary transition-colors p-2 rounded-xl hover:bg-slate-50 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
          <button
            onClick={() => navigate("/support")}
            aria-label="Help & Support"
            className="text-slate-400 hover:text-primary transition-colors p-2 rounded-xl hover:bg-slate-50"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700 leading-tight">
              {user?.fullName ?? "System Admin"}
            </p>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
              {roleBadge[user?.role ?? "system_admin"]}
            </p>
          </div>
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.id ?? "admin"}`}
            alt={user?.fullName ?? "User"}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
          />
        </div>
      </div>
    </header>
  );
}
