import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Configure parallel workers - use more workers for better performance */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],

  /* Configure projects for major browsers and API tests */
  projects: [
    {
      name: 'api',
      testDir: './api',
      use: {
        /* Base URL for API tests */
        baseURL: 'http://localhost:3000',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
      },
      workers: 1, // API tests should run sequentially to avoid conflicts
    },
    {
      name: 'chromium',
      testDir: './e2e',
      use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:5173',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        /* Browser configuration */
        browserName: 'chromium',
        /* Viewport for consistent testing */
        viewport: { width: 1280, height: 720 },
        /* Ignore HTTPS errors in development */
        ignoreHTTPSErrors: true,
      },
    },

    // {
    //   name: 'firefox',
    //   testDir: './e2e',
    //   use: {
    //     baseURL: 'http://localhost:5173',
    //     trace: 'on-first-retry',
    //     ...devices['Desktop Firefox']
    //   },
    // },

    // {
    //   name: 'webkit',
    //   testDir: './e2e',
    //   use: {
    //     baseURL: 'http://localhost:5173',
    //     trace: 'on-first-retry',
    //     ...devices['Desktop Safari']
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   testDir: './e2e',
    //   use: {
    //     baseURL: 'http://localhost:5173',
    //     trace: 'on-first-retry',
    //     ...devices['Pixel 5']
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   testDir: './e2e',
    //   use: {
    //     baseURL: 'http://localhost:5173',
    //     trace: 'on-first-retry',
    //     ...devices['iPhone 12']
    //   },
    // },
  ],

  /* Global test configuration */
  use: {
    /* Maximum time each action can take */
    actionTimeout: 10000,
    /* Maximum time for navigation */
    navigationTimeout: 30000,
  },

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'cd ../backend && npm run start:dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000, // 2 minutes timeout for server startup
    },
    {
      command: 'cd ../frontend && npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 120000, // 2 minutes timeout for server startup
    },
  ],
});
