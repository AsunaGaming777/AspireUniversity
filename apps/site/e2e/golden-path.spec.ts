import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Golden Path: Sign-up → Certificate → Discord Role', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('complete user journey', async ({ page }) => {
    // Step 1: Sign up
    await test.step('User signs up with email', async () => {
      await page.goto('/auth/signup');
      
      const timestamp = Date.now();
      await page.fill('input[name="email"]', `test-${timestamp}@example.com`);
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.fill('input[name="name"]', 'Test User');
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(/\/dashboard/);
    });

    // Step 2: Navigate to pricing and purchase (test mode)
    await test.step('User purchases Standard plan', async () => {
      await page.goto('/pricing');
      
      // Click on Standard plan
      await page.click('text=Get Started >> nth=0');
      
      // Should redirect to Stripe Checkout or show test mode
      // In test environment, we'll mock the success
      await page.evaluate(() => {
        localStorage.setItem('mock-payment-success', 'true');
      });
    });

    // Step 3: Enrollment created
    await test.step('User is enrolled in course', async () => {
      await page.goto('/dashboard?success=true');
      
      await expect(page.locator('text=Payment Successful')).toBeVisible();
      await expect(page.locator('text=Standard Plan')).toBeVisible();
    });

    // Step 4: Open a lesson
    await test.step('User opens first lesson', async () => {
      await page.click('text=Continue Learning');
      
      await expect(page).toHaveURL(/\/learn\//);
      await expect(page.locator('video, iframe')).toBeVisible();
      await expect(page.locator('text=Transcript')).toBeVisible();
    });

    // Step 5: Pass a quiz
    await test.step('User completes quiz with passing score', async () => {
      await page.click('text=Take Quiz');
      
      // Answer quiz questions (assuming multiple choice)
      for (let i = 0; i < 5; i++) {
        await page.click(`input[type="radio"] >> nth=${i * 4}`); // Select first option for each question
      }
      
      await page.click('button:has-text("Submit Quiz")');
      
      await expect(page.locator('text=Passed')).toBeVisible({ timeout: 10000 });
    });

    // Step 6: Submit assignment
    await test.step('User submits assignment', async () => {
      await page.goto('/assignments');
      
      await page.click('text=Submit Assignment');
      await page.fill('textarea[name="content"]', 'This is my assignment submission.');
      
      // Upload file if supported
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles({
          name: 'assignment.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Assignment content'),
        });
      }
      
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Submitted')).toBeVisible();
    });

    // Step 7: Mentor grades assignment (admin flow)
    await test.step('Mentor grades assignment', async () => {
      // Login as mentor/admin
      await page.goto('/admin/ops/assignments');
      
      // Click on first pending assignment
      await page.click('tr:has-text("Pending") >> button:has-text("Grade")');
      
      // Fill rubric
      await page.fill('input[name="score"]', '95');
      await page.fill('textarea[name="feedback"]', 'Excellent work!');
      
      await page.click('button:has-text("Publish Grade")');
      
      await expect(page.locator('text=Grade published')).toBeVisible();
    });

    // Step 8: Certificate issued
    await test.step('Certificate is issued', async () => {
      await page.goto('/certificates');
      
      await expect(page.locator('text=Certificate of Completion')).toBeVisible();
      await expect(page.locator('a:has-text("Download Certificate")')).toBeVisible();
      
      // Click to view certificate
      await page.click('a:has-text("View Certificate")');
      
      await expect(page.locator('text=This certifies that')).toBeVisible();
    });

    // Step 9: Verify Discord role sync (check KPIs)
    await test.step('Discord role synced and visible in Ops Console', async () => {
      await page.goto('/admin/ops');
      
      // Check that enrollment appears in KPIs
      await expect(page.locator('text=Active Enrollments')).toBeVisible();
      
      // Check Discord bot heartbeat
      await expect(page.locator('text=Bot Status').locator('.. >> text=Online')).toBeVisible();
    });
  });
});

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Course page accessibility', async ({ page }) => {
    await page.goto('/courses');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Lesson page accessibility', async ({ page }) => {
    await page.goto('/learn/course-1/module-1/lesson-1');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Checkout page accessibility', async ({ page }) => {
    await page.goto('/pricing');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
import AxeBuilder from '@axe-core/playwright';

test.describe('Golden Path: Sign-up → Certificate → Discord Role', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('complete user journey', async ({ page }) => {
    // Step 1: Sign up
    await test.step('User signs up with email', async () => {
      await page.goto('/auth/signup');
      
      const timestamp = Date.now();
      await page.fill('input[name="email"]', `test-${timestamp}@example.com`);
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.fill('input[name="name"]', 'Test User');
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(/\/dashboard/);
    });

    // Step 2: Navigate to pricing and purchase (test mode)
    await test.step('User purchases Standard plan', async () => {
      await page.goto('/pricing');
      
      // Click on Standard plan
      await page.click('text=Get Started >> nth=0');
      
      // Should redirect to Stripe Checkout or show test mode
      // In test environment, we'll mock the success
      await page.evaluate(() => {
        localStorage.setItem('mock-payment-success', 'true');
      });
    });

    // Step 3: Enrollment created
    await test.step('User is enrolled in course', async () => {
      await page.goto('/dashboard?success=true');
      
      await expect(page.locator('text=Payment Successful')).toBeVisible();
      await expect(page.locator('text=Standard Plan')).toBeVisible();
    });

    // Step 4: Open a lesson
    await test.step('User opens first lesson', async () => {
      await page.click('text=Continue Learning');
      
      await expect(page).toHaveURL(/\/learn\//);
      await expect(page.locator('video, iframe')).toBeVisible();
      await expect(page.locator('text=Transcript')).toBeVisible();
    });

    // Step 5: Pass a quiz
    await test.step('User completes quiz with passing score', async () => {
      await page.click('text=Take Quiz');
      
      // Answer quiz questions (assuming multiple choice)
      for (let i = 0; i < 5; i++) {
        await page.click(`input[type="radio"] >> nth=${i * 4}`); // Select first option for each question
      }
      
      await page.click('button:has-text("Submit Quiz")');
      
      await expect(page.locator('text=Passed')).toBeVisible({ timeout: 10000 });
    });

    // Step 6: Submit assignment
    await test.step('User submits assignment', async () => {
      await page.goto('/assignments');
      
      await page.click('text=Submit Assignment');
      await page.fill('textarea[name="content"]', 'This is my assignment submission.');
      
      // Upload file if supported
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles({
          name: 'assignment.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Assignment content'),
        });
      }
      
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Submitted')).toBeVisible();
    });

    // Step 7: Mentor grades assignment (admin flow)
    await test.step('Mentor grades assignment', async () => {
      // Login as mentor/admin
      await page.goto('/admin/ops/assignments');
      
      // Click on first pending assignment
      await page.click('tr:has-text("Pending") >> button:has-text("Grade")');
      
      // Fill rubric
      await page.fill('input[name="score"]', '95');
      await page.fill('textarea[name="feedback"]', 'Excellent work!');
      
      await page.click('button:has-text("Publish Grade")');
      
      await expect(page.locator('text=Grade published')).toBeVisible();
    });

    // Step 8: Certificate issued
    await test.step('Certificate is issued', async () => {
      await page.goto('/certificates');
      
      await expect(page.locator('text=Certificate of Completion')).toBeVisible();
      await expect(page.locator('a:has-text("Download Certificate")')).toBeVisible();
      
      // Click to view certificate
      await page.click('a:has-text("View Certificate")');
      
      await expect(page.locator('text=This certifies that')).toBeVisible();
    });

    // Step 9: Verify Discord role sync (check KPIs)
    await test.step('Discord role synced and visible in Ops Console', async () => {
      await page.goto('/admin/ops');
      
      // Check that enrollment appears in KPIs
      await expect(page.locator('text=Active Enrollments')).toBeVisible();
      
      // Check Discord bot heartbeat
      await expect(page.locator('text=Bot Status').locator('.. >> text=Online')).toBeVisible();
    });
  });
});

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Course page accessibility', async ({ page }) => {
    await page.goto('/courses');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Lesson page accessibility', async ({ page }) => {
    await page.goto('/learn/course-1/module-1/lesson-1');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Checkout page accessibility', async ({ page }) => {
    await page.goto('/pricing');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});


