import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";

interface HeaderProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

const roleBadge: Record<string, string> = {
  admin: "Superuser",
  qa: "QA Officer",
  analyst: "Analyst",
  hod: "Dept. Head",
  lecturer: "Lecturer",
  student: "Student",
};

export default function Header({ showSearch = true, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const user = useAppSelector((state) => state.auth.user);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:ml-72 bg-white/70 backdrop-blur-xl border-b border-slate-100/10 shadow-sm flex items-center justify-between px-8 z-40">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search system modules..."
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3 border-r border-slate-200 pr-5">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-low relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-low">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-primary leading-tight">{user?.name ?? "Admin User"}</p>
            <p className="text-[10px] text-on-tertiary-container font-bold bg-tertiary-container/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {roleBadge[user?.role ?? "admin"]}
            </p>
          </div>
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.id ?? "admin"}`}
            alt={user?.name ?? "User"}
            className="w-9 h-9 rounded-full object-cover border border-outline-variant/30"
          />
        </div>
      </div>
    </header>
  );
}
