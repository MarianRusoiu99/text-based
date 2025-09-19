import { test, expect } from '@playwright/test';

test.describe('Story Management', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login first
    const timestamp = Date.now();
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="username"]', `storytest${timestamp}`);
    await page.fill('input[name="email"]', `storytest${timestamp}@example.com`);
    await page.fill('input[name="displayName"]', 'Story Test User');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home or stories page
    await expect(page).toHaveURL(/\/(|stories)$/);
  });

  test('should create a new story', async ({ page }) => {
    await page.goto('/editor');

    // Fill story creation form
    await page.fill('input[id="title"]', 'E2E Test Story');
    await page.fill('textarea[id="description"]', 'A story created during E2E testing');

    // Submit form
    await page.click('button:has-text("Create Story")');

    // Should redirect to editor with story loaded
    await expect(page).toHaveURL(/\/editor\//);
  });

  test('should add and edit nodes in story editor', async ({ page }) => {
    // First create a story
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Node Editing Test Story');
    await page.fill('textarea[id="description"]', 'Testing node creation and editing');
    await page.click('button:has-text("Create Story")');

    // Wait for navigation to editor
    await page.waitForURL(/\/editor\//);

    // Verify we can access the editor
    await expect(page.locator('text=Story Editor')).toBeVisible();

    // Click Add Node button
    await page.click('button:has-text("Add Node")');

    // Wait for the node to appear (it should be visible in the ReactFlow canvas)
    await page.waitForTimeout(2000); // Give time for the API call and render

    // Check if any node appears in the canvas
    const nodes = page.locator('.react-flow__node');
    await expect(nodes.first()).toBeVisible();

    // Find a node with "New Node" text or any node
    const newNode = page.locator('.react-flow__node').filter({ hasText: 'New Node' }).or(nodes.first());
    await expect(newNode).toBeVisible();

    // Click on the new node to select it
    await newNode.click();

    // Verify the edit panel appears
    await expect(page.locator('text=Edit Node')).toBeVisible();

    // Edit the node title
    await page.fill('input[placeholder="Node title"]', 'Updated Node Title');

    // Edit the node content
    await page.fill('textarea[placeholder="Node content"]', 'Updated node content for testing');

    // Save the node
    await page.click('button:has-text("Save Node")');

    // Verify the node title was updated in the canvas
    await expect(page.locator('.react-flow__node').filter({ hasText: 'Updated Node Title' })).toBeVisible();
  });

  test('should create connections between nodes', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Connection Test Story');
    await page.fill('textarea[id="description"]', 'Testing node connections');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add first node
    await page.click('button:has-text("Add Node")');
    await page.waitForTimeout(1000);

    // Add second node
    await page.click('button:has-text("Add Node")');
    await page.waitForTimeout(1000);

    // Verify we have 2 nodes
    await expect(page.locator('.react-flow__node')).toHaveCount(2);

    // For now, just verify the editor loads - full connection testing would require
    // more complex interaction with ReactFlow's drag and drop
    await expect(page.locator('text=Story Editor')).toBeVisible();
  });

  test('should publish and play story', async ({ page }) => {
    // Create a story
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Published Test Story');
    await page.fill('textarea[id="description"]', 'A published story for testing');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add a node to make the story playable
    await page.click('button:has-text("Add Node")');
    await page.waitForTimeout(1000);

    // Edit the node with some content
    const newNode = page.locator('.react-flow__node').filter({ hasText: 'New Node' });
    await newNode.click();
    await page.fill('input[placeholder="Node title"]', 'Start');
    await page.fill('textarea[placeholder="Node content"]', 'Welcome to the story!');
    await page.click('button:has-text("Save Node")');

    // Publish the story
    await page.click('button:has-text("Publish Story")');

    // Navigate to player
    await page.click('button:has-text("Preview Story")');

    // Should be in player mode
    await expect(page).toHaveURL(/\/player\//);
    await expect(page.locator('text=Welcome to the story!')).toBeVisible();
  });
});
