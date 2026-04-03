# Design System & Reference Guide

Based on Material Design 3 color system with institutional branding customizations.

## Color System (Material Design 3)

### Primary (Academic Navy)

- **primary**: `#002045` - Main brand color, headers, CTAs
- **on-primary**: `#ffffff` - Text on primary background
- **primary-container**: `#1a365d` - Light primary background
- **on-primary-container**: `#86a0cd` - Text on primary container

### Secondary (Academic Blue)

- **secondary**: `#545f72` - Secondary actions, supporting elements
- **on-secondary**: `#ffffff` - Text on secondary
- **secondary-container**: `#d5e0f7` - Light secondary background
- **on-secondary-container**: `#586377` - Text on secondary container

### Tertiary (Success Green)

- **tertiary**: `#002617` - Accent for positive indicators
- **on-tertiary**: `#ffffff` - Text on tertiary
- **tertiary-container**: `#003e28` - Light tertiary background
- **on-tertiary-container**: `#00b47d` - Text on tertiary container
- **tertiary-fixed**: `#6ffbbe` - Light success accent

### Surface (Backgrounds)

- **surface**: `#f9f9ff` - Main background
- **on-surface**: `#111c2c` - Primary text color
- **surface-bright**: `#f9f9ff` - Brightest surface
- **surface-dim**: `#cfdaf1` - Dimmed surface
- **surface-container-lowest**: `#ffffff` - Card backgrounds
- **surface-container-low**: `#f0f3ff` - Subtle backgrounds
- **surface-container**: `#e7eeff` - Container backgrounds
- **surface-container-high**: `#dee8ff` - Elevated containers
- **surface-container-highest**: `#d8e3fa` - Top-level containers

### Supporting Colors

- **error**: `#ba1a1a` - Error/warning states
- **on-error**: `#ffffff` - Text on error
- **error-container**: `#ffdad6` - Light error background
- **outline**: `#74777f` - Borders and dividers
- **outline-variant**: `#c4c6cf` - Subtle borders
- **on-surface-variant**: `#43474e` - Secondary text
- **inverse-surface**: `#263142` - Dark mode backgrounds

---

## Typography

- **Font Family**: `Inter` (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Font Styles

- **headline** (h1, h2, h3): `Inter` bold/extrabold (24-32px)
- **body** (p, text): `Inter` regular/medium (14-16px)
- **label** (buttons, labels): `Inter` medium/bold (12-14px)

### Heading Sizes (Reference Implementation)

- **h1 (Page Title)**: 24-32px, bold, tracking-tight (letter-spacing: -0.5px)
- **h2 (Section Title)**: 20-24px, bold
- **h3 (Card Title)**: 16-20px, bold
- **body**: 14-16px, regular
- **small/label**: 12-14px, medium, uppercase (for labels)

---

## Layout System

### Fixed Sidebar Navigation

**Desktop**: `w-72` (288px / 18rem)

```html
<aside
  class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col"
>
  <!-- Branding (top) -->
  <div class="p-6 mb-10">
    <h1 class="text-lg font-bold text-primary uppercase">Academic Curator</h1>
    <p class="text-xs text-on-surface-variant uppercase">
      System Administration
    </p>
  </div>

  <!-- Navigation menu (flex-1) -->
  <nav class="flex-1 flex flex-col gap-1">
    <!-- Nav item with icon -->
    <a
      class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-all"
    >
      <span class="material-symbols-outlined">dashboard_customize</span>
      <span>System Hub</span>
    </a>
    <!-- More items... -->
  </nav>

  <!-- User info (bottom) -->
  <div class="mt-auto pt-6 border-t border-outline-variant/50">
    <!-- Institution logo + name -->
  </div>
</aside>
```

**Features**:

- Light background: `bg-surface-container-low`
- Fixed positioning for stable navigation
- Icons from Material Symbols
- Active menu item: white background + bold text
- Hover states with transitions
- Bottom section separated by border-top

### Sticky Top Header

**Height**: `h-16` (64px)

```html
<header class="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 border-b border-outline/10 shadow-sm">
  <!-- Left: Search -->
  <div class="flex-1">
    <input placeholder="Search..." class="rounded-full bg-surface-container-low pl-10 pr-4"
  </div>

  <!-- Right: Actions + User -->
  <div class="flex items-center gap-6">
    <button class="text-on-surface-variant hover:text-primary">
      <span class="material-symbols-outlined">notifications</span>
    </button>
    <!-- User profile dropdown -->
  </div>
</header>
```

**Features**:

- Glassmorphism effect: `bg-white/70 backdrop-blur-xl`
- Sticky positioning
- Search bar with icon
- Icon buttons for notifications, settings, help
- User profile with avatar and role label

### Main Content Area

```html
<main class="ml-72 pt-16 min-h-screen">
  <div class="max-w-6xl mx-auto p-12">
    <!-- Page content -->
  </div>
</main>
```

**Spacing**:

- Left margin: `ml-72` (accounts for sidebar)
- Top padding: `pt-16` (accounts for header)
- Content padding: `p-12` (48px)
- Max-width: `max-w-6xl` (1152px)

## Component Patterns (from Reference Screens)

### Authentication Screen (Split Layout)

**Mobile**: Stacked layout (forms on top)  
**Desktop**: Split (md:grid-cols-12 gap-12)

```html
<main
  class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xl"
>
  <!-- Branding Section (md:col-span-5) -->
  <section
    class="hidden md:flex md:col-span-5 bg-primary-container p-12 flex-col justify-between"
  >
    <div>
      <h1 class="text-2xl font-extrabold text-surface-container-lowest">
        Academic Curator
      </h1>
      <h2 class="text-4xl font-bold text-surface-bright mt-24">
        Transforming raw institutional data into
        <span class="text-on-tertiary-container">curated intelligence</span>.
      </h2>
      <p class="mt-6 text-on-primary-container text-lg">
        Experience the framework v2.1
      </p>
    </div>
  </section>

  <!-- Forms Section (md:col-span-7) -->
  <section class="md:col-span-7 bg-surface-container-lowest p-8 md:p-16">
    <form class="space-y-6">
      <!-- Select fields, inputs, buttons... -->
    </form>
  </section>
</main>
```

**Key Features**:

- Rounded corners: `rounded-xl`
- Split background colors for visual distinction
- Branding section stays hidden on mobile
- Form section centered with max-width

### Input & Select Fields

```html
<!-- Text Input -->
<input
  class="w-full h-12 pl-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg transition-all"
  placeholder="name@institution.edu"
/>

<!-- Select with Icon -->
<div class="relative">
  <select
    class="w-full h-12 pl-4 pr-10 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary rounded-t-lg"
  >
    <option>Select role...</option>
  </select>
  <span
    class="material-symbols-outlined absolute right-3 top-3 pointer-events-none"
    >expand_more</span
  >
</div>
```

**Characteristics**:

- No top/left/right borders (clean minimal look)
- Bottom border only: `border-b-2`
- Focus: changes border color to primary
- Rounded only at top: `rounded-t-lg`
- Height: `h-12` (48px)
- Padding: `pl-4 pr-4` (16px)

### Buttons

```html
<!-- Primary Button (CTA) -->
<button
  class="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-lg hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2"
>
  Sign In to Framework
  <span class="material-symbols-outlined">arrow_forward</span>
</button>

<!-- Secondary Button -->
<button
  class="text-primary font-bold border-2 border-primary/10 px-6 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
>
  Request Institutional Access
</button>

<!-- Icon Button -->
<button
  class="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
>
  notifications
</button>
```

**Sizes & Variants**:

- Normal: `h-12` (48px) or `h-14` (56px)
- Icon buttons: `p-2` with rounded-full
- Border radius: varied (lg = 8px, xl = 12px, full = 9999px)
- Hover effects: background change or scale transform

### Stat/Metric Cards

```html
<div
  class="p-6 bg-surface-container-lowest rounded-lg border border-outline-variant/30"
>
  <div class="text-xs text-on-surface-variant font-bold uppercase">
    Total Students
  </div>
  <div class="text-4xl font-bold text-primary mt-2">1,250</div>
  <div class="text-sm text-on-tertiary-container font-medium mt-4">
    ↑ +5.2% YoY
  </div>
</div>
```

### Step Indicator (Wizard)

```html
<div class="flex items-center justify-between relative">
  <!-- Connector lines -->
  <div
    class="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -z-10"
  ></div>

  <!-- Steps -->
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold"
    >
      1
    </div>
    <span class="font-bold text-primary uppercase">Select Source</span>
  </div>

  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold"
    >
      2
    </div>
    <span class="font-medium text-on-surface-variant uppercase"
      >Configure API</span
    >
  </div>
  <!-- More steps... -->
</div>
```

**Features**:

- Circle indicators with numbers
- Connector lines using pseudo-elements
- Active step: primary color
- Pending steps: gray color
- Relative positioning for layout

### Role Selection Card

```html
<div
  class="border-2 border-outline-variant/30 p-6 rounded-xl hover:border-primary transition-colors cursor-pointer group"
>
  <span class="material-symbols-outlined text-3xl mb-4">school</span>
  <h3 class="font-bold text-primary text-lg">Academic Administrator</h3>
  <p class="text-on-surface-variant text-sm mt-2">
    High-level institutional oversight and strategy
  </p>
</div>
```

**States**:

- Default: gray border
- Hover: primary border
- Selected: filled background with primary color

### Data Table

```html
<table class="w-full">
  <thead class="bg-primary-container text-on-primary-container">
    <tr>
      <th class="px-4 py-3 text-left text-sm font-bold">Student ID</th>
      <th class="px-4 py-3 text-left text-sm font-bold">Name</th>
      <th class="px-4 py-3 text-right text-sm font-bold">GPA</th>
    </tr>
  </thead>
  <tbody>
    <tr
      class="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors"
    >
      <td class="px-4 py-3 text-sm">202502SENG001</td>
      <td class="px-4 py-3 text-sm">Jean Umucyo</td>
      <td class="px-4 py-3 text-sm text-right font-bold">3.45</td>
    </tr>
  </tbody>
</table>
```

### Modal / Dialog

```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-surface rounded-xl shadow-xl max-w-md p-8">
    <h2 class="text-2xl font-bold text-primary mb-4">Confirm Action</h2>
    <p class="text-on-surface-variant mb-6">
      Are you sure you want to continue?
    </p>
    <div class="flex gap-3">
      <button
        class="flex-1 py-2 border border-outline rounded-lg font-medium hover:bg-surface-container-low"
      >
        Cancel
      </button>
      <button
        class="flex-1 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Alert / Info Box

```html
<div
  class="flex items-center gap-3 p-3 rounded-lg bg-surface-container text-on-secondary-container"
>
  <span class="material-symbols-outlined text-sm">lock_person</span>
  <p class="text-xs leading-tight font-medium uppercase">
    Multi-factor authentication (MFA) will be enabled.
  </p>
</div>
```

---

## Spacing & Layout Grid

### Base Spacing Unit: 4px (Tailwind default)

```
Tailwind   Pixels   Rem   Use Case
p-0        0px      0     No spacing
p-1        4px      0.25  Tight component spacing
p-2        8px      0.5   Icon buttons, small gaps
p-3        12px     0.75  List items, table cells
p-4        16px     1     Form fields, default component padding
p-6        24px     1.5   Cards, section padding
p-8        32px     2     Container padding
p-12       48px     3     Page padding, major sections
p-16       64px     4     Large section spacing
```

### Responsive Breakpoints

```
Breakpoint  Min-Width   Tailwind Prefix   Common Use
Mobile      0px         (none)            Stacked layouts, hamburger sidebars
Tablet      640px       sm:               Landscape phones
            768px       md:               Tablets, grid layouts (2-column)
Desktop     1024px      lg:               Full layouts, 3+ columns
Large       1280px      xl:               Wide displays
Extra-Large 1536px      2xl:              Large monitors
```

**Example Responsive Pattern**:

```html
<!-- Stacks on mobile, 2 columns on tablet, 3 columns on desktop -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
  <card>Item 1</card>
  <card>Item 2</card>
  <card>Item 3</card>
</div>
```

### Max-Width Constraints

```
w-max       Fit content width
max-w-md    448px (28rem)  - Modals, forms
max-w-lg    512px (32rem)  - Tablets
max-w-2xl   672px (42rem)  - Small containers
max-w-4xl   896px (56rem)  - General containers
max-w-6xl   1152px (72rem) - Main content area (dashboard)
max-w-7xl   1280px (80rem) - Full page width
```

---

## Tailwind CSS Configuration for Design System

### Color Tokens Extension

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: "#002045",
        "primary-container": "#1a365d",
        "on-primary": "#ffffff",
        "on-primary-container": "#86a0cd",

        secondary: "#545f72",
        "secondary-container": "#d5e0f7",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#586377",

        tertiary: "#002617",
        "tertiary-container": "#003e28",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#00b47d",

        surface: "#f9f9ff",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#cfdaf1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d8e3fa",

        "on-surface": "#111c2c",
        "on-surface-variant": "#43474e",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",

        outline: "#74777f",
        "outline-variant": "#c4c6cf",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      fontSize: {
        xs: ["12px", "16px"], // Label
        sm: ["14px", "20px"], // Body small
        base: ["16px", "24px"], // Body
        lg: ["18px", "28px"], // Subtitle
        xl: ["20px", "28px"], // Card title
        "2xl": ["24px", "32px"], // Section title
        "3xl": ["30px", "36px"], // Page title
        "4xl": ["36px", "40px"], // Hero title
      },
    },
  },
};
```

---

## Visual Hierarchy & Typography Scale

**Application to UI**:

| Level | Element          | Size    | Weight  | Color           | Case      |
| ----- | ---------------- | ------- | ------- | --------------- | --------- |
| 1     | Page Title       | 30-36px | Bold    | primary         | -         |
| 2     | Section Title    | 24px    | Bold    | primary         | -         |
| 3     | Card/Modal Title | 20px    | Bold    | on-surface      | -         |
| 4     | Body Text        | 16px    | Regular | on-surface      | -         |
| 5     | Label/Helper     | 12px    | Medium  | outline-variant | Uppercase |
| 6     | Metric Number    | 36-48px | Bold    | primary         | -         |
| 7     | Metric Label     | 12px    | Medium  | outline-variant | Uppercase |

---

## Border Radius System

```
rounded-lg      8px   - Input fields, cards, buttons
rounded-xl      12px  - Larger cards, modals
rounded-2xl     16px  - Large sections
rounded-full    9999px - Circles, pills
```

**Application**:

- Form inputs: `rounded-t-lg` (top only)
- Cards: `rounded-lg`
- Buttons: `rounded-xl` (primary), `rounded-lg` (secondary)
- Avatar/circles: `rounded-full`

---

## Icon Library

**Source**: Material Symbols Outlined (Google Fonts)

```html
<!-- Usage -->
<span class="material-symbols-outlined">icon_name</span>
```

**Common Icons**:

- Navigation: `menu`, `home`, `dashboard`, `settings`
- Actions: `add`, `delete`, `edit`, `save`, `download`
- Status: `check_circle`, `error`, `warning`, `info`
- UI: `search`, `notifications`, `logout`, `account_circle`
- Data: `bar_chart`, `pie_chart`, `trending_up`, `analytics`

**Size**: Default is 24px. Modify with `.text-{size}` class:

```html
<span class="material-symbols-outlined text-3xl">icon_name</span>
<span class="material-symbols-outlined text-sm">icon_name</span>
```

---

## Accessibility Patterns

### Focus States

All interactive elements must have visible focus:

```html
<!-- Input focus -->
<input
  class="focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
/>

<!-- Button focus -->
<button class="focus:ring-2 focus:ring-offset-2 focus:ring-primary"></button>
```

### ARIA Labels

```html
<!-- Icon button must have label -->
<button aria-label="Delete item">
  <span class="material-symbols-outlined">delete</span>
</button>

<!-- Form fields -->
<label for="email" class="block text-sm font-medium">Email</label>
<input id="email" type="email" />

<!-- Semantic HTML for tables -->
<table>
  <thead>
    <!-- Headers -->
  </thead>
  <tbody>
    <!-- Data rows -->
  </tbody>
</table>
```

### Color Contrast

Minimum WCAG AA compliance (4.5:1 for normal text):

- Primary text on white: `#111c2c` (on-surface) ✅
- Secondary text on white: `#43474e` (on-surface-variant) ✅
- White text on primary: `#002045` (primary) ✅

---

## Reference Design Screens (Guide for Implementation)

### Key Screens Examined

**1. Login & Role Access Portal** (`login_role_access/`)

- Split-screen layout: Branding (left) + Form (right)
- Responsive: stacked on mobile
- Components: Institution select, Role cards, Password input, MFA notice
- **Key Pattern**: Read-only section (branding) + interactive section (form)

**2. User Registration & Security Setup** (`user_registration_security_setup/`)

- Multi-step wizard with progress indicator
- Left sidebar (stepper) + Right form area
- 3 steps: Role, Institution Details, Security Layer
- **Key Pattern**: Numbered step circles with connector lines, large form CTAs

**3. Academic Admin Dashboard** (`admin_system_hub_finalized/`)

- Fixed sidebar navigation (left)
- Sticky header with search + notifications (top)
- Main content grid with metric cards
- **Key Pattern**: Sidebar > Header > Content layout with ml-72 pt-16

**4. Data Source Integration Wizard** (`data_source_integration_wizard/`)

- 4-step wizard with numbered indicators
- Form validation feedback
- Step navigation (Previous/Next buttons)
- **Key Pattern**: Linear form flow with validation at each step

**Total Reference Screens**: 80+ additional screens available organized by role and feature

---

## Implementation Checklist

### Foundation Phase (React + Build Setup)

- [ ] Vite project with React 18
- [ ] Tailwind CSS 3+ configured
- [ ] Design system color tokens in tailwind.config.js
- [ ] Material Symbols Outlined font imported
- [ ] Redux Toolkit store initialized
- [ ] Mock Service Worker (MSW) configured

### Layout Components

- [ ] Sidebar (fixed left, w-72, bg-surface-container-low)
- [ ] Header (sticky top, h-16, glassmorphism effect)
- [ ] MainContent wrapper (ml-72 pt-16, max-w-6xl)
- [ ] Responsive mobile breakpoint (sidebar becomes hamburger)

### Form Components

- [ ] TextInput (bottom-border-only style)
- [ ] SelectField (with dropdown arrow icon)
- [ ] PasswordInput (with show/hide toggle)
- [ ] MultiFactorAuthInput (MFA setup)
- [ ] RadioGroup (role selection cards)
- [ ] Checkbox with label

### Common Components

- [ ] Button (Primary, Secondary, Icon variants)
- [ ] Badge/Pill (for status indicators)
- [ ] Card (base, with shadow, padding)
- [ ] Table (sortable headers, row hover)
- [ ] Modal/Dialog (centered, with backdrop)
- [ ] Alert/Toast (4 states: info, warning, error, success)

### Dashboard Components

- [ ] MetricCard (label, large value, trend indicator)
- [ ] ChartCard (title, chart, actions)
- [ ] StatusIndicator (badges: active, pending, error)
- [ ] UserProfile (avatar, name, institution, role)

### Navigation Components

- [ ] NavItem (icon + label, active state)
- [ ] Breadcrumb (path navigation)
- [ ] TabBar (horizontal tab selection)

---

## Color Usage Guide by Component

| Component   | Element          | Color Token               |
| ----------- | ---------------- | ------------------------- |
| **Sidebar** | Background       | surface-container-low     |
|             | Text             | on-surface                |
|             | Active item      | primary                   |
|             | Hover            | primary/10% opacity       |
| **Header**  | Background       | white/70% + backdrop-blur |
|             | Border bottom    | outline/10% opacity       |
| **Buttons** | Primary BG       | primary                   |
|             | Primary Text     | on-primary                |
|             | Secondary BG     | surface-container         |
|             | Hover            | primary-container         |
| **Forms**   | Input border     | outline-variant           |
|             | Input focus      | primary                   |
|             | Labels           | on-surface-variant        |
|             | Error            | error                     |
| **Cards**   | Background       | surface-container-lowest  |
|             | Border           | outline-variant/30%       |
| **Metrics** | Label            | on-surface-variant        |
|             | Number           | primary                   |
|             | Trend (positive) | tertiary                  |
|             | Trend (negative) | error                     |
| **Tables**  | Header BG        | primary-container         |
|             | Header Text      | on-primary-container      |
|             | Row hover        | surface-container-low     |
|             | Divider          | outline-variant/20%       |

---

## Component Pattern Samples

### Authentication Flow Pattern

1. Login page (split layout)
2. Role selection (card grid or radio buttons)
3. Institution selector (dropdown)
4. Credentials (email + password inputs)
5. MFA setup (QR code scan or SMS)
6. Dashboard redirect

### Data Entry Pattern

1. Multi-step form wizard (1-5 steps)
2. Progress indicator (numbered circles with lines)
3. Input validation (real-time or on blur)
4. Step navigation (Previous/Next/Submit)
5. Confirmation (toast or modal)

### Dashboard Pattern

1. Sidebar navigation (persistent)
2. Header search + actions (notifications, settings, user menu)
3. Page title + breadcrumb
4. Metric cards grid (KPIs)
5. Data visualization (charts)
6. Action buttons (Generate, Download, Export)
7. Data table (paginated, sortable)

---

## Mobile Responsive Behavior

### Sidebar

- **Desktop (lg+)**: Fixed left, 288px wide
- **Tablet (md)**: Collapsed sidebar with icons only
- **Mobile (<md)**: Hamburger menu, full-width when opened

### Forms

- **Desktop**: Full width or constrained max-w
- **Mobile**: Full width, stack vertically, touch-friendly (larger buttons)

### Tables

- **Desktop**: Standard table layout
- **Tablet**: Horizontal scroll with sticky first column
- **Mobile**: Card stack (each row becomes a card)

### Grids

- **Desktop**: 3-4 columns (grid-cols-3 or grid-cols-4)
- **Tablet**: 2 columns (grid-cols-2)
- **Mobile**: 1 column (grid-cols-1)
