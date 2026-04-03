# Component Library Reference

## Overview

The Component Library provides reusable, accessible UI components built with React, Tailwind CSS, and Redux. Components follow a modular design pattern for consistency across the application.

---

## Component Categories

### 1. Form Components

#### Input Field

```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="user@university.rw"
  value={email}
  onChange={handleEmailChange}
  error="Invalid email format"
  required={true}
  disabled={false}
  className="mb-4"
/>
```

**Props**:

- `label`: Label text
- `type`: email, password, text, number, etc.
- `placeholder`: Placeholder text
- `value`: Input value
- `onChange`: Change handler
- `error`: Error message (if validation fails)
- `required`: Show required indicator
- `disabled`: Disable input
- `className`: Additional CSS classes

---

#### Select/Dropdown

```jsx
<Select
  label="Department"
  options={[
    { value: "SENG", label: "Software Engineering" },
    { value: "BUS", label: "Business" },
    { value: "SCI", label: "Science" },
  ]}
  value={selectedDept}
  onChange={handleDeptChange}
  error="" // Empty if valid
  required={true}
/>
```

**Props**:

- `label`: Label text
- `options`: Array of {value, label} objects
- `value`: Selected value
- `onChange`: Change handler
- `error`: Error message
- `required`: Required indicator
- `searchable`: Enable search (default: true)

---

#### Checkbox

```jsx
<Checkbox
  label="I agree to terms"
  checked={agreedToTerms}
  onChange={handleCheckChange}
  disabled={false}
  error=""
/>
```

---

#### Radio Button

```jsx
<RadioGroup
  label="Select Role"
  options={[
    { value: "STUDENT", label: "Student" },
    { value: "FACULTY", label: "Faculty" },
    { value: "ADMIN", label: "Administrator" },
  ]}
  selectedValue={role}
  onChange={handleRoleChange}
  direction="vertical" // or "horizontal"
/>
```

---

#### Date Picker

```jsx
<DatePicker
  label="Date of Birth"
  value={dateOfBirth}
  onChange={handleDateChange}
  format="YYYY-MM-DD"
  minDate="1990-01-01"
  maxDate={today()}
  error=""
/>
```

---

#### File Upload

```jsx
<FileUpload
  label="Upload Document"
  accept=".pdf,.doc,.docx"
  maxSize={5} // MB
  multiple={false}
  onUpload={handleFileUpload}
  error=""
/>
```

---

### 2. Button Components

#### Primary Button

```jsx
<Button
  variant="primary"
  size="md"
  onClick={handleSubmit}
  disabled={isLoading}
  isLoading={isLoading}
>
  Submit
</Button>
```

**Variants**: `primary`, `secondary`, `danger`, `success`, `outline`  
**Sizes**: `xs`, `sm`, `md`, `lg`, `xl`

---

#### Button Group

```jsx
<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="outline">Delete</Button>
</ButtonGroup>
```

---

### 3. Data Display Components

#### Table

```jsx
<Table
  columns={[
    { key: "studentId", label: "Student ID", sortable: true },
    { key: "name", label: "Full Name", sortable: true },
    { key: "gpa", label: "GPA", sortable: true, type: "number" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" onClick={() => viewStudent(row.studentId)}>
          View
        </Button>
      ),
    },
  ]}
  data={students}
  pagination={{ pageSize: 10 }}
  onChange={handleTableChange}
  loading={isLoading}
/>
```

#### Card

```jsx
<Card
  title="Student Performance"
  subtitle="Spring 2025"
  elevation={1}
  className="mb-4"
>
  <div className="p-4">
    <p>GPA: 3.45</p>
    <p>Status: Excellent</p>
  </div>
</Card>
```

---

#### Badge

```jsx
<Badge variant="success" size="md">
  Active
</Badge>
```

**Variants**: `success`, `danger`, `warning`, `info`, `default`

---

#### List

```jsx
<List
  items={[
    { id: 1, title: "First Item", subtitle: "Description" },
    { id: 2, title: "Second Item", subtitle: "Description" },
  ]}
  renderItem={(item) => (
    <div key={item.id}>
      <h4>{item.title}</h4>
      <p>{item.subtitle}</p>
    </div>
  )}
/>
```

---

### 4. Feedback Components

#### Alert

```jsx
<Alert
  type="error"
  title="Validation Error"
  message="Please fill in all required fields"
  dismissible={true}
  onDismiss={handleDismiss}
/>
```

**Types**: `success`, `error`, `warning`, `info`

---

#### Modal

```jsx
<Modal
  isOpen={showModal}
  title="Confirm Action"
  onClose={handleCloseModal}
  actions={[
    { label: "Cancel", onClick: handleCloseModal },
    { label: "Confirm", onClick: handleConfirm, variant: "danger" },
  ]}
>
  <p>Are you sure you want to delete this record?</p>
</Modal>
```

---

#### Toast Notification

```jsx
// In component or Redux action:
showToast({
  type: "success",
  message: "Student record updated successfully",
  duration: 3000,
});
```

---

#### Loading Spinner

```jsx
<Spinner size="lg" color="primary" />
```

---

### 5. Layout Components

#### Layout

```jsx
<Layout
  title="Dashboard"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ]}
>
  <MainContent>{/* Page content */}</MainContent>
</Layout>
```

---

#### Sidebar

```jsx
<Sidebar collapsed={sidebarCollapsed}>
  <nav className="space-y-4">
    <NavItem href="/dashboard" icon="Home" label="Dashboard" />
    <NavItem href="/students" icon="Users" label="Students" />
    <NavItem href="/analytics" icon="BarChart" label="Analytics" />
  </nav>
</Sidebar>
```

---

#### Header

```jsx
<Header
  title="Application"
  rightContent={
    <div className="flex gap-4">
      <LanguageSwitcher />
      <NotificationBell count={3} />
      <UserMenu user={user} />
    </div>
  }
/>
```

---

### 6. Dashboard Components

#### Stat Card

```jsx
<StatCard
  title="Total Students"
  value="1,250"
  subtitle="Active enrollment"
  changePercent={5.2}
  icon="Users"
  color="blue"
  onClick={() => navigate("/students")}
/>
```

---

#### Chart Card

```jsx
<ChartCard
  title="Student Performance Trends"
  subtitle="Last 6 months"
  chart={<LineChart data={performanceData} xAxisKey="month" yAxisKey="gpa" />}
  actions={[{ label: "Export", onClick: handleExport }]}
/>
```

---

#### Widget Grid

```jsx
<WidgetGrid
  columns={3}
  gap={4}
  widgets={[
    { id: 1, component: StatCard, props: {...} },
    { id: 2, component: ChartCard, props: {...} },
    { id: 3, component: Widget, props: {...} }
  ]}
  onReorder={handleReorder}
  customizable={true}
/>
```

---

### 7. Chart Components

#### Line Chart

```jsx
<LineChart
  data={[
    { month: "Jan", gpa: 3.2, attendance: 0.95 },
    { month: "Feb", gpa: 3.4, attendance: 0.93 },
  ]}
  xAxisKey="month"
  yAxisKeys={["gpa", "attendance"]}
  title="Performance Trend"
/>
```

---

#### Bar Chart

```jsx
<BarChart
  data={departmentStats}
  xAxisKey="department"
  yAxisKey="studentCount"
  title="Enrollment by Department"
/>
```

---

#### Pie Chart

```jsx
<PieChart
  data={[
    { name: "Active", value: 800 },
    { name: "On Leave", value: 50 },
    { name: "Graduated", value: 150 },
  ]}
  title="Student Status Distribution"
/>
```

---

### 8. Data Lineage Component

#### Data Lineage Viewer

```jsx
<DataLineageViewer
  nodes={[
    { id: "lms", label: "LMS (Moodle)", type: "source" },
    { id: "sis", label: "SIS", type: "source" },
    { id: "transform", label: "ETL Transform", type: "process" },
    { id: "record", label: "Student Record", type: "target" },
  ]}
  edges={[
    { from: "lms", to: "transform" },
    { from: "sis", to: "transform" },
    { from: "transform", to: "record" },
  ]}
  onNodeClick={handleNodeClick}
/>
```

---

## Component Composition Example

### Creating a Custom Student List Component

```jsx
// StudentListComponent.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Alert } from "../components";
import { deleteStudent } from "../redux/slices/dataSlice";

export function StudentListComponent() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { students, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const columns = [
    { key: "studentId", label: "Student ID", sortable: true },
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "gpa", label: "GPA", sortable: true, type: "number" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => viewStudent(row)}>
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedStudent(row);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    dispatch(deleteStudent(selectedStudent.studentId));
    setShowDeleteModal(false);
  };

  return (
    <div>
      <Table
        columns={columns}
        data={students}
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        onClose={() => setShowDeleteModal(false)}
        actions={[
          { label: "Cancel", onClick: () => setShowDeleteModal(false) },
          { label: "Delete", onClick: handleDelete, variant: "danger" },
        ]}
      >
        <p>Are you sure you want to delete {selectedStudent?.name}?</p>
      </Modal>
    </div>
  );
}
```

---

## Styling Guidelines

### Tailwind CSS Classes

**Colors**:

```
Primary: text-blue-600, bg-blue-500, hover:bg-blue-600
Success: text-green-600, bg-green-500
Danger: text-red-600, bg-red-500
Warning: text-yellow-600, bg-yellow-500
```

**Spacing**:

```
p-2, p-4, p-6, p-8 (padding)
m-2, m-4, m-6, m-8 (margin)
gap-2, gap-4, gap-6, gap-8 (gaps)
```

**Responsive**:

```
md:w-1/2  (50% width on medium screens and up)
lg:p-6   (6 units padding on large screens)
xl:text-2xl (2xl text size on extra-large screens)
```

---

## Accessibility Guidelines

- All inputs have associated labels
- Color not the only indicator (use icons + text)
- Sufficient color contrast (WCAG AA standard)
- Keyboard navigation support
- ARIA attributes where needed
- Form validation with clear error messages

---

## Component Storybook

When implemented, document each component with:

- Component description
- Required props
- Optional props
- Examples (multiple scenarios)
- Accessibility notes
- Usage guidelines

---

**Last Updated**: April 3, 2026
