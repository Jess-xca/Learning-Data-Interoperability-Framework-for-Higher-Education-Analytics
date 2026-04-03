# Design System & Reference Guide

## Color Palette

### Primary Colors

```
Navy (Primary): #1e3a5f
  - Used for: Headers, sidebars, buttons, text

Light Background: #f5f7fa
  - Used for: Main content background, subtle elements

Accent Green: #10b981
  - Used for: Positive indicators, highlights, success states

White: #ffffff
  - Used for: Cards, forms, overlays
```

### Secondary Colors

```
Gray (Text): #374151
  - Used for: Body text, secondary information

Light Gray (Borders): #e5e7eb
  - Used for: Dividers, borders, subtle separators

Blue (Info): #3b82f6
  - Used for: Information, links, secondary actions

Red (Warning): #ef4444
  - Used for: Errors, warnings, critical alerts
```

---

## Typography

- **Font Family**: Sans-serif (likely: Inter, Segoe UI, or system font)
- **Heading XL**: Bold, 28-32px (page titles)
- **Heading L**: Bold, 20-24px (section titles)
- **Heading M**: Bold, 16-18px (card titles)
- **Body**: Regular, 14-16px (content text)
- **Small**: Regular, 12-14px (labels, helper text)

---

## Layout System

### Sidebar Navigation

- Width: ~200-220px
- Dark navy background `#1e3a5f`
- White text
- Menu items with icons
- Hover states: slightly lighter background
- Active state: underline or background highlight

### Top Header

- Height: ~60-70px
- White background with border-bottom
- Contains: Logo/Title, Search bar, Notifications, Help, User menu
- Sticky/fixed positioning

### Main Content Area

- Padding: 20-30px
- Max-width: responsive, fills remaining space
- Cards: white background, subtle shadows, 8-12px radius corners

---

## Component Library (Based on Reference)

### 1. Metric Card / Stat Card

```
┌─────────────────┐
│ LABEL           │
│ 84.2%           │ ← Large bold number
│ ↑ +2.1% YoY     │ ← Small green text with icon
└─────────────────┘
```

- White background with subtle shadow
- Label in small gray text
- Large bold metric value
- Trend indicator (green for positive)

### 2. Role Selection Card

```
┌──────────────────────────┐
│ 🎓 Academic Administrator │
│ High-level institutional │
│    oversight and strategy │
└──────────────────────────┘
```

- Card with icon on left
- Title in bold
- Description in gray text
- Border: 2px solid (active/selected), 1px gray (unselected)
- Hover: subtle background change

### 3. Navigation Sidebar

- Menu items: icon + label
- Active state: colored background or underline
- Spacing: 12px vertical between items

### 4. Table

- Header: Navy background, white text
- Rows: alternating white/light gray
- Hover: highlight row
- Actions: buttons or dropdown menu

### 5. Data Visualization Cards

- Title + subtitle
- Chart/graph
- Download or action buttons

---

## Visual Hierarchy

1. **Page Title** (Largest, Navy, Bold)
2. **Section Subtitle** (Gray text, smaller)
3. **Metric Cards** (Emphasis on large numbers)
4. **Component Labels** (Small uppercase, gray)
5. **Body Text** (Regular size, dark gray)

---

## Spacing & Grid

- Base unit: 4px
- Common spacing: 8px, 12px, 16px, 20px, 24px, 32px
- Card padding: 16-20px
- Section gaps: 24-32px
- Sidebar width: 200px + 20px padding

---

## Buttons

### Primary Button

```
Background: #1e3a5f
Text: White, bold
Padding: 10px 24px
Border-radius: 6px
Hover: Darker shade
```

### Secondary Button

```
Background: #f5f7fa
Text: Navy
Padding: 10px 24px
Border: 1px solid #e5e7eb
Border-radius: 6px
Hover: Lighter shade
```

### Icon Buttons

```
Background: Transparent
Icon: Navy or Gray
Hover: Light background
```

---

## Forms

### Input Fields

```
Border: 1px solid #e5e7eb
Padding: 10px 12px
Border-radius: 4px
Font: 14px
Placeholder: Light gray
Focus: Blue border, shadow
```

### Select/Dropdown

```
Similar to input fields
With dropdown arrow icon
```

### Labels

```
Font-weight: 600
Font-size: 12px
Text-transform: uppercase
Color: #374151
Margin-bottom: 4px
```

---

## Responsive Breakpoints

- **Mobile**: < 640px (sidebar becomes hamburger menu)
- **Tablet**: 640px - 1024px (sidebar collapses)
- **Desktop**: > 1024px (full layout)

---

## Reference Screens Analyzed

1. **login_role_access** - Login with role selection
   - Split layout: branding (left) + form (right)
   - Institution selector
   - Role selector
   - Email & password inputs
   - MFA notice
   - Sign in button
   - Register link

2. **user_registration_security_setup** - Multi-step registration
   - Stepper on left: Role Selection, Institutional Details, Security Layer
   - Role card selection
   - Form inputs: Full Name, Email, Institution, Department
   - Password strength indicator
   - MFA QR code scanner
   - Buttons: Save as Draft, Finalize Registration

3. **academic_admin_strategic_resource_hub** - Main dashboard
   - Sidebar with menu items
   - Top header with search, notifications, user menu
   - Page title + subtitle
   - Metric cards (Graduation Rate, Faculty-to-Student, Grant Utilization)
   - Vision Tracker sidebar (right)
   - Interactive map/visualization section
   - Data table with status badges
   - Generate Report button
   - Download CSV button

---

## Component Building Order

1. **Base Components**: Button, Input, Select, Badge, Card
2. **Layout Components**: Sidebar, Header, MainContent, Layout
3. **Form Components**: FormGroup, PasswordInput, MFAInput
4. **Dashboard Components**: MetricCard, ChartCard, Table, Widget
5. **Page Components**: LoginPage, RegistrationPage, DashboardPage

---

**Last Updated**: April 3, 2026
**Design Reference**: stitch_login_role_access reference screens (80+ mockups)
