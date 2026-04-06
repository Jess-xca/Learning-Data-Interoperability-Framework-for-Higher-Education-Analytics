# Academic Curator - User Guide

**Version:** 1.0.0  
**Last Updated:** April 6, 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Authentication](#authentication)
4. [Role-Based Features](#role-based-features)
5. [Data Management](#data-management)
6. [Accreditation & Compliance](#accreditation--compliance)
7. [Reporting](#reporting)
8. [Data Governance](#data-governance)
9. [Security & Access](#security--access)
10. [FAQs](#faqs)

---

## Getting Started

### System Requirements

- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet:** Stable connection (1 Mbps minimum)
- **Screen:** 1024x768 minimum (mobile devices supported)

### First Login

1. Visit `http://localhost:3000`
2. Click "Sign In"
3. Enter email and password
4. Complete multi-factor authentication (if enabled)
5. You'll be directed to your role-specific dashboard

### Profile Setup

1. Click profile icon (top right)
2. Select "My Profile"
3. Update personal information:
   - Name
   - Email
   - Phone
   - Department
   - Profile photo
4. Set preferences:
   - Language
   - Timezone
   - Notifications
5. Click "Save Changes"

---

## Dashboard Overview

### Main Components

**Header**

- Application logo and name
- Search bar (global search)
- Notifications bell
- Profile menu

**Sidebar Navigation**

- Role-specific menu items
- Active page indicator
- Icon-based menu items
- Collapsible on mobile

**Main Content Area**

- Page-specific content
- Customizable widgets
- Data tables
- Charts and visualizations

**Footer**

- Copyright information
- Quick links
- Version information

### Dashboard Widgets

Each dashboard includes:

- **Key Metrics Cards** - Overview of important KPIs
- **Charts & Graphs** - Visual data representation
- **Data Tables** - Detailed information
- **Quick Actions** - Common tasks

---

## Authentication

### Login

1. Enter your institutional email
2. Enter your password
3. Complete multi-factor authentication:
   - Receive code via email or SMS
   - Enter 6-digit code
   - Click "Verify"
4. Click "Sign In"

### Password Management

**Forgot Password:**

1. Click "Forgot Password" on login page
2. Enter email address
3. Click "Send Reset Link"
4. Check email for reset link
5. Create new password (minimum 8 characters, mix of letters/numbers/symbols)
6. Click "Update Password"

**Change Password:**

1. Go to Profile → Settings
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click "Update"

### Multi-Factor Authentication (MFA)

**Enable MFA:**

1. Go to Settings → Security
2. Click "Enable MFA"
3. Scan QR code with authenticator app (Google Authenticator, Microsoft Authenticator)
4. Enter 6-digit code
5. Click "Verify"

**Backup Codes:**

- Store backup codes in safe location
- Use if authenticator app is unavailable
- Get new codes from Settings → Security

---

## Role-Based Features

### Academic Admin

**Access:** Complete system access

**Primary Tasks:**

- View institutional analytics
- Manage user accounts
- Configure data integrations
- Review compliance reports
- Manage accreditation evidence

**Key Pages:**

- Dashboard (institutional overview)
- User Management
- Data Sources
- Accreditation
- Reports

---

### QA Officer

**Access:** Quality assurance focused features

**Primary Tasks:**

- Track accreditation readiness
- Collect compliance evidence
- Generate compliance reports
- Monitor data quality
- Review institutional reporting

**Key Pages:**

- Dashboard (compliance metrics)
- Accreditation (evidence collection)
- Data Governance
- Institutional Reporting
- Analytics

---

### Data Analyst

**Access:** Analytics and reporting

**Primary Tasks:**

- Create custom reports
- Analyze student performance
- Export data for analysis
- View data quality metrics
- Generate trend analysis

**Key Pages:**

- Dashboard (analytics)
- Analytics
- Reports
- Data Quality
- Pipeline

---

### Department Head (HOD)

**Access:** Department-level features

**Primary Tasks:**

- View department metrics
- Monitor course performance
- Track student outcomes
- Review faculty analytics
- Budget tracking

**Key Pages:**

- Dashboard (department focus)
- Students
- Courses
- Analytics
- Reports

---

### Lecturer

**Access:** Course and student focused

**Primary Tasks:**

- View my courses
- Monitor student performance
- Review attendance
- Grade students
- View analytics

**Key Pages:**

- Dashboard (course focus)
- My Courses
- My Students
- Performance
- Settings

---

### Student

**Access:** Personal and academic records

**Primary Tasks:**

- View my courses
- Check grades
- View my progress
- Update profile
- Access my records

**Key Pages:**

- Dashboard (personal)
- My Courses
- My Progress
- Settings

---

## Data Management

### Data Sources

**Location:** Admin Menu → Data Sources

**View Available Connectors:**

1. Click "Data Sources" in sidebar
2. See list of available system integrations:
   - Learning Management System (LMS)
   - Student Information System (SIS)
   - Assessment Platform
   - Attendance System
   - Finance System

**Connect New Source (Admin Only):**

1. Click "Add Data Source"
2. Select system type
3. Enter connection details:
   - API endpoint
   - Authentication credentials
   - Data refresh frequency
4. Click "Test Connection"
5. Click "Connect" to activate

---

### Data Mapping

**Location:** Admin Menu → Data Mapping

**View Data Mappings:**

1. Click "Data Mapping" in sidebar
2. Select source system
3. View field mappings between source and Academic Curator
4. See data transformation rules

**Edit Mappings (Admin Only):**

1. Click "Edit Mapping"
2. Adjust field assignments
3. Set transformation rules
4. Click "Save" to apply

---

### Data Quality

**Location:** Analytics Menu → Data Quality

**Monitor Quality Metrics:**

- Completeness (% of fields populated)
- Accuracy (data validation checks)
- Timeliness (last update timestamp)
- Consistency (cross-system validation)

**Quality Reports:**

1. Click "Generate Quality Report"
2. Select time period
3. Select data categories
4. Click "Generate"
5. Download as PDF or export data

---

## Accreditation & Compliance

### Accreditation Dashboard

**Location:** QA Menu → Accreditation

**Overview Tab:**

- Compliance status summary
- Progress towards accreditation
- Deadline tracking
- Key metrics

**Standards Tab:**

- Mapping of standards to evidence
- Compliance status by standard
- Timeline tracking
- Document requirements

**Evidence Tab:**

- Collect supporting documents
- Evidence status
- Upload files
- Track evidence completeness

**Reports Tab:**

- Generated accreditation reports
- Report status
- Completion percentage
- Download options

---

### Evidence Collection

**Upload Evidence:**

1. Go to Accreditation → Evidence Tab
2. Click "Upload Evidence"
3. Fill in form:
   - **Title:** Descriptive name
   - **Category:** Type of evidence (document/report/audit/assessment/other)
   - **Description:** Context and relevance
   - **File:** Upload document (max 50MB)
4. Click "Upload Evidence"
5. Evidence is reviewed and processed

**Supported Formats:**

- PDF
- Word (DOC, DOCX)
- Excel (XLS, XLSX)
- PowerPoint (PPT, PPTX)
- Images (JPG, PNG)

---

### Accreditation Reports

**Generate Report:**

1. Go to Accreditation → Reports Tab
2. Click "Continue Working" on desired report
3. Report generator opens
4. Select areas to include
5. Enable/disable "Include Evidence Summary"
6. Click "Generate Report"
7. Report is processed and displayed

**Report Contents:**

- Standards mapping
- Evidence summary
- Compliance status
- Institution overview
- Recommendations

---

## Reporting

### Institutional Reporting

**Location:** QA Menu → Institutional Reporting

**View Reports:**

1. Click "Institutional Reporting" in sidebar
2. See list of reports:
   - Accreditation Self-Study
   - Quality Assurance
   - Compliance Status
   - Performance Metrics

**Report Actions:**

- **Edit:** Modify report content
- **View:** Full report preview
- **Distribution:** Share with stakeholders
- **Analytics:** View access metrics

---

### Report Distribution

**Share Report:**

1. Select report
2. Click "Distribute" button
3. Configure distribution:
   - **Method:** Email or shareable link
   - **Schedule:** Immediate or scheduled
   - **Recipients:** Add email addresses
   - **Departments:** Assign recipients by department
4. **Options:**
   - Include evidence summary
   - Allow recipient comments
5. Click "Distribute"
6. Status shows "Sent"

**Track Distribution:**

- View recipient list
- See delivery status
- Track access count
- Monitor read time

---

### Analytics

**View Report Analytics:**

1. Select report
2. Click "Analytics" button
3. See metrics:
   - Total access count
   - Download count
   - Average read time
   - Unique viewers
   - Share count
   - Comments received

**Time Range Filtering:**

- Last 7 days
- Last 30 days
- All time

---

## Data Governance

### Data Dictionary

**Location:** Admin Menu → Data Governance (Dictionary Tab)

**Search Data Elements:**

1. Enter search term or filter by sensitivity
2. View element details:
   - Data type
   - Source system
   - Owner department
   - Last modified date
   - Classification level

**Data Classification:**

- **Public:** Freely shareable
- **Internal:** Within institution only
- **Confidential:** Restricted access

---

### Data Lineage

**Location:** Admin Menu → Data Governance (Lineage Tab)

**View Data Flow:**

1. Select pipeline
2. See data journey:
   - Source system
   - Processing stages (Extract, Transform, Load)
   - Destination system
   - Last run status
   - Records processed

**Pipeline Status:**

- Success: Green indicator
- Failed: Red indicator
- Running: Processing indicator

---

### Governance Policies

**Location:** Admin Menu → Data Governance (Policies Tab)

**View Policies:**

- Data Retention Policy (how long data is kept)
- Data Access Policy (who can access what)
- Data Quality Standards (acceptable thresholds)

**Policy Details:**

- Policy description
- Effective date
- Owner department
- Status (Active / Under Review)

---

## Security & Access

### Role-Based Access Control

**Location:** Admin Menu → Security & Access (RBAC Tab)

**View Roles:**

- Admin (full access)
- QA Officer (quality & compliance)
- Data Analyst (analytics & reporting)
- Department Head (department level)
- Lecturer (course level)
- Student (personal only)

**Permissions by Role:**
Each role has specific permissions for:

- Data access (view, edit, delete)
- Report access (generate, share, download)
- Configuration (settings, users, systems)
- Audit (logs, history, compliance)

---

### Audit Logging

**Location:** Admin Menu → Security & Access (Audit Tab)

**View Audit Logs:**

1. Click "Audit Logs" tab
2. Filter by:
   - **Action:** Login, data access, modification, export
   - **Date Range:** Today, this week, this month
3. See details:
   - User who performed action
   - Action type
   - Resource accessed
   - Timestamp
   - IP address
   - Success/Failure status

**Export Audit Report:**

- Click "Export Report"
- Select date range
- Download as PDF

---

### Data Encryption

**Location:** Admin Menu → Security & Access (Encryption Tab)

**Encryption Status:**

- **Data at Rest:** AES-256 encryption
- **Data in Transit:** TLS 1.3
- **Field Level:** Sensitive fields encrypted
- **Key Rotation:** Automatic every 90 days

**Secured Fields:**

- Student IDs
- Email addresses
- Phone numbers
- Social security numbers
- Financial information

---

## FAQs

### General

**Q: How do I reset my password?**
A: Click "Forgot Password" on the login page, enter your email, and follow the reset link in the email you receive.

**Q: Can I change my role?**
A: No, roles are assigned by administrators. Contact your System Admin if you need a role change.

**Q: How often is data updated?**
A: Data is synchronized with source systems daily by default, but refresh frequency is configurable.

---

### Accreditation & Compliance

**Q: What file formats are accepted for evidence?**
A: PDF, Word, Excel, PowerPoint, and image files (JPG, PNG). Maximum file size is 50MB.

**Q: How long does evidence review take?**
A: Evidence is typically reviewed within 1-2 business days.

**Q: Can I edit evidence after upload?**
A: Yes, you can edit title, description, and category. File replacement requires re-upload.

---

### Reporting

**Q: Who can receive distributed reports?**
A: Anyone with a valid institutional email address. Recipients don't need to be Academic Curator users.

**Q: Can recipients schedule future report delivery?**
A: Yes, you can select "Scheduled" and choose a delivery date/time.

**Q: How long are distributed reports accessible?**
A: By default, reports are accessible for 90 days. This is configurable by administrators.

---

### Data & Privacy

**Q: Who can see my personal information?**
A: Only authorized personnel can access your information based on role and need-to-know. All access is logged.

**Q: Can I download my data?**
A: If your role allows, you can export data as CSV or JSON. Contact your admin if you need this permission.

**Q: How is my data protected?**
A: All sensitive data is encrypted. Access is controlled via roles and permissions. All access is audited.

---

### Technical

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, and Edge (recent versions). Internet Explorer is not supported.

**Q: Do I need to install anything?**
A: No, Academic Curator is web-based. Just open in your browser.

**Q: What should I do if I encounter an error?**
A: Note the error message and timestamp, then contact your administrator.

**Q: Is there a mobile app?**
A: The web application is responsive and works on mobile devices. Native apps may be available in the future.

---

### Support

**Need Help?**

- **Internal Support:** Contact your System Administrator
- **Documentation:** Check the user guide and FAQ
- **Email:** support@institution.edu
- **Phone:** +250 XXX XXX XXX

---

## Getting Started Checklist

- [ ] Complete first login
- [ ] Set up multi-factor authentication (MFA)
- [ ] Update profile information
- [ ] Review role-specific features
- [ ] Change password (first time)
- [ ] Explore dashboard
- [ ] Read relevant sections of this guide

---

## Version History

| Version | Date        | Changes            |
| ------- | ----------- | ------------------ |
| 1.0.0   | Apr 6, 2026 | Initial user guide |

---
