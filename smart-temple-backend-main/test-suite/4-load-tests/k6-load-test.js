import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Load Test Configuration for Baseline, Stress, Spike & Endurance Testing
export const options = {
  stages: [
    // Stage 1: Baseline Load Test - Ramp up to 100 Virtual Users over 10s, hold for 1 min
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    
    // Stage 2: Stress Test - Ramp up to 500 VUs
    { duration: '30s', target: 500 },
    { duration: '1m', target: 500 },
    
    // Stage 3: Spike Test - Sudden jump to 1000 VUs
    { duration: '10s', target: 1000 },
    { duration: '30s', target: 1000 },
    
    // Stage 4: Endurance / Ramp down back to baseline
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests < 500ms, 99% < 1500ms
    http_req_failed: ['rate<0.01'],                 // Error rate < 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://lokeshdurgi.github.io/Smart-Temple';

export default function () {
  const endpoints = [
    `${BASE_URL}/`,
    `${BASE_URL}/api/menu`,
    `${BASE_URL}/api/orders`,
    `${BASE_URL}/api/auth/login`,
    `${BASE_URL}/api/dashboard`
  ];

  const targetUrl = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(targetUrl);

  check(res, {
    'status is 200 or 304': (r) => r.status === 200 || r.status === 304,
    'response duration < 1500ms': (r) => r.timings.duration < 1500,
  });

  sleep(0.5); // Think time
}
