import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EStoryHelper,
  E2EAssertions, 
  E2ETestUtils
} from '../utils/e2e-test-utilities';

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
  });

  test.afterEach(async ({ page }) => {
    await E2ETestUtils.clearTestData(page);
  });

  test.describe('RPG Template Creation', () => {
    test('should create basic RPG template with stats', async ({ page }) => {
      // Navigate to RPG template creation
      await page.goto('/rpg-templates/new');
      await page.waitForLoadState('networkidle');

      // Create template with basic stats
      const rpgTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Fantasy Adventure System',
        description: 'A classic fantasy RPG with core stats'
      });

      // Fill template form
      await page.getByTestId('template-name-input').fill(rpgTemplate.name);
      await page.getByTestId('template-description-input').fill(rpgTemplate.description);

      // Add stats
      for (const stat of rpgTemplate.mechanics.stats) {
        await page.getByTestId('add-stat-btn').click();
        await page.getByTestId('stat-name-input').fill(stat.name);
        await page.getByTestId('stat-type-select').selectOption(stat.type);
        await page.getByTestId('stat-default-value-input').fill(stat.defaultValue.toString());
        await page.getByTestId('save-stat-btn').click();
      }

      // Add skills
      for (const skill of rpgTemplate.mechanics.skills!) {
        await page.getByTestId('add-skill-btn').click();
        await page.getByTestId('skill-name-input').fill(skill.name);
        await page.getByTestId('skill-type-select').selectOption(skill.type);
        await page.getByTestId('skill-default-value-input').fill(skill.defaultValue.toString());
        await page.getByTestId('save-skill-btn').click();
      }

      // Add check types
      for (const checkType of rpgTemplate.mechanics.checkTypes!) {
        await page.getByTestId('add-check-type-btn').click();
        await page.getByTestId('check-type-name-input').fill(checkType);
        await page.getByTestId('save-check-type-btn').click();
      }

      // Save template
      await page.getByTestId('create-template-btn').click();

      // Assert template created
      await E2EAssertions.assertSuccessMessage(page, 'RPG template created successfully');
      await E2EAssertions.assertUrlMatches(page, /\/rpg-templates\/[a-zA-Z0-9-]+/);
      
      // Verify template details
      await E2EAssertions.assertElementVisible(page, '[data-testid="template-name"]', rpgTemplate.name);
      await E2EAssertions.assertElementVisible(page, '[data-testid="template-description"]', rpgTemplate.description);
      
      // Verify stats are displayed
      for (const stat of rpgTemplate.mechanics.stats) {
        await E2EAssertions.assertElementVisible(page, '[data-testid="stat-item"]', stat.name);
      }
    });

    test('should create complex RPG template with custom mechanics', async ({ page }) => {
      await page.goto('/rpg-templates/new');

      // Create template with complex mechanics
      await page.getByTestId('template-name-input').fill('Advanced Sci-Fi System');
      await page.getByTestId('template-description-input').fill('Complex sci-fi RPG with advanced mechanics');

      // Add custom stat types
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('techLevel');
      await page.getByTestId('stat-type-select').selectOption('decimal');
      await page.getByTestId('stat-default-value-input').fill('1.0');
      await page.getByTestId('stat-min-value-input').fill('0.0');
      await page.getByTestId('stat-max-value-input').fill('10.0');
      await page.getByTestId('save-stat-btn').click();

      // Add boolean stat
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('cyberImplants');
      await page.getByTestId('stat-type-select').selectOption('boolean');
      await page.getByTestId('stat-default-value-checkbox').uncheck();
      await page.getByTestId('save-stat-btn').click();

      // Add array stat for inventory
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('inventory');
      await page.getByTestId('stat-type-select').selectOption('array');
      await page.getByTestId('stat-default-value-input').fill('[]');
      await page.getByTestId('save-stat-btn').click();

      // Add custom check types
      const customChecks = ['tech-roll', 'psych-test', 'combat-sequence'];
      for (const checkType of customChecks) {
        await page.getByTestId('add-check-type-btn').click();
        await page.getByTestId('check-type-name-input').fill(checkType);
        await page.getByTestId('save-check-type-btn').click();
      }

      // Save template
      await page.getByTestId('create-template-btn').click();

      // Assert complex template created with all mechanics
      await E2EAssertions.assertSuccessMessage(page, 'RPG template created successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-item"]', 'techLevel');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-item"]', 'cyberImplants');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-item"]', 'inventory');
      
      for (const checkType of customChecks) {
        await E2EAssertions.assertElementVisible(page, '[data-testid="check-type-item"]', checkType);
      }
    });

    test('should validate RPG template creation', async ({ page }) => {
      await page.goto('/rpg-templates/new');

      // Try to save empty template
      await page.getByTestId('create-template-btn').click();

      // Assert validation errors
      await E2EAssertions.assertElementVisible(page, '[data-testid="name-error"]', 'Template name is required');
    });

    test('should prevent duplicate stat names', async ({ page }) => {
      await page.goto('/rpg-templates/new');
      await page.getByTestId('template-name-input').fill('Test Template');

      // Add first stat
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('strength');
      await page.getByTestId('stat-type-select').selectOption('integer');
      await page.getByTestId('save-stat-btn').click();

      // Try to add duplicate stat
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('strength');
      await page.getByTestId('stat-type-select').selectOption('integer');
      await page.getByTestId('save-stat-btn').click();

      // Assert duplicate error
      await E2EAssertions.assertErrorMessage(page, 'Stat name already exists');
    });
  });

  test.describe('RPG Template Integration with Stories', () => {
    let rpgTemplateId: string;

    test.beforeEach(async ({ page }) => {
      // Create RPG template for story integration tests
      const rpgTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Story Integration Template'
      });

      rpgTemplateId = await page.evaluate(async (template) => {
        const response = await fetch('/api/rpg-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });
        const result = await response.json();
        return result.data.id;
      }, rpgTemplate);
    });

    test('should apply RPG template to story during creation', async ({ page }) => {
      await page.goto('/stories/new');

      // Select RPG template
      await page.getByTestId('rpg-template-select').selectOption(rpgTemplateId);
      
      // Create story
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'RPG Story Test'
      });
      await page.getByTestId('story-title-input').fill(testStory.title);
      await page.getByTestId('story-description-input').fill(testStory.description);
      await page.getByTestId('create-story-button').click();

      // Assert story has RPG template applied
      await E2EAssertions.assertUrlMatches(page, /\/editor\/[a-zA-Z0-9-]+/);
      await E2EAssertions.assertElementVisible(page, '[data-testid="rpg-template-indicator"]', 'Story Integration Template');
      
      // Check that RPG mechanics are available
      await page.getByTestId('rpg-mechanics-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="rpg-stats-panel"]');
    });

    test('should enable RPG checks in story nodes', async ({ page }) => {
      // Create story with RPG template
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'RPG Check Story',
        rpgTemplateId: rpgTemplateId
      });
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      await E2EStoryHelper.goToStoryEditor(page, storyId);

      // Add node with RPG check
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Strength Challenge');
      await page.getByTestId('node-content-input').fill('You encounter a heavy door...');
      
      // Add RPG check to the node
      await page.getByTestId('add-rpg-check-btn').click();
      await page.getByTestId('check-type-select').selectOption('stat');
      await page.getByTestId('check-stat-select').selectOption('strength');
      await page.getByTestId('check-difficulty-input').fill('15');
      await page.getByTestId('success-text-input').fill('You force the door open!');
      await page.getByTestId('failure-text-input').fill('The door won\'t budge.');
      
      await page.getByTestId('save-rpg-check-btn').click();
      await page.getByTestId('save-node-btn').click();

      // Assert RPG check is saved
      await E2EAssertions.assertElementVisible(page, '[data-testid="rpg-check-indicator"]', 'Strength Check');
    });

    test('should handle variable modifications through RPG mechanics', async ({ page }) => {
      // Create story with RPG template
      const testStory = E2ETestDataFactory.createTestStory({
        rpgTemplateId: rpgTemplateId
      });
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      await E2EStoryHelper.goToStoryEditor(page, storyId);

      // Add variables first
      const variables = [
        E2ETestDataFactory.createTestVariable({
          variableName: 'playerGold',
          variableType: 'integer',
          defaultValue: '100'
        })
      ];
      await E2EStoryHelper.addVariables(page, variables);

      // Add node with variable modification
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Treasure Found');
      await page.getByTestId('node-content-input').fill('You found a treasure chest!');
      
      // Add variable modification
      await page.getByTestId('add-variable-modification-btn').click();
      await page.getByTestId('variable-select').selectOption('playerGold');
      await page.getByTestId('modification-type-select').selectOption('add');
      await page.getByTestId('modification-value-input').fill('50');
      
      await page.getByTestId('save-variable-modification-btn').click();
      await page.getByTestId('save-node-btn').click();

      // Assert variable modification is configured
      await E2EAssertions.assertElementVisible(page, '[data-testid="variable-modification-indicator"]', '+50 gold');
    });
  });

  test.describe('RPG Gameplay Mechanics', () => {
    let storyId: string;
    let rpgTemplateId: string;

    test.beforeEach(async ({ page }) => {
      // Setup story with RPG template for gameplay tests
      const rpgTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Gameplay Test Template'
      });

      rpgTemplateId = await page.evaluate(async (template) => {
        const response = await fetch('/api/rpg-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });
        const result = await response.json();
        return result.data.id;
      }, rpgTemplate);

      const testStory = E2ETestDataFactory.createTestStory({
        title: 'RPG Gameplay Test',
        rpgTemplateId: rpgTemplateId
      });
      storyId = await E2EStoryHelper.createStory(page, testStory);
      
      // Publish story for gameplay
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Game Start');
      await page.getByTestId('node-content-input').fill('Your adventure begins...');
      await page.getByTestId('save-node-btn').click();
      await E2EStoryHelper.publishStory(page);
    });

    test('should initialize player stats from RPG template', async ({ page }) => {
      // Start playing the story
      await page.goto(`/play/${storyId}`);
      await page.waitForLoadState('networkidle');

      // Check player stats panel
      await page.getByTestId('player-stats-btn').click();
      
      // Assert default stats from template are initialized
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-strength"]', '10');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-intelligence"]', '10');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-charisma"]', '10');
      
      // Check skills
      await E2EAssertions.assertElementVisible(page, '[data-testid="skill-swordplay"]', '0');
      await E2EAssertions.assertElementVisible(page, '[data-testid="skill-magic"]', '0');
    });

    test('should perform RPG checks during gameplay', async ({ page }) => {
      // Setup story with RPG check node
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Add node with strength check
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Strength Test');
      await page.getByTestId('node-content-input').fill('A heavy boulder blocks your path.');
      
      // Add RPG check
      await page.getByTestId('add-rpg-check-btn').click();
      await page.getByTestId('check-type-select').selectOption('stat');
      await page.getByTestId('check-stat-select').selectOption('strength');
      await page.getByTestId('check-difficulty-input').fill('12');
      await page.getByTestId('success-text-input').fill('You move the boulder!');
      await page.getByTestId('failure-text-input').fill('The boulder is too heavy.');
      
      await page.getByTestId('save-rpg-check-btn').click();
      await page.getByTestId('save-node-btn').click();

      // Connect nodes
      await page.locator('[data-testid="story-node"]').filter({ hasText: 'Game Start' }).click();
      await page.getByTestId('add-choice-btn').click();
      await page.getByTestId('choice-text-input').fill('Approach the boulder');
      await page.getByTestId('choice-target-select').selectOption('Strength Test');
      await page.getByTestId('save-choice-btn').click();

      // Start gameplay
      await page.goto(`/play/${storyId}`);
      await page.getByTestId('choice-button').click();

      // Assert RPG check interface appears
      await E2EAssertions.assertElementVisible(page, '[data-testid="rpg-check-panel"]', 'Strength Check');
      await E2EAssertions.assertElementVisible(page, '[data-testid="check-difficulty"]', 'Difficulty: 12');
      
      // Perform check
      await page.getByTestId('perform-check-btn').click();
      
      // Assert result is shown (either success or failure)
      const resultVisible = await Promise.race([
        page.waitForSelector('[data-testid="check-success"]', { timeout: 3000 }).then(() => 'success'),
        page.waitForSelector('[data-testid="check-failure"]', { timeout: 3000 }).then(() => 'failure')
      ]);
      
      expect(['success', 'failure']).toContain(resultVisible);
    });

    test('should modify player stats during gameplay', async ({ page }) => {
      // Setup story with stat modification
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Training Ground');
      await page.getByTestId('node-content-input').fill('You train with the sword master.');
      
      // Add stat modification
      await page.getByTestId('add-stat-modification-btn').click();
      await page.getByTestId('stat-select').selectOption('strength');
      await page.getByTestId('modification-type-select').selectOption('add');
      await page.getByTestId('modification-value-input').fill('2');
      
      await page.getByTestId('save-stat-modification-btn').click();
      await page.getByTestId('save-node-btn').click();

      // Connect to start node
      await page.locator('[data-testid="story-node"]').filter({ hasText: 'Game Start' }).click();
      await page.getByTestId('add-choice-btn').click();
      await page.getByTestId('choice-text-input').fill('Visit training ground');
      await page.getByTestId('choice-target-select').selectOption('Training Ground');
      await page.getByTestId('save-choice-btn').click();

      // Play and check stat modification
      await page.goto(`/play/${storyId}`);
      
      // Check initial strength
      await page.getByTestId('player-stats-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-strength"]', '10');
      await page.getByTestId('close-stats-btn').click();
      
      // Make choice that modifies strength
      await page.getByTestId('choice-button').click();
      
      // Check updated strength
      await page.getByTestId('player-stats-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-strength"]', '12');
    });

    test('should handle inventory management', async ({ page }) => {
      // Setup story with item mechanics
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Add items to story
      const items = [
        E2ETestDataFactory.createTestItem({
          itemName: 'Healing Potion',
          description: 'Restores health'
        })
      ];
      await E2EStoryHelper.addItems(page, items);

      // Add node that gives item
      await page.getByTestId('add-node-btn').click();
      await page.getByTestId('node-title-input').fill('Potion Shop');
      await page.getByTestId('node-content-input').fill('The shopkeeper offers you a potion.');
      
      // Add item acquisition
      await page.getByTestId('add-item-action-btn').click();
      await page.getByTestId('item-action-select').selectOption('give');
      await page.getByTestId('item-select').selectOption('Healing Potion');
      await page.getByTestId('item-quantity-input').fill('1');
      
      await page.getByTestId('save-item-action-btn').click();
      await page.getByTestId('save-node-btn').click();

      // Connect to start
      await page.locator('[data-testid="story-node"]').filter({ hasText: 'Game Start' }).click();
      await page.getByTestId('add-choice-btn').click();
      await page.getByTestId('choice-text-input').fill('Visit potion shop');
      await page.getByTestId('choice-target-select').selectOption('Potion Shop');
      await page.getByTestId('save-choice-btn').click();

      // Play and check inventory
      await page.goto(`/play/${storyId}`);
      
      // Check empty inventory
      await page.getByTestId('inventory-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="empty-inventory"]', 'No items');
      await page.getByTestId('close-inventory-btn').click();
      
      // Get item
      await page.getByTestId('choice-button').click();
      
      // Check inventory has item
      await page.getByTestId('inventory-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="inventory-item"]', 'Healing Potion');
    });
  });

  test.describe('Custom RPG Mechanics', () => {
    test('should support custom dice rolling systems', async ({ page }) => {
      await page.goto('/rpg-templates/new');
      
      // Create template with custom dice system
      await page.getByTestId('template-name-input').fill('Custom Dice System');
      await page.getByTestId('template-description-input').fill('Uses custom dice mechanics');
      
      // Configure custom dice system
      await page.getByTestId('dice-system-tab').click();
      await page.getByTestId('enable-custom-dice').check();
      
      // Add dice types
      await page.getByTestId('add-dice-type-btn').click();
      await page.getByTestId('dice-name-input').fill('d20');
      await page.getByTestId('dice-sides-input').fill('20');
      await page.getByTestId('save-dice-type-btn').click();
      
      await page.getByTestId('add-dice-type-btn').click();
      await page.getByTestId('dice-name-input').fill('d6');
      await page.getByTestId('dice-sides-input').fill('6');
      await page.getByTestId('save-dice-type-btn').click();
      
      // Add custom roll formulas
      await page.getByTestId('add-roll-formula-btn').click();
      await page.getByTestId('formula-name-input').fill('attack-roll');
      await page.getByTestId('formula-expression-input').fill('1d20 + strength');
      await page.getByTestId('save-formula-btn').click();
      
      await page.getByTestId('create-template-btn').click();
      
      // Assert custom dice system saved
      await E2EAssertions.assertSuccessMessage(page, 'RPG template created successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="dice-type-item"]', 'd20');
      await E2EAssertions.assertElementVisible(page, '[data-testid="dice-type-item"]', 'd6');
      await E2EAssertions.assertElementVisible(page, '[data-testid="formula-item"]', 'attack-roll');
    });

    test('should support conditional mechanics', async ({ page }) => {
      await page.goto('/rpg-templates/new');
      
      await page.getByTestId('template-name-input').fill('Conditional Mechanics');
      
      // Add stat with conditions
      await page.getByTestId('add-stat-btn').click();
      await page.getByTestId('stat-name-input').fill('health');
      await page.getByTestId('stat-type-select').selectOption('integer');
      await page.getByTestId('stat-default-value-input').fill('100');
      
      // Add condition for health stat
      await page.getByTestId('add-condition-btn').click();
      await page.getByTestId('condition-type-select').selectOption('range');
      await page.getByTestId('condition-min-input').fill('0');
      await page.getByTestId('condition-max-input').fill('25');
      await page.getByTestId('condition-effect-input').fill('Player is critically wounded');
      await page.getByTestId('save-condition-btn').click();
      
      await page.getByTestId('save-stat-btn').click();
      
      // Add conditional skill
      await page.getByTestId('add-skill-btn').click();
      await page.getByTestId('skill-name-input').fill('magic');
      await page.getByTestId('skill-type-select').selectOption('integer');
      
      // Add unlock condition for magic skill
      await page.getByTestId('add-unlock-condition-btn').click();
      await page.getByTestId('unlock-condition-stat-select').selectOption('intelligence');
      await page.getByTestId('unlock-condition-operator-select').selectOption('>=');
      await page.getByTestId('unlock-condition-value-input').fill('15');
      await page.getByTestId('save-unlock-condition-btn').click();
      
      await page.getByTestId('save-skill-btn').click();
      
      await page.getByTestId('create-template-btn').click();
      
      // Assert conditional mechanics saved
      await E2EAssertions.assertSuccessMessage(page, 'RPG template created successfully');
    });

    test('should support custom resource systems', async ({ page }) => {
      await page.goto('/rpg-templates/new');
      
      await page.getByTestId('template-name-input').fill('Resource Management System');
      
      // Create custom resource types
      await page.getByTestId('resources-tab').click();
      
      // Add mana resource
      await page.getByTestId('add-resource-btn').click();
      await page.getByTestId('resource-name-input').fill('mana');
      await page.getByTestId('resource-type-select').selectOption('renewable');
      await page.getByTestId('resource-max-value-input').fill('100');
      await page.getByTestId('resource-regen-rate-input').fill('5');
      await page.getByTestId('resource-regen-interval-input').fill('turn');
      await page.getByTestId('save-resource-btn').click();
      
      // Add stamina resource
      await page.getByTestId('add-resource-btn').click();
      await page.getByTestId('resource-name-input').fill('stamina');
      await page.getByTestId('resource-type-select').selectOption('consumable');
      await page.getByTestId('resource-max-value-input').fill('50');
      await page.getByTestId('save-resource-btn').click();
      
      await page.getByTestId('create-template-btn').click();
      
      // Assert resource system created
      await E2EAssertions.assertSuccessMessage(page, 'RPG template created successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="resource-item"]', 'mana');
      await E2EAssertions.assertElementVisible(page, '[data-testid="resource-item"]', 'stamina');
    });
  });

  test.describe('Performance and Scalability', () => {
    test('should handle large RPG templates efficiently', async ({ page }) => {
      await page.goto('/rpg-templates/new');
      
      // Create template with many stats
      await page.getByTestId('template-name-input').fill('Large Template');
      
      // Add 50 stats to test performance
      for (let i = 0; i < 50; i++) {
        await page.getByTestId('add-stat-btn').click();
        await page.getByTestId('stat-name-input').fill(`stat${i}`);
        await page.getByTestId('stat-type-select').selectOption('integer');
        await page.getByTestId('stat-default-value-input').fill('10');
        await page.getByTestId('save-stat-btn').click();
      }
      
      // Measure save time
      const startTime = Date.now();
      await page.getByTestId('create-template-btn').click();
      await page.waitForSelector('[data-testid="success-message"]');
      const saveTime = Date.now() - startTime;
      
      // Assert reasonable performance (under 5 seconds)
      expect(saveTime).toBeLessThan(5000);
    });

    test('should optimize RPG calculations during gameplay', async ({ page }) => {
      // Create complex template with many mechanics
      const complexTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Performance Test Template'
      });

      const templateId = await page.evaluate(async (template) => {
        const response = await fetch('/api/rpg-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });
        const result = await response.json();
        return result.data.id;
      }, complexTemplate);

      // Create story with many RPG checks
      const testStory = E2ETestDataFactory.createTestStory({
        rpgTemplateId: templateId
      });
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      // Measure gameplay performance
      const startTime = Date.now();
      await page.goto(`/play/${storyId}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Assert reasonable load time
      expect(loadTime).toBeLessThan(3000);
    });
  });
});