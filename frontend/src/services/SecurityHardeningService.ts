/**
 * Phase 4C: Security Hardening Service
 * Input validation, access controls, and threat detection
 * Note: Encryption moved to backend for server-side processing
 */

// Browser doesn't have Node.js crypto - this is a placeholder service
// Full encryption implementation available on backend

interface EncryptionConfig {
  algorithm: string;
  keyLength: 256 | 192 | 128;
}

interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'phone' | 'date' | 'ssn' | 'custom';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitizer?: (value: string) => string;
}

interface AuditLogEntry {
  timestamp: number;
  action: string;
  userId: string;
  resource: string;
  status: 'success' | 'failure';
  details: any;
}

interface AccessControl {
  userId: string;
  resource: string;
  action: string;
  granted: boolean;
}

class SecurityHardeningService {
  private encryptionConfig: EncryptionConfig = {
    algorithm: 'aes-256-gcm',
    keyLength: 256,
  };

  private auditLog: AuditLogEntry[] = [];
  private accessControls = new Map<string, AccessControl[]>();
  private threatDetection = {
    sqlInjectionPatterns: [
      /('|("))\s*(;|or|and)\s*('|("))/i,
      /(\bunion\b|\bselect\b|\bdrop\b|\binsert\b|\bupdate\b)/i,
    ],
    xssPatterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ],
    pathTraversalPatterns: [/\.\.\//g, /%2e%2e/gi],
  };

  private encryptionKeys = new Map<string, string>();
  private ipWhitelist: Set<string> = new Set();
  private rateLimits = new Map<string, { count: number; resetAt: number }>();

  /**
   * Initialize encryption with secure key management
   * Note: Actual encryption is handled server-side
   */
  initializeEncryption(masterKey: string): void {
    // Key stored for client-side reference
    this.encryptionKeys.set('default', masterKey);
  }

  /**
   * Encrypt sensitive data (placeholder - use backend)
   */
  encrypt(plaintext: string, keyId: string = 'default'): string {
    // Return plaintext for now - encryption handled on backend
    return plaintext;
  }

  /**
   * Decrypt data (placeholder - use backend)
   */
  decrypt(ciphertext: string, keyId: string = 'default'): string {
    // Return ciphertext for now - decryption handled on backend
    return ciphertext;
  }

  /**
   * Hash sensitive data (one-way) - using browser API
   */
  async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate input against rules
   */
  validateInput(data: any, rules: ValidationRule[]): {
    isValid: boolean;
    errors: string[];
    sanitized: any;
  } {
    const errors: string[] = [];
    const sanitized = { ...data };

    rules.forEach((rule) => {
      const value = data[rule.field];

      // Check required
      if (rule.required && !value) {
        errors.push(`${rule.field} is required`);
        return;
      }

      if (!value) return;

      // Type validation
      switch (rule.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${rule.field} must be a valid email`);
          }
          break;

        case 'phone':
          if (!/^\+?[0-9\s-()]{10,}$/.test(value)) {
            errors.push(`${rule.field} must be a valid phone number`);
          }
          break;

        case 'ssn':
          if (!/^\d{3}-\d{2}-\d{4}$/.test(value)) {
            errors.push(`${rule.field} must be a valid SSN`);
          }
          break;

        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push(`${rule.field} must be a valid date`);
          }
          break;

        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`${rule.field} must be a number`);
          }
          break;

        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
          }
          break;
      }

      // Length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(
          `${rule.field} must be at least ${rule.minLength} characters`
        );
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(
          `${rule.field} must be at most ${rule.maxLength} characters`
        );
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }

      // Sanitization
      if (rule.sanitizer) {
        sanitized[rule.field] = rule.sanitizer(value);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Detect threats in input
   */
  detectThreats(input: string): { threats: string[]; isSafe: boolean } {
    const threats: string[] = [];

    // SQL Injection detection
    this.threatDetection.sqlInjectionPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        threats.push('Potential SQL injection detected');
      }
    });

    // XSS detection
    this.threatDetection.xssPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        threats.push('Potential XSS attack detected');
      }
    });

    // Path traversal detection
    this.threatDetection.pathTraversalPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        threats.push('Potential path traversal detected');
      }
    });

    return {
      threats,
      isSafe: threats.length === 0,
    };
  }

  /**
   * Sanitize input to prevent attacks
   */
  sanitizeInput(input: string): string {
    let sanitized = input
      // Remove script tags
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Escape special HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized.trim();
  }

  /**
   * Audit logging
   */
  auditLog(
    action: string,
    userId: string,
    resource: string,
    status: 'success' | 'failure',
    details?: any
  ): void {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      action,
      userId,
      resource,
      status,
      details,
    };

    this.auditLog.push(entry);

    // Keep last 10000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
  }

  /**
   * Access control check
   */
  checkAccess(userId: string, resource: string, action: string): boolean {
    const key = `${userId}:${resource}:${action}`;
    const controls = this.accessControls.get(key);

    if (!controls || controls.length === 0) {
      return false;
    }

    return controls[0].granted;
  }

  /**
   * Grant access control
   */
  grantAccess(userId: string, resource: string, action: string): void {
    const key = `${userId}:${resource}:${action}`;
    const controls = this.accessControls.get(key) || [];
    controls.push({
      userId,
      resource,
      action,
      granted: true,
    });
    this.accessControls.set(key, controls);
  }

  /**
   * Rate limiting
   */
  checkRateLimit(userId: string, limit: number = 100, windowMs: number = 60000): boolean {
    const key = userId;
    const now = Date.now();

    const record = this.rateLimits.get(key);

    if (!record || now > record.resetAt) {
      this.rateLimits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (record.count < limit) {
      record.count++;
      return true;
    }

    return false;
  }

  /**
   * IP whitelist management
   */
  addIpToWhitelist(ip: string): void {
    this.ipWhitelist.add(ip);
  }

  isIpWhitelisted(ip: string): boolean {
    return this.ipWhitelist.has(ip);
  }

  /**
   * Generate secure random tokens
   */
  generateSecureToken(length: number = 32): string {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get audit logs
   */
  getAuditLogs(filter?: {
    userId?: string;
    action?: string;
    status?: string;
    since?: number;
  }): AuditLogEntry[] {
    return this.auditLog.filter((entry) => {
      if (filter?.userId && entry.userId !== filter.userId) return false;
      if (filter?.action && entry.action !== filter.action) return false;
      if (filter?.status && entry.status !== filter.status) return false;
      if (filter?.since && entry.timestamp < filter.since) return false;
      return true;
    });
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.auditLog, null, 2);
    } else {
      // CSV format
      const headers = ['timestamp', 'action', 'userId', 'resource', 'status'];
      const csv = [headers.join(',')];
      this.auditLog.forEach((entry) => {
        csv.push(
          [
            new Date(entry.timestamp).toISOString(),
            entry.action,
            entry.userId,
            entry.resource,
            entry.status,
          ].join(',')
        );
      });
      return csv.join('\n');
    }
  }
}

// Export singleton
export const securityHardeningService = new SecurityHardeningService();
export default SecurityHardeningService;
