import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 25 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // File uploads can be slower
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const authToken = __ENV.AUTH_TOKEN || 'mock-token';
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  // Step 1: Get assignments
  const assignmentsResponse = http.get(`${BASE_URL}/api/assignments`, { headers });

  check(assignmentsResponse, {
    'assignments loaded': (r) => r.status === 200,
    'assignments response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  if (assignmentsResponse.status !== 200) {
    return;
  }

  const assignments = assignmentsResponse.json();
  const randomAssignment = assignments[Math.floor(Math.random() * assignments.length)];

  sleep(1);

  // Step 2: Get assignment details
  const assignmentResponse = http.get(`${BASE_URL}/api/assignments/${randomAssignment.id}`, { headers });

  check(assignmentResponse, {
    'assignment details loaded': (r) => r.status === 200,
    'assignment response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Step 3: Submit assignment
  const submissionData = {
    content: `This is a test submission for assignment ${randomAssignment.id}. ` +
             `Generated at ${new Date().toISOString()}. ` +
             `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` +
             `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    files: [
      {
        name: 'test-submission.txt',
        content: 'This is a test file content for the assignment submission.',
        type: 'text/plain',
      },
    ],
  };

  const submitResponse = http.post(
    `${BASE_URL}/api/assignments/${randomAssignment.id}/submit`,
    JSON.stringify(submissionData),
    { headers }
  );

  check(submitResponse, {
    'assignment submitted': (r) => r.status === 201,
    'submission response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(2);

  // Step 4: Check submission status
  const statusResponse = http.get(`${BASE_URL}/api/assignments/${randomAssignment.id}/submission`, { headers });

  check(statusResponse, {
    'submission status checked': (r) => r.status === 200,
    'status response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Step 5: Update submission (if needed)
  const updateData = {
    content: submissionData.content + '\n\nUpdated with additional content.',
  };

  const updateResponse = http.put(
    `${BASE_URL}/api/assignments/${randomAssignment.id}/submission`,
    JSON.stringify(updateData),
    { headers }
  );

  check(updateResponse, {
    'submission updated': (r) => r.status === 200,
    'update response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'assignment-submission-test-results.json': JSON.stringify(data, null, 2),
  };
}


