import { NextRequest, NextResponse } from 'next/server';
import { config } from './config';
import logger from './observability';

// Security headers
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.stripe.com https://api.sendgrid.com https://api.openai.com https://api.anthropic.com;
    frame-src 'self' https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),
};

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (identifier: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
};

// Rate limiting middleware
export const rateLimitMiddleware = (limit: number, windowMs: number) => {
  return (req: NextRequest) => {
    const identifier = req.ip || 'unknown';
    
    if (!rateLimit(identifier, limit, windowMs)) {
      logger.warn({
        identifier,
        limit,
        windowMs,
      }, 'Rate limit exceeded');
      
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    return null;
  };
};

// File upload security
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > config.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${config.MAX_FILE_SIZE} bytes`,
    };
  }
  
  // Check file type
  if (!config.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|vbs|js|jar|php|asp|aspx|jsp)$/i,
    /\.(sh|bash|zsh|fish|ps1|psm1)$/i,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: 'File type is not allowed for security reasons',
      };
  }
  
  return { valid: true };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// SQL injection prevention
export const sanitizeSQL = (input: string): string => {
  return input
    .replace(/['"]/g, '') // Remove quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '')
    .trim();
};

// XSS prevention
export const escapeHTML = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// CSRF protection
export const generateCSRFToken = (): string => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken;
};

// Session security
export const createSecureSession = (userId: string): { token: string; expires: Date } => {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return { token, expires };
};

// Password security
export const hashPassword = async (password: string): Promise<string> => {
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const crypto = require('crypto');
  const [salt, hash] = hashedPassword.split(':');
  const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === testHash;
};

// API key security
export const generateAPIKey = (): string => {
  const crypto = require('crypto');
  return `ak_${crypto.randomBytes(32).toString('hex')}`;
};

export const validateAPIKey = (key: string): boolean => {
  return key.startsWith('ak_') && key.length === 67;
};

// Webhook signature verification
export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

// IP whitelist
export const isIPWhitelisted = (ip: string, whitelist: string[]): boolean => {
  return whitelist.includes(ip);
};

// Geolocation security
export const isCountryAllowed = (countryCode: string, allowedCountries: string[]): boolean => {
  return allowedCountries.includes(countryCode);
};

// Device fingerprinting
export const generateDeviceFingerprint = (req: NextRequest): string => {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  
  const fingerprint = `${userAgent}:${acceptLanguage}:${acceptEncoding}`;
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(fingerprint).digest('hex');
};

// Security audit logging
export const logSecurityEvent = (event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical') => {
  logger.warn({
    securityEvent: {
      event,
      details,
      severity,
      timestamp: new Date().toISOString(),
    },
  }, 'Security event detected');
  
  // In production, this would send to your security monitoring system
  if (severity === 'high' || severity === 'critical') {
    console.error(`🚨 SECURITY ALERT [${severity.toUpperCase()}] ${event}:`, details);
  }
};

// Fraud detection
export const detectFraud = (userId: string, ip: string, userAgent: string, metadata: any): { risk: number; flags: string[] } => {
  const flags: string[] = [];
  let risk = 0;
  
  // Check for suspicious patterns
  if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    flags.push('bot_user_agent');
    risk += 0.3;
  }
  
  if (metadata?.rapidRequests > 10) {
    flags.push('rapid_requests');
    risk += 0.2;
  }
  
  if (metadata?.unusualLocation) {
    flags.push('unusual_location');
    risk += 0.2;
  }
  
  if (metadata?.suspiciousEmail) {
    flags.push('suspicious_email');
    risk += 0.3;
  }
  
  // Log high-risk events
  if (risk > 0.5) {
    logSecurityEvent('fraud_detected', {
      userId,
      ip,
      userAgent,
      risk,
      flags,
    }, 'high');
  }
  
  return { risk, flags };
};

// Content Security Policy
export const getCSP = (nonce: string): string => {
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.stripe.com https://api.sendgrid.com https://api.openai.com https://api.anthropic.com;
    frame-src 'self' https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim();
};

// Security middleware
export const securityMiddleware = (req: NextRequest) => {
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add HSTS header for HTTPS
  if (req.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
};

// Export security utilities
export {
  securityHeaders,
  rateLimit,
  rateLimitMiddleware,
  validateFileUpload,
  sanitizeInput,
  sanitizeSQL,
  escapeHTML,
  generateCSRFToken,
  validateCSRFToken,
  createSecureSession,
  hashPassword,
  verifyPassword,
  generateAPIKey,
  validateAPIKey,
  verifyWebhookSignature,
  isIPWhitelisted,
  isCountryAllowed,
  generateDeviceFingerprint,
  logSecurityEvent,
  detectFraud,
  getCSP,
  securityMiddleware,
};

