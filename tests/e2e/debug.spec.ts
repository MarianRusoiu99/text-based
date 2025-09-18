import { test, expect } from '@playwright/test';

test.describe('Frontend Debug', () => {
  test('should load homepage and display content', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });

    // Get the page content
    const content = await page.textContent('body');
    console.log('Page content:', content);

    // Check if there's any visible content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text:', bodyText);

    // Check for common elements
    const hasTitle = await page.locator('h1, h2, h3').count() > 0;
    const hasButtons = await page.locator('button').count() > 0;
    const hasLinks = await page.locator('a').count() > 0;

    console.log('Has title elements:', hasTitle);
    console.log('Has buttons:', hasButtons);
    console.log('Has links:', hasLinks);

    // Check for error messages
    const errorText = await page.locator('text=/error|Error|ERROR/').textContent();
    if (errorText) {
      console.log('Error found:', errorText);
    }

    // Check the page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check if the page has any content at all
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(0);
  });

  test('should check console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    } else {
      console.log('No console errors found');
    }
  });

  test('should check network requests', async ({ page }) => {
    const requests: string[] = [];
    const failures: string[] = [];

    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
    });

    page.on('requestfailed', request => {
      failures.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Network requests:');
    requests.forEach(req => console.log('  ', req));

    if (failures.length > 0) {
      console.log('Failed requests:');
      failures.forEach(fail => console.log('  ', fail));
    }
  });
});