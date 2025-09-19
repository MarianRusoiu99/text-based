/**
 * Shared Authentication Helper for API and E2E Tests
 * Provides centralized authentication logic to avoid duplication
 */

import { APIRequestContext, Page, expect } from '@playwright/test';

export interface AuthUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Default test user credentials
 */
export const DEFAULT_TEST_USER: AuthUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User'
};

/**
 * API Authentication Helper
 * Handles authentication for API tests
 */
export class APIAuthHelper {
  private static registeredUsers = new Set<string>();

  /**
   * Register a user via API if not already registered
   */
  static async registerUserIfNeeded(
    request: APIRequestContext,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<AuthResponse> {
    if (this.registeredUsers.has(user.email)) {
      // User already registered, just login
      return this.loginUser(request, user);
    }

    const response = await request.post('http://localhost:3000/auth/register', {
      data: user,
    });

    if (response.status() === 201) {
      this.registeredUsers.add(user.email);
      const responseBody = await response.json();
      return responseBody as AuthResponse;
    } else if (response.status() === 409) {
      // User already exists, try to login instead
      this.registeredUsers.add(user.email);
      return this.loginUser(request, user);
    } else {
      throw new Error(`Registration failed: ${response.status()} ${await response.text()}`);
    }
  }

  /**
   * Login a user via API
   */
  static async loginUser(
    request: APIRequestContext,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<AuthResponse> {
    const response = await request.post('http://localhost:3000/auth/login', {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const responseBody = await response.json();
    return responseBody as AuthResponse;
  }

  /**
   * Get authentication tokens for a user
   */
  static async getAuthTokens(
    request: APIRequestContext,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<AuthTokens> {
    const authResponse = await this.registerUserIfNeeded(request, user);
    return {
      accessToken: authResponse.data.accessToken,
      refreshToken: authResponse.data.refreshToken,
    };
  }

  /**
   * Create authenticated request headers
   */
  static async getAuthHeaders(
    request: APIRequestContext,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<Record<string, string>> {
    const tokens = await this.getAuthTokens(request, user);
    return {
      'Authorization': `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
    };
  }
}

/**
 * E2E Authentication Helper
 * Handles authentication for E2E tests
 */
export class E2EAuthHelper {
  /**
   * Register a user via E2E interface
   */
  static async registerUser(page: Page, user: AuthUser): Promise<{ user: AuthUser; authData: any }> {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByLabel('Display Name').fill(user.displayName);

    // Submit form
    await page.getByRole('button', { name: /register|sign up/i }).click();

    // Wait for success or redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify user is authenticated
    await this.verifyAuthentication(page);

    return {
      user,
      authData: await this.getAuthState(page)
    };
  }

  /**
   * Login a user via E2E interface
   */
  static async loginUser(page: Page, user: AuthUser): Promise<{ user: AuthUser; authData: any }> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);

    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click();

    // Wait for success or redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify user is authenticated
    await this.verifyAuthentication(page);

    return {
      user,
      authData: await this.getAuthState(page)
    };
  }

  /**
   * Verify user is authenticated
   */
  static async verifyAuthentication(page: Page): Promise<void> {
    // Check for authenticated user indicators
    const userMenu = page.locator('[data-testid="user-menu"]').or(
      page.locator('[aria-label*="user"]').or(
        page.locator('text=/welcome|dashboard|profile/i')
      )
    );

    await expect(userMenu).toBeVisible({ timeout: 5000 });
  }

  /**
   * Get current authentication state
   */
  static async getAuthState(page: Page): Promise<any> {
    // Try to get auth state from localStorage or context
    try {
      const authState = await page.evaluate(() => {
        const state = localStorage.getItem('auth-state');
        return state ? JSON.parse(state) : null;
      });
      return authState;
    } catch {
      return { isAuthenticated: true }; // Fallback
    }
  }

  /**
   * Logout user
   */
  static async logoutUser(page: Page): Promise<void> {
    // Click user menu
    await page.locator('[data-testid="user-menu"]').click();

    // Click logout
    await page.getByRole('menuitem', { name: /logout|sign out/i }).click();

    // Wait for redirect to login
    await page.waitForURL('**/login', { timeout: 5000 });
  }
}

/**
 * Test Setup Helper
 * Provides common test setup utilities
 */
export class TestSetupHelper {
  /**
   * Setup authenticated context for API tests
   */
  static async setupAuthenticatedAPIContext(
    request: APIRequestContext,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<{ headers: Record<string, string>; user: AuthUser }> {
    const headers = await APIAuthHelper.getAuthHeaders(request, user);
    return { headers, user };
  }

  /**
   * Setup authenticated context for E2E tests
   */
  static async setupAuthenticatedE2EContext(
    page: Page,
    user: AuthUser = DEFAULT_TEST_USER
  ): Promise<{ user: AuthUser; authData: any }> {
    return await E2EAuthHelper.loginUser(page, user);
  }
}