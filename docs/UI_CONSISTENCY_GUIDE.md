# UI Consistency Guide

## Overview

This guide establishes standardized patterns and conventions for the Innovation Prototype UI. All components and pages should follow these guidelines to ensure visual and functional consistency across the application.

**Last Updated:** April 7, 2026  
**Design System:** Material Design 3  
**Color Scheme:** Secondary-focused for authentication flows, Primary for system actions

---

## Table of Contents

1. [Design System](#design-system)
2. [Color Tokens](#color-tokens)
3. [Typography](#typography)
4. [Spacing & Dimensions](#spacing--dimensions)
5. [Components & Patterns](#components--patterns)
6. [Authentication Pages](#authentication-pages)
7. [Form Design](#form-design)
8. [Buttons & Actions](#buttons--actions)
9. [Containers & Layouts](#containers--layouts)
10. [Common Patterns](#common-patterns)
11. [Development Guidelines](#development-guidelines)

---

## Design System

The Innovation Prototype uses **Material Design 3** design language with Tailwind CSS for implementation.

### Key Principles

- **Consistency:** Reusable components and patterns across all pages
- **Accessibility:** Proper color contrast, semantic HTML, keyboard navigation
- **Responsiveness:** Mobile-first approach with breakpoints at 640px, 768px, 1024px, 1280px
- **Performance:** Minimal CSS, efficient component structure

---

## Color Tokens

### Primary Color Palette

**Secondary Color (Auth & Main Actions)**

- `text-secondary` - Secondary text/headings
- `bg-secondary` - Secondary buttons, highlights
- `text-on-secondary` - Text on secondary backgrounds
- `bg-secondary-container` - Secondary container backgrounds
- `text-on-secondary-container` - Text on secondary containers

**Tertiary Color (Accents)**

- `bg-tertiary-container` - Tertiary backgrounds (used in gradients)
- `text-on-tertiary-container` - Text on tertiary backgrounds

**Surface Colors (Backgrounds)**

- `bg-surface` - Main page background
- `bg-surface-container-lowest` - Cards, panels, elevated containers
- `bg-surface-container-low` - Form inputs, subtle elevation
- `bg-surface-container-high` - Subtle backgrounds
- `text-on-surface` - Primary text on surfaces
- `text-on-surface-variant` - Secondary text, helper text

**State Colors**

- `text-error` / `bg-error` - Error states, validation
- `text-outline-variant` - Borders, dividers, inactive elements

### Usage Rules

1. **Authentication Pages** (LoginPage, RegistrationPage, PasswordResetPage)
   - Primary colors: **Secondary** (not Primary)
   - Background: `bg-secondary-container` for branding panels
   - Buttons: `bg-secondary` with `text-on-secondary`
   - Heading: `text-secondary`

2. **System Pages** (Dashboard, Analytics, etc.)
   - Primary colors: **Primary** (for main actions)
   - Background: `bg-surface-container-lowest` for panels
   - Buttons: `bg-primary` with `text-on-primary`

3. **Consistent Across All**
   - Text labels: Use consistent color (secondary in auth, primary in system)
   - Gradients: Include `via-on-tertiary-container` for depth
   - Shadows: Match to primary button color for visual coherence

---

## Typography

### Heading Scale

```
h1: text-3xl font-bold text-on-surface
h2: text-2xl font-bold text-secondary (auth) / text-primary (system)
h3: text-xl font-bold text-on-surface
```

### Body Text

```
Body:       text-base text-on-surface
Body Small: text-sm text-on-surface-variant
Body Tiny:  text-xs text-on-surface-variant
```

### Labels & Instructions

```
Label:      text-sm font-semibold text-secondary
Label Small: text-xs font-semibold text-on-surface-variant
Helper Text: text-xs text-on-surface-variant
Error Text:  text-xs text-error
```

### Font Weights

- **300:** Light text (not typically used)
- **400:** Regular body text
- **500:** Medium, form labels
- **600:** Semibold, labels, emphasis
- **700:** Bold, headings
- **800+:** Not used in this system

---

## Spacing & Dimensions

### Vertical Spacing (Gap/Margin)

```
xs: gap-1   (0.25rem)
sm: gap-2   (0.5rem)
md: gap-3   (0.75rem)
lg: gap-4   (1rem)
xl: gap-6   (1.5rem)
2xl: gap-8  (2rem)
```

### Common Spacing Patterns

```
Form sections:    space-y-5  (1.25rem vertical)
Compact sections: space-y-3  (0.75rem vertical)
Large sections:   space-y-8  (2rem vertical)
```

### Heights

```
Buttons:           h-12 (3rem)
Large buttons:     h-14 (3.5rem)
Form fields:       h-12 (3rem)
Icons (inline):    h-6 w-6
Large icons:       h-8 w-8
```

### Padding

```
xs: p-2   (0.5rem)
sm: p-4   (1rem)
md: p-6   (1.5rem)
lg: p-8   (2rem)
```

### Border Radius

```
sm: rounded-lg    (0.5rem)
md: rounded-xl    (0.75rem)
lg: rounded-2xl   (1rem)
full: rounded-full
```

---

## Components & Patterns

### Reusable Form Components

Located in `src/components/forms/`:

1. **FormInput.tsx**
   - Purpose: Reusable text/email/password input
   - Props: label, error, required, helperText, icon, type, onChange, value, placeholder
   - Styling: Consistent fieldClass with bottom-border focus state

   ```tsx
   <FormInput
     label="Email Address"
     type="email"
     icon="mail"
     error={errors.email}
     required
     onChange={handleChange}
   />
   ```

2. **FormSelect.tsx**
   - Purpose: Dropdown select with icon
   - Props: label, options array, icon, error, required, helperText

   ```tsx
   <FormSelect
     label="Select Role"
     icon="person"
     options={[{value: 'admin', label: 'Administrator'}, ...]}
     onChange={handleChange}
   />
   ```

3. **FormField.tsx**
   - Purpose: Wrapper for custom form elements
   - Provides consistent label, error, and helper text styling

   ```tsx
   <FormField label="Custom Input" error={error} required>
     {/* Custom input element */}
   </FormField>
   ```

4. **VerificationCodeInput.tsx**
   - Purpose: Specialized 6-digit code input
   - Props: value, onChange, maxLength, placeholder
   - Features: Monospace font, numeric-only, centered text

   ```tsx
   <VerificationCodeInput value={code} onChange={setCode} />
   ```

5. **StepIndicator.tsx**
   - Purpose: Display multi-step form progress
   - Props: currentStep, totalSteps, stepTitle, stepDescription
   ```tsx
   <StepIndicator
     currentStep={1}
     totalSteps={4}
     stepTitle="Email Verification"
     stepDescription="Enter your institutional email"
   />
   ```

---

## Authentication Pages

All authentication pages (LoginPage, RegistrationPage, PasswordResetPage) follow a consistent pattern:

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Top Gradient Bar (fixed)                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ┌──────────┐              ┌──────────┐ │
│  │ Branding │              │ Form     │ │
│  │ Panel    │              │ Panel    │ │
│  │ (5 cols) │              │ (7 cols) │ │
│  │ md:flex  │              │ (full    │ │
│  │ hidden   │              │  mobile) │ │
│  └──────────┘              └──────────┘ │
└─────────────────────────────────────────┘
```

### Top Gradient Bar

```tsx
<div
  className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r 
  from-secondary via-on-tertiary-container to-secondary z-50"
/>
```

### Branding Panel (Hidden on Mobile)

```tsx
<div
  className="col-span-5 hidden md:flex flex-col gap-8 p-8 
  bg-secondary-container rounded-xl h-full justify-between"
>
  {/* Feature items */}
</div>
```

### Form Panel

```tsx
<div
  className="w-full max-w-md bg-surface-container-lowest 
  rounded-xl p-8 shadow-glass"
>
  {/* Form content */}
</div>
```

### Header Section

```tsx
<div className="flex items-center gap-3 mb-8">
  <span className="material-symbols-outlined text-secondary text-3xl">
    lock {/* icon varies by page */}
  </span>
  <div>
    <h1 className="text-2xl font-bold text-secondary">Page Title</h1>
  </div>
</div>
```

### Back Link Pattern

```tsx
<a
  href="/login"
  className="block text-center text-sm 
  text-secondary font-semibold hover:underline"
>
  ← Back to login
</a>
```

### Success State

```tsx
<div className="space-y-5 text-center">
  <span className="material-symbols-outlined text-5xl text-secondary">
    check_circle
  </span>
  <h2 className="text-xl font-bold text-secondary">Success!</h2>
</div>
```

---

## Form Design

### Field Container Pattern

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-semibold text-secondary">
    Field Label <span className="text-error">*</span>
  </label>
  <input
    className="w-full h-12 pl-4 pr-4 bg-surface-container-low 
      border-0 border-b-2 border-outline-variant 
      focus:border-secondary focus:ring-0 text-on-surface 
      rounded-t-lg transition-all font-medium outline-none"
  />
  {error && <p className="text-xs text-error">{error}</p>}
  {helperText && (
    <p className="text-xs text-on-surface-variant">{helperText}</p>
  )}
</div>
```

### Key Field Characteristics

- **Container:** `space-y-1.5` for tight vertical spacing
- **Label:** `text-sm font-semibold text-secondary`
- **Input:**
  - Height: `h-12` (48px)
  - Padding: `pl-4 pr-4`
  - Background: `bg-surface-container-low`
  - Border: Bottom-only (`border-b-2`) with `border-outline-variant`
  - Focus: Changes border to `border-secondary`
  - No ring: `focus:ring-0`
  - Rounded top only: `rounded-t-lg`
- **Error:** `text-xs text-error`
- **Helper Text:** `text-xs text-on-surface-variant`
- **Required Indicator:** Red asterisk `*` next to label

### Field States

**Normal State**

```
Background: surface-container-low
Border: outline-variant
Text: on-surface
```

**Focus State**

```
Border: secondary (bottom-2)
Ring: none (focus:ring-0)
Cursor: text
```

**Error State**

```
Border: error
Error Message: text-xs text-error
```

**Disabled State**

```
Opacity: opacity-60
Cursor: not-allowed
```

---

## Buttons & Actions

### Primary Button (Main Action)

Used for form submission, primary CTAs:

```tsx
<button
  className="w-full h-12 bg-secondary text-on-secondary 
  rounded-xl font-bold hover:opacity-90 transition-all 
  disabled:opacity-60 shadow-lg shadow-secondary/20"
>
  Submit
</button>
```

**Characteristics:**

- Full width: `w-full`
- Height: `h-12` (48px)
- Background: `bg-secondary` (or `bg-primary` for system pages)
- Text: `text-on-secondary` high contrast
- Rounded: `rounded-xl`
- Weight: `font-bold`
- Hover: `opacity-90` (subtle darkening)
- Disabled: `opacity-60`
- Shadow: `shadow-lg shadow-secondary/20`

### Secondary Button (Back/Cancel)

Used for less important actions:

```tsx
<button className="text-sm text-secondary font-semibold hover:underline">
  ← Back
</button>
```

**Characteristics:**

- Text only, no background
- Size: `text-sm`
- Color: `text-secondary`
- Weight: `font-semibold`
- Hover: `underline`

### Loading State

```tsx
<button disabled className="...">
  <span className="material-symbols-outlined animate-spin">
    progress_activity
  </span>
</button>
```

---

## Containers & Layouts

### Main Content Container (Form Pages)

Centered card with max width:

```tsx
<div className="flex items-center justify-center min-h-screen bg-surface">
  <div
    className="w-full max-w-md bg-surface-container-lowest 
    rounded-xl p-8 shadow-glass"
  >
    {/* Content */}
  </div>
</div>
```

### Split Layout (Branding + Form)

Two-column on desktop, single-column on mobile:

```tsx
<div
  className="grid grid-cols-1 md:grid-cols-12 gap-6 
  w-full max-w-6xl"
>
  <div className="col-span-5 hidden md:flex ...">{/* Branding panel */}</div>
  <div className="col-span-7 ...">{/* Form panel */}</div>
</div>
```

### Alert/Notification Box

```tsx
<div className="p-4 rounded-lg border-l-4 bg-[color]/10 border-[color]">
  <p className="text-sm text-[color]">{message}</p>
</div>
```

Examples:

- Error: `bg-error/10 border-error text-error`
- Success: `bg-secondary/10 border-secondary text-secondary`
- Info: `bg-tertiary/10 border-tertiary text-tertiary`

---

## Common Patterns

### Icon + Text Header

```tsx
<div className="flex items-center gap-3 mb-8">
  <span className="material-symbols-outlined text-secondary text-3xl">
    icon_name
  </span>
  <div>
    <h1 className="text-2xl font-bold text-secondary">Title</h1>
    <p className="text-sm text-on-surface-variant">Subtitle</p>
  </div>
</div>
```

### Feature Item (Branding Panel)

```tsx
<div className="flex items-start gap-4">
  <div
    className="w-12 h-12 rounded-full bg-on-secondary-container/10 
    flex items-center justify-center flex-shrink-0"
  >
    <span className="material-symbols-outlined text-on-secondary-container">
      icon
    </span>
  </div>
  <div>
    <p className="text-lg font-semibold text-on-secondary-container">Title</p>
    <p className="text-sm text-on-secondary-container/70">Description</p>
  </div>
</div>
```

### Form Section with Spacing

```tsx
<div className="space-y-5">
  {/* Multiple form fields with lg vertical spacing */}
</div>
```

### Centered Text Section

```tsx
<div className="space-y-5 text-center">
  <p className="text-on-surface-variant">{description}</p>
  <button className="...">Action</button>
</div>
```

---

## Development Guidelines

### 1. Using Styling Constants

Import and use constants from `src/constants/uiStyles.ts`:

```tsx
import { BUTTON, CONTAINER, FORM_FIELD, TEXT } from "@/constants/uiStyles";

export function MyComponent() {
  return (
    <div className={CONTAINER.formPanel}>
      <label className={FORM_FIELD.label}>Email</label>
      <input className={FORM_FIELD.base} />
      <button className={BUTTON.primary}>Submit</button>
    </div>
  );
}
```

### 2. Component File Structure

```
src/components/
  forms/
    FormInput.tsx       ← Reusable form component
    FormSelect.tsx
    FormField.tsx
    VerificationCodeInput.tsx
    StepIndicator.tsx
    index.ts            ← Exports all form components
  pages/
    LoginPage.tsx       ← Full page component
    RegistrationPage.tsx
    PasswordResetPage.tsx
  common/               ← Shared UI components
    Alert.tsx
    Card.tsx
    Badge.tsx
```

### 3. Naming Conventions

- **Components:** PascalCase (`FormInput.tsx`, `LoginPage.tsx`)
- **Files:** Match component name
- **CSS Classes:** Tailwind utility classes in `className` prop
- **Props:** camelCase (`formLabel`, `handleSubmit`)
- **State:** camelCase (`isLoading`, `emailError`)

### 4. Color Consistency Checklist

Before submitting auth page code, verify:

- [ ] Top gradient: `from-secondary via-on-tertiary-container to-secondary`
- [ ] Branding panel: `bg-secondary-container`
- [ ] Branding text: `text-on-secondary-container`
- [ ] Main heading: `text-secondary`
- [ ] Form labels: `text-secondary`
- [ ] Primary button: `bg-secondary text-on-secondary shadow-secondary/20`
- [ ] Secondary button/links: `text-secondary`
- [ ] Icons: `text-secondary` (in auth pages)

### 5. Accessibility Requirements

- [ ] Color contrast minimum 4.5:1 for text
- [ ] Form inputs have associated labels
- [ ] Error messages linked to invalid fields
- [ ] Keyboard navigation working (Tab, Enter, Escape)
- [ ] Focus states visible (not just color-based)
- [ ] ARIA labels for icon-only buttons
- [ ] Helper text for complex fields

### 6. Building & Testing

**Build Command:**

```bash
npm run build
```

**Expected Output:**

```
tsc -b && vite build
✓ 380 modules transformed.
✓ built in X.XXs
```

**Color Testing:**
Use browser DevTools to inspect computed styles and verify color tokens are applied correctly.

---

## Migration Path

If updating existing pages to follow this guide:

1. **Identify all inline style strings**
2. **Replace with constants** where applicable
3. **Update color tokens**: `primary` → `secondary` for auth pages
4. **Extract form fields** to use FormInput/FormField components
5. **Verify build passes** (`npm run build`)
6. **Test in browser** for visual consistency

### Example: Before & After

**Before:**

```tsx
<input
  className="w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 
    border-b-2 border-outline-variant focus:border-primary text-on-surface 
    rounded-t-lg transition-all"
/>
```

**After:**

```tsx
import { FORM_FIELD } from "@/constants/uiStyles";

<FormInput label="Email" value={email} onChange={handleChange} />;
```

---

## References

- **Material Design 3:** https://m3.material.io/
- **Tailwind CSS:** https://tailwindcss.com/
- **Material Symbols:** https://fonts.google.com/icons
- **Color Tokens:** See Tailwind config for exact hex values

---

## Questions or Updates?

This guide is version-controlled and should be updated as patterns evolve. When making significant UI changes:

1. Update this document
2. Update `src/constants/uiStyles.ts` if adding new patterns
3. Update component stories/examples if applicable
4. Notify team of breaking changes

**Last Updated:** April 7, 2026  
**Next Review:** Q3 2026
