# Learning Data Interoperability Framework for Higher Education Analytics

A modular, frontend-first prototype for integrating educational data across higher education systems. Designed for institutional analytics, student success prediction, and evidence-based decision-making.

**Status**: Analysis Phase ✅ → Development Phase ⏳

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm v9+ or yarn v3+

### Installation
```bash
git clone <repository>
cd Prototype
npm install
npm run dev
```

Opens at `http://localhost:3000`

---

## 📋 Project Overview

### Scope
- **Target**: Rwandan universities (with international applicability)
- **Focus**: Learning data integration, analytics, and governance
- **Approach**: Frontend-first modular architecture
- **Data Freshness**: Real-time or daily batch (configurable)

### Key Features
✅ **User Authentication** - Multi-factor authentication, role-based access  
✅ **Customizable Dashboards** - Role-specific analytics views  
✅ **Data Integration UI** - LMS, SIS, and assessment platform connectors  
✅ **Learning Analytics** - Student performance, engagement, at-risk identification  
✅ **Student Success Prediction** - AI-powered early warning system  
✅ **Curriculum Analytics** - Course/program effectiveness tracking  
✅ **Accreditation Support** - HEC compliance evidence collection  
✅ **Institutional Reporting** - HEC and FERPA-compliant reporting  
✅ **Data Governance** - Privacy, consent, audit, lineage tracking  

### Supported Languages
- 🇬🇧 English (default)
- 🇹🇿 Kiswahili
- 🇫🇷 French
- 🇷🇼 Kinyarwanda (partial)

---

## 🏗️ Architecture

### Technology Stack
| Component | Technology |
|-----------|-----------|
| **Frontend** | React.js 18+ |
| **Styling** | Tailwind CSS 3+ |
| **State Management** | Redux Toolkit |
| **Mock API** | Mock Service Worker (MSW) |
| **Visualization** | Recharts, D3.js, Plotly |
| **Build Tool** | Vite |

### System Architecture
```
User Interface (React Components)
    ↓
Redux State Management
    ↓
API Service Layer (Axios)
    ↓
Mock Service Worker (MSW)
    ↓
Dummy Data Generators
    ↓
Future: Backend APIs
```

---

## 📁 Project Structure

```
Prototype/
├── docs/                          # Comprehensive documentation
│   ├── PROJECT_OVERVIEW.md       # Project summary
│   ├── ARCHITECTURE.md           # System design & structure
│   ├── DUMMY_DATA_SCHEMA.md      # Data model specification
│   ├── TASKS.md                  # Work breakdown & task tracking
│   ├── COMPLIANCE_FRAMEWORK.md   # HEC + FERPA compliance
│   ├── STUDENT_ID_FORMAT.md      # Student ID specification
│   ├── COMPONENT_LIBRARY.md      # UI component documentation
│   ├── API_MOCKS.md              # Mock API endpoints
│   └── SETUP_GUIDE.md            # Installation & configuration
├── src/                           # Source code
│   ├── pages/                    # Page components & routes
│   ├── components/               # Reusable UI components
│   ├── redux/                    # Redux store & slices
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API & utility services
│   ├── mocks/                    # MSW mock handlers
│   ├── styles/                   # Global styles
│   ├── utils/                    # Utility functions
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # Entry point
├── public/                        # Static assets
├── package.json                   # Dependencies & scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── .env.example                  # Environment template
└── README.md                      # This file
```

---

## 📚 Documentation Guide

| Document | Purpose |
|----------|---------|
| **PROJECT_OVERVIEW.md** | Executive summary & objectives |
| **ARCHITECTURE.md** | System design, data flow, component hierarchy |
| **DUMMY_DATA_SCHEMA.md** | Data entities, relationships, generation rules |
| **TASKS.md** | Complete task breakdown by phase (65 tasks) |
| **COMPLIANCE_FRAMEWORK.md** | HEC & FERPA requirements & implementation |
| **STUDENT_ID_FORMAT.md** | Student ID specification: YYYYSSDDDNNN |
| **COMPONENT_LIBRARY.md** | Reusable component catalog with examples |
| **API_MOCKS.md** | Mock API endpoints & response formats |
| **SETUP_GUIDE.md** | Installation, configuration, troubleshooting |

👉 **Start with**: `docs/PROJECT_OVERVIEW.md`

---

## 🎯 Development Phases

### Phase 1: Foundation (Current)
- ⏳ Project setup & dependencies
- ⏳ Dummy data generator
- ⏳ Base component library
- ⏳ Redux store configuration

### Phase 2: Authentication & Dashboard
- ⏳ User registration & login
- ⏳ Role-based dashboards
- ⏳ Dashboard customization

### Phase 3: Data Integration (Parallel)
- ⏳ Data source connectors
- ⏳ Standards mapping UI
- ⏳ Student record viewer

### Phase 4: Analytics (Parallel)
- ⏳ Learning analytics dashboard
- ⏳ Success prediction
- ⏳ Curriculum analytics

### Phase 5: Governance (Parallel)
- ⏳ Data governance dashboard
- ⏳ Accreditation support
- ⏳ Institutional reporting
- ⏳ Security management

### Phase 6: Integration & Testing
- ⏳ Cross-module testing
- ⏳ Performance optimization
- ⏳ Documentation completion

**Estimated Total Effort**: 135-155 hours solo development

---

## 👥 User Roles

| Role | Dashboard Focus | Key Features |
|------|-----------------|--------------|
| **Academic Admin** | Institutional overview | Enrollment, program analytics |
| **QA Officer** | Accreditation readiness | Compliance tracking, evidence |
| **Data Analyst** | Deep analytics | Custom reports, data quality |
| **Department Head** | Department metrics | Course performance, outcomes |
| **System Admin** | Security & governance | User management, audit logs |

---

## 🔐 Compliance & Security

### Standards
- **HEC** (Higher Education Council - Rwanda): Institutional reporting, accreditation
- **FERPA** (Family Educational Rights and Privacy Act - USA): Student privacy, access control

### Security Features
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Data encryption (at rest & in transit)
- Comprehensive audit logging
- Consent tracking for data disclosure
- Automatic data retention & deletion

### Privacy
- Student access to own records only
- Parent/guardian notification with consent
- Third-party disclosure control
- Student amendment rights
- Data classification by sensitivity

---

## 📊 Student ID Format

**Pattern**: `YYYYSSDDDNNN`

Example: `202502SENG001`
- **2025** = Enrollment year
- **02** = Semester (01 or 02)
- **SENG** = Department code (3 letters)
- **001** = Sequential number

→ See `docs/STUDENT_ID_FORMAT.md` for details

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run test            # Run tests
npm run test:coverage   # Tests with coverage

# (Future)
npm run db:seed         # Generate dummy data
npm run db:reset        # Reset database
```

---

## 🔄 Development Workflow

### Setup Development Environment
```bash
# 1. Clone repository
git clone <url>
cd Prototype

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start development server
npm run dev
```

### Create Feature Branch
```bash
# Create feature branch
git checkout -b feature/module-name

# Make changes
# ... code ...

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/module-name
```

---

## 🧪 Testing

Mock data is automatically generated and served via Mock Service Worker (MSW):

- **1000 students** with realistic profiles
- **80 courses** across 6 departments
- **4000 enrollments** with grade distributions
- **50000+ LMS activities** and attendance records

All data is:
- Generated synthetically (no real PII)
- Rwandan institution context
- Realistic correlations (GPA ↔ attendance, etc.)
- Accessible via mock API endpoints

---

## 📖 Learning Materials

### Getting Started
1. Read `docs/PROJECT_OVERVIEW.md` for project context
2. Review `docs/ARCHITECTURE.md` for system design
3. Follow `docs/SETUP_GUIDE.md` for installation
4. Check `docs/TASKS.md` to identify work items

### Component Development
- `docs/COMPONENT_LIBRARY.md` - Catalog of reusable components
- Reference React docs: https://react.dev
- Tailwind CSS docs: https://tailwindcss.com

### Data & API
- `docs/DUMMY_DATA_SCHEMA.md` - Data models
- `docs/API_MOCKS.md` - Mock endpoints
- MSW Docs: https://mswjs.io

### Compliance
- `docs/COMPLIANCE_FRAMEWORK.md` - HEC & FERPA rules
- `docs/STUDENT_ID_FORMAT.md` - ID generation & validation

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000 && taskkill /PID <PID> /F
# macOS/Linux: lsof -ti:3000 | xargs kill -9
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind Styles Not Applied
- Verify `tailwind.config.js` content paths
- Restart dev server: `npm run dev`
- Check CSS import in `src/index.css`

See `docs/SETUP_GUIDE.md` for more solutions.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "feat: description"`
4. Push to remote: `git push origin feature/name`
5. Create pull request for review

---

## 📝 License

[Specify your license - e.g., MIT, Apache 2.0]

---

## 💬 Contact & Support

- **Project Lead**: [Your Name]
- **Documentation**: `/docs` folder
- **Issues & Questions**: GitHub Issues or email

---

## 📅 Recent Changes

- ✅ **Apr 3, 2026** - Project analysis complete, full documentation created, tech stack finalized
  - Created comprehensive documentation (8 files, 10,000+ lines)
  - Defined 65 development tasks across 6 phases
  - Established compliance framework (HEC + FERPA)
  - Designed dummy data schema & student ID format

---

## 🎓 Educational Context

This framework was designed as part of an academic research and prototype project to:
- Demonstrate best practices in higher education data integration
- Provide a reference architecture for institutional data systems
- Support institutional analytics and decision-making
- Ensure compliance with educational data privacy regulations
- Enable future production implementation

**Note**: This is a prototype implementation. Production deployment would require backend infrastructure, database implementation, and additional security hardening.

---

**Last Updated**: April 3, 2026
