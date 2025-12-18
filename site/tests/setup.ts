import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/azerra_test';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
process.env.SENDGRID_API_KEY = 'SG.test_mock';
process.env.FROM_EMAIL = 'test@azerra.ai';
process.env.DISCORD_BOT_TOKEN = 'mock_discord_token';
process.env.DISCORD_GUILD_ID = 'mock_guild_id';
process.env.DISCORD_WEBHOOK_SECRET = 'mock_webhook_secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.OPENAI_API_KEY = 'sk-test_mock';
process.env.ANTHROPIC_API_KEY = 'sk-ant-test_mock';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long';
process.env.DEMO_MODE = 'false';
process.env.MAINTENANCE_MODE = 'false';

// Global test database client
let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  
  // Connect to test database
  await prisma.$connect();
  
  // Clean database
  await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "courses" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "modules" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "lessons" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "assignments" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "cohorts" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "affiliates" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "testimonials" CASCADE`;
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

beforeEach(async () => {
  // Clean up test data before each test
  await prisma.$executeRaw`TRUNCATE TABLE "assignment_submissions" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "progress" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "user_achievements" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "certificates" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "referrals" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "payouts" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "webhook_events" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "moderation_logs" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "fraud_detection" CASCADE`;
});

afterEach(async () => {
  // Additional cleanup if needed
});

// Export prisma for use in tests
export { prisma };

// Mock external services
export const mockStripe = {
  customers: {
    create: vi.fn(),
    retrieve: vi.fn(),
    update: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
};

export const mockSendGrid = {
  send: vi.fn(),
};

export const mockDiscord = {
  login: vi.fn(),
  channels: {
    fetch: vi.fn(),
    send: vi.fn(),
  },
  guilds: {
    fetch: vi.fn(),
  },
};

export const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn(),
    },
  },
};

// Mock fetch
global.fetch = vi.fn();

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}));

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn((callback) => callback({})),
}));

// Test utilities
export const createTestUser = async (overrides = {}) => {
  return await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      ...overrides,
    },
  });
};

export const createTestCourse = async (overrides = {}) => {
  return await prisma.course.create({
    data: {
      title: 'Test Course',
      slug: 'test-course',
      description: 'A test course',
      isPublished: true,
      ...overrides,
    },
  });
};

export const createTestModule = async (courseId: string, overrides = {}) => {
  return await prisma.module.create({
    data: {
      courseId,
      title: 'Test Module',
      description: 'A test module',
      order: 1,
      isPublished: true,
      ...overrides,
    },
  });
};

export const createTestLesson = async (moduleId: string, overrides = {}) => {
  return await prisma.lesson.create({
    data: {
      moduleId,
      title: 'Test Lesson',
      description: 'A test lesson',
      content: 'Test content',
      order: 1,
      isPublished: true,
      ...overrides,
    },
  });
};

export const createTestAssignment = async (lessonId: string, overrides = {}) => {
  return await prisma.assignment.create({
    data: {
      lessonId,
      title: 'Test Assignment',
      description: 'A test assignment',
      type: 'PROJECT',
      points: 100,
      isPublished: true,
      ...overrides,
    },
  });
};

export const createTestCohort = async (courseId: string, overrides = {}) => {
  return await prisma.cohort.create({
    data: {
      courseId,
      name: 'Test Cohort',
      description: 'A test cohort',
      startDate: new Date(),
      isActive: true,
      ...overrides,
    },
  });
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create mock request/response objects
export const createMockRequest = (overrides = {}) => ({
  method: 'GET',
  url: '/',
  headers: {},
  body: {},
  query: {},
  ...overrides,
});

export const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    getHeader: vi.fn(),
  };
  return res;
};

// Helper to create mock Next.js request/response
export const createMockNextRequest = (overrides = {}) => ({
  method: 'GET',
  url: 'http://localhost:3000/',
  headers: new Headers(),
  json: vi.fn(),
  text: vi.fn(),
  formData: vi.fn(),
  ...overrides,
});

export const createMockNextResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  headers: new Headers(),
  ...new Response(),
});


