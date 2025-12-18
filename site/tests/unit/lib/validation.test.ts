import { describe, it, expect } from 'vitest';
import {
  userCreateSchema,
  userUpdateSchema,
  loginSchema,
  registerSchema,
  courseCreateSchema,
  lessonCreateSchema,
  assignmentCreateSchema,
  assignmentSubmissionSchema,
  checkoutSessionSchema,
  cohortCreateSchema,
  affiliateCreateSchema,
  testimonialCreateSchema,
  progressUpdateSchema,
  searchSchema,
  userFilterSchema,
  fileUploadSchema,
  rateLimitSchema,
  healthCheckSchema,
  errorResponseSchema,
  successResponseSchema,
  paginationSchema,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('User Validation', () => {
    it('should validate user creation data', () => {
      const validData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        timezone: 'America/New_York',
        age: 25,
      };

      const result = userCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toEqual(['email']);
      }
    });

    it('should reject invalid role', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'INVALID_ROLE',
      };

      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate user update data', () => {
      const validData = {
        name: 'Updated Name',
        timezone: 'Europe/London',
      };

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Auth Validation', () => {
    it('should validate login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        referrerCode: 'AFFILIATE123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Course Validation', () => {
    it('should validate course creation data', () => {
      const validData = {
        title: 'Test Course',
        description: 'A test course',
        slug: 'test-course',
        isPublished: true,
      };

      const result = courseCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug', () => {
      const invalidData = {
        title: 'Test Course',
        slug: 'Invalid Slug!',
      };

      const result = courseCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Lesson Validation', () => {
    it('should validate lesson creation data', () => {
      const validData = {
        title: 'Test Lesson',
        description: 'A test lesson',
        content: 'Test content',
        videoUrl: 'https://example.com/video.mp4',
        duration: 30,
        order: 1,
        isPublished: true,
      };

      const result = lessonCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid duration', () => {
      const invalidData = {
        title: 'Test Lesson',
        duration: 2000, // More than 24 hours
        order: 1,
      };

      const result = lessonCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Assignment Validation', () => {
    it('should validate assignment creation data', () => {
      const validData = {
        title: 'Test Assignment',
        description: 'A test assignment',
        type: 'PROJECT',
        points: 100,
        dueDate: '2024-12-31T23:59:59Z',
        isPublished: true,
      };

      const result = assignmentCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate assignment submission data', () => {
      const validData = {
        content: 'Test submission content',
        files: [
          {
            url: 'https://example.com/file.pdf',
            name: 'file.pdf',
            size: 1024,
            type: 'application/pdf',
          },
        ],
      };

      const result = assignmentSubmissionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Payment Validation', () => {
    it('should validate checkout session data', () => {
      const validData = {
        priceId: 'price_1234567890',
        successUrl: 'https://azerra.ai/success',
        cancelUrl: 'https://azerra.ai/cancel',
        referrerCode: 'AFFILIATE123',
      };

      const result = checkoutSessionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Cohort Validation', () => {
    it('should validate cohort creation data', () => {
      const validData = {
        name: 'Test Cohort',
        description: 'A test cohort',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        maxStudents: 50,
        isActive: true,
      };

      const result = cohortCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Affiliate Validation', () => {
    it('should validate affiliate creation data', () => {
      const validData = {
        code: 'AFFILIATE123',
        commissionRate: 0.3,
      };

      const result = affiliateCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid affiliate code', () => {
      const invalidData = {
        code: 'invalid-code!',
        commissionRate: 0.3,
      };

      const result = affiliateCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Testimonial Validation', () => {
    it('should validate testimonial creation data', () => {
      const validData = {
        name: 'John Doe',
        title: 'Software Engineer',
        company: 'Tech Corp',
        content: 'Great course!',
        rating: 5,
        earnings: 5000,
        proofUrl: 'https://example.com/proof',
        consentGiven: true,
      };

      const result = testimonialCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject testimonial without consent', () => {
      const invalidData = {
        name: 'John Doe',
        content: 'Great course!',
        rating: 5,
        consentGiven: false,
      };

      const result = testimonialCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Progress Validation', () => {
    it('should validate progress update data', () => {
      const validData = {
        completed: true,
        progress: 0.8,
        timeSpent: 3600,
      };

      const result = progressUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid progress value', () => {
      const invalidData = {
        progress: 1.5, // Should be between 0 and 1
      };

      const result = progressUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Search and Filter Validation', () => {
    it('should validate search parameters', () => {
      const validData = {
        q: 'test query',
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate user filter parameters', () => {
      const validData = {
        q: 'test',
        page: 1,
        limit: 20,
        role: 'STUDENT',
        cohortId: 'clh1234567890',
        isActive: true,
        hasDiscord: true,
      };

      const result = userFilterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('File Upload Validation', () => {
    it('should validate file upload data', () => {
      const validData = {
        file: {
          name: 'test.pdf',
          size: 1024,
          type: 'application/pdf',
          buffer: Buffer.from('test content'),
        },
        assignmentId: 'clh1234567890',
      };

      const result = fileUploadSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Rate Limiting Validation', () => {
    it('should validate rate limit data', () => {
      const validData = {
        identifier: 'user:123',
        limit: 100,
        windowMs: 60000,
      };

      const result = rateLimitSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Health Check Validation', () => {
    it('should validate health check data', () => {
      const validData = {
        status: 'healthy',
        timestamp: '2024-01-01T00:00:00Z',
        services: {
          database: {
            status: 'up',
            responseTime: 50,
            lastCheck: '2024-01-01T00:00:00Z',
          },
          redis: {
            status: 'up',
            responseTime: 10,
            lastCheck: '2024-01-01T00:00:00Z',
          },
        },
      };

      const result = healthCheckSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Response Validation', () => {
    it('should validate error response', () => {
      const validData = {
        error: 'ValidationError',
        message: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        details: { field: 'email', message: 'Invalid email format' },
        timestamp: '2024-01-01T00:00:00Z',
        requestId: 'req_1234567890',
      };

      const result = errorResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate success response', () => {
      const validData = {
        success: true,
        data: { id: '123', name: 'Test' },
        message: 'Operation successful',
        timestamp: '2024-01-01T00:00:00Z',
        requestId: 'req_1234567890',
      };

      const result = successResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Pagination Validation', () => {
    it('should validate pagination data', () => {
      const validData = {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      };

      const result = paginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should apply default values', () => {
      const validData = {};

      const result = paginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });
  });
});


