/**
 * Phase 4C: Security Hardening Service
 * Encryption, input validation, access controls, and threat detection
 */

import crypto from 'crypto';

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
   */
  initializeEncryption(masterKey: string): void {
    // In production, use proper key derivation
    const derivedKey = crypto
      .pbkdf2Sync(masterKey, 'salt', 100000, 32, 'sha256')
      .toString('hex');
    this.encryptionKeys.set('default', derivedKey);
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext: string, keyId: string = 'default'): string {
    const key = this.encryptionKeys.get(keyId);
    if (!key) {
      throw new Error(`Encryption key '${keyId}' not found`);
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.encryptionConfig.algorithm,
      Buffer.from(key, 'hex'),
      iv
    );

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = (cipher as any).getAuthTag();

    // Return: IV + authTag + encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt data
   */
  decrypt(ciphertext: string, keyId: string = 'default'): string {
    const key = this.encryptionKeys.get(keyId);
    if (!key) {
      throw new Error(`Encryption key '${keyId}' not found`);
    }

    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid ciphertext format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(
      this.encryptionConfig.algorithm,
      Buffer.from(key, 'hex'),
      iv
    );

    (decipher as any).setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
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
    return crypto.randomBytes(length).toString('hex');
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
