import { z } from 'zod';

// Common validation schemas
export const cuidSchema = z.string().cuid();
export const emailSchema = z.string().email();
export const urlSchema = z.string().url();
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/);

// User validation
export const userCreateSchema = z.object({
  email: emailSchema,
  name: z.string().min(1).max(100),
  image: urlSchema.optional(),
  role: z.enum(['STUDENT', 'MENTOR', 'INSTRUCTOR', 'AFFILIATE', 'ADMIN', 'MODERATOR']).default('STUDENT'),
  timezone: z.string().optional(),
  age: z.number().int().min(13).max(120).optional(),
});

export const userUpdateSchema = userCreateSchema.partial();

// Auth validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
  referrerCode: z.string().optional(),
});

// Course validation
export const courseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  isPublished: z.boolean().default(false),
});

export const lessonCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  content: z.string().optional(),
  videoUrl: urlSchema.optional(),
  duration: z.number().int().min(1).max(1440).optional(), // max 24 hours
  order: z.number().int().min(0),
  isPublished: z.boolean().default(false),
});

// Assignment validation
export const assignmentCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['QUIZ', 'PROJECT', 'ESSAY', 'CODE', 'PEER_REVIEW']),
  points: z.number().int().min(1).max(1000).default(100),
  dueDate: z.string().datetime().optional(),
  isPublished: z.boolean().default(false),
});

export const assignmentSubmissionSchema = z.object({
  content: z.string().max(10000).optional(),
  files: z.array(z.object({
    url: urlSchema,
    name: z.string(),
    size: z.number().int().min(1),
    type: z.string(),
  })).optional(),
});

// Payment validation
export const checkoutSessionSchema = z.object({
  priceId: z.string().min(1),
  successUrl: urlSchema,
  cancelUrl: urlSchema,
  referrerCode: z.string().optional(),
});

// Webhook validation
export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
});

export const discordWebhookSchema = z.object({
  type: z.string(),
  data: z.any(),
  signature: z.string(),
  timestamp: z.string(),
});

// Cohort validation
export const cohortCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  maxStudents: z.number().int().min(1).max(1000).optional(),
  isActive: z.boolean().default(true),
});

// Affiliate validation
export const affiliateCreateSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{6,20}$/),
  commissionRate: z.number().min(0).max(1).default(0.3),
});

// Testimonial validation
export const testimonialCreateSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  earnings: z.number().min(0).optional(),
  proofUrl: urlSchema.optional(),
  consentGiven: z.boolean(),
});

// Progress validation
export const progressUpdateSchema = z.object({
  completed: z.boolean().optional(),
  progress: z.number().min(0).max(1).optional(),
  timeSpent: z.number().int().min(0).optional(),
});

// Search and filter schemas
export const searchSchema = z.object({
  q: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const userFilterSchema = searchSchema.extend({
  role: z.enum(['STUDENT', 'MENTOR', 'INSTRUCTOR', 'AFFILIATE', 'ADMIN', 'MODERATOR']).optional(),
  cohortId: cuidSchema.optional(),
  isActive: z.boolean().optional(),
  hasDiscord: z.boolean().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1).max(255),
    size: z.number().int().min(1),
    type: z.string(),
    buffer: z.instanceof(Buffer),
  }),
  assignmentId: cuidSchema.optional(),
});

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1),
  limit: z.number().int().min(1),
  windowMs: z.number().int().min(1000),
});

// Health check validation
export const healthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string().datetime(),
  services: z.record(z.object({
    status: z.enum(['up', 'down', 'degraded']),
    responseTime: z.number().optional(),
    lastCheck: z.string().datetime(),
  })),
});

// Error response validation
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string().datetime(),
  requestId: z.string().optional(),
});

// Success response validation
export const successResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
  requestId: z.string().optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  total: z.number().int().min(0).optional(),
  totalPages: z.number().int().min(0).optional(),
});

// Export types
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CourseCreate = z.infer<typeof courseCreateSchema>;
export type LessonCreate = z.infer<typeof lessonCreateSchema>;
export type AssignmentCreate = z.infer<typeof assignmentCreateSchema>;
export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;
export type StripeWebhook = z.infer<typeof stripeWebhookSchema>;
export type DiscordWebhook = z.infer<typeof discordWebhookSchema>;
export type CohortCreate = z.infer<typeof cohortCreateSchema>;
export type AffiliateCreate = z.infer<typeof affiliateCreateSchema>;
export type TestimonialCreate = z.infer<typeof testimonialCreateSchema>;
export type ProgressUpdate = z.infer<typeof progressUpdateSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;
export type HealthCheck = z.infer<typeof healthCheckSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;


