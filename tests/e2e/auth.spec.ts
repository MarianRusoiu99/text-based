import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page }) => {
    const timestamp = Date.now();
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="username"]', `testuser${timestamp}`);
    await page.fill('input[name="email"]', `test${timestamp}@example.com`);
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home or stories page
    await expect(page).toHaveURL(/\/(|stories)$/);
  });

  test('should login with existing user', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home or stories page
    await expect(page).toHaveURL(/\/(|stories)$/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form with wrong credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
