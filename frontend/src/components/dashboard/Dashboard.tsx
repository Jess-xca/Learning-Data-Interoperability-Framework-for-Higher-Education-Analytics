import type { ReactNode } from "react";

/**
 * Reusable Dashboard Component
 * Can be used on any page (/students, /programs, etc.)
 * Adapts based on context and props
 */

interface DashboardProps {
  title: string;
  description?: string;
  kpiCards?: KPICardData[];
  modules?: ModuleData[];
  pipelines?: PipelineData[];
  sections?: DashboardSection[];
  showNetworkSection?: boolean;
  showQuickActions?: boolean;
  quickActions?: QuickActionData[];
  children?: ReactNode;
  className?: string;
}

interface KPICardData {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
  status: string;
  accentColor: "primary" | "secondary" | "tertiary" | "error";
}

interface ModuleData {
  name: string;
  icon: string;
  status: "STABLE" | "ACTIVE" | "SYNCING" | "TRAINING" | "IDLE" | "UPDATING" | "PROTECTED";
  color: string;
}

interface PipelineData {
  name: string;
  desc: string;
  status: "LIVE" | "QUEUED" | "IDLE" | "FAILED" | "SUCCESS" | "PROCESSING";
  color: string;
}

interface DashboardSection {
  title: string;
  content: ReactNode;
  columnSpan?: "full" | "half" | "third";
}

interface QuickActionData {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function Dashboard({
  title,
  description,
  kpiCards = [],
  modules = [],
  pipelines = [],
  sections = [],
  showNetworkSection = true,
  showQuickActions = true,
  quickActions = [],
  children,
  className = "",
}: DashboardProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent tracking-tight mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed font-medium">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ── KPI Metrics ── */}
      {kpiCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpiCards.map((card, idx) => (
            <KPICard key={idx} {...card} />
          ))}
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Modules Section */}
        {modules.length > 0 && (
          <div className="col-span-12 lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                Ecosystem Modules
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-tertiary/20 to-secondary/20 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-tertiary border border-tertiary/40">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                All Systems Operational
              </span>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-sm rounded-lg border border-secondary/20 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modules.map((mod) => (
                  <ModuleCard key={mod.name} module={mod} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pipelines Section */}
        {pipelines.length > 0 && (
          <div className={`${modules.length > 0 ? "col-span-12 lg:col-span-4" : "col-span-12"} space-y-5`}>
            <div className="bg-surface-container rounded-lg border border-outline-variant overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-on-surface uppercase tracking-[0.15em]">
                    Active Data Pipelines
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-widest text-error bg-error/15 px-2 py-1 rounded-full border border-error/30">
                    Real Time
                  </span>
                </div>
              </div>
              <div className="divide-y divide-outline-variant/30 max-h-72 overflow-y-auto">
                {pipelines.map((pipe, idx) => (
                  <div key={idx} className="px-5 py-4 hover:bg-primary/3 transition-colors border-l-4" style={{ borderColor: pipe.color }}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-sm font-bold text-on-surface">{pipe.name}</p>
                      <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap" 
                        style={{ color: pipe.color, backgroundColor: `${pipe.color}15` }}>
                        {pipe.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{pipe.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-outline-variant/30 bg-surface-container-lowest text-center">
                <button className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                  Manage All Pipelines
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Custom Sections ── */}
      {sections.length > 0 && (
        <div className="grid grid-cols-12 gap-6 mb-10">
          {sections.map((section, idx) => {
            const colSpanMap = {
              full: "col-span-12",
              half: "col-span-12 lg:col-span-6",
              third: "col-span-12 lg:col-span-4",
            };
            return (
              <div key={idx} className={colSpanMap[section.columnSpan || "half"]}>
                <div className="bg-surface-container rounded-lg border border-outline-variant p-5">
                  <h3 className="text-lg font-black text-on-surface mb-4 tracking-tight">
                    {section.title}
                  </h3>
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Network Section ── */}
      {showNetworkSection && (
        <div className="bg-gradient-to-r from-primary via-secondary-container to-tertiary rounded-lg overflow-hidden relative mb-8 shadow-lg">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #adc7f7 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00b47d 0%, transparent 50%)" }} />
          <div className="relative z-10 p-6 md:p-8 grid grid-cols-12 gap-6 md:gap-8 min-h-[220px]">
            <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
              <h2 className="text-2xl font-black text-white tracking-tight mb-3 drop-shadow-md">
                Institutional Network
              </h2>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-5 max-w-md drop-shadow-sm">
                Visualizing connectivity across 4 campus nodes and 12 remote data centers. All regions reporting optimal latency.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "North Campus", status: "Active", color: "#00b47d" },
                  { label: "Cloud Mirror", status: "Synced", color: "#ff9500" },
                  { label: "Europe Node", status: "Stable", color: "#00b47d" },
                ].map((node) => (
                  <span
                    key={node.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-[9px] font-bold text-white border border-white/20 backdrop-blur-sm"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    {node.label}: {node.status}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 hidden md:flex items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center opacity-30">
                <div className="absolute w-20 h-20 rounded-full border border-white/30 animate-pulse" />
                <div className="absolute w-32 h-32 rounded-full border border-white/15" />
                <span className="material-symbols-outlined text-5xl text-white/40">hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      {showQuickActions && quickActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, idx) => (
            <QuickActionCard key={idx} {...action} />
          ))}
        </div>
      )}

      {/* ── Custom Children ── */}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function KPICard({
  label,
  value,
  suffix,
  icon,
  status,
  accentColor,
}: KPICardData) {
  const accentMap = {
    primary: { 
      border: "border-primary", 
      bg: "bg-gradient-to-br from-primary/15 to-primary/5", 
      text: "text-primary",
      icon: "bg-primary/20"
    },
    secondary: { 
      border: "border-secondary", 
      bg: "bg-gradient-to-br from-secondary/15 to-secondary/5", 
      text: "text-secondary",
      icon: "bg-secondary/20"
    },
    tertiary: { 
      border: "border-tertiary", 
      bg: "bg-gradient-to-br from-tertiary/15 to-tertiary/5", 
      text: "text-tertiary",
      icon: "bg-tertiary/20"
    },
    error: { 
      border: "border-error", 
      bg: "bg-gradient-to-br from-error/15 to-error/5", 
      text: "text-error",
      icon: "bg-error/20"
    },
  };

  const colors = accentMap[accentColor];

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} rounded-lg p-5 hover:shadow-lg hover:-translate-y-1 transition-all group backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.12em]">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.icon} ${colors.text} group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
      </div>
      <p className={`text-3xl font-black ${colors.text} tracking-tight mb-1`}>
        {value}{suffix && <span className="text-lg font-bold">{suffix}</span>}
      </p>
      <p className="text-xs font-medium text-on-surface-variant leading-snug">
        {status}
      </p>
    </div>
  );
}

function ModuleCard({ module }: { module: ModuleData }) {
  return (
    <div className="bg-surface-container-low/60 backdrop-blur-sm rounded-lg border-2 hover:border-2 transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-0.5" style={{ borderColor: `${module.color}40`, backgroundColor: `${module.color}06` }}>
      <div className="flex items-start gap-3 p-4">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${module.color}20` }}>
          <span className="material-symbols-outlined text-lg" style={{ color: module.color }}>
            {module.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
            {module.name}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: module.color }} />
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
              {module.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionData) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-secondary-container/20 to-tertiary-container/20 border-2 border-secondary/30 rounded-lg p-5 hover:shadow-lg hover:-translate-y-1 hover:border-secondary/50 transition-all text-left group backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform shadow-sm">
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <h3 className="font-black text-xs text-on-surface mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-on-surface-variant font-medium">{description}</p>
    </button>
  );
}

// ============================================================================
// EXPORT INDIVIDUAL COMPONENTS FOR FLEXIBILITY
// ============================================================================
export { KPICard, ModuleCard, QuickActionCard };
export type { DashboardProps, KPICardData, ModuleData, PipelineData, DashboardSection, QuickActionData };
