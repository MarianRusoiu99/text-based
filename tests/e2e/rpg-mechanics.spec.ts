import { test, expect } from '@playwright/test';

test.describe('RPG Mechanics E2E', () => {
  let testUsername: string;
  let testPassword: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique credentials for this test
    const timestamp = Date.now();
    testUsername = `rpgtest${timestamp}`;
    testPassword = 'password123';

    // Register first
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="email"]', `${testUsername}@example.com`);
    await page.fill('input[name="displayName"]', 'RPG Test User');
    await page.fill('input[name="password"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home or stories page
    await expect(page).toHaveURL(/\/(|stories)$/);

    // Now login to ensure we have a fresh authenticated session
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home or stories page
    await expect(page).toHaveURL(/\/(|stories)$/);

    // Verify we're logged in by checking for some authenticated content
    // This might be a user menu, profile link, or logout button
    await expect(page.locator('text=Logout').or(page.locator('text=Profile')).or(page.locator('[data-testid="user-menu"]'))).toBeVisible();
  });

  test('should create story with RPG mechanics', async ({ page }) => {
    await page.goto('/editor');

    // Fill story creation form
    await page.fill('input[id="title"]', 'RPG Mechanics E2E Test Story');
    await page.fill('textarea[id="description"]', 'Testing RPG mechanics in the editor');

    // Submit form
    await page.click('button:has-text("Create Story")');

    // Should redirect to editor with story loaded
    await expect(page).toHaveURL(/\/editor\//);

    // Verify RPG panels are visible
    await expect(page.locator('text=Variables')).toBeVisible();
    await expect(page.locator('text=Items')).toBeVisible();
    await expect(page.locator('text=Conditions')).toBeVisible();
    await expect(page.locator('text=Effects')).toBeVisible();
  });

  test('should create and manage variables in the editor', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Variable Management Test');
    await page.fill('textarea[id="description"]', 'Testing variable creation and management');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Open Variables panel
    await page.click('button:has-text("Variables")');

    // Add a new variable
    await page.fill('input[placeholder="Variable name"]', 'player_level');
    await page.selectOption('select', 'integer');
    await page.fill('input[placeholder="Default value"]', '1');
    await page.click('button:has-text("Add Variable")');

    // Verify variable appears in the list
    await expect(page.locator('text=player_level')).toBeVisible();
    await expect(page.locator('text=integer')).toBeVisible();
    await expect(page.locator('text=1')).toBeVisible();
  });

  test('should create and manage items in the editor', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Item Management Test');
    await page.fill('textarea[id="description"]', 'Testing item creation and management');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Open Items panel
    await page.click('button:has-text("Items")');

    // Add a new item
    await page.fill('input[placeholder="Item name"]', 'magic_sword');
    await page.fill('input[placeholder="Description"]', 'A powerful enchanted sword');
    await page.click('button:has-text("Add Item")');

    // Verify item appears in the list
    await expect(page.locator('text=magic_sword')).toBeVisible();
    await expect(page.locator('text=A powerful enchanted sword')).toBeVisible();
  });

  test('should build complex conditions', async ({ page }) => {
    // Create story with variables and items first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Conditions Builder Test');
    await page.fill('textarea[id="description"]', 'Testing conditions builder');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add a variable first
    await page.click('button:has-text("Variables")');
    await page.fill('input[placeholder="Variable name"]', 'player_strength');
    await page.selectOption('select', 'integer');
    await page.fill('input[placeholder="Default value"]', '10');
    await page.click('button:has-text("Add Variable")');

    // Add an item
    await page.click('button:has-text("Items")');
    await page.fill('input[placeholder="Item name"]', 'strength_potion');
    await page.fill('input[placeholder="Description"]', 'Increases strength temporarily');
    await page.click('button:has-text("Add Item")');

    // Open Conditions Builder
    await page.click('button:has-text("Conditions")');

    // Build a complex condition: player_strength > 5 AND has strength_potion
    await page.click('button:has-text("Add AND Condition")');

    // Add variable condition
    await page.click('button:has-text("Add Variable Condition")');
    await page.selectOption('select[name="variable"]', 'player_strength');
    await page.selectOption('select[name="operator"]', '>');
    await page.fill('input[name="value"]', '5');

    // Add item condition
    await page.click('button:has-text("Add Item Condition")');
    await page.selectOption('select[name="item"]', 'strength_potion');

    // Verify conditions are built
    await expect(page.locator('text=player_strength > 5')).toBeVisible();
    await expect(page.locator('text=Has strength_potion')).toBeVisible();
  });

  test('should build effects', async ({ page }) => {
    // Create story with variables and items first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Effects Builder Test');
    await page.fill('textarea[id="description"]', 'Testing effects builder');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add a variable first
    await page.click('button:has-text("Variables")');
    await page.fill('input[placeholder="Variable name"]', 'player_mana');
    await page.selectOption('select', 'integer');
    await page.fill('input[placeholder="Default value"]', '50');
    await page.click('button:has-text("Add Variable")');

    // Add an item
    await page.click('button:has-text("Items")');
    await page.fill('input[placeholder="Item name"]', 'mana_crystal');
    await page.fill('input[placeholder="Description"]', 'Restores mana');
    await page.click('button:has-text("Add Item")');

    // Open Effects Builder
    await page.click('button:has-text("Effects")');

    // Add variable effect
    await page.click('button:has-text("Add Variable Effect")');
    await page.selectOption('select[name="variable"]', 'player_mana');
    await page.selectOption('select[name="operation"]', 'add');
    await page.fill('input[name="value"]', '25');

    // Add item effect
    await page.click('button:has-text("Add Item Effect")');
    await page.selectOption('select[name="effect-type"]', 'remove_item');
    await page.selectOption('select[name="item"]', 'mana_crystal');

    // Verify effects are built
    await expect(page.locator('text=player_mana + 25')).toBeVisible();
    await expect(page.locator('text=Remove mana_crystal')).toBeVisible();
  });

  test('should create choice node with RPG mechanics', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Choice Node RPG Test');
    await page.fill('textarea[id="description"]', 'Testing choice nodes with RPG mechanics');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add nodes to the canvas
    await page.click('button:has-text("Add Node")');
    await page.click('button:has-text("Add Node")');

    // Select first node and add choice
    await page.click('.react-flow__node:first-child');
    await page.click('button:has-text("Add Choice")');

    // Configure choice with conditions and effects
    await page.fill('input[name="choiceText"]', 'Drink the mysterious potion');

    // Add condition
    await page.click('button:has-text("Add Condition")');
    // This would require the conditions builder to be integrated into the choice modal

    // Add effect
    await page.click('button:has-text("Add Effect")');
    // This would require the effects builder to be integrated into the choice modal

    // Save choice
    await page.click('button:has-text("Save Choice")');

    // Verify choice appears on the node
    await expect(page.locator('text=Drink the mysterious potion')).toBeVisible();
  });

  test('should persist RPG mechanics data', async ({ page }) => {
    // Create story with RPG elements
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Persistence Test Story');
    await page.fill('textarea[id="description"]', 'Testing data persistence');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);

    // Add variable
    await page.click('button:has-text("Variables")');
    await page.fill('input[placeholder="Variable name"]', 'test_var');
    await page.selectOption('select', 'string');
    await page.fill('input[placeholder="Default value"]', 'test_value');
    await page.click('button:has-text("Add Variable")');

    // Add item
    await page.click('button:has-text("Items")');
    await page.fill('input[placeholder="Item name"]', 'test_item');
    await page.fill('input[placeholder="Description"]', 'A test item');
    await page.click('button:has-text("Add Item")');

    // Refresh page
    await page.reload();

    // Verify data persists
    await page.click('button:has-text("Variables")');
    await expect(page.locator('text=test_var')).toBeVisible();

    await page.click('button:has-text("Items")');
    await expect(page.locator('text=test_item')).toBeVisible();
  });
});