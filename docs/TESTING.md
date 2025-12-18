# Testing Guide

## Overview

Comprehensive testing strategy for Azerra AI School platform with unit tests, integration tests, E2E tests, and accessibility checks.

## Test Stack

- **Unit Tests**: Vitest + Testing Library
- **Integration Tests**: Vitest + Supertest
- **E2E Tests**: Playwright
- **Accessibility**: axe-core
- **Coverage**: v8 (80% threshold)

## Running Tests

### All Tests
```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Watch mode
pnpm test:watch
```

### Unit Tests
```bash
# Run unit tests
pnpm test:unit

# With coverage report
pnpm test:unit --coverage

# Coverage report opens in browser
open coverage/index.html
```

### Integration Tests
```bash
# Run integration tests
pnpm test:integration

# Requires running services:
docker-compose up -d postgres redis
```

### E2E Tests
```bash
# Run E2E tests
pnpm test:e2e

# Run specific browser
pnpm test:e2e --project=chromium

# Run in UI mode
pnpm test:e2e --ui

# Run with debugging
pnpm test:e2e --debug
```

### Accessibility Tests
```bash
# Run accessibility tests only
pnpm test:a11y

# Check specific page
pnpm test:e2e --grep "Homepage accessibility"
```

## Coverage Requirements

### Thresholds (Must Pass)
- **Lines**: ≥80%
- **Statements**: ≥80%
- **Functions**: ≥80%
- **Branches**: ≥80%

### Excluded from Coverage
- Configuration files (*.config.*)
- Type definitions (*.d.ts)
- Test files (*.test.*, *.spec.*)
- Sentry config files
- Node modules
- Build output (.next/, dist/)

## Test Structure

### Unit Tests
Location: `__tests__/lib/`, `__tests__/components/`

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### Integration Tests
Location: `__tests__/integration/`

Example:
```typescript
describe('API Integration', () => {
  it('should handle request', async () => {
    const response = await fetch('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests
Location: `e2e/`

Example:
```typescript
import { test, expect } from '@playwright/test';

test('user flow', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page).toHaveURL('/success');
});
```

### Accessibility Tests
Integrated with E2E tests using axe-core:

```typescript
import AxeBuilder from '@axe-core/playwright';

test('accessibility', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

## Golden Path E2E Test

The golden path test verifies the complete user journey:

1. **Sign Up** - User creates account
2. **Purchase** - User buys Standard plan (test mode)
3. **Enrollment** - Enrollment record created
4. **Lesson View** - User accesses lesson content
5. **Quiz Pass** - User completes quiz with ≥70%
6. **Assignment Submit** - User submits assignment
7. **Mentor Grade** - Mentor reviews and grades
8. **Certificate** - Certificate issued
9. **Discord Role** - Role synced to Discord
10. **Ops Console** - KPIs updated and visible

## CI/CD Pipeline

### GitHub Actions Workflow

1. **Typecheck** - TypeScript compilation
2. **Lint** - ESLint with zero warnings
3. **Unit Tests** - Vitest with coverage ≥80%
4. **Integration Tests** - API tests with live DB
5. **E2E Tests** - Playwright critical flows
6. **Build** - Next.js production build
7. **Deploy Preview** - Vercel preview (PRs)
8. **Deploy Production** - Vercel production (main)

### Required Status Checks
All jobs must pass before merge:
- ✅ Typecheck
- ✅ Lint
- ✅ Unit tests (≥80% coverage)
- ✅ Integration tests
- ✅ E2E tests
- ✅ Build

### Coverage Gates
Build fails if coverage drops below 80%:
```bash
# CI automatically checks:
node -e "
  const coverage = require('./coverage/coverage-summary.json');
  const total = coverage.total;
  
  if (total.lines.pct < 80) process.exit(1);
  if (total.statements.pct < 80) process.exit(1);
  if (total.functions.pct < 80) process.exit(1);
  if (total.branches.pct < 80) process.exit(1);
"
```

## Accessibility Standards

### WCAG Compliance
- **Level A** - Required (baseline)
- **Level AA** - Target (current)
- **Level AAA** - Aspirational

### Tested Pages
- ✅ Homepage
- ✅ Course catalog
- ✅ Lesson viewer
- ✅ Checkout/Pricing
- ✅ Dashboard
- ✅ Admin console

### Common Issues to Avoid
- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Keyboard navigation issues
- Missing ARIA labels
- Focus management problems

## Mocking Strategies

### External Services
```typescript
// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'sess_123' })
      }
    }
  }))
}));

// Mock Redis
vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn()
  }))
}));
```

### Database
```typescript
// Use Prisma mock
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));
```

## Debugging Tests

### Vitest
```bash
# Run with debug
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# Use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

### Playwright
```bash
# Debug mode (opens inspector)
pnpm test:e2e --debug

# Headed mode (see browser)
pnpm test:e2e --headed

# Slow motion
pnpm test:e2e --slow-mo=1000

# Trace viewer
pnpm test:e2e --trace on
npx playwright show-trace trace.zip
```

## Performance Testing

### Load Tests with k6
```bash
# Run lesson view load test
k6 run infra/load/lesson-view.k6.js

# Must pass:
# - p95 < 300ms
# - Error rate < 1%
```

See [Load Testing Guide](../infra/load/README.md) for details.

## Continuous Testing

### Pre-commit Hooks
```bash
# Install husky
pnpm add -D husky

# Setup hooks
npx husky install
npx husky add .husky/pre-commit "pnpm typecheck && pnpm lint"
npx husky add .husky/pre-push "pnpm test:unit"
```

### Local Development
```bash
# Watch mode for active development
pnpm test:watch

# Coverage in watch mode
pnpm test:watch --coverage
```

## Troubleshooting

### Tests Timeout
```typescript
// Increase timeout for slow tests
test('slow operation', { timeout: 60000 }, async () => {
  // ...
});
```

### Flaky Tests
```typescript
// Retry flaky E2E tests
test.describe.configure({ retries: 2 });

test('flaky test', async ({ page }) => {
  // Use waitFor for stability
  await page.waitForSelector('button', { state: 'visible' });
});
```

### Coverage Not Met
1. Check `coverage/index.html` for gaps
2. Add tests for uncovered branches
3. Remove dead code
4. Verify test files are excluded

## Best Practices

1. **Write tests first** (TDD when possible)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated** (no shared state)
5. **Mock external dependencies**
6. **Test edge cases** (null, undefined, errors)
7. **Maintain test speed** (parallelize, use mocks)
8. **Review coverage reports** regularly

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Overview

Comprehensive testing strategy for Azerra AI School platform with unit tests, integration tests, E2E tests, and accessibility checks.

## Test Stack

- **Unit Tests**: Vitest + Testing Library
- **Integration Tests**: Vitest + Supertest
- **E2E Tests**: Playwright
- **Accessibility**: axe-core
- **Coverage**: v8 (80% threshold)

## Running Tests

### All Tests
```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Watch mode
pnpm test:watch
```

### Unit Tests
```bash
# Run unit tests
pnpm test:unit

# With coverage report
pnpm test:unit --coverage

# Coverage report opens in browser
open coverage/index.html
```

### Integration Tests
```bash
# Run integration tests
pnpm test:integration

# Requires running services:
docker-compose up -d postgres redis
```

### E2E Tests
```bash
# Run E2E tests
pnpm test:e2e

# Run specific browser
pnpm test:e2e --project=chromium

# Run in UI mode
pnpm test:e2e --ui

# Run with debugging
pnpm test:e2e --debug
```

### Accessibility Tests
```bash
# Run accessibility tests only
pnpm test:a11y

# Check specific page
pnpm test:e2e --grep "Homepage accessibility"
```

## Coverage Requirements

### Thresholds (Must Pass)
- **Lines**: ≥80%
- **Statements**: ≥80%
- **Functions**: ≥80%
- **Branches**: ≥80%

### Excluded from Coverage
- Configuration files (*.config.*)
- Type definitions (*.d.ts)
- Test files (*.test.*, *.spec.*)
- Sentry config files
- Node modules
- Build output (.next/, dist/)

## Test Structure

### Unit Tests
Location: `__tests__/lib/`, `__tests__/components/`

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### Integration Tests
Location: `__tests__/integration/`

Example:
```typescript
describe('API Integration', () => {
  it('should handle request', async () => {
    const response = await fetch('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests
Location: `e2e/`

Example:
```typescript
import { test, expect } from '@playwright/test';

test('user flow', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page).toHaveURL('/success');
});
```

### Accessibility Tests
Integrated with E2E tests using axe-core:

```typescript
import AxeBuilder from '@axe-core/playwright';

test('accessibility', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

## Golden Path E2E Test

The golden path test verifies the complete user journey:

1. **Sign Up** - User creates account
2. **Purchase** - User buys Standard plan (test mode)
3. **Enrollment** - Enrollment record created
4. **Lesson View** - User accesses lesson content
5. **Quiz Pass** - User completes quiz with ≥70%
6. **Assignment Submit** - User submits assignment
7. **Mentor Grade** - Mentor reviews and grades
8. **Certificate** - Certificate issued
9. **Discord Role** - Role synced to Discord
10. **Ops Console** - KPIs updated and visible

## CI/CD Pipeline

### GitHub Actions Workflow

1. **Typecheck** - TypeScript compilation
2. **Lint** - ESLint with zero warnings
3. **Unit Tests** - Vitest with coverage ≥80%
4. **Integration Tests** - API tests with live DB
5. **E2E Tests** - Playwright critical flows
6. **Build** - Next.js production build
7. **Deploy Preview** - Vercel preview (PRs)
8. **Deploy Production** - Vercel production (main)

### Required Status Checks
All jobs must pass before merge:
- ✅ Typecheck
- ✅ Lint
- ✅ Unit tests (≥80% coverage)
- ✅ Integration tests
- ✅ E2E tests
- ✅ Build

### Coverage Gates
Build fails if coverage drops below 80%:
```bash
# CI automatically checks:
node -e "
  const coverage = require('./coverage/coverage-summary.json');
  const total = coverage.total;
  
  if (total.lines.pct < 80) process.exit(1);
  if (total.statements.pct < 80) process.exit(1);
  if (total.functions.pct < 80) process.exit(1);
  if (total.branches.pct < 80) process.exit(1);
"
```

## Accessibility Standards

### WCAG Compliance
- **Level A** - Required (baseline)
- **Level AA** - Target (current)
- **Level AAA** - Aspirational

### Tested Pages
- ✅ Homepage
- ✅ Course catalog
- ✅ Lesson viewer
- ✅ Checkout/Pricing
- ✅ Dashboard
- ✅ Admin console

### Common Issues to Avoid
- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Keyboard navigation issues
- Missing ARIA labels
- Focus management problems

## Mocking Strategies

### External Services
```typescript
// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'sess_123' })
      }
    }
  }))
}));

// Mock Redis
vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn()
  }))
}));
```

### Database
```typescript
// Use Prisma mock
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));
```

## Debugging Tests

### Vitest
```bash
# Run with debug
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# Use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

### Playwright
```bash
# Debug mode (opens inspector)
pnpm test:e2e --debug

# Headed mode (see browser)
pnpm test:e2e --headed

# Slow motion
pnpm test:e2e --slow-mo=1000

# Trace viewer
pnpm test:e2e --trace on
npx playwright show-trace trace.zip
```

## Performance Testing

### Load Tests with k6
```bash
# Run lesson view load test
k6 run infra/load/lesson-view.k6.js

# Must pass:
# - p95 < 300ms
# - Error rate < 1%
```

See [Load Testing Guide](../infra/load/README.md) for details.

## Continuous Testing

### Pre-commit Hooks
```bash
# Install husky
pnpm add -D husky

# Setup hooks
npx husky install
npx husky add .husky/pre-commit "pnpm typecheck && pnpm lint"
npx husky add .husky/pre-push "pnpm test:unit"
```

### Local Development
```bash
# Watch mode for active development
pnpm test:watch

# Coverage in watch mode
pnpm test:watch --coverage
```

## Troubleshooting

### Tests Timeout
```typescript
// Increase timeout for slow tests
test('slow operation', { timeout: 60000 }, async () => {
  // ...
});
```

### Flaky Tests
```typescript
// Retry flaky E2E tests
test.describe.configure({ retries: 2 });

test('flaky test', async ({ page }) => {
  // Use waitFor for stability
  await page.waitForSelector('button', { state: 'visible' });
});
```

### Coverage Not Met
1. Check `coverage/index.html` for gaps
2. Add tests for uncovered branches
3. Remove dead code
4. Verify test files are excluded

## Best Practices

1. **Write tests first** (TDD when possible)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated** (no shared state)
5. **Mock external dependencies**
6. **Test edge cases** (null, undefined, errors)
7. **Maintain test speed** (parallelize, use mocks)
8. **Review coverage reports** regularly

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)


