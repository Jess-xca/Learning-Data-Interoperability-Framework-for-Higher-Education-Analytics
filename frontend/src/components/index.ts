// Layout
export * from "./layout";
export { Sidebar, Header, MainContent } from "./layout";

// Forms
export * from "./forms";
export { Button, TextInput, SelectInput } from "./forms";

// Common
export * from "./common";
export { Card, Badge, Alert } from "./common";

// Dashboard
export * from "./dashboard";
export { MetricCard, ChartCard, Table } from "./dashboard";
export type { TableColumn } from "./dashboard";

// Pages
export { InteroperabilityPage } from "./pages/InteroperabilityPage";
export { default as DataSourcesPage } from "./pages/DataSourcesPage";
export { ETLPipelinePage } from "./pages/ETLPipelinePage";

// Analytics Components (Phase 6)
export { PerformanceTrendChart } from "./analytics/PerformanceTrendChart";
export { PredictiveInsights } from "./analytics/PredictiveInsights";
export { InterventionTracker } from "./analytics/InterventionTracker";
export { CohortComparison } from "./analytics/CohortComparison";
export { EarlyWarningIndicators } from "./analytics/EarlyWarningIndicators";

// Wizards & Dialogs
export { default as DataSourceWizard } from "./DataSourceWizard";
