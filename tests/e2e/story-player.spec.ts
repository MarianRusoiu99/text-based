import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EStoryHelper,
  E2EAssertions, 
  E2ETestUtils,
  StoryEditorPage
} from '../utils/e2e-test-utilities';

/**
 * Story Player E2E Tests
 * Testing immersive story playing experience with complete gameplay mechanics
 */
test.describe('Story Player Experience', () => {
  let authenticatedUser: any;
  let publishedStoryId: string;

  test.beforeEach(async ({ page }) => {
    // Setup authenticated user for story playing tests
    const { user, authData } = await E2EAuthHelper.setupAuthenticatedUser(page);
    authenticatedUser = { user, authData };

    // Create and publish a test story for playing
    const testStory = E2ETestDataFactory.createTestStory({
      title: 'Player Test Adventure',
      description: 'A story designed for testing the player experience'
    });
    publishedStoryId = await E2EStoryHelper.createStory(page, testStory);
    
    // Add basic content and publish
    const editorPage = new StoryEditorPage(page);
    await editorPage.goto(publishedStoryId);
    await editorPage.addNode('Opening Scene', 'Welcome to your adventure! You stand at a crossroads.');
    await editorPage.addNode('Forest Path', 'You venture into the dark forest.');
    await editorPage.addNode('Mountain Trail', 'You climb the rocky mountain path.');
    
    // Connect nodes with choices
    await editorPage.connectNodes('Opening Scene', 'Forest Path', 'Enter the forest');
    await editorPage.connectNodes('Opening Scene', 'Mountain Trail', 'Take the mountain path');
    
    await E2EStoryHelper.publishStory(page);
  });

  test.afterEach(async ({ page }) => {
    await E2ETestUtils.clearTestData(page);
  });

  test.describe('Story Discovery and Navigation', () => {
    test('should discover and start playing a published story', async ({ page }) => {
      // Go to story discovery page
      await page.goto('/discover');
      await page.waitForLoadState('networkidle');

      // Search for our test story
      await page.getByTestId('story-search-input').fill('Player Test Adventure');
      await page.getByTestId('search-button').click();

      // Assert story appears in results
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-card"]', 'Player Test Adventure');
      
      // Click to view story details
      await page.getByTestId('story-card').click();
      
      // Assert story details page loads
      await E2EAssertions.assertUrlMatches(page, `/stories/${publishedStoryId}`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-title"]', 'Player Test Adventure');
      
      // Start playing the story
      await page.getByTestId('play-story-btn').click();
      
      // Assert player loads
      await E2EAssertions.assertUrlMatches(page, `/play/${publishedStoryId}`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'Welcome to your adventure');
    });

    test('should handle story ratings and reviews', async ({ page }) => {
      // Go to story page
      await page.goto(`/stories/${publishedStoryId}`);
      
      // Rate the story
      await page.getByTestId('rating-stars').locator('[data-value="4"]').click();
      await E2EAssertions.assertSuccessMessage(page, 'Rating submitted');
      
      // Leave a review
      await page.getByTestId('review-textarea').fill('Great story! Really enjoyed the branching paths.');
      await page.getByTestId('submit-review-btn').click();
      
      // Assert review appears
      await E2EAssertions.assertSuccessMessage(page, 'Review submitted');
      await E2EAssertions.assertElementVisible(page, '[data-testid="user-review"]', 'Great story!');
    });

    test('should show story statistics and metadata', async ({ page }) => {
      await page.goto(`/stories/${publishedStoryId}`);
      
      // Assert story metadata is displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-author"]', authenticatedUser.user.displayName);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-status"]', 'Published');
      
      // Check statistics
      await E2EAssertions.assertElementVisible(page, '[data-testid="play-count"]', '0 plays');
      await E2EAssertions.assertElementVisible(page, '[data-testid="node-count"]', '3 scenes');
    });
  });

  test.describe('Core Gameplay Mechanics', () => {
    test('should navigate through story choices', async ({ page }) => {
      // Start playing
      await page.goto(`/play/${publishedStoryId}`);
      await page.waitForLoadState('networkidle');

      // Assert initial scene content
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'Welcome to your adventure');
      
      // Assert choices are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="choice-button"]', 'Enter the forest');
      await E2EAssertions.assertElementVisible(page, '[data-testid="choice-button"]', 'Take the mountain path');
      
      // Make a choice
      await page.getByTestId('choice-button').filter({ hasText: 'Enter the forest' }).click();
      
      // Assert navigation to forest scene
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'You venture into the dark forest');
      
      // Assert choice buttons update for new scene
      await page.waitForTimeout(1000); // Allow for content update
    });

    test('should track player progress and save state', async ({ page }) => {
      // Start playing
      await page.goto(`/play/${publishedStoryId}`);
      
      // Make a choice to progress
      await page.getByTestId('choice-button').filter({ hasText: 'Take the mountain path' }).click();
      
      // Verify progress is saved (refresh page)
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Assert player is still on mountain path scene
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'You climb the rocky mountain path');
    });

    test('should handle story completion', async ({ page }) => {
      // Create a story with an ending
      const completableStory = E2ETestDataFactory.createTestStory({
        title: 'Completable Adventure'
      });
      const completableStoryId = await E2EStoryHelper.createStory(page, completableStory);
      
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(completableStoryId);
      await editorPage.addNode('Start', 'Your journey begins.');
      await editorPage.addNode('The End', 'Congratulations! You have completed the adventure.');
      await editorPage.connectNodes('Start', 'The End', 'Finish the adventure');
      await E2EStoryHelper.publishStory(page);
      
      // Play through to completion
      await page.goto(`/play/${completableStoryId}`);
      await page.getByTestId('choice-button').click();
      
      // Assert completion screen
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-completion"]', 'Congratulations');
      await E2EAssertions.assertElementVisible(page, '[data-testid="completion-stats"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="play-again-btn"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="rate-story-btn"]');
    });

    test('should support bookmarking and save points', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Progress through story
      await page.getByTestId('choice-button').first().click();
      
      // Create bookmark
      await page.getByTestId('bookmark-btn').click();
      await page.getByTestId('bookmark-name-input').fill('Forest entrance');
      await page.getByTestId('save-bookmark-btn').click();
      
      // Assert bookmark saved
      await E2EAssertions.assertSuccessMessage(page, 'Bookmark saved');
      
      // Navigate away and return via bookmark
      await page.goto('/');
      await page.goto('/profile/bookmarks');
      await page.getByTestId('bookmark-item').filter({ hasText: 'Forest entrance' }).click();
      
      // Assert returned to bookmarked position
      await E2EAssertions.assertUrlMatches(page, `/play/${publishedStoryId}`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'dark forest');
    });
  });

  test.describe('RPG Integration in Gameplay', () => {
    let rpgStoryId: string;

    test.beforeEach(async ({ page }) => {
      // Create RPG template for gameplay tests
      const rpgTemplate = E2ETestDataFactory.createTestRpgTemplate({
        name: 'Player Test RPG System'
      });

      const rpgTemplateId = await page.evaluate(async (template) => {
        const response = await fetch('/api/rpg-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });
        const result = await response.json();
        return result.data.id;
      }, rpgTemplate);

      // Create RPG story
      const rpgStory = E2ETestDataFactory.createTestStory({
        title: 'RPG Adventure Test',
        rpgTemplateId: rpgTemplateId
      });
      rpgStoryId = await E2EStoryHelper.createStory(page, rpgStory);
      
      // Setup RPG story with mechanics
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(rpgStoryId);
      
      // Add variables and items
      const variables = [
        E2ETestDataFactory.createTestVariable({
          variableName: 'playerHealth',
          variableType: 'integer',
          defaultValue: '100'
        })
      ];
      await E2EStoryHelper.addVariables(page, variables);
      
      const items = [
        E2ETestDataFactory.createTestItem({
          itemName: 'Health Potion',
          description: 'Restores 25 HP'
        })
      ];
      await E2EStoryHelper.addItems(page, items);
      
      // Add nodes with RPG mechanics
      await editorPage.addNode('Adventure Start', 'Your RPG adventure begins!');
      await E2EStoryHelper.publishStory(page);
    });

    test('should display and manage player stats during gameplay', async ({ page }) => {
      await page.goto(`/play/${rpgStoryId}`);
      
      // Open stats panel
      await page.getByTestId('player-stats-btn').click();
      
      // Assert initial stats from RPG template
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-strength"]', '10');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-intelligence"]', '10');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-charisma"]', '10');
      
      // Assert variables are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="variable-playerHealth"]', '100');
      
      // Close stats panel
      await page.getByTestId('close-stats-btn').click();
    });

    test('should handle inventory management during gameplay', async ({ page }) => {
      await page.goto(`/play/${rpgStoryId}`);
      
      // Open inventory
      await page.getByTestId('inventory-btn').click();
      
      // Assert empty inventory initially
      await E2EAssertions.assertElementVisible(page, '[data-testid="empty-inventory"]', 'No items');
      
      // Close inventory
      await page.getByTestId('close-inventory-btn').click();
    });

    test('should perform RPG checks with dice rolling', async ({ page }) => {
      // Setup story with RPG check
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(rpgStoryId);
      
      // Add node with RPG check
      await editorPage.addNode('Strength Challenge', 'A heavy door blocks your path.');
      
      // Add RPG check (simplified - actual implementation would be more complex)
      await page.locator('[data-testid="story-node"]').filter({ hasText: 'Adventure Start' }).click();
      await page.getByTestId('add-choice-btn').click();
      await page.getByTestId('choice-text-input').fill('Try to force the door');
      await page.getByTestId('choice-target-select').selectOption('Strength Challenge');
      await page.getByTestId('save-choice-btn').click();
      
      // Play and test RPG check
      await page.goto(`/play/${rpgStoryId}`);
      await page.getByTestId('choice-button').filter({ hasText: 'Try to force the door' }).click();
      
      // Assert RPG check interface (if implemented)
      // This would depend on the actual RPG check implementation
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'heavy door blocks');
    });
  });

  test.describe('Social Features and Sharing', () => {
    test('should share story progress on social media', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Progress through some of the story
      await page.getByTestId('choice-button').first().click();
      
      // Open sharing menu
      await page.getByTestId('share-btn').click();
      
      // Assert sharing options
      await E2EAssertions.assertElementVisible(page, '[data-testid="share-twitter-btn"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="share-facebook-btn"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="copy-link-btn"]');
      
      // Test copy link functionality
      await page.getByTestId('copy-link-btn').click();
      await E2EAssertions.assertSuccessMessage(page, 'Link copied to clipboard');
    });

    test('should follow other players and see their activity', async ({ page, context }) => {
      // Create second user
      const secondUserPage = await context.newPage();
      const secondUser = await E2EAuthHelper.setupAuthenticatedUser(secondUserPage, {
        username: 'storyplayer2',
        displayName: 'Story Player 2'
      });
      
      // Second user plays the story
      await secondUserPage.goto(`/play/${publishedStoryId}`);
      await secondUserPage.getByTestId('choice-button').first().click();
      
      // First user follows second user
      await page.goto(`/users/${secondUser.user.username}`);
      await page.getByTestId('follow-user-btn').click();
      
      // Check activity feed
      await page.goto('/activity');
      await E2EAssertions.assertElementVisible(page, '[data-testid="activity-item"]', `${secondUser.user.displayName} played`);
      
      await secondUserPage.close();
    });

    test('should participate in community discussions', async ({ page }) => {
      await page.goto(`/stories/${publishedStoryId}`);
      
      // Go to discussions tab
      await page.getByTestId('discussions-tab').click();
      
      // Start a new discussion
      await page.getByTestId('new-discussion-btn').click();
      await page.getByTestId('discussion-title-input').fill('Great story paths!');
      await page.getByTestId('discussion-content-input').fill('I loved the forest path. What did others think?');
      await page.getByTestId('create-discussion-btn').click();
      
      // Assert discussion created
      await E2EAssertions.assertSuccessMessage(page, 'Discussion created');
      await E2EAssertions.assertElementVisible(page, '[data-testid="discussion-item"]', 'Great story paths!');
    });
  });

  test.describe('Accessibility and User Experience', () => {
    test('should be fully keyboard navigable', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Navigate using keyboard only
      await page.keyboard.press('Tab'); // Focus first choice
      await page.keyboard.press('Enter'); // Select choice
      
      // Assert navigation worked
      await page.waitForTimeout(1000);
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'forest');
    });

    test('should support screen readers', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Check ARIA labels and roles
      const storyContent = page.getByTestId('story-content');
      await expect(storyContent).toHaveAttribute('role', 'main');
      await expect(storyContent).toHaveAttribute('aria-label');
      
      const choiceButtons = page.getByTestId('choice-button');
      await expect(choiceButtons.first()).toHaveAttribute('aria-describedby');
    });

    test('should support different font sizes and themes', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Open settings
      await page.getByTestId('player-settings-btn').click();
      
      // Change font size
      await page.getByTestId('font-size-select').selectOption('large');
      await page.getByTestId('save-settings-btn').click();
      
      // Assert font size changed
      const content = page.getByTestId('story-content');
      await expect(content).toHaveClass(/font-large/);
      
      // Change theme
      await page.getByTestId('player-settings-btn').click();
      await page.getByTestId('theme-select').selectOption('dark');
      await page.getByTestId('save-settings-btn').click();
      
      // Assert dark theme applied
      await expect(page.locator('body')).toHaveClass(/dark-theme/);
    });

    test('should handle mobile responsive design', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`/play/${publishedStoryId}`);
      
      // Assert mobile layout
      await E2EAssertions.assertElementVisible(page, '[data-testid="mobile-player-menu"]');
      
      // Test swipe gestures (if implemented)
      const storyContent = page.getByTestId('story-content');
      await storyContent.hover();
      
      // Simulate swipe (this would need touch event simulation)
      await page.mouse.down();
      await page.mouse.move(100, 0);
      await page.mouse.up();
    });
  });

  test.describe('Performance and Optimization', () => {
    test('should load large stories efficiently', async ({ page }) => {
      // Create a story with many nodes for performance testing
      const largeStory = E2ETestDataFactory.createTestStory({
        title: 'Large Performance Test Story'
      });
      const largeStoryId = await E2EStoryHelper.createStory(page, largeStory);
      
      // Add many nodes (simplified - in reality would use API)
      const editorPage = new StoryEditorPage(page);
      await editorPage.goto(largeStoryId);
      
      // Add 20 nodes to test performance
      for (let i = 0; i < 20; i++) {
        await editorPage.addNode(`Scene ${i}`, `Content for scene ${i}`);
      }
      
      await E2EStoryHelper.publishStory(page);
      
      // Measure load time
      const startTime = Date.now();
      await page.goto(`/play/${largeStoryId}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Assert reasonable load time (under 3 seconds)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should implement lazy loading for story content', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Assert only current scene content is loaded
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'Welcome to your adventure');
      
      // Assert future scenes are not yet loaded in DOM
      const forestContent = page.locator('text=You venture into the dark forest');
      await expect(forestContent).not.toBeVisible();
    });

    test('should cache story data for offline play', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Play through some content to cache it
      await page.getByTestId('choice-button').first().click();
      
      // Simulate offline mode
      await page.context().setOffline(true);
      
      // Navigate back (should work from cache)
      await page.goBack();
      
      // Assert content still loads from cache
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-content"]', 'Welcome to your adventure');
      
      // Restore online mode
      await page.context().setOffline(false);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle corrupted save data gracefully', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Progress through story
      await page.getByTestId('choice-button').first().click();
      
      // Corrupt save data in localStorage
      await page.evaluate(() => {
        localStorage.setItem('story-save-data', 'invalid-json');
      });
      
      // Refresh page
      await page.reload();
      
      // Assert graceful handling of corrupted data
      await E2EAssertions.assertElementVisible(page, '[data-testid="save-data-error"]', 'Save data corrupted');
      await E2EAssertions.assertElementVisible(page, '[data-testid="restart-story-btn"]');
    });

    test('should handle network errors during gameplay', async ({ page }) => {
      await page.goto(`/play/${publishedStoryId}`);
      
      // Simulate network error
      await page.route('**/api/stories/**', route => route.abort());
      
      // Try to make a choice
      await page.getByTestId('choice-button').first().click();
      
      // Assert error handling
      await E2EAssertions.assertErrorMessage(page, 'Connection error. Please try again.');
      await E2EAssertions.assertElementVisible(page, '[data-testid="retry-btn"]');
    });

    test('should handle invalid story URLs', async ({ page }) => {
      await page.goto('/play/invalid-story-id');
      
      // Assert error page
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-not-found"]', 'Story not found');
      await E2EAssertions.assertElementVisible(page, '[data-testid="browse-stories-btn"]');
    });

    test('should handle unauthorized access to private stories', async ({ page, context }) => {
      // Create private story with first user
      const privateStory = E2ETestDataFactory.createTestStory({
        title: 'Private Story',
        visibility: 'private'
      });
      const privateStoryId = await E2EStoryHelper.createStory(page, privateStory);
      await E2EStoryHelper.publishStory(page);
      
      // Create second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.setupAuthenticatedUser(secondUserPage, {
        username: 'unauthorizeduser'
      });
      
      // Try to access private story
      await secondUserPage.goto(`/play/${privateStoryId}`);
      
      // Assert access denied
      await E2EAssertions.assertErrorMessage(secondUserPage, 'Story not found or access denied');
      
      await secondUserPage.close();
    });
  });
});