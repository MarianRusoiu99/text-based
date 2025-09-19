/**
 * Shared Authentication Helper for E2E Tests
 * Provides centralized authentication logic for E2E testing
 */

import { Page, expect } from '@playwright/test';

export interface E2EAuthUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface E2EAuthState {
  isAuthenticated: boolean;
  user?: E2EAuthUser;
}

/**
 * Default test user credentials for E2E tests
 */
export const DEFAULT_E2E_TEST_USER: E2EAuthUser = {
  username: 'e2etestuser',
  email: 'e2e-test@example.com',
  password: 'password123',
  displayName: 'E2E Test User'
};

/**
 * E2E Authentication Helper
 * Handles authentication workflows for E2E tests
 */
export class E2EAuthHelper {
  private static registeredUsers = new Set<string>();

  /**
   * Register a new user via the UI
   */
  static async registerUser(
    page: Page,
    user: E2EAuthUser = DEFAULT_E2E_TEST_USER
  ): Promise<{ user: E2EAuthUser; authState: E2EAuthState }> {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form with resilient selectors
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByLabel('Display Name').fill(user.displayName);

    // Submit form
    await page.getByRole('button', { name: /register|sign up|create account/i }).click();

    // Wait for success - either redirect or success message
    try {
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    } catch {
      // If no redirect, check for success message
      await expect(page.getByText(/registration successful|account created|welcome/i)).toBeVisible({ timeout: 5000 });
    }

    // Verify authentication
    const authState = await this.verifyAuthentication(page);

    return { user, authState };
  }

  /**
   * Login an existing user via the UI
   */
  static async loginUser(
    page: Page,
    user: E2EAuthUser = DEFAULT_E2E_TEST_USER
  ): Promise<{ user: E2EAuthUser; authState: E2EAuthState }> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form with resilient selectors
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);

    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click();

    // Wait for success - either redirect or success message
    try {
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    } catch {
      // If no redirect, check for success message
      await expect(page.getByText(/login successful|welcome back/i)).toBeVisible({ timeout: 5000 });
    }

    // Verify authentication
    const authState = await this.verifyAuthentication(page);

    return { user, authState };
  }

  /**
   * Verify user is authenticated by checking UI indicators
   */
  static async verifyAuthentication(page: Page): Promise<E2EAuthState> {
    // Check for authenticated user indicators with resilient selectors
    const userMenu = page.locator('[data-testid="user-menu"]').or(
      page.locator('[aria-label*="user"]').or(
        page.locator('text=/welcome|dashboard|profile/i')
      )
    );

    try {
      await expect(userMenu).toBeVisible({ timeout: 5000 });
      return { isAuthenticated: true };
    } catch {
      return { isAuthenticated: false };
    }
  }

  /**
   * Logout the current user
   */
  static async logoutUser(page: Page): Promise<void> {
    // Click user menu with resilient selector
    const userMenu = page.locator('[data-testid="user-menu"]').or(
      page.locator('[aria-label*="user"]').or(
        page.locator('button').filter({ hasText: /account|profile|user/i })
      )
    );

    await userMenu.click();

    // Click logout with resilient selector
    await page.getByRole('menuitem', { name: /logout|sign out/i }).click();

    // Wait for redirect to login
    await page.waitForURL('**/login', { timeout: 5000 });
  }

  /**
   * Setup authenticated context for E2E tests
   */
  static async setupAuthenticatedContext(
    page: Page,
    user: E2EAuthUser = DEFAULT_E2E_TEST_USER
  ): Promise<{ user: E2EAuthUser; authState: E2EAuthState }> {
    // Try to login first (user might already exist)
    try {
      return await this.loginUser(page, user);
    } catch {
      // If login fails, try to register
      return await this.registerUser(page, user);
    }
  }
}

/**
 * E2E Test Assertions Helper
 * Provides common assertion patterns for E2E tests
 */
export class E2EAssertions {
  /**
   * Assert user is authenticated
   */
  static async assertUserAuthenticated(page: Page, expectedUser?: E2EAuthUser): Promise<void> {
    const authState = await E2EAuthHelper.verifyAuthentication(page);
    expect(authState.isAuthenticated).toBe(true);

    if (expectedUser) {
      // Check if user info is displayed
      if (expectedUser.displayName) {
        await expect(page.getByText(expectedUser.displayName)).toBeVisible();
      }
    }
  }

  /**
   * Assert URL matches expected pattern
   */
  static async assertUrlMatches(page: Page, expectedUrl: string | RegExp): Promise<void> {
    if (typeof expectedUrl === 'string') {
      await expect(page).toHaveURL(expectedUrl);
    } else {
      await expect(page).toHaveURL(expectedUrl);
    }
  }

  /**
   * Assert success message is displayed
   */
  static async assertSuccessMessage(page: Page, message: string | RegExp): Promise<void> {
    const messageLocator = typeof message === 'string'
      ? page.getByText(message)
      : page.getByText(message);

    await expect(messageLocator).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert error message is displayed
   */
  static async assertErrorMessage(page: Page, message: string | RegExp): Promise<void> {
    const messageLocator = typeof message === 'string'
      ? page.getByText(message)
      : page.getByText(message);

    await expect(messageLocator).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert element is visible with custom message
   */
  static async assertElementVisible(page: Page, locator: string, message?: string): Promise<void> {
    await expect(page.locator(locator)).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert page title
   */
  static async assertPageTitle(page: Page, title: string | RegExp): Promise<void> {
    const titleLocator = typeof title === 'string'
      ? page.getByRole('heading', { name: title })
      : page.getByRole('heading').filter({ hasText: title });

    await expect(titleLocator).toBeVisible({ timeout: 5000 });
  }
}

/**
 * E2E Test Utilities
 * Provides common test utilities and helpers
 */
export class E2ETestUtils {
  /**
   * Clear test data and reset application state
   */
  static async clearTestData(page: Page): Promise<void> {
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Navigate to home to reset state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Additional buffer for dynamic content
  }

  /**
   * Take screenshot for debugging
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  /**
   * Generate unique test identifier
   */
  static generateTestId(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}