import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Video streaming can be slower
    http_req_failed: ['rate<0.02'],
    errors: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Simulate authenticated user
  const authToken = __ENV.AUTH_TOKEN || 'mock-token';
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  // Step 1: Get lesson list
  const lessonsResponse = http.get(`${BASE_URL}/api/lessons`, { headers });

  check(lessonsResponse, {
    'lessons loaded': (r) => r.status === 200,
    'lessons response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  if (lessonsResponse.status !== 200) {
    return;
  }

  const lessons = lessonsResponse.json();
  const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];

  sleep(1);

  // Step 2: Start lesson
  const startResponse = http.post(`${BASE_URL}/api/lessons/${randomLesson.id}/start`, {}, { headers });

  check(startResponse, {
    'lesson started': (r) => r.status === 200,
    'start response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(2);

  // Step 3: Update progress (simulate watching)
  const progressData = {
    progress: 0.5,
    timeSpent: 300, // 5 minutes
  };

  const progressResponse = http.put(
    `${BASE_URL}/api/lessons/${randomLesson.id}/progress`,
    JSON.stringify(progressData),
    { headers }
  );

  check(progressResponse, {
    'progress updated': (r) => r.status === 200,
    'progress response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(3);

  // Step 4: Complete lesson
  const completeResponse = http.post(`${BASE_URL}/api/lessons/${randomLesson.id}/complete`, {}, { headers });

  check(completeResponse, {
    'lesson completed': (r) => r.status === 200,
    'complete response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Step 5: Take quiz (if available)
  const quizResponse = http.get(`${BASE_URL}/api/lessons/${randomLesson.id}/quiz`, { headers });

  if (quizResponse.status === 200) {
    const quiz = quizResponse.json();
    
    // Simulate quiz submission
    const quizData = {
      answers: quiz.questions.map(() => Math.floor(Math.random() * 4)), // Random answers
    };

    const submitQuizResponse = http.post(
      `${BASE_URL}/api/lessons/${randomLesson.id}/quiz/submit`,
      JSON.stringify(quizData),
      { headers }
    );

    check(submitQuizResponse, {
      'quiz submitted': (r) => r.status === 200,
      'quiz response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'lesson-viewing-test-results.json': JSON.stringify(data, null, 2),
  };
}


