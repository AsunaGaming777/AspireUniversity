# Load Testing with K6

This directory contains K6 load testing scripts for the Aspire AI platform.

## Prerequisites

1. Install K6: https://k6.io/docs/getting-started/installation/
2. Set up test environment with proper database and Redis
3. Configure environment variables

## Test Scripts

### 1. Enrollment Test (`enrollment-test.js`)
Tests the complete user enrollment flow:
- User registration
- Authentication
- Course catalog browsing
- Course enrollment
- Progress tracking

**Usage:**
```bash
k6 run load/k6/enrollment-test.js --env BASE_URL=http://localhost:3000
```

### 2. Lesson Viewing Test (`lesson-viewing-test.js`)
Tests lesson consumption and progress tracking:
- Lesson loading
- Progress updates
- Quiz taking
- Completion tracking

**Usage:**
```bash
k6 run load/k6/lesson-viewing-test.js --env BASE_URL=http://localhost:3000 --env AUTH_TOKEN=your-token
```

### 3. Assignment Submission Test (`assignment-submission-test.js`)
Tests assignment submission and management:
- Assignment loading
- Content submission
- File uploads
- Status updates

**Usage:**
```bash
k6 run load/k6/assignment-submission-test.js --env BASE_URL=http://localhost:3000 --env AUTH_TOKEN=your-token
```

## Performance Targets

### SLOs (Service Level Objectives)
- **API Success Rate**: 99.9%
- **API P95 Latency**: <300ms for GET requests, <1000ms for POST requests
- **Webhook Failure Rate**: <1%

### Load Test Scenarios

#### Scenario 1: Normal Load
- **Users**: 50 concurrent
- **Duration**: 10 minutes
- **Expected**: All SLOs met

#### Scenario 2: Peak Load
- **Users**: 200 concurrent
- **Duration**: 5 minutes
- **Expected**: P95 latency <500ms, success rate >99%

#### Scenario 3: Stress Test
- **Users**: 500 concurrent
- **Duration**: 3 minutes
- **Expected**: System remains stable, graceful degradation

## Running Tests

### Single Test
```bash
k6 run load/k6/enrollment-test.js
```

### All Tests
```bash
npm run load:test
```

### Custom Configuration
```bash
k6 run --vus 100 --duration 5m load/k6/enrollment-test.js
```

## Environment Variables

- `BASE_URL`: Target application URL (default: http://localhost:3000)
- `AUTH_TOKEN`: Authentication token for authenticated tests
- `DATABASE_URL`: Test database connection
- `REDIS_URL`: Test Redis connection

## Test Data

Tests use generated test data to avoid conflicts:
- Random email addresses
- Random user names
- Mock payment methods
- Generated content

## Monitoring

During load tests, monitor:
- Application metrics (CPU, memory, database connections)
- Database performance (query times, connection pool)
- Redis performance (memory usage, hit rates)
- External service health (Stripe, SendGrid, Discord)

## Results Analysis

K6 generates detailed reports including:
- Request duration percentiles
- Error rates
- Throughput metrics
- Custom metrics

Results are saved to JSON files for further analysis.

## Troubleshooting

### Common Issues

1. **High Error Rates**
   - Check database connection limits
   - Verify Redis connectivity
   - Monitor external service health

2. **Slow Response Times**
   - Check database query performance
   - Verify caching effectiveness
   - Monitor network latency

3. **Memory Issues**
   - Check for memory leaks
   - Monitor garbage collection
   - Verify connection pooling

### Debug Mode
```bash
k6 run --http-debug load/k6/enrollment-test.js
```

## Continuous Integration

Load tests are integrated into CI/CD pipeline:
- Run on staging environment
- Fail build if SLOs not met
- Generate performance reports
- Alert on regressions

## Best Practices

1. **Start Small**: Begin with low user counts
2. **Gradual Ramp**: Increase load gradually
3. **Monitor Resources**: Watch system resources during tests
4. **Clean Data**: Use test data that can be cleaned up
5. **Realistic Scenarios**: Test actual user workflows
6. **Regular Testing**: Run load tests regularly
7. **Document Results**: Keep performance baselines

## Performance Baselines

### Current Baselines (Target)
- **Enrollment Flow**: <2s end-to-end
- **Lesson Loading**: <500ms
- **Assignment Submission**: <1s
- **Quiz Completion**: <300ms
- **Progress Updates**: <200ms

### Monitoring Thresholds
- **Error Rate**: >1% triggers alert
- **P95 Latency**: >500ms triggers alert
- **Database Connections**: >80% triggers alert
- **Memory Usage**: >90% triggers alert


