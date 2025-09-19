/**
 * Comprehensive E2E test utilities following Playwright testing strategy
 * Implements test data management, user workflows, and assertion helpers
 */

import { Page, Browser, BrowserContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

export interface TestUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  isVerified?: boolean;
}

export interface TestStory {
  id?: string;
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  tags?: string[];
  rpgTemplateId?: string;
}

export interface TestRpgTemplate {
  id?: string;
  name: string;
  description: string;
  mechanics: {
    stats: Array<{ name: string; type: string; defaultValue: any }>;
    skills?: Array<{ name: string; type: string; defaultValue: any }>;
    checkTypes?: string[];
  };
}

/**
 * E2E Test Data Factory for generating realistic test data
 */
export class E2ETestDataFactory {
  /**
   * Generate a unique test user for E2E testing
   */
  static createTestUser(overrides: Partial<TestUser> = {}): TestUser {
    const timestamp = Date.now();
    return {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      password: 'TestPassword123!',
      displayName: `Test User ${timestamp}`,
      isVerified: false,
      ...overrides,
    };
  }

  /**
   * Generate a test story with realistic content
   */
  static createTestStory(overrides: Partial<TestStory> = {}): TestStory {
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      visibility: 'public',
      tags: [faker.lorem.word(), faker.lorem.word()],
      ...overrides,
    };
  }

  /**
   * Generate an RPG template for testing flexible mechanics
   */
  static createTestRpgTemplate(overrides: Partial<TestRpgTemplate> = {}): TestRpgTemplate {
    return {
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      mechanics: {
        stats: [
          { name: 'strength', type: 'integer', defaultValue: 10 },
          { name: 'intelligence', type: 'integer', defaultValue: 10 },
          { name: 'charisma', type: 'integer', defaultValue: 10 },
        ],
        skills: [
          { name: 'swordplay', type: 'integer', defaultValue: 0 },
          { name: 'magic', type: 'integer', defaultValue: 0 },
        ],
        checkTypes: ['skill', 'stat', 'luck'],
      },
      ...overrides,
    };
  }

  /**
   * Generate test variable data
   */
  static createTestVariable(overrides: any = {}) {
    return {
      variableName: faker.lorem.word(),
      variableType: faker.helpers.arrayElement(['string', 'integer', 'boolean']),
      defaultValue: faker.lorem.word(),
      description: faker.lorem.sentence(),
      ...overrides,
    };
  }

  /**
   * Generate test item data
   */
  static createTestItem(overrides: any = {}) {
    return {
      itemName: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      ...overrides,
    };
  }
}

/**
 * E2E Authentication Helper for managing user sessions
 */
export class E2EAuthHelper {
  /**
   * Register a new user and return authentication data
   */
  static async registerUser(page: Page, user: TestUser): Promise<{ user: TestUser; authData: any }> {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.getByTestId('username-input').fill(user.username);
    await page.getByTestId('email-input').fill(user.email);
    await page.getByTestId('password-input').fill(user.password);
    await page.getByTestId('display-name-input').fill(user.displayName);
    
    // Submit registration
    await page.getByTestId('register-button').click();
    
    // Wait for registration success
    await page.waitForSelector('[data-testid="registration-success"]', { timeout: 10000 });
    
    // For testing purposes, auto-verify the user
    await this.verifyUserEmail(page, user);
    
    return { user, authData: await this.getAuthData(page) };
  }

  /**
   * Login user and return authentication data
   */
  static async loginUser(page: Page, credentials: { identifier: string; password: string }): Promise<any> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form
    await page.getByTestId('identifier-input').fill(credentials.identifier);
    await page.getByTestId('password-input').fill(credentials.password);
    
    // Submit login
    await page.getByTestId('login-button').click();
    
    // Wait for login success and redirect
    await page.waitForURL('/', { timeout: 10000 });
    
    return await this.getAuthData(page);
  }

  /**
   * Verify user email (for testing purposes)
   */
  static async verifyUserEmail(page: Page, user: TestUser): Promise<void> {
    // In a real scenario, this would involve checking email and clicking verification link
    // For testing, we'll make a direct API call or use a test endpoint
    await page.evaluate(async (userEmail) => {
      const response = await fetch('/api/auth/verify-email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      return response.json();
    }, user.email);
  }

  /**
   * Get current authentication data from page context
   */
  static async getAuthData(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const authData = localStorage.getItem('auth-storage');
      return authData ? JSON.parse(authData) : null;
    });
  }

  /**
   * Logout current user
   */
  static async logoutUser(page: Page): Promise<void> {
    await page.getByTestId('user-menu').click();
    await page.getByTestId('logout-button').click();
    await page.waitForURL('/login', { timeout: 5000 });
  }

  /**
   * Setup authenticated user for testing
   */
  static async setupAuthenticatedUser(page: Page, userOverrides: Partial<TestUser> = {}): Promise<{ user: TestUser; authData: any }> {
    const user = E2ETestDataFactory.createTestUser(userOverrides);
    return await this.registerUser(page, user);
  }
}

/**
 * E2E Story Management Helper
 */
export class E2EStoryHelper {
  /**
   * Create a new story through the UI
   */
  static async createStory(page: Page, story: TestStory): Promise<string> {
    await page.goto('/stories/new');
    await page.waitForLoadState('networkidle');

    // Fill story creation form
    await page.getByTestId('story-title-input').fill(story.title);
    await page.getByTestId('story-description-input').fill(story.description);
    await page.getByTestId('visibility-select').selectOption(story.visibility);
    
    // Add tags if provided
    if (story.tags) {
      for (const tag of story.tags) {
        await page.getByTestId('tag-input').fill(tag);
        await page.getByTestId('add-tag-button').click();
      }
    }

    // Submit story creation
    await page.getByTestId('create-story-button').click();
    
    // Wait for redirect to editor
    await page.waitForURL(/\/editor\/[a-zA-Z0-9-]+/, { timeout: 10000 });
    
    // Extract story ID from URL
    const url = page.url();
    const storyId = url.split('/editor/')[1];
    
    return storyId;
  }

  /**
   * Navigate to story editor
   */
  static async goToStoryEditor(page: Page, storyId: string): Promise<void> {
    await page.goto(`/editor/${storyId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow React Flow to initialize
  }

  /**
   * Add variables to a story
   */
  static async addVariables(page: Page, variables: any[]): Promise<void> {
    // Open variables panel
    await page.getByTestId('variables-toggle-btn').click();
    
    for (const variable of variables) {
      // Click add variable button
      await page.getByTestId('add-variable-btn').click();
      
      // Fill variable form
      await page.getByTestId('variable-name-input').fill(variable.variableName);
      await page.getByTestId('variable-type-select').selectOption(variable.variableType);
      
      if (variable.defaultValue) {
        await page.getByTestId('variable-default-value-input').fill(variable.defaultValue);
      }
      
      // Create variable
      await page.getByTestId('create-variable-btn').click();
      
      // Wait for variable to appear in list
      await page.waitForSelector(`text=${variable.variableName}`, { timeout: 5000 });
    }
  }

  /**
   * Add items to a story
   */
  static async addItems(page: Page, items: any[]): Promise<void> {
    // Open items panel
    await page.getByTestId('items-toggle-btn').click();
    
    for (const item of items) {
      // Click add item button
      await page.getByTestId('add-item-btn').click();
      
      // Fill item form
      await page.getByTestId('item-name-input').fill(item.itemName);
      
      if (item.description) {
        await page.getByTestId('item-description-input').fill(item.description);
      }
      
      // Create item
      await page.getByTestId('create-item-btn').click();
      
      // Wait for item to appear in list
      await page.waitForSelector(`text=${item.itemName}`, { timeout: 5000 });
    }
  }

  /**
   * Publish a story
   */
  static async publishStory(page: Page): Promise<void> {
    await page.getByTestId('publish-story-btn').click();
    await page.waitForSelector('[data-testid="story-published-success"]', { timeout: 5000 });
  }
}

/**
 * E2E Assertion Helpers for comprehensive validation
 */
export class E2EAssertions {
  /**
   * Assert that user is successfully authenticated
   */
  static async assertUserAuthenticated(page: Page, expectedUser: Partial<TestUser>): Promise<void> {
    const authData = await E2EAuthHelper.getAuthData(page);
    
    if (!authData || !authData.state.isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    
    if (expectedUser.username && authData.state.user.username !== expectedUser.username) {
      throw new Error(`Expected username ${expectedUser.username}, got ${authData.state.user.username}`);
    }
    
    if (expectedUser.email && authData.state.user.email !== expectedUser.email) {
      throw new Error(`Expected email ${expectedUser.email}, got ${authData.state.user.email}`);
    }
  }

  /**
   * Assert that page displays error message
   */
  static async assertErrorMessage(page: Page, expectedMessage: string): Promise<void> {
    await page.waitForSelector('[data-testid="error-message"]', { timeout: 5000 });
    const errorText = await page.getByTestId('error-message').textContent();
    
    if (!errorText || !errorText.includes(expectedMessage)) {
      throw new Error(`Expected error message to contain "${expectedMessage}", got "${errorText}"`);
    }
  }

  /**
   * Assert that page displays success message
   */
  static async assertSuccessMessage(page: Page, expectedMessage: string): Promise<void> {
    await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
    const successText = await page.getByTestId('success-message').textContent();
    
    if (!successText || !successText.includes(expectedMessage)) {
      throw new Error(`Expected success message to contain "${expectedMessage}", got "${successText}"`);
    }
  }

  /**
   * Assert that story is properly displayed
   */
  static async assertStoryDisplayed(page: Page, story: TestStory): Promise<void> {
    await page.waitForSelector(`text=${story.title}`, { timeout: 5000 });
    await page.waitForSelector(`text=${story.description}`, { timeout: 5000 });
  }

  /**
   * Assert that variable is displayed in variables list
   */
  static async assertVariableDisplayed(page: Page, variable: any): Promise<void> {
    await page.waitForSelector(`text=${variable.variableName}`, { timeout: 5000 });
    
    if (variable.variableType) {
      await page.waitForSelector(`text=${variable.variableType}`, { timeout: 5000 });
    }
    
    if (variable.defaultValue) {
      await page.waitForSelector(`text=${variable.defaultValue}`, { timeout: 5000 });
    }
  }

  /**
   * Assert that item is displayed in items list
   */
  static async assertItemDisplayed(page: Page, item: any): Promise<void> {
    await page.waitForSelector(`text=${item.itemName}`, { timeout: 5000 });
    
    if (item.description) {
      await page.waitForSelector(`text=${item.description}`, { timeout: 5000 });
    }
  }

  /**
   * Assert that current URL matches expected pattern
   */
  static async assertUrlMatches(page: Page, pattern: string | RegExp): Promise<void> {
    const currentUrl = page.url();
    const matches = typeof pattern === 'string' ? currentUrl.includes(pattern) : pattern.test(currentUrl);
    
    if (!matches) {
      throw new Error(`Expected URL to match ${pattern}, got ${currentUrl}`);
    }
  }

  /**
   * Assert that element is visible and contains expected text
   */
  static async assertElementVisible(page: Page, selector: string, expectedText?: string): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
    
    if (expectedText) {
      const element = page.locator(selector);
      const text = await element.textContent();
      
      if (!text || !text.includes(expectedText)) {
        throw new Error(`Expected element ${selector} to contain "${expectedText}", got "${text}"`);
      }
    }
  }
}

/**
 * E2E Page Object Models for complex interactions
 */
export class HomePage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async getFeaturedStories(): Promise<string[]> {
    const stories = await this.page.getByTestId('featured-story').all();
    const titles = [];
    
    for (const story of stories) {
      const title = await story.getByTestId('story-title').textContent();
      if (title) titles.push(title);
    }
    
    return titles;
  }

  async searchStories(query: string): Promise<void> {
    await this.page.getByTestId('story-search-input').fill(query);
    await this.page.getByTestId('search-button').click();
    await this.page.waitForLoadState('networkidle');
  }
}

export class StoryEditorPage {
  constructor(private page: Page) {}

  async goto(storyId: string): Promise<void> {
    await this.page.goto(`/editor/${storyId}`);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async addNode(title: string, content: string): Promise<void> {
    await this.page.getByTestId('add-node-btn').click();
    await this.page.getByTestId('node-title-input').fill(title);
    await this.page.getByTestId('node-content-input').fill(content);
    await this.page.getByTestId('save-node-btn').click();
  }

  async connectNodes(fromNodeTitle: string, toNodeTitle: string, choiceText: string): Promise<void> {
    // Implementation for connecting nodes with choices
    const fromNode = this.page.locator('.react-flow__node').filter({ hasText: fromNodeTitle });
    const toNode = this.page.locator('.react-flow__node').filter({ hasText: toNodeTitle });
    
    await fromNode.click();
    await this.page.getByTestId('add-choice-btn').click();
    await this.page.getByTestId('choice-text-input').fill(choiceText);
    await this.page.getByTestId('choice-target-select').selectOption(toNodeTitle);
    await this.page.getByTestId('save-choice-btn').click();
  }

  async openVariablesPanel(): Promise<void> {
    await this.page.getByTestId('variables-toggle-btn').click();
  }

  async openItemsPanel(): Promise<void> {
    await this.page.getByTestId('items-toggle-btn').click();
  }
}

/**
 * Test utility functions for common E2E operations
 */
export class E2ETestUtils {
  /**
   * Wait for API request to complete
   */
  static async waitForApiRequest(page: Page, urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
    await page.waitForResponse(response => {
      const url = response.url();
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
    }, { timeout });
  }

  /**
   * Clear all test data (for cleanup)
   */
  static async clearTestData(page: Page): Promise<void> {
    try {
      // Navigate to the app first to ensure localStorage is accessible
      await page.goto('http://localhost:5173');
      
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Clear cookies
      const context = page.context();
      await context.clearCookies();
    } catch (error) {
      console.warn('Failed to clear test data:', error);
    }
  }

  /**
   * Setup test database state
   */
  static async setupTestData(page: Page, data: any): Promise<void> {
    await page.evaluate((testData) => {
      // This would typically call a test API endpoint to setup database state
      localStorage.setItem('test-data', JSON.stringify(testData));
    }, data);
  }

  /**
   * Take screenshot for debugging
   */
  static async takeDebugScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `test-results/debug-${name}-${Date.now()}.png`, fullPage: true });
  }

  /**
   * Log network requests for debugging
   */
  static async logNetworkRequests(page: Page, duration: number = 5000): Promise<string[]> {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    
    await page.waitForTimeout(duration);
    
    return requests;
  }

  /**
   * Verify no console errors
   */
  static async assertNoConsoleErrors(page: Page): Promise<void> {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a moment for any async errors
    await page.waitForTimeout(1000);
    
    if (errors.length > 0) {
      throw new Error(`Console errors found: ${errors.join(', ')}`);
    }
  }
}