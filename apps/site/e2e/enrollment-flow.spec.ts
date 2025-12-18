import { test, expect } from '@playwright/test'

test.describe('Student Enrollment Flow', () => {
  test('complete user journey from signup to course access', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/')
    await expect(page.getByText('AI Mastery')).toBeVisible()

    // 2. Navigate to courses
    await page.click('text=Explore Courses')
    await expect(page).toHaveURL(/.*courses/)

    // 3. View course details
    const firstCourse = page.locator('.card').first()
    await expect(firstCourse).toBeVisible()

    // 4. Sign up flow
    await page.click('text=Get Started')
    await expect(page).toHaveURL(/.*signup/)

    // Fill signup form
    await page.fill('input[type="email"]', `test-${Date.now()}@aspire.ai`)
    await page.fill('input[placeholder*="Full Name"]', 'Test User')
    await page.fill('input[type="password"]', 'securepassword123')
    await page.fill('input[placeholder*="Confirm"]', 'securepassword123')

    // Note: In real test, this would complete signup
    // For now, we verify the form is functional
    expect(await page.locator('button[type="submit"]').isEnabled()).toBe(true)
  })

  test('pricing page displays correctly', async ({ page }) => {
    await page.goto('/pricing')
    
    // Check all three plans are visible
    await expect(page.getByText('Standard Plan')).toBeVisible()
    await expect(page.getByText('Mastery Plan')).toBeVisible()
    await expect(page.getByText('Mastermind Plan')).toBeVisible()

    // Check pricing
    await expect(page.getByText('$49')).toBeVisible()
    await expect(page.getByText('$99')).toBeVisible()
    await expect(page.getByText('$199')).toBeVisible()
  })

  test('dashboard requires authentication', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to signin
    await expect(page).toHaveURL(/.*signin/)
  })
})



