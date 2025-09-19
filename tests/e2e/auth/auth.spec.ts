import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EAssertions, 
  E2ETestUtils 
} from '../../utils/e2e-test-utilities';

/**
 * Authentication E2E Tests
 * Following comprehensive testing strategy with complete user workflows
 */
test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await E2ETestUtils.clearTestData(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data after each test
    await E2ETestUtils.clearTestData(page);
  });

  test.describe('User Registration', () => {
    test('should successfully register a new user with valid data', async ({ page }) => {
      // Arrange
      const testUser = E2ETestDataFactory.createTestUser({
        displayName: 'Test User Registration'
      });

      // Act
      const { user, authData } = await E2EAuthHelper.registerUser(page, testUser);

      // Assert
      await E2EAssertions.assertUserAuthenticated(page, user);
      await E2EAssertions.assertUrlMatches(page, '/');
      await E2EAssertions.assertSuccessMessage(page, 'Registration successful');
      
      expect(authData.state.user.username).toBe(testUser.username);
      expect(authData.state.user.email).toBe(testUser.email);
      expect(authData.state.user.displayName).toBe(testUser.displayName);
      expect(authData.state.isAuthenticated).toBe(true);
    });

    test('should validate required fields during registration', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      // Try to submit empty form
      await page.getByTestId('register-button').click();

      // Assert validation errors are shown
      await E2EAssertions.assertElementVisible(page, '[data-testid="username-error"]', 'Username is required');
      await E2EAssertions.assertElementVisible(page, '[data-testid="email-error"]', 'Email is required');
      await E2EAssertions.assertElementVisible(page, '[data-testid="password-error"]', 'Password is required');
      await E2EAssertions.assertElementVisible(page, '[data-testid="display-name-error"]', 'Display name is required');
    });

    test('should prevent duplicate username registration', async ({ page }) => {
      // Create first user
      const firstUser = E2ETestDataFactory.createTestUser();
      await E2EAuthHelper.registerUser(page, firstUser);
      await E2EAuthHelper.logoutUser(page);

      // Try to register with same username
      const duplicateUser = E2ETestDataFactory.createTestUser({
        username: firstUser.username,
        email: 'different@example.com'
      });

      await page.goto('/register');
      await page.getByTestId('username-input').fill(duplicateUser.username);
      await page.getByTestId('email-input').fill(duplicateUser.email);
      await page.getByTestId('password-input').fill(duplicateUser.password);
      await page.getByTestId('display-name-input').fill(duplicateUser.displayName);
      await page.getByTestId('register-button').click();

      // Assert error message for duplicate username
      await E2EAssertions.assertErrorMessage(page, 'Username already exists');
    });

    test('should prevent duplicate email registration', async ({ page }) => {
      // Create first user
      const firstUser = E2ETestDataFactory.createTestUser();
      await E2EAuthHelper.registerUser(page, firstUser);
      await E2EAuthHelper.logoutUser(page);

      // Try to register with same email
      const duplicateUser = E2ETestDataFactory.createTestUser({
        username: 'differentuser',
        email: firstUser.email
      });

      await page.goto('/register');
      await page.getByTestId('username-input').fill(duplicateUser.username);
      await page.getByTestId('email-input').fill(duplicateUser.email);
      await page.getByTestId('password-input').fill(duplicateUser.password);
      await page.getByTestId('display-name-input').fill(duplicateUser.displayName);
      await page.getByTestId('register-button').click();

      // Assert error message for duplicate email
      await E2EAssertions.assertErrorMessage(page, 'Email already exists');
    });

    test('should enforce password requirements', async ({ page }) => {
      await page.goto('/register');
      
      const testUser = E2ETestDataFactory.createTestUser({
        password: 'weak' // Weak password
      });

      await page.getByTestId('username-input').fill(testUser.username);
      await page.getByTestId('email-input').fill(testUser.email);
      await page.getByTestId('password-input').fill(testUser.password);
      await page.getByTestId('display-name-input').fill(testUser.displayName);
      await page.getByTestId('register-button').click();

      // Assert password validation error
      await E2EAssertions.assertElementVisible(page, '[data-testid="password-error"]', 'Password must be at least 8 characters');
    });
  });

  test.describe('User Login', () => {
    test('should successfully login with valid username and password', async ({ page }) => {
      // Setup: Create a verified user
      const testUser = E2ETestDataFactory.createTestUser({ isVerified: true });
      await E2EAuthHelper.registerUser(page, testUser);
      await E2EAuthHelper.logoutUser(page);

      // Act: Login with username
      const authData = await E2EAuthHelper.loginUser(page, {
        identifier: testUser.username,
        password: testUser.password
      });

      // Assert
      await E2EAssertions.assertUserAuthenticated(page, testUser);
      await E2EAssertions.assertUrlMatches(page, '/');
      expect(authData.state.isAuthenticated).toBe(true);
      expect(authData.state.user.username).toBe(testUser.username);
    });

    test('should successfully login with valid email and password', async ({ page }) => {
      // Setup: Create a verified user
      const testUser = E2ETestDataFactory.createTestUser({ isVerified: true });
      await E2EAuthHelper.registerUser(page, testUser);
      await E2EAuthHelper.logoutUser(page);

      // Act: Login with email
      const authData = await E2EAuthHelper.loginUser(page, {
        identifier: testUser.email,
        password: testUser.password
      });

      // Assert
      await E2EAssertions.assertUserAuthenticated(page, testUser);
      expect(authData.state.user.email).toBe(testUser.email);
    });

    test('should reject invalid credentials', async ({ page }) => {
      await page.goto('/login');

      // Try login with invalid credentials
      await page.getByTestId('identifier-input').fill('nonexistent@example.com');
      await page.getByTestId('password-input').fill('wrongpassword');
      await page.getByTestId('login-button').click();

      // Assert error message is shown
      await E2EAssertions.assertErrorMessage(page, 'Invalid credentials');
      await E2EAssertions.assertUrlMatches(page, '/login');
    });

    test('should reject unverified user login', async ({ page }) => {
      // Create unverified user
      const testUser = E2ETestDataFactory.createTestUser({ isVerified: false });
      await E2EAuthHelper.registerUser(page, testUser);
      await E2EAuthHelper.logoutUser(page);

      // Try to login
      await page.goto('/login');
      await page.getByTestId('identifier-input').fill(testUser.email);
      await page.getByTestId('password-input').fill(testUser.password);
      await page.getByTestId('login-button').click();

      // Assert verification required message
      await E2EAssertions.assertErrorMessage(page, 'Please verify your email');
    });

    test('should validate required login fields', async ({ page }) => {
      await page.goto('/login');

      // Try to submit empty form
      await page.getByTestId('login-button').click();

      // Assert validation errors
      await E2EAssertions.assertElementVisible(page, '[data-testid="identifier-error"]', 'Username or email is required');
      await E2EAssertions.assertElementVisible(page, '[data-testid="password-error"]', 'Password is required');
    });
  });

  test.describe('Password Management', () => {
    test('should successfully change password', async ({ page }) => {
      // Setup authenticated user
      const { user } = await E2EAuthHelper.setupAuthenticatedUser(page);

      // Navigate to profile settings
      await page.goto('/profile/settings');
      await page.waitForLoadState('networkidle');

      // Change password
      const newPassword = 'NewSecurePassword123!';
      await page.getByTestId('current-password-input').fill(user.password);
      await page.getByTestId('new-password-input').fill(newPassword);
      await page.getByTestId('confirm-password-input').fill(newPassword);
      await page.getByTestId('change-password-button').click();

      // Assert success message
      await E2EAssertions.assertSuccessMessage(page, 'Password updated successfully');

      // Test login with new password
      await E2EAuthHelper.logoutUser(page);
      await E2EAuthHelper.loginUser(page, {
        identifier: user.username,
        password: newPassword
      });

      await E2EAssertions.assertUserAuthenticated(page, user);
    });

    test('should initiate password reset flow', async ({ page }) => {
      // Create user first
      const testUser = E2ETestDataFactory.createTestUser();
      await E2EAuthHelper.registerUser(page, testUser);
      await E2EAuthHelper.logoutUser(page);

      // Go to password reset
      await page.goto('/forgot-password');
      await page.getByTestId('email-input').fill(testUser.email);
      await page.getByTestId('reset-password-button').click();

      // Assert success message
      await E2EAssertions.assertSuccessMessage(page, 'Password reset email sent');
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Setup authenticated user
      const { user } = await E2EAuthHelper.setupAuthenticatedUser(page);

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Assert user is still authenticated
      await E2EAssertions.assertUserAuthenticated(page, user);
    });

    test('should successfully logout user', async ({ page }) => {
      // Setup authenticated user
      await E2EAuthHelper.setupAuthenticatedUser(page);

      // Logout
      await E2EAuthHelper.logoutUser(page);

      // Assert user is logged out
      await E2EAssertions.assertUrlMatches(page, '/login');
      
      const authData = await E2EAuthHelper.getAuthData(page);
      expect(authData?.state?.isAuthenticated).toBeFalsy();
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected route without authentication
      await page.goto('/editor');

      // Should redirect to login
      await E2EAssertions.assertUrlMatches(page, '/login');
    });

    test('should handle token expiration gracefully', async ({ page }) => {
      // Setup authenticated user
      await E2EAuthHelper.setupAuthenticatedUser(page);

      // Simulate token expiration by clearing tokens
      await page.evaluate(() => {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          parsed.state.accessToken = 'expired-token';
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      });

      // Try to access protected route
      await page.goto('/editor');

      // Should redirect to login due to expired token
      await E2EAssertions.assertUrlMatches(page, '/login');
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('should handle network errors during registration', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/auth/register', route => route.abort());

      const testUser = E2ETestDataFactory.createTestUser();
      
      await page.goto('/register');
      await page.getByTestId('username-input').fill(testUser.username);
      await page.getByTestId('email-input').fill(testUser.email);
      await page.getByTestId('password-input').fill(testUser.password);
      await page.getByTestId('display-name-input').fill(testUser.displayName);
      await page.getByTestId('register-button').click();

      // Assert network error message
      await E2EAssertions.assertErrorMessage(page, 'Network error. Please try again.');
    });

    test('should handle network errors during login', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/auth/login', route => route.abort());

      await page.goto('/login');
      await page.getByTestId('identifier-input').fill('test@example.com');
      await page.getByTestId('password-input').fill('password123');
      await page.getByTestId('login-button').click();

      // Assert network error message
      await E2EAssertions.assertErrorMessage(page, 'Network error. Please try again.');
    });

    test('should prevent CSRF attacks', async ({ page }) => {
      // This test would verify CSRF protection is in place
      // Implementation depends on CSRF token strategy
      await page.goto('/register');
      
      // Remove CSRF token if present
      await page.evaluate(() => {
        const csrfInput = document.querySelector('input[name="_token"]');
        if (csrfInput) csrfInput.remove();
      });

      const testUser = E2ETestDataFactory.createTestUser();
      await page.getByTestId('username-input').fill(testUser.username);
      await page.getByTestId('email-input').fill(testUser.email);
      await page.getByTestId('password-input').fill(testUser.password);
      await page.getByTestId('display-name-input').fill(testUser.displayName);
      await page.getByTestId('register-button').click();

      // Should reject request without valid CSRF token
      await E2EAssertions.assertErrorMessage(page, 'Invalid request');
    });

    test('should sanitize user inputs', async ({ page }) => {
      // Test XSS prevention
      const maliciousUser = E2ETestDataFactory.createTestUser({
        displayName: '<script>alert("xss")</script>',
        username: 'test<script>alert("xss")</script>user'
      });

      const { user } = await E2EAuthHelper.registerUser(page, maliciousUser);

      // Assert scripts are sanitized
      await page.goto('/profile');
      const displayName = await page.getByTestId('user-display-name').textContent();
      expect(displayName).not.toContain('<script>');
      expect(displayName).toContain('alert("xss")'); // Script tags removed but content escaped
    });
  });

  test.describe('Accessibility & UX', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/login');

      // Navigate using keyboard
      await page.keyboard.press('Tab'); // Username field
      await page.keyboard.type('testuser');
      await page.keyboard.press('Tab'); // Password field  
      await page.keyboard.type('password123');
      await page.keyboard.press('Tab'); // Login button
      await page.keyboard.press('Enter'); // Submit

      // Should attempt login
      await page.waitForSelector('[data-testid="error-message"]', { timeout: 5000 });
    });

    test('should show loading states during authentication', async ({ page }) => {
      await page.goto('/login');

      const testUser = E2ETestDataFactory.createTestUser();
      await page.getByTestId('identifier-input').fill(testUser.username);
      await page.getByTestId('password-input').fill(testUser.password);

      // Click login and immediately check for loading state
      await page.getByTestId('login-button').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="login-loading"]');
    });

    test('should have proper form labels and ARIA attributes', async ({ page }) => {
      await page.goto('/register');

      // Check that form inputs have proper labels
      const usernameInput = page.getByTestId('username-input');
      const emailInput = page.getByTestId('email-input');
      const passwordInput = page.getByTestId('password-input');

      await expect(usernameInput).toHaveAttribute('aria-label');
      await expect(emailInput).toHaveAttribute('aria-label');
      await expect(passwordInput).toHaveAttribute('aria-label');
    });
  });
});
