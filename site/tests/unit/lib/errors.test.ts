import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError,
  WebhookError,
  createErrorResponse,
  logError,
  asyncHandler,
  handleValidationError,
  handleDatabaseError,
  handleRateLimitError,
  handleWebhookError,
  isRetryableError,
  getRetryDelay,
} from '@/lib/errors';
import { z } from 'zod';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an AppError with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    it('should create an AppError with custom values', () => {
      const error = new AppError('Custom error', 400, 'CUSTOM_ERROR', false);
      
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.isOperational).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError', () => {
      const error = new ValidationError('Invalid data');
      
      expect(error.message).toBe('Invalid data');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should include details when provided', () => {
      const details = { field: 'email', message: 'Invalid format' };
      const error = new ValidationError('Invalid data', details);
      
      expect((error as any).details).toBe(details);
    });
  });

  describe('AuthenticationError', () => {
    it('should create an AuthenticationError with default message', () => {
      const error = new AuthenticationError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should create an AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid credentials');
      
      expect(error.message).toBe('Invalid credentials');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('AuthorizationError', () => {
    it('should create an AuthorizationError with default message', () => {
      const error = new AuthorizationError();
      
      expect(error.message).toBe('Insufficient permissions');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError with default resource', () => {
      const error = new NotFoundError();
      
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create a NotFoundError with custom resource', () => {
      const error = new NotFoundError('User');
      
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('ConflictError', () => {
    it('should create a ConflictError', () => {
      const error = new ConflictError('Resource already exists');
      
      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('RateLimitError', () => {
    it('should create a RateLimitError with default message', () => {
      const error = new RateLimitError();
      
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('ExternalServiceError', () => {
    it('should create an ExternalServiceError', () => {
      const error = new ExternalServiceError('Stripe', 'API key invalid');
      
      expect(error.message).toBe('Stripe error: API key invalid');
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('DatabaseError', () => {
    it('should create a DatabaseError', () => {
      const originalError = new Error('Connection failed');
      const error = new DatabaseError('Failed to connect', originalError);
      
      expect(error.message).toBe('Database error: Failed to connect');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DATABASE_ERROR');
      expect((error as any).originalError).toBe(originalError);
    });
  });

  describe('WebhookError', () => {
    it('should create a WebhookError', () => {
      const error = new WebhookError('Invalid signature', 'stripe');
      
      expect(error.message).toBe('Webhook error (stripe): Invalid signature');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('WEBHOOK_ERROR');
    });
  });
});

describe('Error Utilities', () => {
  describe('createErrorResponse', () => {
    it('should create error response for AppError', () => {
      const error = new ValidationError('Invalid data');
      const response = createErrorResponse(error, 'req_123');
      
      expect(response.error).toBe('ValidationError');
      expect(response.message).toBe('Invalid data');
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.requestId).toBe('req_123');
      expect(response.timestamp).toBeDefined();
    });

    it('should create error response for ZodError', () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: 'invalid' });
      
      if (!result.success) {
        const response = createErrorResponse(result.error, 'req_123');
        
        expect(response.error).toBe('ValidationError');
        expect(response.message).toBe('Invalid input data');
        expect(response.code).toBe('VALIDATION_ERROR');
        expect(response.details).toBeDefined();
      }
    });

    it('should create error response for unknown error', () => {
      const error = new Error('Unknown error');
      const response = createErrorResponse(error, 'req_123');
      
      expect(response.error).toBe('InternalServerError');
      expect(response.message).toBe('Unknown error');
      expect(response.code).toBe('INTERNAL_ERROR');
    });

    it('should mask error message in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Sensitive error message');
      const response = createErrorResponse(error, 'req_123');
      
      expect(response.message).toBe('An internal server error occurred');
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logError', () => {
    it('should log error information', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const error = new ValidationError('Test error');
      const context = { userId: '123', action: 'create_user' };
      
      logError(error, context);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Application Error:',
        expect.stringContaining('ValidationError')
      );
      
      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should warn for operational errors', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const error = new AppError('Operational error', 400, 'OPERATIONAL_ERROR', true);
      logError(error);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Operational Error:',
        expect.any(Object)
      );
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('asyncHandler', () => {
    it('should handle successful async functions', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const handler = asyncHandler(mockFn);
      
      const req = {};
      const res = {};
      const next = vi.fn();
      
      await handler(req, res, next);
      
      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle async function errors', async () => {
      const error = new Error('Async error');
      const mockFn = vi.fn().mockRejectedValue(error);
      const handler = asyncHandler(mockFn);
      
      const req = {};
      const res = {};
      const next = vi.fn();
      
      await handler(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleValidationError', () => {
    it('should throw ValidationError for ZodError', () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: 'invalid' });
      
      if (!result.success) {
        expect(() => handleValidationError(result.error)).toThrow(ValidationError);
      }
    });
  });

  describe('handleDatabaseError', () => {
    it('should throw ConflictError for P2002', () => {
      const error = { code: 'P2002', message: 'Unique constraint failed' };
      
      expect(() => handleDatabaseError(error)).toThrow(ConflictError);
    });

    it('should throw NotFoundError for P2025', () => {
      const error = { code: 'P2025', message: 'Record not found' };
      
      expect(() => handleDatabaseError(error)).toThrow(NotFoundError);
    });

    it('should throw ValidationError for P2003', () => {
      const error = { code: 'P2003', message: 'Foreign key constraint failed' };
      
      expect(() => handleDatabaseError(error)).toThrow(ValidationError);
    });

    it('should throw DatabaseError for other errors', () => {
      const error = { code: 'P9999', message: 'Unknown error' };
      
      expect(() => handleDatabaseError(error)).toThrow(DatabaseError);
    });
  });

  describe('handleRateLimitError', () => {
    it('should throw RateLimitError with details', () => {
      expect(() => handleRateLimitError('user:123', 100, 60000)).toThrow(RateLimitError);
    });
  });

  describe('handleWebhookError', () => {
    it('should throw WebhookError', () => {
      const error = new Error('Invalid signature');
      
      expect(() => handleWebhookError(error, 'stripe')).toThrow(WebhookError);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for retryable errors', () => {
      expect(isRetryableError(new RateLimitError())).toBe(true);
      expect(isRetryableError(new ExternalServiceError('Stripe', 'Timeout'))).toBe(true);
      expect(isRetryableError(new DatabaseError('Connection failed'))).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      expect(isRetryableError(new ValidationError('Invalid data'))).toBe(false);
      expect(isRetryableError(new AuthenticationError())).toBe(false);
      expect(isRetryableError(new AuthorizationError())).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('should return increasing delay with jitter', () => {
      const delay1 = getRetryDelay(1);
      const delay2 = getRetryDelay(2);
      const delay3 = getRetryDelay(3);
      
      expect(delay1).toBeGreaterThan(0);
      expect(delay2).toBeGreaterThan(delay1);
      expect(delay3).toBeGreaterThan(delay2);
      expect(delay3).toBeLessThanOrEqual(30000); // Max delay
    });

    it('should cap delay at maximum', () => {
      const delay = getRetryDelay(100); // Very high attempt number
      
      expect(delay).toBeLessThanOrEqual(30000);
    });
  });
});


