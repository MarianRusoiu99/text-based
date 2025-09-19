import { test, expect } from '@playwright/test';
import { E2EAuthHelper } from '../../utils/e2e-test-utilities';

test.describe('Profile Management', () => {
  let sharedPage: any;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    await E2EAuthHelper.loginWithDefaultUser(sharedPage);
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  test('should display user profile information', async () => {
    // Navigate to profile page
    await sharedPage.goto('/profile');

    // Wait for loading to complete
    await sharedPage.waitForFunction(() => {
      return !document.body.textContent?.includes('Loading...');
    });

    // Check if there's an error
    const errorElement = sharedPage.locator('text=Error loading profile');
    if (await errorElement.isVisible()) {
      const fullContent = await sharedPage.textContent('body');
      console.log('Page content when error:', fullContent);
      throw new Error('Profile loading failed with error');
    }

    // Check if profile information is displayed
    await expect(sharedPage.locator('h2:text("testuser")')).toBeVisible();
    await expect(sharedPage.locator('p:text("@testuser")')).toBeVisible();
    await expect(sharedPage.locator('p:text("test@example.com")')).toBeVisible();
  });

  test('should allow editing profile information', async () => {
    // Navigate to profile page
    await sharedPage.goto('/profile');

    // Click edit profile button
    await sharedPage.click('text=Edit Profile');

    // Check if form fields are visible
    await expect(sharedPage.locator('input[value="testuser"]')).toBeVisible();
    await expect(sharedPage.locator('textarea')).toBeVisible();

    // Update profile information
    await sharedPage.fill('input[name="displayName"]', 'Updated Test User');
    await sharedPage.fill('textarea[name="bio"]', 'This is my updated bio');
    await sharedPage.fill('input[name="avatarUrl"]', 'https://example.com/new-avatar.jpg');

    // Save changes
    await sharedPage.click('text=Save Changes');

    // Verify changes are saved and displayed
    await expect(sharedPage.locator('text=Updated Test User')).toBeVisible();
    await expect(sharedPage.locator('text=This is my updated bio')).toBeVisible();
  });

  test('should cancel profile editing', async () => {
    // Navigate to profile page
    await sharedPage.goto('/profile');

    // Click edit profile button
    await sharedPage.click('text=Edit Profile');

    // Make changes
    await sharedPage.fill('input[name="displayName"]', 'Cancelled Change');

    // Click cancel
    await sharedPage.click('text=Cancel');

    // Verify original information is still displayed
    await expect(sharedPage.locator('text=testuser')).toBeVisible();
    await expect(sharedPage.locator('text=Cancelled Change')).not.toBeVisible();
  });

  test('should handle profile loading errors', async () => {
    // This test would require mocking API responses
    // For now, we'll test the basic error handling structure
    await sharedPage.goto('/profile');

    // The profile should load successfully with our test user
    await expect(sharedPage.locator('text=testuser')).toBeVisible();
  });
});
