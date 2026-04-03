import React from 'react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export default function Header({ title, showSearch = true, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:ml-72 bg-white/70 backdrop-blur-xl border-b border-outline/10 flex items-center justify-between px-6 z-40">
      {/* Left: Search */}
      {showSearch && (
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Help Button */}
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Notifications */}
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 ml-4">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">Admin User</p>
            <p className="text-xs text-on-surface-variant">System Admin</p>
          </div>
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=admin"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
