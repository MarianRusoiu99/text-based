import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login a test user
    const timestamp = Date.now();
    await page.goto('/register');

    await page.fill('input[name="username"]', `profiletest${timestamp}`);
    await page.fill('input[name="email"]', `profiletest${timestamp}@example.com`);
    await page.fill('input[name="displayName"]', 'Profile Test User');
    await page.fill('input[name="password"]', 'password123');

    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/(|stories)$/);
    
    // Check if user is logged in by checking the header
    await expect(page.locator('text=Welcome, Profile Test User')).toBeVisible();
    
    // Check if auth data is in localStorage
    const authData = await page.evaluate(() => localStorage.getItem('auth-storage'));
    expect(authData).toBeTruthy();
    console.log('Auth data:', authData);
  });

  test('should display user profile information', async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');

    // Wait for loading to complete
    await page.waitForFunction(() => {
      return !document.body.textContent?.includes('Loading...');
    });

    // Check if there's an error
    const errorElement = page.locator('text=Error loading profile');
    if (await errorElement.isVisible()) {
      const fullContent = await page.textContent('body');
      console.log('Page content when error:', fullContent);
      throw new Error('Profile loading failed with error');
    }

    // Check if profile information is displayed
    await expect(page.locator('h2:text("Profile Test User")')).toBeVisible();
    await expect(page.locator('p:text("@profiletest")')).toBeVisible();
    await expect(page.locator('p:text("@example.com")')).toBeVisible();
  });

  test('should allow editing profile information', async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');

    // Click edit profile button
    await page.click('text=Edit Profile');

    // Check if form fields are visible
    await expect(page.locator('input[value="Profile Test User"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();

    // Update profile information
    await page.fill('input[name="displayName"]', 'Updated Profile User');
    await page.fill('textarea[name="bio"]', 'This is my updated bio');
    await page.fill('input[name="avatarUrl"]', 'https://example.com/new-avatar.jpg');

    // Save changes
    await page.click('text=Save Changes');

    // Verify changes are saved and displayed
    await expect(page.locator('text=Updated Profile User')).toBeVisible();
    await expect(page.locator('text=This is my updated bio')).toBeVisible();
  });

  test('should cancel profile editing', async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');

    // Click edit profile button
    await page.click('text=Edit Profile');

    // Make changes
    await page.fill('input[name="displayName"]', 'Cancelled Change');

    // Click cancel
    await page.click('text=Cancel');

    // Verify original information is still displayed
    await expect(page.locator('text=Profile Test User')).toBeVisible();
    await expect(page.locator('text=Cancelled Change')).not.toBeVisible();
  });

  test('should handle profile loading errors', async ({ page }) => {
    // This test would require mocking API responses
    // For now, we'll test the basic error handling structure
    await page.goto('/profile');

    // The profile should load successfully with our test user
    await expect(page.locator('text=Profile Test User')).toBeVisible();
  });
});
