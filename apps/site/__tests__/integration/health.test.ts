import { describe, it, expect } from 'vitest';

describe('Health Endpoints Integration', () => {
  const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

  describe('GET /api/health/liveness', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${BASE_URL}/api/health/liveness`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeGreaterThan(0);
    });
  });

  describe('GET /api/health/readiness', () => {
    it('should check all dependencies', async () => {
      const response = await fetch(`${BASE_URL}/api/health/readiness`);
      const data = await response.json();

      expect(response.status).toBeOneOf([200, 503]);
      expect(data.status).toBeOneOf(['healthy', 'unhealthy']);
      expect(data.checks).toBeDefined();
      expect(data.checks.database).toBeDefined();
      expect(data.checks.redis).toBeDefined();
      expect(data.checks.stripe).toBeDefined();
    });

    it('should include response times for healthy checks', async () => {
      const response = await fetch(`${BASE_URL}/api/health/readiness`);
      const data = await response.json();

      if (data.checks.database.status === 'pass') {
        expect(data.checks.database.responseTime).toBeGreaterThan(0);
      }
    });
  });
});

// Custom matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    return {
      pass,
      message: () => `expected ${received} to be one of ${expected.join(', ')}`,
    };
  },
});

describe('Health Endpoints Integration', () => {
  const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

  describe('GET /api/health/liveness', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${BASE_URL}/api/health/liveness`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeGreaterThan(0);
    });
  });

  describe('GET /api/health/readiness', () => {
    it('should check all dependencies', async () => {
      const response = await fetch(`${BASE_URL}/api/health/readiness`);
      const data = await response.json();

      expect(response.status).toBeOneOf([200, 503]);
      expect(data.status).toBeOneOf(['healthy', 'unhealthy']);
      expect(data.checks).toBeDefined();
      expect(data.checks.database).toBeDefined();
      expect(data.checks.redis).toBeDefined();
      expect(data.checks.stripe).toBeDefined();
    });

    it('should include response times for healthy checks', async () => {
      const response = await fetch(`${BASE_URL}/api/health/readiness`);
      const data = await response.json();

      if (data.checks.database.status === 'pass') {
        expect(data.checks.database.responseTime).toBeGreaterThan(0);
      }
    });
  });
});

// Custom matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    return {
      pass,
      message: () => `expected ${received} to be one of ${expected.join(', ')}`,
    };
  },
});


