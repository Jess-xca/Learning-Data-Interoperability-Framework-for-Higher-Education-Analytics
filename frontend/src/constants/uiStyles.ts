/**
 * Centralized UI styling constants for consistent Material Design 3 implementation
 * These constants define reusable styling patterns across all components
 */

// ============================================================================
// COMMON SPACING & DIMENSIONS
// ============================================================================

export const SPACING = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
  "2xl": "gap-8",
} as const;

export const PADDING = {
  xs: "p-2",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
} as const;

export const HEIGHT = {
  button: "h-12",
  largeButton: "h-14",
  field: "h-12",
  icon: "h-6 w-6",
  largeIcon: "h-8 w-8",
} as const;

export const RADIUS = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const;

// ============================================================================
// FORM FIELDS & INPUTS
// ============================================================================

export const FORM_FIELD = {
  base: `w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 
    border-outline-variant focus:border-secondary focus:ring-0 text-on-surface 
    rounded-t-lg transition-all font-medium outline-none`,

  label: "block text-sm font-semibold text-secondary",
  helperText: "text-xs text-on-surface-variant mt-1",
  errorText: "text-xs text-error mt-1",

  required: "text-error after:content-['*'] ml-0.5",

  // For code/verification inputs
  codeInput: "text-center text-2xl tracking-[0.5em] font-bold font-mono",

  // For select/dropdown
  selectContainer: "relative",
  selectDownIcon:
    "material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-xl",
} as const;

// ============================================================================
// BUTTONS
// ============================================================================

export const BUTTON = {
  // Primary action button (secondary colored for auth flows)
  primary: `h-12 bg-secondary text-on-secondary rounded-xl font-bold 
    hover:opacity-90 transition-all disabled:opacity-60 
    shadow-lg shadow-secondary/20`,

  // Secondary/tertiary action button
  secondary:
    "text-sm text-secondary font-semibold hover:underline transition-colors",

  // Link button for navigation
  link: "text-secondary hover:underline transition-colors",

  // Icon button
  icon: "h-10 w-10 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center",

  // Loading state
  loadingIcon: "material-symbols-outlined animate-spin",
} as const;

// ============================================================================
// PANELS & CONTAINERS
// ============================================================================

export const CONTAINER = {
  // Main form panel (centered card)
  formPanel: `w-full max-w-md bg-surface-container-lowest rounded-xl p-8 shadow-glass`,

  // Branding/feature panel (usually on left side of split layout)
  brandingPanel: `col-span-5 hidden md:flex flex-col gap-8 p-8 bg-secondary-container rounded-xl h-full justify-between`,
  brandingElement: `flex items-start gap-4`,
  brandingIcon: `w-12 h-12 rounded-full bg-on-secondary-container/10 flex items-center justify-center flex-shrink-0`,
  brandingTitle: `text-lg font-semibold text-on-secondary-container`,
  brandingSubtitle: `text-sm text-on-secondary-container/70`,

  // Split layout (form + branding)
  splitLayout: `grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-6xl`,

  // Alert/notification container
  alertBox: `p-4 rounded-lg border-l-4`,
  alertError: `bg-error/10 border-error text-error`,
  alertSuccess: `bg-secondary/10 border-secondary text-secondary`,
  alertInfo: `bg-tertiary/10 border-tertiary text-tertiary`,
  alertWarning: `bg-warning/10 border-warning text-warning`,
} as const;

// ============================================================================
// TYPOGRAPHY & TEXT
// ============================================================================

export const TEXT = {
  // Headings
  h1: "text-3xl font-bold text-on-surface",
  h2: "text-2xl font-bold text-secondary",
  h3: "text-xl font-bold text-on-surface",

  // Body text
  body: "text-base text-on-surface",
  bodySmall: "text-sm text-on-surface-variant",
  bodyTiny: "text-xs text-on-surface-variant",

  // Labels
  label: "text-sm font-semibold text-secondary",
  labelSmall: "text-xs font-semibold text-on-surface-variant",

  // Links
  link: "text-secondary underline hover:opacity-80 transition-opacity",
  linkDecoration: "text-secondary hover:underline transition-colors",
} as const;

// ============================================================================
// BACKGROUNDS & GRADIENTS
// ============================================================================

export const BACKGROUND = {
  // Top gradient bar (common in auth pages)
  topGradient: `fixed top-0 left-0 w-full h-1 bg-gradient-to-r 
    from-secondary via-on-tertiary-container to-secondary z-50`,

  // Page background
  page: "min-h-screen bg-surface",

  // Surface containers
  surface: "bg-surface-container-lowest",
  surfaceHigh: "bg-surface-container-high",
  surfaceHighest: "bg-surface-container-highest",

  // Colored surfaces
  secondary: "bg-secondary-container",
  tertiary: "bg-tertiary-container",
  error: "bg-error/10",
} as const;

// ============================================================================
// INTERACTIVE STATES
// ============================================================================

export const INTERACTIVE = {
  // Focus state
  focus:
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary",

  // Hover state
  hover: "hover:opacity-90 transition-opacity",

  // Disabled state
  disabled: "disabled:opacity-60 disabled:cursor-not-allowed",

  // Active/selected state
  active: "border-b-2 border-secondary",
} as const;

// ============================================================================
// LAYOUT PATTERNS
// ============================================================================

export const LAYOUT = {
  // Centered main content
  center: "flex items-center justify-center min-h-screen",

  // Vertical stack with spacing
  stack: "space-y-5",
  stackCompact: "space-y-3",
  stackLarge: "space-y-8",

  // Horizontal row with spacing
  row: "flex gap-4 items-center",
  rowResponsive: "flex flex-col md:flex-row gap-4 items-start md:items-center",

  // Grid
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-4",
  grid3: "grid grid-cols-1 md:grid-cols-3 gap-4",
} as const;

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================

export const SHADOW = {
  // Glass morphism effect
  glass: "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur",

  // Elevation shadows
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",

  // Colored shadows
  secondary: "shadow-secondary/20",
  error: "shadow-error/20",
  tertiary: "shadow-tertiary/20",
} as const;

// ============================================================================
// AUTH PAGE SPECIFIC PATTERNS
// ============================================================================

export const AUTH_PATTERN = {
  // Header with icon and title
  header: {
    container: "flex items-center gap-3 mb-8",
    icon: "material-symbols-outlined text-secondary text-3xl",
    content: "flex flex-col",
    title: "text-2xl font-bold text-secondary",
    subtitle: "text-sm text-on-surface-variant",
  },

  // Step indicator display
  stepIndicator: "text-sm text-on-surface-variant font-semibold",

  // Error message box
  error: "mb-6",

  // Form section spacing
  formSection: "space-y-5",

  // Back link styling
  backLink:
    "block text-center text-sm text-secondary font-semibold hover:underline",

  // Success state
  successIcon: "material-symbols-outlined text-5xl text-secondary",
  successHeading: "text-xl font-bold text-secondary text-center mb-4",
} as const;

// ============================================================================
// ICON PATTERNS
// ============================================================================

export const ICON = {
  // Standard icon sizes
  sm: "material-symbols-outlined text-xl",
  md: "material-symbols-outlined text-2xl",
  lg: "material-symbols-outlined text-3xl",
  xl: "material-symbols-outlined text-4xl",

  // Icon colors
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  error: "text-error",
  onSurface: "text-on-surface",

  // Animated icon
  spin: "material-symbols-outlined animate-spin",
  pulse: "material-symbols-outlined animate-pulse",
} as const;

// ============================================================================
// BREAKPOINTS (for responsive design reference)
// ============================================================================

export const BREAKPOINTS = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// ============================================================================
// ANIMATION & TRANSITION
// ============================================================================

export const ANIMATION = {
  default: "transition-all",
  fast: "transition-all duration-150",
  slow: "transition-all duration-500",

  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
} as const;

export default {
  SPACING,
  PADDING,
  HEIGHT,
  RADIUS,
  FORM_FIELD,
  BUTTON,
  CONTAINER,
  TEXT,
  BACKGROUND,
  INTERACTIVE,
  LAYOUT,
  SHADOW,
  AUTH_PATTERN,
  ICON,
  BREAKPOINTS,
  ANIMATION,
};
