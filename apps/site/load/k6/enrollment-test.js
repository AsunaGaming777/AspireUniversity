import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests under 300ms
    http_req_failed: ['rate<0.01'], // Error rate under 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test user enrollment flow
  const enrollmentData = {
    email: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
    password: 'TestPassword123!',
    name: `Test User ${Math.random().toString(36).substr(2, 9)}`,
    referrerCode: 'AFFILIATE123',
  };

  // Step 1: Register user
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(enrollmentData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerResponse, {
    'registration successful': (r) => r.status === 201,
    'registration response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  if (registerResponse.status !== 201) {
    console.error(`Registration failed: ${registerResponse.body}`);
    return;
  }

  sleep(1);

  // Step 2: Login
  const loginData = {
    email: enrollmentData.email,
    password: enrollmentData.password,
  };

  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(loginData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  if (loginResponse.status !== 200) {
    console.error(`Login failed: ${loginResponse.body}`);
    return;
  }

  const authToken = loginResponse.json('token');
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  sleep(1);

  // Step 3: Get course catalog
  const catalogResponse = http.get(`${BASE_URL}/api/courses`, { headers });

  check(catalogResponse, {
    'catalog loaded': (r) => r.status === 200,
    'catalog response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Step 4: Enroll in course
  const enrollmentPayload = {
    courseId: 'clh1234567890', // Mock course ID
    paymentMethodId: 'pm_test_mock',
  };

  const enrollResponse = http.post(`${BASE_URL}/api/enrollments`, JSON.stringify(enrollmentPayload), {
    headers,
  });

  check(enrollResponse, {
    'enrollment successful': (r) => r.status === 201,
    'enrollment response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(1);

  // Step 5: Get user progress
  const progressResponse = http.get(`${BASE_URL}/api/progress`, { headers });

  check(progressResponse, {
    'progress loaded': (r) => r.status === 200,
    'progress response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'enrollment-test-results.json': JSON.stringify(data, null, 2),
  };
}


