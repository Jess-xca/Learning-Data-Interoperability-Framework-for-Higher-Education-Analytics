# System Architecture & Component Design

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Learning Data Frontend                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             React Application (Vite)                 │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │  Pages      │  │  Components │  │   Hooks    │  │   │
│  │  │  (Routes)   │  │  (UI Layer) │  │  (Logic)   │  │   │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  │         │                │                │         │   │
│  │         └────────────────┼────────────────┘         │   │
│  │                          ▼                          │   │
│  │  ┌──────────────────────────────────┐              │   │
│  │  │      Redux Store (State)         │              │   │
│  │  ├──────────────────────────────────┤              │   │
│  │  │ • auth state                     │              │   │
│  │  │ • ui preferences                 │              │   │
│  │  │ • cached data                    │              │   │
│  │  │ • loading states                 │              │   │
│  │  └──────────────────────────────────┘              │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │  ┌──────────────────────────────────┐              │   │
│  │  │   API Service Layer (Axios)      │              │   │
│  │  │   + Redux Thunks                 │              │   │
│  │  └──────────────────────────────────┘              │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │  ┌──────────────────────────────────┐              │   │
│  │  │  Mock Service Worker (MSW)       │              │   │
│  │  │  • Request interception          │              │   │
│  │  │  • Mock API handlers             │              │   │
│  │  │  • Dummy data responses          │              │   │
│  │  └──────────────────────────────────┘              │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Styling & Theme (Tailwind CSS)                │   │
│  │  • Global styles                                      │   │
│  │  • Custom Tailwind components                        │   │
│  │  • Responsive utilities                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Localization (i18n)                              │   │
│  │  • English, Kiswahili, French, Kinyarwanda          │   │
│  │  • Dynamic language switching                        │   │
│  │  • localStorage persistence                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │    Backend APIs (Future)            │
        │  • Auth service                     │
        │  • Data integration service         │
        │  • Analytics service                │
        │  • Governance service               │
        └────────────────────────────────────┘
```

---

## Directory Structure

```
d:\Innovation\Prototype/
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md (this file)
│   ├── DUMMY_DATA_SCHEMA.md
│   ├── TASKS.md
│   ├── COMPLIANCE_FRAMEWORK.md
│   ├── API_MOCKS.md
│   ├── COMPONENT_LIBRARY.md
│   ├── SETUP_GUIDE.md
│   └── STUDENT_ID_FORMAT.md
│
├── src/
│   ├── index.jsx                           # App entry point
│   ├── App.jsx                             # Main app component
│   ├── index.css                           # Global styles
│   │
│   ├── pages/                              # Page components (routes)
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── MFASetupPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AcademicAdminDashboard.jsx
│   │   │   ├── QAOfficerDashboard.jsx
│   │   │   ├── DataAnalystDashboard.jsx
│   │   │   ├── DepartmentHeadDashboard.jsx
│   │   │   └── SystemAdminDashboard.jsx
│   │   ├── dataIntegration/
│   │   │   ├── DataSourcesPage.jsx
│   │   │   ├── IntegrationWizardPage.jsx
│   │   │   ├── StandardsMappingPage.jsx
│   │   │   └── StudentRecordPage.jsx
│   │   ├── analytics/
│   │   │   ├── LearningAnalyticsPage.jsx
│   │   │   ├── StudentSuccessPage.jsx
│   │   │   ├── CurriculumAnalyticsPage.jsx
│   │   │   └── ReportingPage.jsx
│   │   ├── governance/
│   │   │   ├── DataGovernancePage.jsx
│   │   │   ├── AccreditationPage.jsx
│   │   │   ├── CompliancePage.jsx
│   │   │   └── SecurityManagementPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── components/                         # Reusable components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── Table.jsx
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MainContent.jsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── Widget.jsx
│   │   │   ├── WidgetGrid.jsx
│   │   │   ├── DashboardCustomizer.jsx
│   │   │   └── NotificationCenter.jsx
│   │   ├── forms/
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── IntegrationWizard.jsx
│   │   │   └── MappingForm.jsx
│   │   └── charts/
│   │       ├── LineChart.jsx
│   │       ├── BarChart.jsx
│   │       ├── PieChart.jsx
│   │       ├── Heatmap.jsx
│   │       └── DataLineageViewer.jsx
│   │
│   ├── redux/                              # Redux store & slices
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── uiSlice.js
│   │   │   ├── dashboardSlice.js
│   │   │   ├── dataSlice.js
│   │   │   └── notificationSlice.js
│   │   └── thunks/
│   │       ├── authThunks.js
│   │       ├── dataThunks.js
│   │       └── analyticsThunks.js
│   │
│   ├── hooks/                              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDashboard.js
│   │   ├── useFetch.js
│   │   ├── useLocalStorage.js
│   │   └── useResponsive.js
│   │
│   ├── services/
│   │   ├── api.js                          # Axios instance
│   │   ├── authService.js
│   │   ├── dataService.js
│   │   ├── analyticsService.js
│   │   └── reportingService.js
│   │
│   ├── mocks/                              # MSW mock handlers
│   │   ├── browser.js
│   │   ├── handlers/
│   │   │   ├── authHandlers.js
│   │   │   ├── dataHandlers.js
│   │   │   ├── analyticsHandlers.js
│   │   │   └── governanceHandlers.js
│   │   └── dummyData/
│   │       ├── students.js
│   │       ├── courses.js
│   │       ├── enrollments.js
│   │       ├── departments.js
│   │       ├── programs.js
│   │       └── generator.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── dateUtils.js
│   │   ├── studentIdGenerator.js
│   │   └── localStorage.js
│   │
│   ├── i18n/                               # Localization
│   │   ├── i18n.js
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── sw.json  (Kiswahili)
│   │   │   ├── fr.json  (French)
│   │   │   └── rw.json  (Kinyarwanda)
│   │   └── LanguageSwitcher.jsx
│   │
│   ├── styles/
│   │   ├── tailwind.css
│   │   ├── components/
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── tables.css
│   │   │   └── cards.css
│   │   └── utilities/
│   │       └── animations.css
│   │
│   └── App.jsx                             # Root component with routing

├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── logo.png

├── package.json                            # Dependencies
├── vite.config.js                          # Vite configuration
├── tailwind.config.js                      # Tailwind configuration
├── tailwind.css                            # Global Tailwind imports
├── .env.example                            # Environment variables template
├── .gitignore
├── README.md
└── changelog.md                            # Development changelog
```

---

## Component Hierarchy

### Authentication Flow

```
LoginPage
  ├── LoginForm
  │   ├── Input (email)
  │   ├── Input (password)
  │   └── Button
  └── MFAVerificationModal
      ├── OTPInput
      └── Button

RegisterPage
  ├── RegistrationForm
  │   ├── Input (name, email, etc.)
  │   ├── Select (role, institution)
  │   ├── PasswordStrengthIndicator
  │   └── Button
  └── EmailVerificationModal
      └── ResendButton
```

### Dashboard Layout

```
DashboardPage
  ├── Layout
  │   ├── Header
  │   │   ├── LanguageSwitcher
  │   │   ├── NotificationBell
  │   │   └── UserMenu
  │   ├── Sidebar
  │   │   └── NavMenu (role-based)
  │   ├── MainContent
  │   │   ├── DashboardCustomizer (customization controls)
  │   │   └── WidgetGrid
  │   │       ├── StatCard (multiple)
  │   │       ├── ChartCard (multiple)
  │   │       ├── Widget (customizable, draggable)
  │   │       └── Widget
  │   └── Footer
  │
  └── NotificationCenter (drawer)
      └── NotificationList
          └── NotificationItem (multiple)
```

### Data Integration Flow

```
DataIntegrationPage
  ├── DataSourceSummary
  │   └── ConnectedSystemCard (multiple)
  │
  ├── IntegrationWizard
  │   ├── Step 1: SystemSelection
  │   │   └── Select (LMS/SIS options)
  │   ├── Step 2: CredentialInput
  │   │   ├── Input (various)
  │   │   └── Button (test connection)
  │   ├── Step 3: FieldMapping
  │   │   ├── MappingInterface
  │   │   │   ├── SelectField (source)
  │   │   │   └── SelectField (target)
  │   │   └── AddMappingButton
  │   └── Step 4: Confirmation
  │       ├── MappingSummary
  │       └── Button (confirm)
  │
  └── DataSourceHealth
      └── HealthMonitorCard (multiple)
```

### Analytics Dashboard

```
LearningAnalyticsPage
  ├── FilterBar
  │   ├── DateRangeInput
  │   ├── Select (course/program)
  │   └── Button (apply filters)
  │
  ├── StatCards
  │   ├── StatCard (GPA)
  │   ├── StatCard (Completion Rate)
  │   └── StatCard (Engagement)
  │
  ├── ChartSection
  │   ├── ChartCard (PerformanceChart)
  │   ├── ChartCard (EngagementChart)
  │   └── ChartCard (AtRiskChart)
  │
  ├── AtRiskStudentsList
  │   ├── Table
  │   │   ├── TableRow (user, risk, action)
  │   │   └── TableRow (...)
  │   └── DetailModal
  │
  └── ExportControls
      ├── Button (export PDF)
      └── Button (export Excel)
```

---

## Data Flow Example: Student Login

```
1. User enters credentials → LoginForm
2. LoginForm validates → validateEmail, validatePassword
3. Form submitted → Redux thunk (authThunks.login)
4. Redux thunk dispatches action → authSlice (loading)
5. API call → authService.login()
6. MSW intercepts request → authHandlers
7. MSW returns mock response → dummyData/students.js
8. Response received → Redux thunk dispatches (success/failure)
9. Redux state updated → authSlice (user, token)
10. Component receives state → useAuth hook
11. useAuth checks auth state → redirects to dashboard or shows error
12. Dashboard renders → Layout + role-specific dashboard
13. Components access state → useSelector hooks
14. Charts/tables fetch data → Redux thunks
15. MSW handlers respond → dummyData generators
16. Data transformed → formatters.js
17. Components render with data → visualization components
```

---

## State Management Structure

### Redux Store

```javascript
{
  auth: {
    user: { id, name, email, role, department },
    token: "...",
    isAuthenticated: boolean,
    isLoading: boolean,
    error: null
  },

  ui: {
    currentLanguage: "en" | "sw" | "fr" | "rw",
    sidebarOpen: boolean,
    theme: "light" | "dark",
    notifications: [],
    notificationCount: 0
  },

  dashboard: {
    customLayout: { widget1: position, ... },
    isCustomizing: boolean,
    refreshRate: number
  },

  data: {
    students: [],
    courses: [],
    enrollments: [],
    loading: boolean,
    error: null
  },

  analytics: {
    performanceMetrics: {},
    engagementMetrics: {},
    atRiskStudents: [],
    loading: boolean
  }
}
```

---

## API Endpoint Structure (Mocked with MSW)

```
GET  /api/auth/me                    → Current user
POST /api/auth/login                 → User login
POST /api/auth/register              → User registration
POST /api/auth/logout                → User logout
POST /api/auth/mfa/setup             → MFA setup
POST /api/auth/mfa/verify            → Verify OTP

GET  /api/students                   → List students
GET  /api/students/:id               → Student detail
GET  /api/students/:id/record        → Student 360° record
GET  /api/students/:id/prediction    → Success prediction

GET  /api/courses                    → List courses
GET  /api/courses/:id                → Course detail
GET  /api/courses/:id/analytics      → Course analytics

GET  /api/enrollments                → List enrollments
GET  /api/enrollments/:id            → Enrollment detail

GET  /api/analytics/dashboard        → Dashboard metrics
GET  /api/analytics/learning         → Learning analytics
GET  /api/analytics/success          → Success predictions
GET  /api/analytics/curriculum       → Curriculum analytics

GET  /api/data-governance/quality    → Data quality metrics
GET  /api/data-governance/lineage    → Data lineage

GET  /api/compliance/accreditation   → Accreditation status
GET  /api/compliance/hec-reports     → HEC reporting data

GET  /api/security/audit-logs        → Audit logs
GET  /api/security/users             → User management
```

---

## Performance Considerations

### Code Splitting

- Each page component lazy-loaded
- Heavy visualization components loaded on-demand
- Redux store normalized for efficient updates

### Caching Strategy

- Redux store caches API responses
- localStorage for user preferences
- sessionStorage for temporary data
- MSW mock data generated once per session

### Optimization

- React.memo for expensive components
- useCallback for event handlers
- Virtual scrolling for large tables
- Image optimization for exports

---

## Testing Strategy

### Unit Tests

- Components: React Testing Library
- Utilities: Jest
- Redux: Redux Thunk middleware

### Integration Tests

- Page flows (auth → dashboard → analytics)
- Cross-component data passing
- Route navigation

### Mock Data Testing

- MSW handler validation
- Data consistency checks
- API response shapes

---

**Last Updated**: April 3, 2026
