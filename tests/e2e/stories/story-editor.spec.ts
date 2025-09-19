import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EStoryHelper,
  E2EAssertions, 
  E2ETestUtils,
  StoryEditorPage
} from '../../utils/e2e-test-utilities';

/**
 * Story Creation and Editing E2E Tests
 * Following comprehensive testing strategy with complete story lifecycle workflows
 */
test.describe('Story Creation and Editing', () => {
  let authenticatedUser: any;

  test.beforeEach(async ({ page }) => {
    // Setup authenticated user for all story tests
    const { user, authData } = await E2EAuthHelper.setupAuthenticatedUser(page);
    authenticatedUser = { user, authData };
  });

  test.afterEach(async ({ page }) => {
    await E2ETestUtils.clearTestData(page);
  });

  test.describe('Story Creation Flow', () => {
    test('should successfully create a basic story', async ({ page }) => {
      // Arrange
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'My First Adventure',
        description: 'An epic journey begins here',
        visibility: 'public'
      });

      // Act
      const storyId = await E2EStoryHelper.createStory(page, testStory);

      // Assert
      expect(storyId).toBeTruthy();
      await E2EAssertions.assertUrlMatches(page, `/editor/${storyId}`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-title"]', testStory.title);
    });

    test('should create story with RPG template', async ({ page }) => {
      // First create an RPG template
      const rpgTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Fantasy Adventure',
        description: 'A classic fantasy RPG template'
      });

      // Create RPG template through API or UI (assuming API endpoint exists)
      const templateId = await page.evaluate(async (template) => {
        const response = await fetch('/api/rpg-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });
        const result = await response.json();
        return result.data.id;
      }, rpgTemplate);

      // Create story with RPG template
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'RPG Adventure Story',
        rpgTemplateId: templateId
      });

      const storyId = await E2EStoryHelper.createStory(page, testStory);

      // Assert RPG template is applied
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      await E2EAssertions.assertElementVisible(page, '[data-testid="rpg-template-name"]', rpgTemplate.name);
    });

    test('should validate required story fields', async ({ page }) => {
      await page.goto('/stories/new');
      await page.waitForLoadState('networkidle');

      // Try to submit empty form
      await page.getByTestId('create-story-button').click();

      // Assert validation errors
      await E2EAssertions.assertElementVisible(page, '[data-testid="title-error"]', 'Title is required');
    });

    test('should enforce title length limits', async ({ page }) => {
      await page.goto('/stories/new');

      // Try with too long title
      const longTitle = 'A'.repeat(256); // Assuming 255 char limit
      await page.getByTestId('story-title-input').fill(longTitle);
      await page.getByTestId('create-story-button').click();

      await E2EAssertions.assertElementVisible(page, '[data-testid="title-error"]', 'Title must be less than 255 characters');
    });

    test('should create story with tags', async ({ page }) => {
      const testStory = E2ETestDataFactory.createTestStory({
        tags: ['fantasy', 'adventure', 'magic']
      });

      const storyId = await E2EStoryHelper.createStory(page, testStory);

      // Verify tags are saved
      await page.goto(`/stories/${storyId}`);
      for (const tag of testStory.tags!) {
        await E2EAssertions.assertElementVisible(page, '[data-testid="story-tag"]', tag);
      }
    });
  });

  test.describe('Story Editor Functionality', () => {
    let storyId: string;
    let editorPage: StoryEditorPage;

    test.beforeEach(async ({ page }) => {
      // Create a test story for editing
      const testStory = E2ETestDataFactory.createTestStory();
      storyId = await E2EStoryHelper.createStory(page, testStory);
      editorPage = new StoryEditorPage(page);
      await editorPage.goto(storyId);
    });

    test('should add story nodes', async ({ page }) => {
      // Add first node
      await editorPage.addNode('Opening Scene', 'You find yourself at the entrance of a mysterious cave...');

      // Assert node is created
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-node"]', 'Opening Scene');
      await E2EAssertions.assertElementVisible(page, '[data-testid="node-content"]', 'mysterious cave');
    });

    test('should connect nodes with choices', async ({ page }) => {
      // Add two connected nodes
      await editorPage.addNode('Scene 1', 'You see two paths ahead.');
      await editorPage.addNode('Scene 2', 'You chose the left path.');
      
      // Connect them with a choice
      await editorPage.connectNodes('Scene 1', 'Scene 2', 'Take the left path');

      // Assert connection is created
      await E2EAssertions.assertElementVisible(page, '[data-testid="choice-text"]', 'Take the left path');
      await E2EAssertions.assertElementVisible(page, '.react-flow__edge', ''); // Edge exists
    });

    test('should add variables to story', async ({ page }) => {
      const variables = [
        E2ETestDataFactory.createTestVariable({
          variableName: 'playerHealth',
          variableType: 'integer',
          defaultValue: '100'
        }),
        E2ETestDataFactory.createTestVariable({
          variableName: 'playerName',
          variableType: 'string',
          defaultValue: 'Hero'
        })
      ];

      await E2EStoryHelper.addVariables(page, variables);

      // Assert variables are added
      for (const variable of variables) {
        await E2EAssertions.assertVariableDisplayed(page, variable);
      }
    });

    test('should add items to story', async ({ page }) => {
      const items = [
        E2ETestDataFactory.createTestItem({
          itemName: 'Magic Sword',
          description: 'A powerful enchanted blade'
        }),
        E2ETestDataFactory.createTestItem({
          itemName: 'Health Potion',
          description: 'Restores 50 HP'
        })
      ];

      await E2EStoryHelper.addItems(page, items);

      // Assert items are added
      for (const item of items) {
        await E2EAssertions.assertItemDisplayed(page, item);
      }
    });

    test('should support drag and drop for node positioning', async ({ page }) => {
      // Add a node
      await editorPage.addNode('Movable Node', 'This node can be moved');
      
      const node = page.locator('[data-testid="story-node"]').first();
      const nodeBox = await node.boundingBox();
      
      // Drag node to new position
      await node.dragTo(page.locator('.react-flow__pane'), {
        targetPosition: { x: nodeBox!.x + 100, y: nodeBox!.y + 100 }
      });

      // Verify node position changed
      const newNodeBox = await node.boundingBox();
      expect(newNodeBox!.x).not.toBe(nodeBox!.x);
      expect(newNodeBox!.y).not.toBe(nodeBox!.y);
    });

    test('should auto-save story changes', async ({ page }) => {
      // Add content that should trigger auto-save
      await editorPage.addNode('Auto Save Test', 'Testing auto-save functionality');

      // Wait for auto-save indication
      await E2EAssertions.assertElementVisible(page, '[data-testid="auto-save-indicator"]', 'Saved');
      
      // Refresh page and verify content persists
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-node"]', 'Auto Save Test');
    });

    test('should validate node connections', async ({ page }) => {
      // Try to create invalid connection (to self)
      await editorPage.addNode('Self Node', 'This node tries to connect to itself');
      
      const node = page.locator('[data-testid="story-node"]').first();
      await node.click();
      await page.getByTestId('add-choice-btn').click();
      await page.getByTestId('choice-text-input').fill('Invalid choice');
      await page.getByTestId('choice-target-select').selectOption('Self Node');
      await page.getByTestId('save-choice-btn').click();

      // Should show validation error
      await E2EAssertions.assertErrorMessage(page, 'Node cannot connect to itself');
    });
  });

  test.describe('Story Publishing and Sharing', () => {
    let storyId: string;

    test.beforeEach(async ({ page }) => {
      // Create a complete story for publishing tests
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'Complete Adventure Story'
      });
      storyId = await E2EStoryHelper.createStory(page, testStory);
      
      // Add some content to make it publishable
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(storyId);
      await editorPage.addNode('Start', 'Your adventure begins...');
    });

    test('should publish story successfully', async ({ page }) => {
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      await E2EStoryHelper.publishStory(page);

      // Assert story is published
      await E2EAssertions.assertSuccessMessage(page, 'Story published successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-status"]', 'Published');
    });

    test('should prevent publishing incomplete stories', async ({ page }) => {
      // Create story with no content
      const emptyStory = E2ETestDataFactory.createTestStory();
      const emptyStoryId = await E2EStoryHelper.createStory(page, emptyStory);
      
      await E2EStoryHelper.goToStoryEditor(page, emptyStoryId);
      await page.getByTestId('publish-story-btn').click();

      // Should show validation error
      await E2EAssertions.assertErrorMessage(page, 'Story must have at least one node to publish');
    });

    test('should update story visibility settings', async ({ page }) => {
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Open settings panel
      await page.getByTestId('story-settings-btn').click();
      
      // Change visibility to private
      await page.getByTestId('visibility-select').selectOption('private');
      await page.getByTestId('save-settings-btn').click();

      // Assert visibility updated
      await E2EAssertions.assertSuccessMessage(page, 'Story settings updated');
      
      // Verify story is not publicly visible
      await E2EAuthHelper.logoutUser(page);
      await page.goto(`/stories/${storyId}`);
      await E2EAssertions.assertErrorMessage(page, 'Story not found or access denied');
    });

    test('should generate shareable link for unlisted stories', async ({ page }) => {
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Set story to unlisted
      await page.getByTestId('story-settings-btn').click();
      await page.getByTestId('visibility-select').selectOption('unlisted');
      await page.getByTestId('save-settings-btn').click();

      // Generate share link
      await page.getByTestId('generate-share-link-btn').click();
      
      // Assert share link is generated
      const shareLink = await page.getByTestId('share-link-input').inputValue();
      expect(shareLink).toContain('/stories/');
      expect(shareLink).toContain('?token=');
      
      // Test share link works
      await E2EAuthHelper.logoutUser(page);
      await page.goto(shareLink);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-title"]', 'Complete Adventure Story');
    });
  });

  test.describe('Story Collaboration Features', () => {
    let storyId: string;
    let collaboratorUser: any;

    test.beforeEach(async ({ page, context }) => {
      // Create story with main user
      const testStory = E2ETestDataFactory.createTestStory({
        title: 'Collaborative Story'
      });
      storyId = await E2EStoryHelper.createStory(page, testStory);

      // Create collaborator user in new context
      const collaboratorPage = await context.newPage();
      collaboratorUser = await E2EAuthHelper.setupAuthenticatedUser(collaboratorPage, {
        username: 'collaborator',
        displayName: 'Story Collaborator'
      });
      await collaboratorPage.close();
    });

    test('should add collaborators to story', async ({ page }) => {
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Open collaboration panel
      await page.getByTestId('collaboration-btn').click();
      
      // Add collaborator
      await page.getByTestId('collaborator-username-input').fill(collaboratorUser.user.username);
      await page.getByTestId('collaboration-level-select').selectOption('editor');
      await page.getByTestId('add-collaborator-btn').click();

      // Assert collaborator added
      await E2EAssertions.assertSuccessMessage(page, 'Collaborator added successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="collaborator-list"]', collaboratorUser.user.username);
    });

    test('should restrict collaborator permissions', async ({ page, context }) => {
      // Add collaborator as viewer only
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      await page.getByTestId('collaboration-btn').click();
      await page.getByTestId('collaborator-username-input').fill(collaboratorUser.user.username);
      await page.getByTestId('collaboration-level-select').selectOption('viewer');
      await page.getByTestId('add-collaborator-btn').click();

      // Switch to collaborator context
      const collaboratorPage = await context.newPage();
      await E2EAuthHelper.loginUser(collaboratorPage, {
        identifier: collaboratorUser.user.username,
        password: collaboratorUser.user.password
      });

      // Try to edit story as viewer
      await collaboratorPage.goto(`/editor/${storyId}`);
      
      // Assert editing controls are disabled
      await expect(collaboratorPage.getByTestId('add-node-btn')).toBeDisabled();
      await expect(collaboratorPage.getByTestId('publish-story-btn')).toBeDisabled();
      
      await collaboratorPage.close();
    });
  });

  test.describe('Story Templates and Cloning', () => {
    test('should create story from template', async ({ page }) => {
      // First create a template story
      const templateStory = E2ETestDataFactory.createTestStory({
        title: 'Adventure Template',
        description: 'A reusable adventure template'
      });
      const templateId = await E2EStoryHelper.createStory(page, templateStory);
      
      // Add content to template
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(templateId);
      await editorPage.addNode('Template Start', 'This is a template starting point');
      
      // Mark as template
      await page.getByTestId('story-settings-btn').click();
      await page.getByTestId('mark-as-template-checkbox').check();
      await page.getByTestId('save-settings-btn').click();
      
      // Create new story from template
      await page.goto('/stories/new');
      await page.getByTestId('use-template-btn').click();
      await page.getByTestId('template-search-input').fill('Adventure Template');
      await page.getByTestId('template-option').first().click();
      await page.getByTestId('create-from-template-btn').click();

      // Assert new story created with template content
      await E2EAssertions.assertUrlMatches(page, /\/editor\/[a-zA-Z0-9-]+/);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-node"]', 'Template Start');
    });

    test('should clone existing story', async ({ page }) => {
      // Create original story
      const originalStory = E2ETestDataFactory.createTestStory({
        title: 'Original Story'
      });
      const originalId = await E2EStoryHelper.createStory(page, originalStory);
      
      // Add content
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(originalId);
      await editorPage.addNode('Original Content', 'This is original content');
      
      // Clone story
      await page.getByTestId('story-menu-btn').click();
      await page.getByTestId('clone-story-btn').click();
      
      // Customize clone
      await page.getByTestId('clone-title-input').fill('Cloned Story');
      await page.getByTestId('confirm-clone-btn').click();

      // Assert clone created
      await E2EAssertions.assertUrlMatches(page, /\/editor\/[a-zA-Z0-9-]+/);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-title"]', 'Cloned Story');
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-node"]', 'Original Content');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle network errors during story creation', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/stories', route => route.abort());

      const testStory = E2ETestDataFactory.createTestStory();
      
      await page.goto('/stories/new');
      await page.getByTestId('story-title-input').fill(testStory.title);
      await page.getByTestId('story-description-input').fill(testStory.description);
      await page.getByTestId('create-story-button').click();

      // Assert network error handling
      await E2EAssertions.assertErrorMessage(page, 'Failed to create story. Please try again.');
    });

    test('should handle editor crashes gracefully', async ({ page }) => {
      const testStory = E2ETestDataFactory.createTestStory();
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      // Simulate editor crash by injecting error
      await page.evaluate(() => {
        // @ts-ignore
        window.ReactFlow = undefined;
      });

      await page.goto(`/editor/${storyId}`);
      
      // Should show fallback UI
      await E2EAssertions.assertElementVisible(page, '[data-testid="editor-error-fallback"]', 'Editor temporarily unavailable');
      await E2EAssertions.assertElementVisible(page, '[data-testid="reload-editor-btn"]');
    });

    test('should prevent unauthorized story access', async ({ page }) => {
      // Create private story
      const privateStory = E2ETestDataFactory.createTestStory({
        visibility: 'private'
      });
      const storyId = await E2EStoryHelper.createStory(page, privateStory);
      
      // Logout and try to access
      await E2EAuthHelper.logoutUser(page);
      await page.goto(`/editor/${storyId}`);

      // Should redirect to login
      await E2EAssertions.assertUrlMatches(page, '/login');
    });

    test('should handle corrupted story data', async ({ page }) => {
      const testStory = E2ETestDataFactory.createTestStory();
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      // Corrupt story data in localStorage
      await page.evaluate(() => {
        localStorage.setItem('story-draft', 'invalid-json');
      });

      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Should handle corruption gracefully
      await E2EAssertions.assertElementVisible(page, '[data-testid="data-recovery-notice"]', 'Draft data corrupted');
    });
  });

  test.describe('Performance and User Experience', () => {
    test('should load large stories efficiently', async ({ page }) => {
      // Create story with many nodes
      const testStory = E2ETestDataFactory.createTestStory();
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(storyId);
      
      // Add 50 nodes to test performance
      for (let i = 0; i < 50; i++) {
        await editorPage.addNode(`Node ${i}`, `Content for node ${i}`);
      }

      // Reload and measure load time
      const startTime = Date.now();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Assert reasonable load time (under 5 seconds)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should show loading states during operations', async ({ page }) => {
      const testStory = E2ETestDataFactory.createTestStory();
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Add node and check for loading state
      await page.getByTestId('add-node-btn').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="node-creation-loading"]');
    });

    test('should support keyboard shortcuts', async ({ page }) => {
      const testStory = E2ETestDataFactory.createTestStory();
      const storyId = await E2EStoryHelper.createStory(page, testStory);
      
      await E2EStoryHelper.goToStoryEditor(page, storyId);
      
      // Test Ctrl+S for save
      await page.keyboard.press('Control+s');
      await E2EAssertions.assertElementVisible(page, '[data-testid="save-confirmation"]');
      
      // Test Ctrl+N for new node
      await page.keyboard.press('Control+n');
      await E2EAssertions.assertElementVisible(page, '[data-testid="new-node-modal"]');
    });
  });
});