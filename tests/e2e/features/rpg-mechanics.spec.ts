import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EStoryHelper,
  E2EAssertions, 
  E2ETestUtils
} from '../../utils/e2e-test-utilities';

/**
 * RPG Mechanics E2E Tests
 * Testing flexible RPG system that supports completely customizable mechanics
 */
test.describe('RPG Mechanics and Templates', () => {
  let authenticatedUser: any;

  test.beforeEach(async ({ page }) => {
    // Setup authenticated user for all RPG tests
    const { user, authData } = await E2EAuthHelper.setupAuthenticatedUser(page);
    authenticatedUser = { user, authData };
    
    // Check if auth data is in localStorage
    const storedAuthData = await page.evaluate(() => localStorage.getItem('auth-storage'));
    expect(storedAuthData).toBeTruthy();
    console.log('Auth data:', storedAuthData);
  });

  test('should create story with RPG mechanics', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(1000);

    // Fill story creation form
    await page.fill('input[id="title"]', 'RPG Mechanics E2E Test Story');
    await page.fill('textarea[id="description"]', 'Testing RPG mechanics in the editor');

    // Submit form
    await page.click('button:has-text("Create Story")');

    // Wait for navigation or error
    await page.waitForTimeout(2000);

    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after form submission:', currentUrl);

    // If still on editor page, check for error messages
    if (currentUrl.includes('/editor') && !currentUrl.includes('/editor/')) {
      const errorText = await page.locator('.text-red-600').textContent();
      if (errorText) {
        console.log('Error message:', errorText);
        throw new Error(`Story creation failed: ${errorText}`);
      }
    }

    // Should redirect to editor with story loaded
    await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Verify RPG panels are visible
    await expect(page.getByTestId('variables-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('items-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('conditions-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('effects-toggle-btn')).toBeVisible();
  });

  test('should create and manage variables in the editor', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Variable Management Test');
    await page.fill('textarea[id="description"]', 'Testing variable creation and management');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Open Variables panel
    await page.getByTestId('variables-toggle-btn').click();

    // Click Add Variable to show the form
    await page.getByTestId('add-variable-btn').click();

    // Add a new variable
    await page.getByTestId('variable-name-input').fill('player_level');
    await page.getByTestId('variable-type-select').selectOption('integer');
    await page.getByTestId('variable-default-value-input').fill('1');
    await page.getByTestId('create-variable-btn').click();

    // Wait for the variable to be created and appear in the list
    await page.waitForTimeout(2000);
    
        // Verify the variable was created and appears in the list
    await expect(page.getByText('player_level')).toBeVisible();
    await expect(page.getByText('integer = 1')).toBeVisible();
  });

  test('should create and manage items in the editor', async ({ page }) => {
    // Create story first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Item Management Test');
    await page.fill('textarea[id="description"]', 'Testing item creation and management');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Open Items panel
    await page.getByTestId('items-toggle-btn').click();

    // Click Add Item to show the form
    await page.getByTestId('add-item-btn').click();

    // Add a new item
    await page.getByTestId('item-name-input').fill('magic_sword');
    await page.getByTestId('item-description-input').fill('A powerful enchanted sword');
    await page.getByTestId('create-item-btn').click();

    // Wait for the item to be created and appear in the list
    await page.waitForTimeout(2000);
    
    // Verify item appears in the list
    await expect(page.getByText('magic_sword')).toBeVisible();
    await expect(page.getByText('A powerful enchanted sword')).toBeVisible();
  });

  test.skip('should build complex conditions', async ({ page }) => {
    // Create story with variables and items first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Conditions Builder Test');
    await page.fill('textarea[id="description"]', 'Testing conditions builder');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Add a variable first
    await page.getByTestId('variables-toggle-btn').click();
    
    // Click Add Variable to show the form
    await page.getByTestId('add-variable-btn').click();
    
    await page.getByTestId('variable-name-input').fill('player_strength');
    await page.getByTestId('variable-type-select').selectOption('integer');
    await page.getByTestId('variable-default-value-input').fill('10');
    await page.getByTestId('create-variable-btn').click();

    // Wait for the variable to be created
    await page.waitForTimeout(2000);

    // Add an item
    await page.getByTestId('items-toggle-btn').click();
    
    // Click Add Item to show the form
    await page.getByTestId('add-item-btn').click();
    
    await page.getByTestId('item-name-input').fill('strength_potion');
    await page.getByTestId('item-description-input').fill('Increases strength temporarily');
    await page.getByTestId('create-item-btn').click();

    // Wait for the item to be created
    await page.waitForTimeout(2000);

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

  test.skip('should build effects', async ({ page }) => {
    // Create story with variables and items first
    await page.goto('/editor');
    await page.fill('input[id="title"]', 'Effects Builder Test');
    await page.fill('textarea[id="description"]', 'Testing effects builder');
    await page.click('button:has-text("Create Story")');
    await page.waitForURL(/\/editor\//);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Add a variable first
    await page.getByTestId('variables-toggle-btn').click();
    await page.getByTestId('add-variable-btn').click();
    await page.getByTestId('variable-name-input').fill('player_mana');
    await page.getByTestId('variable-type-select').selectOption('integer');
    await page.getByTestId('variable-default-value-input').fill('50');
    await page.getByTestId('create-variable-btn').click();
    
    // Wait for variable to be created
    await page.waitForTimeout(2000);

    // Add an item
    await page.getByTestId('items-toggle-btn').click();
    await page.getByTestId('add-item-btn').click();
    await page.getByTestId('item-name-input').fill('mana_crystal');
    await page.getByTestId('item-description-input').fill('Restores mana');
    await page.getByTestId('create-item-btn').click();
    
    // Wait for item to be created
    await page.waitForTimeout(2000);

    // Open Effects Builder
    await page.getByTestId('effects-toggle-btn').click();

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

  test.skip('should create choice node with RPG mechanics', async ({ page }) => {
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
    await page.getByTestId('variables-toggle-btn').click();
    await page.getByTestId('add-variable-btn').click();
    await page.getByTestId('variable-name-input').fill('test_var');
    await page.getByTestId('variable-type-select').selectOption('string');
    await page.getByTestId('variable-default-value-input').fill('test_value');
    await page.getByTestId('create-variable-btn').click();

    // Add item
    await page.getByTestId('items-toggle-btn').click();
    await page.getByTestId('add-item-btn').click();
    await page.getByTestId('item-name-input').fill('test_item');
    await page.getByTestId('item-description-input').fill('A test item');
    await page.getByTestId('create-item-btn').click();

    // Refresh page
    await page.reload();
    await page.waitForTimeout(2000);

    // Verify data persists
    await page.getByTestId('variables-toggle-btn').click();
    await expect(page.getByText('test_var')).toBeVisible();

    await page.getByTestId('items-toggle-btn').click();
    await expect(page.getByText('test_item')).toBeVisible();
  });
});