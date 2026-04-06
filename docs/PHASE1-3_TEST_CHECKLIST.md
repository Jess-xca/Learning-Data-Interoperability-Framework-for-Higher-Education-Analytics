# Phase 1-3: Comprehensive Test Checklist

**Last Updated:** April 4, 2026  
**Status:** All Phases Feature-Complete - Ready for Testing

---

## 📋 PHASE 1: USER REGISTRATION & AUTHENTICATION TEST CHECKLIST

### Login Flow Tests

#### T1.1: Login Page Display

- [ ] Login page loads without errors
- [ ] Institution selector displays 4 options (Université de Kigali, KIST, AUB, Demo)
- [ ] No institution selected by default
- [ ] "Continue" button disabled until institution selected
- [ ] Page is mobile responsive (< 768px)

#### T1.2: Role Selection

- [ ] After institution selection, role selector appears
- [ ] All 6 roles display correctly (admin, qa, analyst, hod, lecturer, student)
- [ ] Role description text matches each role
- [ ] "Continue" button enabled after role selection
- [ ] Screen adapts to smaller screens without overflow

#### T1.3: Credential Entry

- [ ] Email field accepts valid email format
- [ ] Email field rejects invalid formats (no @, missing domain)
- [ ] Password field is masked (shows dots/bullets)
- [ ] Password field has min 8 character requirement
- [ ] Show/hide password toggle works
- [ ] Login button disabled until email + password filled
- [ ] Tab key navigation works through form fields

#### T1.4: MFA Code Entry

- [ ] MFA code input appears after credentials
- [ ] 6-digit code input only accepts numbers
- [ ] Input auto-focuses on field open
- [ ] Code auto-submits when 6 digits entered (optional UX)
- [ ] "Verify" button works when code entered
- [ ] "Back to password" link returns to credential step
- [ ] Invalid code shows error alert

#### T1.5: Session Persistence

- [ ] After successful login, user stays logged in on page refresh
- [ ] localStorage contains `ac_auth` key with encrypted user data
- [ ] Logout clears localStorage
- [ ] Session persists across tab navigation
- [ ] Session expires after configured timeout (optional)

#### T1.6: Keyboard Shortcuts

- [ ] Alt+L (Windows) or Option+L (Mac) triggers logout
- [ ] Logout confirmation appears before clearing session
- [ ] Confirmation cancel re-opens app
- [ ] Other keyboard shortcuts work (Alt+D for dashboard, etc.)

#### T1.7: Role-Based Redirection

- [ ] Admin logs in → redirects to admin dashboard
- [ ] QA Officer logs in → redirects to QA dashboard
- [ ] Data Analyst logs in → redirects to analyst dashboard
- [ ] Lecturer logs in → redirects to lecturer dashboard
- [ ] Student logs in → redirects to student dashboard
- [ ] Dashboard layout changes based on role

---

### User Registration Tests

#### T1.8: Registration Flow - Step 1 (Institution Selection)

- [ ] Registration page loads without errors
- [ ] Institution selector shows all 4 options
- [ ] Selecting institution advances to Step 2
- [ ] Back button or close icon returns to login
- [ ] Progress indicator shows Step 1 of 3

#### T1.9: Registration Flow - Step 2 (Credentials)

- [ ] Form requests: Full Name, Email, Role, Institution, Department (if applicable)
- [ ] All fields are required (validation error if empty)
- [ ] Email validation rejects invalid formats
- [ ] Password strength meter displays (0-4 bars)
- [ ] Strength updates as user types password
- [ ] Password requirements tooltip appears on focus
- [ ] Confirm password field validates match
- [ ] "Continue" button disabled until all fields valid

#### T1.10: Registration Flow - Step 3 (Email Verification)

- [ ] Email verification code input appears
- [ ] Instructions tell user to check inbox
- [ ] Code input accepts 6 digits
- [ ] "Resend code" option available after 30 seconds
- [ ] Correct code advances to success
- [ ] Incorrect code shows error (max 3 attempts)
- [ ] After max attempts, "Resend" automatically triggers

#### T1.11: Registration Success

- [ ] Success message displays after verification
- [ ] "Login Now" button returns to login page
- [ ] New user data is stored (check localStorage)
- [ ] User can immediately log in with new credentials

---

### Profile Management Tests

#### T1.12: Profile Page Display

- [ ] Profile page loads for authenticated user
- [ ] Current user info displays (name, email, role, institution)
- [ ] Photo/avatar displays or placeholder shows
- [ ] Edit button/icon is visible
- [ ] Editable sections are clearly indicated

#### T1.13: Edit Profile

- [ ] Clicking edit enables form fields
- [ ] Full name can be updated
- [ ] Email can be updated
- [ ] Phone number has proper formatting
- [ ] Department selection shows available options
- [ ] Save button only enabled if changes made
- [ ] Cancel reverts all changes
- [ ] Validation prevents invalid email/phone

#### T1.14: Document Upload

- [ ] Document upload component displays on profile page
- [ ] Drag-and-drop zone is visible and labeled
- [ ] File picker dialog opens on click
- [ ] File size error shows if > 10MB
- [ ] File type validation (PDF, DOC, IMG, etc.)
- [ ] Progress bar shows during upload
- [ ] Success message after upload
- [ ] Uploaded file appears in list
- [ ] File delete button removes from list
- [ ] File list persists after refresh

---

### User Management (Admin) Tests

#### T1.15: User Management Page Access

- [ ] Only admin role can access /users page
- [ ] Non-admins see "Access Denied" message
- [ ] Page loads with mock user data
- [ ] User table displays all columns (Name, Email, Role, Status)
- [ ] No errors in console

#### T1.16: User Search & Filter

- [ ] Search by name works (partial match)
- [ ] Search by email works
- [ ] Search results update instantly
- [ ] Role filter shows only selected role users
- [ ] Status filter shows active/inactive/pending users
- [ ] Composite filter (role + status) works together
- [ ] Clear filters button resets all filters
- [ ] Result count updates with filters

#### T1.17: User CRUD Operations

- [ ] Create user: Fill form → Submit → Appears in list
- [ ] Update user: Click edit → Change fields → Save → Changes persist
- [ ] Delete user: Click delete → Confirm → Removed from list
- [ ] Delete confirmation prevents accidental removal
- [ ] Error handling for form validation shows inline errors
- [ ] Success toast messages appear after each action

#### T1.18: User Editing

- [ ] Edit modal/form displays current user data
- [ ] Name, email, role, department are editable
- [ ] Status dropdown works (active/inactive/pending)
- [ ] Email validation prevents duplicates
- [ ] Form validation prevents empty required fields
- [ ] Save updates Redux state
- [ ] Updated user appears correctly in table

---

## 🔐 PHASE 2: MFA & PASSWORD MANAGEMENT TEST CHECKLIST

### TOTP Setup Tests

#### T2.1: TOTP Setup Page Access

- [ ] MFA Setup page accessible from /security route
- [ ] Page shows two tabs: "Set Up TOTP" and "Change Password"
- [ ] TOTP tab is default/active
- [ ] Unauthenticated users can still access (shows setup flow)
- [ ] Page title and descriptions are clear

#### T2.2: Generate TOTP Secret

- [ ] Clicking "Generate Secret" generates 32-char secret
- [ ] QR code displays immediately
- [ ] QR code is scannable (Google Authenticator, Authy, etc.)
- [ ] Manual entry field shows secret value
- [ ] Copy button copies secret to clipboard
- [ ] Placeholder text shows where to paste manually

#### T2.3: QR Code Display

- [ ] QR code image renders from api.qrserver.com
- [ ] QR code is 300x300px
- [ ] QR code contains: `otpauth://totp/` URI
- [ ] QR code URI includes issuer (Academic Curator)
- [ ] QR code URI includes account identifier (email)
- [ ] QR code can be scanned from screen or printed

#### T2.4: Manual Secret Entry

- [ ] Manual input field accepts text paste
- [ ] Manual input is read-only (informational)
- [ ] Copy-to-clipboard works for mobile use cases
- [ ] Text is single-spaced / easy to read

#### T2.5: TOTP Code Verification

- [ ] "Verification Code" input field appears
- [ ] Input accepts 6 digits only
- [ ] Input rejects letters/special chars
- [ ] Code is generated from authenticator app
- [ ] "Verify & Enable" button validates code
- [ ] Valid code (current TOTP) enables TOTP
- [ ] Invalid code shows error: "Invalid verification code"
- [ ] Error doesn't disable button (user can retry)

#### T2.6: TOTP Success & Backup Codes

- [ ] After successful verification, success alert appears
- [ ] "TOTP Enabled" badge displays
- [ ] Backup codes section appears
- [ ] 10 backup codes display (format: 8 digits)
- [ ] Codes are copyable
- [ ] Download button exports codes to text file
- [ ] Warning: "Save these codes in a secure location"
- [ ] Each backup code shows remaining uses (starts at 1)

#### T2.7: TOTP Management

- [ ] When TOTP enabled, "Disable TOTP" button appears
- [ ] Clicking disable shows confirmation dialog
- [ ] Confirmation asks "Are you sure?"
- [ ] Confirming disables TOTP
- [ ] After disable, QR code section reappears
- [ ] Backup codes are cleared after disable
- [ ] TOTP status badge changes to "TOTP Disabled"

#### T2.8: Backup Code Usage

- [ ] Backup codes can be used during login (in place of TOTP code)
- [ ] Each use decrements remaining count (1 → 0)
- [ ] Used codes cannot be reused
- [ ] Warning when < 3 codes remain
- [ ] Generate new backup codes option appears when < 3 remain

---

### Password Reset Tests

#### T2.9: Password Reset Page Access

- [ ] Password reset page accessible from /password-reset
- [ ] Page accessible without authentication
- [ ] Page shows "Forgot your password?" flow
- [ ] Step 1: Email input field
- [ ] Step indicates "Step 1 of 2" or similar

#### T2.10: Email Verification

- [ ] Email input accepts valid format
- [ ] Email validation rejects invalid addresses
- [ ] "Send Reset Code" button submits email
- [ ] Button shows loading state during submission
- [ ] Success message: "Check your email for reset code"
- [ ] Mock: Code auto-displays or stores in localStorage
- [ ] Resend option appears after delay (30s)
- [ ] Code expiry shown (15 minutes in requirements)

#### T2.11: Reset Code Verification

- [ ] Step 2 shows 6-digit code input
- [ ] Input accepts only numbers
- [ ] "Verify Code" button validates
- [ ] Valid code advances to Step 3
- [ ] Invalid code shows: "Invalid or expired code"
- [ ] After 3 failed attempts, "Request new code" link appears
- [ ] Correct code unlocks password reset form

#### T2.12: New Password Entry

- [ ] New password field has 8+ character requirement
- [ ] Confirm password field matches validation
- [ ] Password strength meter displays
- [ ] Show/hide password toggle works for both fields
- [ ] Mismatch error: "Passwords do not match"
- [ ] "Reset Password" button disabled until valid

#### T2.13: Password Reset Completion

- [ ] Submit valid passwords shows loading state
- [ ] Success message: "Password reset successfully!"
- [ ] "Login Now" button appears
- [ ] Clicking goes to login page
- [ ] Old password no longer works
- [ ] New password can be used to login
- [ ] Session clears after reset (user must re-login)

---

### Password Change Tests (Authenticated Users)

#### T2.14: Password Change Tab

- [ ] "Change Password" tab in MFA Setup page
- [ ] Tab only visible for authenticated users
- [ ] Clicking tab shows form
- [ ] Form has 3 fields: Current Password, New Password, Confirm Password

#### T2.15: Change Password Form

- [ ] Current password field is required
- [ ] New password has 8+ requirement
- [ ] Confirm password validates match
- [ ] Password strength meter shows for new password
- [ ] Show/hide toggles work for all fields
- [ ] "Change Password" button disabled until valid

#### T2.16: Change Password Submission

- [ ] Empty current password shows error
- [ ] Incorrect current password shows error: "Current password incorrect"
- [ ] Matching new/confirm passwords submit successfully
- [ ] Success message: "Password changed successfully!"
- [ ] User is NOT logged out after change
- [ ] New password works on next login
- [ ] Old password no longer works

---

## 🔗 PHASE 3: DATA CONNECTORS TEST CHECKLIST

### Data Sources Page Tests

#### T3.1: Page Load

- [ ] DataSources page loads at /data-sources
- [ ] Admin-only access (others see permission denied)
- [ ] Page title: "Data Sources"
- [ ] No console errors
- [ ] Page is mobile responsive

#### T3.2: Header Section

- [ ] "Connect New Source" button displays
- [ ] Button icon is "add" (plus sign)
- [ ] Clicking button opens wizard modal
- [ ] Page description explains data source management
- [ ] Health metrics display at top (99.84% uptime, etc.)

#### T3.3: Health Overview Card

- [ ] Global Pipeline Health shows percentage (99.84%)
- [ ] Uptime trend badge shows (+0.02%)
- [ ] Time period selector (24h, 7d) available
- [ ] Chart shows 12 hourly uptime datapoints
- [ ] Chart bars are hoverable (show tooltip)
- [ ] X-axis shows time labels (00:00, 06:00, 12:00, 18:00, Current)

#### T3.4: Stats Cards

- [ ] Active Ingestions card shows record count (14,282)
- [ ] Records/minute display
- [ ] Open Issues card shows count (02)
- [ ] Issue description: "Schema mismatches detected"
- [ ] Cards have appropriate color coding (success, warning, error)

---

### Connected Ecosystem Grid Tests

#### T3.5: Data Source Cards Display

- [ ] 4 data source cards display (Canvas, Banner, Alma, Salesforce)
- [ ] Each card shows: Icon, Name, Type, Status Badge
- [ ] Status colors correct (Green: connected, Yellow: warning, Red: error)
- [ ] Cards are clickable
- [ ] Hover effect highlights card
- [ ] Grid responsive (1, 2, 4 columns based on screen size)

#### T3.6: Data Source Card Details

- [ ] Last Sync: Shows timestamp (2m ago, 14m ago, etc.)
- [ ] Reliability: Shows percentage (99.9%, 98.4%, 92.1%, 99.7%)
- [ ] Cards show color-coded reliability (green > yellow > red)
- [ ] Icon matches source type (school, person_search, local_library, handshake)
- [ ] Source type label displays (lms, sis, library, crm)

#### T3.7: Source Selection

- [ ] Clicking source card highlights it
- [ ] Details panel appears below grid
- [ ] Panel shows additional information
- [ ] Close button in details panel
- [ ] Selecting different source updates panel

---

### Source Details Panel Tests

#### T3.8: Details Display

- [ ] Status badge shows current status
- [ ] Status color matches status (green/yellow/red)
- [ ] Last Sync shows timestamp
- [ ] Reliability shows percentage
- [ ] Throughput shows records per minute
- [ ] All data matches source card data

#### T3.9: Action Buttons

- [ ] "Sync Now" button with sync icon
- [ ] "Configure" button with settings icon
- [ ] "View Logs" button with bug_report icon
- [ ] Buttons are interactive (not just display)

---

### Ingestion Logs Table Tests

#### T3.10: Table Display

- [ ] Table title: "Recent Ingestion Activity"
- [ ] "Download Report" link in header
- [ ] Table is scrollable on mobile
- [ ] 6 columns: Transaction ID, Source, Entity Type, Volume, Duration, Status
- [ ] Header row is sticky (stays visible when scrolling)

#### T3.11: Log Entries

- [ ] 4+ sample log entries display
- [ ] Transaction IDs formatted: #TX-[number]-[source]
- [ ] Source System names match connected sources
- [ ] Entity Type describes data type (Student Gradebook, Course Registration, etc.)
- [ ] Volume shows record count (0 for failed jobs)
- [ ] Duration shows time in seconds (12.4s, 4.1s, --, 45.2s)
- [ ] Status badges: Green (success), Red (error)
- [ ] Timestamps display correctly (YYYY-MM-DD HH:MM:SS)

#### T3.12: Table Features

- [ ] Alternating row colors (zebra striping)
- [ ] Rows are hoverable
- [ ] Column headers are bold/uppercase
- [ ] Table responsive on mobile (scroll horizontal)
- [ ] Download Report works (optional: file generated)

---

### Integration Wizard Tests

#### T3.13: Wizard Launch

- [ ] "Connect New Source" button opens modal
- [ ] Modal shows title: "Integration Wizard"
- [ ] Modal shows step indicator (Step 1 of 3)
- [ ] Close button (X) in top right
- [ ] Modal is centered and scrollable
- [ ] Backdrop click doesn't close modal

#### T3.14: Step 1 - Type Selection

- [ ] 5 connector types display:
  - [ ] Learning Management Systems (with options)
  - [ ] Student Information Systems (with options)
  - [ ] Library Systems (with options)
  - [ ] CRM Systems (with options)
  - [ ] Custom API (with options)
- [ ] Each type has description text
- [ ] Each type has 3-4 example systems
- [ ] Clicking type advances to Step 2
- [ ] Back button unavailable on Step 1

#### T3.15: Step 2 - Configuration

- [ ] Connection Name field with placeholder
- [ ] API Endpoint field with placeholder URL
- [ ] API Key field (with password masking)
- [ ] Client Secret field (with password masking)
- [ ] Retry Attempts spinner (1-10, default 3)
- [ ] Timeout spinner (in seconds, default 30)
- [ ] "Test Connection" button
- [ ] Back button returns to Step 1
- [ ] Form validation prevents empty required fields

#### T3.16: Step 2 - Test Connection

- [ ] Clicking "Test Connection" shows loading state
- [ ] Loading indicator with "Testing connection..." text
- [ ] After ~1.5s, shows result (success or failure)
- [ ] Success: Green checkmark, "Connection successful!" message
- [ ] Failure: Red X, "Connection test failed" message
- [ ] Retry button appears on failure
- [ ] On success, "Ready to configure" badge shows
- [ ] Step 3 unlock/enable

#### T3.17: Step 3 - Test Result Display

- [ ] Shows previous test result
- [ ] Retest button for re-running test
- [ ] Connect button only enabled after successful test
- [ ] Connect button disabled warning if test failed
- [ ] Save Draft button available

#### T3.18: Wizard Completion

- [ ] Clicking "Connect" creates connector
- [ ] Success toast message appears
- [ ] Modal closes automatically
- [ ] New source appears in ecosystem grid
- [ ] New source has status "connected"
- [ ] Form resets for next wizard

---

### Persistent State Tests

#### T3.19: Data Persistence

- [ ] Data sources persist after refresh
- [ ] localStorage contains connector data
- [ ] Job data persists in localStorage
- [ ] Health data updates on refresh
- [ ] Wizard state clears on completion

#### T3.20: Error Handling

- [ ] Network error shows graceful message
- [ ] Invalid endpoint shows "Failed to connect"
- [ ] Missing credentials shows "Invalid configuration"
- [ ] Timeout after 30s shows "Connection timeout"
- [ ] Max 3 retry attempts configured

---

## 🚀 TEST EXECUTION GUIDE

### Manual Testing Steps

1. **Phase 1**: Follow T1.1 through T1.18 sequentially
2. **Phase 2**: Follow T2.1 through T2.16 sequentially
3. **Phase 3**: Follow T3.1 through T3.20 sequentially

### Automated Testing (TBD)

- Unit tests for hooks (useDataConnector, useIngestionJobs, useTOTP, usePasswordReset)
- Integration tests for form submissions
- E2E tests for full flows (auth → MFA → data connector)

### Browser Testing

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Performance Testing

- Page load < 3s
- Form submission < 1s
- Table render < 500ms
- Modal open/close < 300ms

---

## 📊 Test Results Summary

| Test Category       | Total  | Pass    | Fail    | Notes              |
| ------------------- | ------ | ------- | ------- | ------------------ |
| Phase 1: Auth       | 18     | TBD     | TBD     | All features ready |
| Phase 2: MFA        | 16     | TBD     | TBD     | All features ready |
| Phase 3: Connectors | 20     | TBD     | TBD     | All features ready |
| **TOTAL**           | **54** | **TBD** | **TBD** | **Ready for QA**   |

---

**Next Steps:**

1. Run through test checklist
2. Document any failures/issues
3. Proceed to Phase 4 testing
4. Load test with 1000+ users (TBD)
