# Backend API Requirements for Academic Curator Integration

**Last Updated:** April 4, 2026  
**Status:** Frontend Complete - Ready for Backend Integration  
**API Version:** v1  
**Base URL:** `/api/v1`

---

## 🔌 API Architecture Overview

```
Frontend (React)
    ↓
Axios HTTP Client (with auth interceptor)
    ↓
Backend APIs (Node.js/Python/Java)
    ↓
Database (PostgreSQL/MongoDB)
    ↓
Message Queue (Redis/RabbitMQ) - For async jobs
    ↓
External Systems (LMS, SIS, etc.)
```

---

## 🔐 PHASE 1: AUTHENTICATION APIs

### 1.1 User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "institution": "univ-kigali",
  "role": "lecturer",
  "phone": "+250788123456" (optional),
  "department": "Engineering" (optional)
}
```

**Response (201):**

```json
{
  "id": "user_123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "institution": "univ-kigali",
  "role": "lecturer",
  "status": "pending_verification",
  "createdAt": "2026-04-04T10:30:00Z"
}
```

**Error Responses:**

- 400: Validation error (invalid email, weak password, etc.)
- 409: Email already exists
- 422: Password requirements not met

**Validation Rules:**

- Email: valid format, unique in system
- Password: 8+ chars, 1 uppercase, 1 number, 1 special char
- Phone: E.164 format (optional)
- Role: must be valid role

---

### 1.2 Email Verification

**Endpoint:** `POST /api/v1/auth/verify-email`

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "status": "active",
    "verifiedAt": "2026-04-04T10:35:00Z"
  }
}
```

**Error Responses:**

- 400: Invalid or expired code
- 404: Email not found
- 429: Too many attempts (max 3)

**Implementation Details:**

- Code valid for 15 minutes
- Code format: 6 digits
- Max 3 verification attempts
- Lock account after 3 failures for 30 minutes

---

### 1.3 Resend Verification Email

**Endpoint:** `POST /api/v1/auth/resend-verification`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "message": "Verification email sent",
  "expiresIn": 900
}
```

**Rate Limiting:** Max 3 per hour per email

---

### 1.4 User Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "mfaCode": "123456" (only if MFA enabled)
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_xyz",
  "expiresIn": 3600,
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "lecturer",
    "institution": "univ-kigali",
    "avatar": "https://api.example.com/avatars/user_123.jpg"
  }
}
```

**Error Responses:**

- 401: Invalid credentials
- 403: Account locked (too many failed attempts)
- 429: Too many login attempts (max 5 per 15 min)

**Implementation Details:**

- Lock account after 5 failed attempts
- Lock duration: 15 minutes
- JWT token with 1-hour expiry
- Refresh token with 7-day expiry
- Track login attempts in database

---

### 1.5 Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:** Authorization: `Bearer {accessToken}`

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Implementation Details:**

- Blacklist access token (Redis)
- Keep in blacklist for remaining TTL
- Clear session data
- Remove refresh token

---

### 1.6 Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "refresh_token_xyz"
}
```

**Response (200):**

```json
{
  "accessToken": "new_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

## 🔑 PHASE 1: USER PROFILE APIs

### 1.7 Get User Profile

**Endpoint:** `GET /api/v1/users/profile`

**Headers:** Authorization: `Bearer {accessToken}`

**Response (200):**

```json
{
  "id": "user_123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+250788123456",
  "institution": "univ-kigali",
  "department": "Engineering",
  "role": "lecturer",
  "avatar": "https://api.example.com/avatars/user_123.jpg",
  "bio": "Prof. John Doe",
  "createdAt": "2026-04-04T10:30:00Z",
  "lastLogin": "2026-04-04T14:15:00Z"
}
```

---

### 1.8 Update User Profile

**Endpoint:** `PUT /api/v1/users/profile`

**Headers:** Authorization: `Bearer {accessToken}`

**Request Body:**

```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "phone": "+250788987654",
  "bio": "Senior Lecturer"
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    /* updated user object */
  }
}
```

---

### 1.9 Upload Profile Avatar

**Endpoint:** `POST /api/v1/users/profile/avatar`

**Headers:**

- Authorization: `Bearer {accessToken}`
- Content-Type: `multipart/form-data`

**Request Body:** Form data with `avatar` file (max 5MB)

**Response (200):**

```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "https://api.example.com/avatars/user_123_new.jpg"
}
```

---

## 📄 PHASE 1: DOCUMENT UPLOAD APIs

### 1.10 Upload Document

**Endpoint:** `POST /api/v1/users/documents`

**Headers:**

- Authorization: `Bearer {accessToken}`
- Content-Type: `multipart/form-data`

**Request Body:**

```
file: <binary>
category: "profile" | "institution" | "id" | "certificate" | "other"
fileName: "my_certificate.pdf" (optional, uses uploaded filename if not provided)
```

**Response (201):**

```json
{
  "id": "doc_123",
  "fileName": "my_certificate.pdf",
  "fileType": "application/pdf",
  "fileSize": 245632,
  "category": "certificate",
  "uploadedAt": "2026-04-04T14:30:00Z",
  "url": "https://api.example.com/documents/doc_123.pdf"
}
```

**Error Responses:**

- 413: File too large (max 10MB)
- 415: Unsupported file type
- 422: Invalid category

---

### 1.11 Get User Documents

**Endpoint:** `GET /api/v1/users/documents?category=certificate`

**Headers:** Authorization: `Bearer {accessToken}`

**Response (200):**

```json
{
  "documents": [
    {
      "id": "doc_123",
      "fileName": "my_certificate.pdf",
      "fileType": "application/pdf",
      "fileSize": 245632,
      "category": "certificate",
      "uploadedAt": "2026-04-04T14:30:00Z",
      "url": "https://api.example.com/documents/doc_123.pdf"
    }
  ],
  "total": 1
}
```

---

### 1.12 Delete Document

**Endpoint:** `DELETE /api/v1/users/documents/{documentId}`

**Headers:** Authorization: `Bearer {accessToken}`

**Response (200):**

```json
{
  "message": "Document deleted successfully"
}
```

---

## 👥 PHASE 1: USER MANAGEMENT APIs (Admin)

### 1.13 List Users

**Endpoint:** `GET /api/v1/admin/users?page=1&limit=20&role=lecturer&status=active`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "users": [
    {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "lecturer",
      "institution": "univ-kigali",
      "status": "active",
      "createdAt": "2026-04-04T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "pages": 8
  }
}
```

---

### 1.14 Create User (Admin)

**Endpoint:** `POST /api/v1/admin/users`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "role": "hod",
  "institution": "kigali-institute",
  "department": "Computer Science",
  "status": "active"
}
```

**Response (201):**

```json
{
  "id": "user_456",
  "email": "jane@example.com",
  "role": "hod",
  "status": "active",
  "createdAt": "2026-04-04T15:00:00Z"
}
```

---

### 1.15 Update User (Admin)

**Endpoint:** `PUT /api/v1/admin/users/{userId}`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "qa",
  "status": "inactive"
}
```

**Response (200):**

```json
{
  "message": "User updated successfully",
  "user": {
    /* updated user */
  }
}
```

---

### 1.16 Delete User (Admin)

**Endpoint:** `DELETE /api/v1/admin/users/{userId}`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

---

## 🔐 PHASE 2: MFA APIs

### 2.1 Generate TOTP Secret

**Endpoint:** `POST /api/v1/mfa/totp/generate`

**Headers:** Authorization: `Bearer {accessToken}`

**Response (200):**

```json
{
  "secret": "JBSWY3DPLBVWK3DHNVSQ2LORBAU",
  "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=otpauth://...",
  "backupCodes": [
    "12345678",
    "87654321",
    "11223344",
    "55667788",
    "99887766",
    "44332211",
    "13579246",
    "24681357",
    "98765432",
    "12346578"
  ],
  "expiresIn": 300
}
```

**Implementation Details:**

- Secret must be RSA-2048 encrypted before storage
- QR code contains: `otpauth://totp/Academic%20Curator:user_email?secret=SECRET&issuer=Academic%20Curator`
- Backup codes: 10 codes, 8 digits each
- Secret valid for 5 minutes (for verification)

---

### 2.2 Setup TOTP

**Endpoint:** `POST /api/v1/mfa/totp/setup`

**Headers:** Authorization: `Bearer {accessToken}`

**Request Body:**

```json
{
  "secret": "JBSWY3DPLBVWK3DHNVSQ2LORBAU",
  "verificationCode": "123456"
}
```

**Response (200):**

```json
{
  "message": "TOTP setup successfully",
  "mfaStatus": {
    "enabled": true,
    "method": "totp",
    "backupCodesRemaining": 10,
    "setupDate": "2026-04-04T15:30:00Z"
  }
}
```

**Error Responses:**

- 400: Invalid verification code
- 401: Secret expired (> 5 min)
- 409: TOTP already enabled

---

### 2.3 Verify TOTP Code

**Endpoint:** `POST /api/v1/mfa/totp/verify`

**Headers:** Authorization: `Bearer {accessToken}`

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response (200):**

```json
{
  "message": "Code verified successfully",
  "valid": true
}
```

**Error Responses:**

- 400: Invalid code
- 403: TOTP not enabled

---

### 2.4 Disable TOTP

**Endpoint:** `POST /api/v1/mfa/totp/disable`

**Headers:** Authorization: `Bearer {accessToken}`

**Request Body:**

```json
{
  "password": "user_password_confirmation"
}
```

**Response (200):**

```json
{
  "message": "TOTP disabled successfully",
  "mfaStatus": {
    "enabled": false
  }
}
```

---

## 🔑 PHASE 2: PASSWORD RESET APIs

### 2.5 Request Password Reset

**Endpoint:** `POST /api/v1/auth/password-reset/request`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "message": "Password reset instructions sent to email",
  "expiresIn": 900
}
```

**Implementation Details:**

- Generate 32-char reset token
- Send email with reset_code (6 digits)
- Token valid for 15 minutes
- 1 active reset per user
- Rate limit: 3 per hour per email

---

### 2.6 Verify Reset Token

**Endpoint:** `POST /api/v1/auth/password-reset/verify`

**Request Body:**

```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "message": "Code verified successfully",
  "resetToken": "temporary_reset_token_xyz",
  "expiresIn": 600
}
```

**Error Responses:**

- 400: Invalid or expired code
- 429: Too many attempts (max 3)
- 404: Email not found

---

### 2.7 Complete Password Reset

**Endpoint:** `POST /api/v1/auth/password-reset/complete`

**Request Body:**

```json
{
  "resetToken": "temporary_reset_token_xyz",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**

```json
{
  "message": "Password reset successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com"
  }
}
```

**Implementation Details:**

- Validate reset token
- Hash new password
- Invalidate all active sessions
- Force re-login
- Clear refresh tokens

---

## 🔗 PHASE 3: DATA CONNECTOR APIs

### 3.1 Get Connected Data Sources

**Endpoint:** `GET /api/v1/integrations/sources?status=connected`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "sources": [
    {
      "id": "source_123",
      "name": "Canvas LMS",
      "type": "lms",
      "status": "connected",
      "endpoint": "https://canvas.univ-kigali.ac.rw/api/v1",
      "lastSync": "2026-04-04T14:30:00Z",
      "reliability": 99.9,
      "recordsPerMinute": 1402,
      "health": {
        "latency": 145,
        "uptime": 99.9,
        "lastChecked": "2026-04-04T14:35:00Z"
      }
    }
  ],
  "total": 4
}
```

---

### 3.2 Create Data Source Connection

**Endpoint:** `POST /api/v1/integrations/sources`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "name": "Canvas Production",
  "type": "lms",
  "endpoint": "https://canvas.univ-kigali.ac.rw/api/v1",
  "apiKey": "encrypted_api_key_xyz",
  "retryAttempts": 3,
  "timeout": 30000
}
```

**Response (201):**

```json
{
  "id": "source_123",
  "name": "Canvas Production",
  "type": "lms",
  "status": "connected",
  "createdAt": "2026-04-04T15:00:00Z"
}
```

**Implementation Details:**

- Encrypt API Key (AES-256)
- Test connection before saving
- Create default health check job
- Log connection creation (audit trail)

---

### 3.3 Test Data Source Connection

**Endpoint:** `POST /api/v1/integrations/sources/test`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "name": "Canvas Test",
  "type": "lms",
  "endpoint": "https://canvas.univ-kigali.ac.rw/api/v1",
  "apiKey": "test_api_key"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Connection successful",
  "latency": 234,
  "recordsAvailable": 1402
}
```

**Error Responses:**

- 400: Invalid endpoint
- 401: Invalid API key
- 503: Service unavailable
- 504: Connection timeout

---

### 3.4 Update Data Source

**Endpoint:** `PUT /api/v1/integrations/sources/{sourceId}`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "name": "Canvas Production Updated",
  "apiKey": "new_encrypted_api_key",
  "retryAttempts": 5
}
```

**Response (200):**

```json
{
  "message": "Data source updated successfully",
  "source": {
    /* updated source */
  }
}
```

---

### 3.5 Delete Data Source

**Endpoint:** `DELETE /api/v1/integrations/sources/{sourceId}`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "message": "Data source deleted successfully"
}
```

**Implementation Details:**

- Delete associated jobs (confirm first)
- Delete health check jobs
- Archive sync history
- Log deletion (audit trail)

---

### 3.6 Check Data Source Health

**Endpoint:** `GET /api/v1/integrations/sources/{sourceId}/health`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "id": "source_123",
  "status": "healthy",
  "latency": 145,
  "uptime": 99.9,
  "errorCount": 0,
  "successCount": 1402,
  "lastChecked": "2026-04-04T14:35:00Z",
  "nextCheck": "2026-04-04T14:45:00Z"
}
```

---

## 📊 PHASE 3: INGESTION JOB APIs

### 3.7 Create Ingestion Job

**Endpoint:** `POST /api/v1/integrations/jobs`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Request Body:**

```json
{
  "sourceId": "source_123",
  "entityType": "student_gradebook",
  "schedule": "daily",
  "scheduledTime": "02:00"
}
```

**Response (201):**

```json
{
  "id": "job_123",
  "sourceId": "source_123",
  "entityType": "student_gradebook",
  "schedule": "daily",
  "status": "scheduled",
  "nextRun": "2026-04-05T02:00:00Z",
  "createdAt": "2026-04-04T15:30:00Z"
}
```

---

### 3.8 Execute Ingestion Job

**Endpoint:** `POST /api/v1/integrations/jobs/{jobId}/execute`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "executionId": "exec_123",
  "jobId": "job_123",
  "status": "running",
  "startedAt": "2026-04-04T15:35:00Z"
}
```

**Implementation Details:**

- Queue job to message broker (Redis/RabbitMQ)
- Return immediately with execution ID
- Track execution status in separate table
- Log all errors and warnings
- Send email on failure

---

### 3.9 Get Job Execution Status

**Endpoint:** `GET /api/v1/integrations/jobs/{jobId}/executions/{executionId}`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "executionId": "exec_123",
  "jobId": "job_123",
  "sourceId": "source_123",
  "status": "completed",
  "recordsProcessed": 1402,
  "errorCount": 0,
  "duration": 45,
  "startedAt": "2026-04-04T15:35:00Z",
  "completedAt": "2026-04-04T15:36:25Z",
  "errors": []
}
```

**Status Values:** pending, running, completed, failed, cancelled

---

### 3.10 List Job Executions

**Endpoint:** `GET /api/v1/integrations/jobs/{jobId}/executions?limit=20&offset=0`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "executions": [
    {
      "executionId": "exec_123",
      "status": "completed",
      "recordsProcessed": 1402,
      "errorCount": 0,
      "duration": 45,
      "startedAt": "2026-04-04T15:35:00Z",
      "completedAt": "2026-04-04T15:36:25Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### 3.11 Pause Job

**Endpoint:** `POST /api/v1/integrations/jobs/{jobId}/pause`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "message": "Job paused successfully",
  "jobStatus": "paused"
}
```

---

### 3.12 Resume Job

**Endpoint:** `POST /api/v1/integrations/jobs/{jobId}/resume`

**Headers:** Authorization: `Bearer {accessToken}` (admin only)

**Response (200):**

```json
{
  "message": "Job resumed successfully",
  "jobStatus": "scheduled"
}
```

---

## 🔒 Security Requirements

### Authentication

- JWT with HS256 or RS256 signature
- Access token: 1-hour expiry
- Refresh token: 7-day expiry
- Token blacklist on logout (Redis)

### Authorization

- Role-based access control (RBAC)
- Admin-only endpoints check role in middleware
- User can only access own profile
- Department heads see only their department

### Data Protection

- HTTPS/TLS 1.2+ required
- Password hashing: bcrypt (12+ rounds)
- API Key encryption: AES-256
- Sensitive data (passwords, API keys) never logged
- PII encrypted in database (optional)

### Rate Limiting

- Login: 5 attempts per 15 minutes
- Email verification: 3 attempts per hour
- Password reset: 3 per hour per email
- API endpoints: 100 per minute per user

### Audit Logging

- All user actions logged (create, update, delete)
- Failed login attempts logged
- Admin actions require separate audit log
- 1-year retention for audit logs

---

## 📊 Database Schema (PostgreSQL)

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  institution_id UUID,
  department_id UUID,
  role VARCHAR(50),
  status VARCHAR(50),
  email_verified_at TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Data Sources Table

```sql
CREATE TABLE data_sources (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  endpoint TEXT NOT NULL,
  api_key_encrypted TEXT,
  status VARCHAR(50),
  reliability DECIMAL(5,2),
  last_sync TIMESTAMP,
  retry_attempts INT DEFAULT 3,
  timeout INT DEFAULT 30000,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Ingestion Jobs Table

```sql
CREATE TABLE ingestion_jobs (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES data_sources(id),
  entity_type VARCHAR(100),
  schedule VARCHAR(50),
  scheduled_time TIME,
  status VARCHAR(50),
  next_run TIMESTAMP,
  records_processed INT,
  error_count INT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured (.env.prod)
- [ ] Database migrations run
- [ ] Redis instance running (for token blacklist, job queue)
- [ ] Email service configured (SendGrid/AWS SES)
- [ ] File storage configured (S3/Google Cloud Storage)
- [ ] Secrets vault configured (HashiCorp Vault/AWS Secrets Manager)
- [ ] HTTPS certificate configured
- [ ] CORS headers configured
- [ ] Rate limiting middleware deployed
- [ ] Monitoring/logging configured (DataDog/NewRelic)
- [ ] Backup strategy configured
- [ ] Load testing completed (1000+ concurrent users)

---

## 📋 API Documentation Tools

- [ ] Swagger/OpenAPI specification (@3.0.0)
- [ ] Postman collection exported
- [ ] API docs hosted at `/api/v1/docs`
- [ ] Rate limits documented
- [ ] Error codes documented
- [ ] Authentication flow diagram

---

**Next Steps:**

1. Implement backend in Node.js/Python/Java
2. Set up database and migrations
3. Configure JWT authentication
4. Implement each API endpoint (CRUD)
5. Add unit tests for each endpoint
6. Configure rate limiting and monitoring
7. Deploy to staging environment
8. Run E2E tests against real backend
9. Load test (1000+ concurrent users)
10. Deploy to production
