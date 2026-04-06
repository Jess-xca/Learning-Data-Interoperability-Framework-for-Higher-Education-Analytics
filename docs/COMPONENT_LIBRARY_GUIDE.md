# Component Library Documentation

**Version:** 1.0.0  
**Last Updated:** April 6, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Form Components](#form-components)
4. [Layout Components](#layout-components)
5. [Modal Components](#modal-components)
6. [Utility Components](#utility-components)
7. [Styling Conventions](#styling-conventions)
8. [Best Practices](#best-practices)

---

## Overview

The Academic Curator component library provides a comprehensive set of reusable, accessible components built with React, TypeScript, and Tailwind CSS. All components follow a consistent design system and adhere to strict TypeScript typing.

### Design Principles
- **Accessibility First:** WCAG 2.1 AA compliant
- **Type Safety:** 100% TypeScript coverage
- **Responsive Design:** Mobile-first approach
- **Performance:** Optimized for production
- **Consistency:** Unified design language

---

## Core Components

### 1. Button

A versatile button component with multiple variants and sizes.

**Location:** `src/components/forms/Button.tsx`

**Usage:**
```tsx
import Button from "../forms/Button";

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Danger Button</Button>
<Button disabled>Disabled Button</Button>
```

**Variants:**
- `primary` - Main action button (emerald/teal gradient)
- `secondary` - Secondary action (gray)
- `danger` - Destructive action (red)
- `ghost` - Minimal button

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `className?: string`
- `children: ReactNode`

---

### 2. Card Component

Flexible card for content grouping.

**Location:** `src/components/common/Card.tsx`

**Usage:**
```tsx
const Card = ({ title, description, children }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {children}
  </div>
);
```

**Features:**
- Customizable padding
- Optional title and description
- Shadow and border styling
- Hover effects

---

### 3. Badge/Status Indicator

Display status with visual indicators.

**Usage:**
```tsx
// Status Badge
<span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
  Active
</span>

// Sensitivity Badge
<span className="inline-block px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full">
  Confidential
</span>
```

**Color Schemes:**
- Green: active, approved, success
- Yellow: warning, pending, under review
- Red: failed, confidential, critical
- Blue: info, processing, internal
- Gray: inactive, disabled

---

### 4. Table Component

Responsive data table with sorting and filtering.

**Usage:**
```tsx
<table className="w-full">
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold">Column</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">Data</td>
    </tr>
  </tbody>
</table>
```

**Features:**
- Header row styling
- Hover effects
- Conditional row coloring
- Responsive scrolling on mobile

---

## Form Components

### 1. Input Field

Standard text input with validation.

**Usage:**
```tsx
<input
  type="text"
  placeholder="Enter value..."
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
/>
```

**States:**
- Default: gray border
- Focus: emerald border + ring
- Error: red border + error message
- Disabled: gray background, cursor-not-allowed

---

### 2. Select Dropdown

Custom select component.

**Usage:**
```tsx
<select
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
>
  <option value="">Select...</option>
  <option value="val1">Option 1</option>
</select>
```

---

### 3. Checkbox

Checkbox with label.

**Usage:**
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="w-4 h-4 accent-emerald-600 rounded"
  />
  <span>Label text</span>
</label>
```

---

### 4. File Upload

File input with size and format validation.

**Usage:**
```tsx
<label className="flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer">
  <span className="material-symbols-outlined">cloud_upload</span>
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
    className="hidden"
  />
  <span>Click to upload</span>
</label>
```

**Features:**
- Drag and drop support
- File type validation
- Size validation (configurable)
- Progress indication

---

## Layout Components

### 1. Header/Navigation

Application header with branding and controls.

**Location:** `src/components/layout/Header.tsx`

**Usage:**
```tsx
<header className="bg-gradient-to-r from-emerald-600 to-teal-700">
  {/* Header content */}
</header>
```

---

### 2. Sidebar Navigation

Role-based navigation menu.

**Location:** `src/components/layout/Sidebar.tsx`

**Features:**
- Responsive (hidden on mobile)
- Role-based visibility
- Icon support (Material Symbols)
- Active state indication
- Badge support

**Role Navigation:**
- Admin: 14 menu items
- QA: 9 menu items
- Analyst: 6 menu items
- HOD: 7 menu items
- Lecturer: 5 menu items
- Student: 4 menu items

---

### 3. Footer

Application footer with links and info.

**Location:** `src/components/layout/Footer.tsx`

**Variants:**
- Default: Full footer with all sections
- Minimal: Compact footer for login pages

---

### 4. Container/Layout

Main content container.

**Usage:**
```tsx
<div className="flex flex-col bg-surface min-h-screen">
  {/* Header */}
  {/* Main Content */}
  {/* Footer */}
</div>
```

---

## Modal Components

### 1. Evidence Collection Modal

Evidence upload form with validation.

**Location:** `src/components/EvidenceCollectionModal.tsx`

**Props:**
```tsx
interface EvidenceCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Features:**
- Title and description inputs
- Category selection (5 types)
- File upload with 50MB limit
- Form validation
- Success callback

---

### 2. Report Generator Modal

Report generation with progress tracking.

**Location:** `src/components/ReportGeneratorModal.tsx`

**Features:**
- Area selection (checkboxes)
- Report options (include evidence)
- Progress simulation (0-100%)
- Step indicators
- Redux integration

---

### 3. Report Distribution Modal

Distribution configuration modal.

**Location:** `src/components/ReportDistributionModal.tsx`

**Features:**
- Distribution method selection (Email/Link)
- Schedule option (Immediate/Scheduled)
- Recipient management
- Email validation
- Department assignment

---

### 4. Analytics Modal

Analytics and metrics display.

**Location:** `src/components/ReportingAnalyticsModal.tsx`

**Features:**
- Time range filtering (week/month/all)
- Key metrics cards
- Access trend chart
- Top viewers list
- Analytics summary

---

## Utility Components

### 1. Icon Component

Material Symbols integration.

**Usage:**
```tsx
<span className="material-symbols-outlined">dashboard</span>
<span className="material-symbols-outlined text-2xl">verified_user</span>
<span className="material-symbols-outlined text-red-600">error</span>
```

**Common Icons:**
- `dashboard_customize` - Dashboard
- `verified_user` - Accreditation/Security
- `description` - Reports/Documents
- `analytics` - Analytics
- `settings` - Settings
- `person` - User
- `check_circle` - Success
- `error` - Error
- `warning` - Warning
- `info` - Information

---

### 2. Toast/Notification

Toast notification system.

**Location:** `src/context/ToastContext.tsx`

**Usage:**
```tsx
const { showToast } = useToast();

showToast({
  message: "Success!",
  type: "success", // success | error | warning | info
  duration: 3000
});
```

---

## Styling Conventions

### Colors

**Primary Palette:**
- Emerald/Teal: Primary actions (#059669 → #0d9488)
- Blue: Secondary info (#2563eb)
- Red: Danger/Error (#dc2626)
- Yellow/Amber: Warning (#f59e0b)
- Green: Success (#10b981)
- Gray: Neutral (#6b7280)

### Spacing

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Typography

```
h1: 3xl, font-bold
h2: 2xl, font-bold
h3: lg, font-bold
h4: base, font-semibold
body: base, normal
small: sm, muted
```

### Shadows

```
- shadow-sm: Small shadow (cards, borders)
- shadow: Standard shadow (modals)
- shadow-lg: Large shadow (dropdowns, popovers)
```

### Borders

```
- border: 1px solid gray-300
- rounded-lg: 8px border-radius
- border-l-4: Left accent border
```

---

## Best Practices

### 1. Component Props
- Always type component props with interfaces
- Use `React.FC<Props>` for functional components
- Provide sensible defaults
- Document required vs optional props

### 2. Accessibility
- Use semantic HTML (`<button>`, `<label>`, etc.)
- Include `aria-*` attributes where needed
- Ensure keyboard navigation
- Test with screen readers

### 3. Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple devices
- Avoid fixed widths

### 4. Performance
- Use React.memo for expensive components
- Lazy load modals
- Optimize re-renders
- Minimize bundle size

### 5. TypeScript
- Never use `any` type
- Type all function parameters
- Export types alongside components
- Use `type` for interfaces

### 6. Styling
- Use Tailwind classes exclusively (no CSS files)
- Follow color scheme
- Use consistent spacing
- Maintain border radius consistency

### 7. Testing
- Test component rendering
- Test user interactions
- Test edge cases
- Test accessibility

---

## Component Checklist

### Page Components (21)
- ✅ DashboardPage
- ✅ LoginPage
- ✅ RegistrationPage
- ✅ ProfilePage
- ✅ MFASetupPage
- ✅ PasswordResetPage
- ✅ StudentsPage
- ✅ ProgramsPage
- ✅ CoursesPage
- ✅ AnalyticsPage
- ✅ ReportsPage
- ✅ UserManagementPage
- ✅ DataSourcesPage
- ✅ DataMappingPage
- ✅ DataQualityPage
- ✅ PipelineVisualizerPage
- ✅ GovernancePage
- ✅ SettingsPage
- ✅ AccreditationPage
- ✅ InstitutionalReportingPage
- ✅ DataGovernancePage
- ✅ SecurityAccessPage

### Layout Components (4)
- ✅ Header
- ✅ Sidebar
- ✅ Footer
- ✅ Container

### Modal Components (4)
- ✅ EvidenceCollectionModal
- ✅ ReportGeneratorModal
- ✅ ReportDistributionModal
- ✅ ReportingAnalyticsModal

### Form Components (6)
- ✅ Button
- ✅ Input (text/email/password)
- ✅ Select
- ✅ Checkbox
- ✅ File Upload
- ✅ Form validation

### Utility Components (10+)
- ✅ Card
- ✅ Badge/Status
- ✅ Table
- ✅ Alert
- ✅ Toast
- ✅ Icon
- ✅ Progress Bar
- ✅ Breadcrumb
- ✅ Pagination
- ✅ Tab Interface

---

## Contributing

When creating new components:

1. **Create in appropriate directory**
   - Page: `src/components/pages/`
   - Modal: `src/components/`
   - Layout: `src/components/layout/`
   - Form: `src/components/forms/`
   - Utility: `src/components/common/`

2. **Follow naming conventions**
   - PascalCase for components (e.g., `MyComponent.tsx`)
   - kebab-case for files if needed
   - camelCase for functions and variables

3. **Document your component**
   - JSDoc comments
   - TypeScript interfaces
   - Usage examples

4. **Test your component**
   - Unit tests
   - Integration tests
   - Visual tests

5. **Commit with clear message**
   - `feat: Add ComponentName`
   - `fix: Fix ComponentName bug`
   - `docs: Update ComponentName docs`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Apr 6, 2026 | Initial component library documentation |

---

## Support

For component questions or issues:
1. Check existing components for patterns
2. Review Tailwind CSS documentation
3. Check TypeScript strict mode compliance
4. Test in development environment

---
