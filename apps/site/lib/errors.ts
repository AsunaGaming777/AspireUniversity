import { z } from 'zod';

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    if (details) {
      (this as any).details = details;
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
    this.name = 'ExternalServiceError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: any) {
    super(`Database error: ${message}`, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
    if (originalError) {
      (this as any).originalError = originalError;
    }
  }
}

export class WebhookError extends AppError {
  constructor(message: string, webhookType: string) {
    super(`Webhook error (${webhookType}): ${message}`, 500, 'WEBHOOK_ERROR');
    this.name = 'WebhookError';
  }
}

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string().datetime(),
  requestId: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Error handler utility
export const createErrorResponse = (
  error: Error,
  requestId?: string
): ErrorResponse => {
  const timestamp = new Date().toISOString();
  
  if (error instanceof AppError) {
    return {
      error: error.name,
      message: error.message,
      code: error.code,
      timestamp,
      requestId,
    };
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return {
      error: 'ValidationError',
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      details: error.errors,
      timestamp,
      requestId,
    };
  }

  // Handle unknown errors
  return {
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' 
      ? 'An internal server error occurred' 
      : error.message,
    code: 'INTERNAL_ERROR',
    timestamp,
    requestId,
  };
};

// Error logging utility
export const logError = (error: Error, context?: any) => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  // In production, this would be sent to a logging service
  console.error('Application Error:', JSON.stringify(errorInfo, null, 2));
  
  // If it's an operational error, we might want to alert
  if (error instanceof AppError && error.isOperational) {
    // Log to monitoring service (Sentry, etc.)
    console.warn('Operational Error:', errorInfo);
  }
};

// Error boundary for async functions
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
export const handleValidationError = (error: z.ZodError) => {
  const formattedErrors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  throw new ValidationError('Validation failed', formattedErrors);
};

// Database error handler
export const handleDatabaseError = (error: any) => {
  // Prisma error handling
  if (error.code === 'P2002') {
    throw new ConflictError('A record with this information already exists');
  }
  
  if (error.code === 'P2025') {
    throw new NotFoundError('Record');
  }
  
  if (error.code === 'P2003') {
    throw new ValidationError('Invalid reference to related record');
  }

  // Generic database error
  throw new DatabaseError(error.message, error);
};

// Rate limiting error handler
export const handleRateLimitError = (identifier: string, limit: number, windowMs: number) => {
  const resetTime = new Date(Date.now() + windowMs);
  throw new RateLimitError(
    `Rate limit exceeded for ${identifier}. Limit: ${limit} requests per ${windowMs}ms. Reset at: ${resetTime.toISOString()}`
  );
};

// Webhook error handler
export const handleWebhookError = (error: Error, webhookType: string, payload?: any) => {
  logError(error, { webhookType, payload });
  throw new WebhookError(error.message, webhookType);
};

// Error recovery utilities
export const isRetryableError = (error: Error): boolean => {
  if (error instanceof RateLimitError) return true;
  if (error instanceof ExternalServiceError) return true;
  if (error instanceof DatabaseError) return true;
  
  return false;
};

export const getRetryDelay = (attempt: number): number => {
  // Exponential backoff with jitter
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const jitter = Math.random() * 1000; // 0-1 second jitter
  
  return Math.min(baseDelay * Math.pow(2, attempt) + jitter, maxDelay);
};

// Error metrics
export const errorMetrics = {
  increment: (errorType: string, errorCode?: string) => {
    // This would integrate with your metrics system
    console.log(`Error metric: ${errorType}${errorCode ? `:${errorCode}` : ''}`);
  },
  
  recordLatency: (operation: string, duration: number, success: boolean) => {
    // This would integrate with your metrics system
    console.log(`Latency metric: ${operation} took ${duration}ms, success: ${success}`);
  },
};


