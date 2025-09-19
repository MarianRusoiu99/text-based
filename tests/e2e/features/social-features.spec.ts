import { test, expect } from '@playwright/test';
import { 
  E2ETestDataFactory, 
  E2EAuthHelper, 
  E2EStoryHelper,
  E2EAssertions, 
  E2ETestUtils
} from '../../utils/e2e-test-utilities';

/**
 * Social Features E2E Tests
 * Testing community interaction, following, achievements, and social gameplay
 */
test.describe('Social Features and Community', () => {
  let primaryUser: any;
  let secondaryUser: any;
  let testStoryId: string;

  test.beforeAll(async ({ browser }) => {
    // Setup multiple users for social interaction tests
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    primaryUser = await E2EAuthHelper.setupAuthenticatedUser(page1, {
      username: 'socialuser1',
      displayName: 'Social User 1',
      email: 'social1@example.com'
    });
    
    secondaryUser = await E2EAuthHelper.setupAuthenticatedUser(page2, {
      username: 'socialuser2',
      displayName: 'Social User 2',
      email: 'social2@example.com'
    });
    
    // Create a test story for social interactions
    const testStory = E2ETestDataFactory.createTestStory({
      title: 'Social Interaction Test Story',
      description: 'A story for testing social features',
      visibility: 'public'
    });
    testStoryId = await E2EStoryHelper.createStory(page1, testStory);
    await E2EStoryHelper.publishStory(page1);
    
    await page1.close();
    await page2.close();
    await context1.close();
    await context2.close();
  });

  test.beforeEach(async ({ page }) => {
    // Login primary user for each test
    await E2EAuthHelper.loginUser(page, {
      identifier: primaryUser.user.username,
      password: primaryUser.user.password
    });
  });

  test.afterEach(async ({ page }) => {
    await E2ETestUtils.clearTestData(page);
  });

  test.describe('User Profiles and Following', () => {
    test('should view and edit user profile', async ({ page }) => {
      // Navigate to own profile
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // Assert profile information is displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="profile-username"]', primaryUser.user.username);
      await E2EAssertions.assertElementVisible(page, '[data-testid="profile-display-name"]', primaryUser.user.displayName);
      
      // Edit profile
      await page.getByTestId('edit-profile-btn').click();
      
      // Update bio
      const newBio = 'I love creating interactive stories!';
      await page.getByTestId('bio-textarea').fill(newBio);
      
      // Update location
      await page.getByTestId('location-input').fill('Story Land');
      
      // Update website
      await page.getByTestId('website-input').fill('https://mystories.com');
      
      // Save changes
      await page.getByTestId('save-profile-btn').click();
      
      // Assert changes saved
      await E2EAssertions.assertSuccessMessage(page, 'Profile updated successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="profile-bio"]', newBio);
      await E2EAssertions.assertElementVisible(page, '[data-testid="profile-location"]', 'Story Land');
    });

    test('should follow and unfollow other users', async ({ page, context }) => {
      // Create second user session
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });

      // Primary user visits secondary user's profile
      await page.goto(`/users/${secondaryUser.user.username}`);
      
      // Assert profile information
      await E2EAssertions.assertElementVisible(page, '[data-testid="profile-display-name"]', secondaryUser.user.displayName);
      
      // Follow the user
      await page.getByTestId('follow-user-btn').click();
      
      // Assert follow successful
      await E2EAssertions.assertSuccessMessage(page, 'Now following');
      await E2EAssertions.assertElementVisible(page, '[data-testid="unfollow-user-btn"]', 'Following');
      
      // Check followers count updated
      await E2EAssertions.assertElementVisible(page, '[data-testid="followers-count"]', '1');
      
      // Secondary user should see follower notification
      await secondUserPage.goto('/notifications');
      await E2EAssertions.assertElementVisible(secondUserPage, '[data-testid="notification-item"]', `${primaryUser.user.displayName} started following you`);
      
      // Unfollow the user
      await page.getByTestId('unfollow-user-btn').click();
      await page.getByTestId('confirm-unfollow-btn').click();
      
      // Assert unfollow successful
      await E2EAssertions.assertSuccessMessage(page, 'Unfollowed');
      await E2EAssertions.assertElementVisible(page, '[data-testid="follow-user-btn"]', 'Follow');
      
      await secondUserPage.close();
    });

    test('should display follower and following lists', async ({ page, context }) => {
      // Setup following relationship
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Secondary user follows primary user
      await secondUserPage.goto(`/users/${primaryUser.user.username}`);
      await secondUserPage.getByTestId('follow-user-btn').click();
      
      // Primary user checks followers
      await page.goto('/profile/followers');
      await E2EAssertions.assertElementVisible(page, '[data-testid="follower-item"]', secondaryUser.user.displayName);
      
      // Primary user follows secondary user back
      await page.goto(`/users/${secondaryUser.user.username}`);
      await page.getByTestId('follow-user-btn').click();
      
      // Check following list
      await page.goto('/profile/following');
      await E2EAssertions.assertElementVisible(page, '[data-testid="following-item"]', secondaryUser.user.displayName);
      
      await secondUserPage.close();
    });

    test('should block and unblock users', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Block secondary user
      await page.goto(`/users/${secondaryUser.user.username}`);
      await page.getByTestId('user-menu-btn').click();
      await page.getByTestId('block-user-btn').click();
      await page.getByTestId('confirm-block-btn').click();
      
      // Assert user blocked
      await E2EAssertions.assertSuccessMessage(page, 'User blocked');
      await E2EAssertions.assertElementVisible(page, '[data-testid="blocked-user-message"]', 'You have blocked this user');
      
      // Secondary user should not be able to see primary user's content
      await secondUserPage.goto(`/users/${primaryUser.user.username}`);
      await E2EAssertions.assertElementVisible(secondUserPage, '[data-testid="user-not-found"]', 'User not found');
      
      // Unblock user
      await page.goto('/profile/blocked-users');
      await page.getByTestId('unblock-user-btn').click();
      await page.getByTestId('confirm-unblock-btn').click();
      
      // Assert user unblocked
      await E2EAssertions.assertSuccessMessage(page, 'User unblocked');
      
      await secondUserPage.close();
    });
  });

  test.describe('Activity Feed and Notifications', () => {
    test('should display activity feed with followed users actions', async ({ page, context }) => {
      // Setup following relationship
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Follow secondary user
      await page.goto(`/users/${secondaryUser.user.username}`);
      await page.getByTestId('follow-user-btn').click();
      
      // Secondary user creates a story
      const newStory = E2ETestDataFactory.createTestStory({
        title: 'Activity Feed Test Story'
      });
      await E2EStoryHelper.createStory(secondUserPage, newStory);
      
      // Secondary user plays a story
      await secondUserPage.goto(`/play/${testStoryId}`);
      
      // Primary user checks activity feed
      await page.goto('/activity');
      await page.waitForLoadState('networkidle');
      
      // Assert activities appear in feed
      await E2EAssertions.assertElementVisible(page, '[data-testid="activity-item"]', `${secondaryUser.user.displayName} created a new story`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="activity-item"]', `${secondaryUser.user.displayName} played`);
      
      await secondUserPage.close();
    });

    test('should receive and manage notifications', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Secondary user follows primary user
      await secondUserPage.goto(`/users/${primaryUser.user.username}`);
      await secondUserPage.getByTestId('follow-user-btn').click();
      
      // Secondary user comments on primary user's story
      await secondUserPage.goto(`/stories/${testStoryId}`);
      await secondUserPage.getByTestId('add-comment-btn').click();
      await secondUserPage.getByTestId('comment-textarea').fill('Great story! Love the plot twists.');
      await secondUserPage.getByTestId('submit-comment-btn').click();
      
      // Primary user checks notifications
      await page.goto('/notifications');
      
      // Assert notifications are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="notification-item"]', `${secondaryUser.user.displayName} started following you`);
      await E2EAssertions.assertElementVisible(page, '[data-testid="notification-item"]', `${secondaryUser.user.displayName} commented on your story`);
      
      // Mark notification as read
      await page.getByTestId('notification-item').first().getByTestId('mark-read-btn').click();
      
      // Assert notification marked as read
      await expect(page.getByTestId('notification-item').first()).toHaveClass(/read/);
      
      // Mark all as read
      await page.getByTestId('mark-all-read-btn').click();
      
      // Assert all notifications marked as read
      const notifications = page.getByTestId('notification-item');
      const count = await notifications.count();
      for (let i = 0; i < count; i++) {
        await expect(notifications.nth(i)).toHaveClass(/read/);
      }
      
      await secondUserPage.close();
    });

    test('should configure notification preferences', async ({ page }) => {
      await page.goto('/profile/settings/notifications');
      
      // Configure notification preferences
      await page.getByTestId('email-notifications-toggle').uncheck();
      await page.getByTestId('follow-notifications-toggle').check();
      await page.getByTestId('comment-notifications-toggle').check();
      await page.getByTestId('mention-notifications-toggle').uncheck();
      
      // Save preferences
      await page.getByTestId('save-notification-settings-btn').click();
      
      // Assert preferences saved
      await E2EAssertions.assertSuccessMessage(page, 'Notification preferences updated');
      
      // Verify preferences persist
      await page.reload();
      await expect(page.getByTestId('email-notifications-toggle')).not.toBeChecked();
      await expect(page.getByTestId('follow-notifications-toggle')).toBeChecked();
      await expect(page.getByTestId('comment-notifications-toggle')).toBeChecked();
      await expect(page.getByTestId('mention-notifications-toggle')).not.toBeChecked();
    });
  });

  test.describe('Story Collaboration and Comments', () => {
    test('should comment on stories and reply to comments', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Go to story page
      await page.goto(`/stories/${testStoryId}`);
      
      // Add a comment
      await page.getByTestId('add-comment-btn').click();
      await page.getByTestId('comment-textarea').fill('This is a fantastic story! The choices really matter.');
      await page.getByTestId('submit-comment-btn').click();
      
      // Assert comment appears
      await E2EAssertions.assertSuccessMessage(page, 'Comment added');
      await E2EAssertions.assertElementVisible(page, '[data-testid="comment-item"]', 'fantastic story');
      
      // Secondary user replies to comment
      await secondUserPage.goto(`/stories/${testStoryId}`);
      await secondUserPage.getByTestId('comment-item').getByTestId('reply-btn').click();
      await secondUserPage.getByTestId('reply-textarea').fill('I agree! The author did an amazing job.');
      await secondUserPage.getByTestId('submit-reply-btn').click();
      
      // Assert reply appears
      await E2EAssertions.assertSuccessMessage(secondUserPage, 'Reply added');
      await E2EAssertions.assertElementVisible(secondUserPage, '[data-testid="comment-reply"]', 'amazing job');
      
      // Like a comment
      await page.reload();
      await page.getByTestId('comment-item').getByTestId('like-comment-btn').click();
      
      // Assert like registered
      await E2EAssertions.assertElementVisible(page, '[data-testid="comment-likes"]', '1');
      
      await secondUserPage.close();
    });

    test('should moderate comments as story author', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Secondary user adds inappropriate comment
      await secondUserPage.goto(`/stories/${testStoryId}`);
      await secondUserPage.getByTestId('add-comment-btn').click();
      await secondUserPage.getByTestId('comment-textarea').fill('This story is terrible and inappropriate content here.');
      await secondUserPage.getByTestId('submit-comment-btn').click();
      
      // Primary user (story author) moderates comment
      await page.goto(`/stories/${testStoryId}`);
      await page.getByTestId('comment-item').getByTestId('moderate-btn').click();
      await page.getByTestId('delete-comment-btn').click();
      await page.getByTestId('confirm-delete-btn').click();
      
      // Assert comment deleted
      await E2EAssertions.assertSuccessMessage(page, 'Comment deleted');
      await expect(page.getByTestId('comment-item')).not.toBeVisible();
      
      await secondUserPage.close();
    });

    test('should report inappropriate content', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Secondary user adds comment
      await secondUserPage.goto(`/stories/${testStoryId}`);
      await secondUserPage.getByTestId('add-comment-btn').click();
      await secondUserPage.getByTestId('comment-textarea').fill('Potentially inappropriate comment content.');
      await secondUserPage.getByTestId('submit-comment-btn').click();
      
      // Primary user reports the comment
      await page.goto(`/stories/${testStoryId}`);
      await page.getByTestId('comment-item').getByTestId('report-btn').click();
      await page.getByTestId('report-reason-select').selectOption('inappropriate');
      await page.getByTestId('report-details-textarea').fill('This comment contains inappropriate language.');
      await page.getByTestId('submit-report-btn').click();
      
      // Assert report submitted
      await E2EAssertions.assertSuccessMessage(page, 'Report submitted');
      
      await secondUserPage.close();
    });
  });

  test.describe('Achievements and Gamification', () => {
    test('should earn achievements for story creation', async ({ page }) => {
      // Create first story (should earn "First Story" achievement)
      const firstStory = E2ETestDataFactory.createTestStory({
        title: 'Achievement Test Story 1'
      });
      await E2EStoryHelper.createStory(page, firstStory);
      
      // Check for achievement notification
      await E2EAssertions.assertElementVisible(page, '[data-testid="achievement-notification"]', 'First Story');
      
      // Go to achievements page
      await page.goto('/profile/achievements');
      
      // Assert achievement is displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="achievement-item"]', 'First Story');
      await E2EAssertions.assertElementVisible(page, '[data-testid="achievement-description"]', 'Created your first story');
    });

    test('should earn achievements for community interaction', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Follow 5 users to earn "Social Butterfly" achievement
      // (For testing, we'll simulate this by following one user multiple times with different test users)
      
      // Follow secondary user
      await page.goto(`/users/${secondaryUser.user.username}`);
      await page.getByTestId('follow-user-btn').click();
      
      // Add multiple comments to earn "Commentator" achievement
      await page.goto(`/stories/${testStoryId}`);
      
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('add-comment-btn').click();
        await page.getByTestId('comment-textarea').fill(`Comment number ${i + 1} for achievement testing.`);
        await page.getByTestId('submit-comment-btn').click();
        await page.waitForTimeout(1000);
      }
      
      // Check achievements
      await page.goto('/profile/achievements');
      await E2EAssertions.assertElementVisible(page, '[data-testid="achievement-item"]', 'Commentator');
      
      await secondUserPage.close();
    });

    test('should display achievement leaderboards', async ({ page }) => {
      await page.goto('/leaderboards');
      
      // Assert leaderboard categories
      await E2EAssertions.assertElementVisible(page, '[data-testid="leaderboard-tab"]', 'Story Creators');
      await E2EAssertions.assertElementVisible(page, '[data-testid="leaderboard-tab"]', 'Most Followed');
      await E2EAssertions.assertElementVisible(page, '[data-testid="leaderboard-tab"]', 'Achievement Points');
      
      // Check story creators leaderboard
      await page.getByTestId('leaderboard-tab').filter({ hasText: 'Story Creators' }).click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="leaderboard-entry"]', primaryUser.user.displayName);
      
      // Check most followed leaderboard
      await page.getByTestId('leaderboard-tab').filter({ hasText: 'Most Followed' }).click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="leaderboard-table"]');
    });

    test('should track and display user statistics', async ({ page }) => {
      await page.goto('/profile/stats');
      
      // Assert user statistics are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-stories-created"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-stories-played"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-followers"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-following"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-comments"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="stat-achievements"]');
      
      // Check if graphs/charts are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="activity-chart"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="story-stats-chart"]');
    });
  });

  test.describe('Community Events and Contests', () => {
    test('should participate in writing contests', async ({ page }) => {
      // Navigate to contests page
      await page.goto('/contests');
      
      // Assert active contests are displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="contest-item"]');
      
      // Join a contest
      await page.getByTestId('contest-item').first().getByTestId('join-contest-btn').click();
      
      // Create story for contest
      await page.getByTestId('create-contest-story-btn').click();
      
      const contestStory = E2ETestDataFactory.createTestStory({
        title: 'Contest Entry Story',
        description: 'My entry for the writing contest'
      });
      
      await page.getByTestId('story-title-input').fill(contestStory.title);
      await page.getByTestId('story-description-input').fill(contestStory.description);
      await page.getByTestId('contest-theme-select').selectOption('fantasy');
      await page.getByTestId('create-story-button').click();
      
      // Assert story created for contest
      await E2EAssertions.assertSuccessMessage(page, 'Contest entry submitted');
      await E2EAssertions.assertUrlMatches(page, /\/editor\/[a-zA-Z0-9-]+/);
    });

    test('should vote on contest entries', async ({ page, context }) => {
      // Setup second user
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Create contest entry with secondary user
      await secondUserPage.goto('/contests');
      await secondUserPage.getByTestId('contest-item').first().getByTestId('join-contest-btn').click();
      await secondUserPage.getByTestId('create-contest-story-btn').click();
      
      const entry = E2ETestDataFactory.createTestStory({
        title: 'Voting Test Entry'
      });
      await secondUserPage.getByTestId('story-title-input').fill(entry.title);
      await secondUserPage.getByTestId('create-story-button').click();
      
      // Primary user votes on contest entries
      await page.goto('/contests');
      await page.getByTestId('contest-item').first().getByTestId('view-entries-btn').click();
      
      // Vote on entry
      await page.getByTestId('contest-entry').first().getByTestId('vote-btn').click();
      
      // Assert vote registered
      await E2EAssertions.assertSuccessMessage(page, 'Vote submitted');
      await E2EAssertions.assertElementVisible(page, '[data-testid="vote-count"]', '1');
      
      await secondUserPage.close();
    });

    test('should organize community events', async ({ page }) => {
      // Navigate to events page
      await page.goto('/events');
      
      // Create a new community event
      await page.getByTestId('create-event-btn').click();
      
      await page.getByTestId('event-title-input').fill('Monthly Story Challenge');
      await page.getByTestId('event-description-textarea').fill('Join us for a monthly writing challenge!');
      await page.getByTestId('event-type-select').selectOption('challenge');
      await page.getByTestId('event-date-input').fill('2024-12-31');
      await page.getByTestId('create-event-btn').click();
      
      // Assert event created
      await E2EAssertions.assertSuccessMessage(page, 'Event created successfully');
      await E2EAssertions.assertElementVisible(page, '[data-testid="event-item"]', 'Monthly Story Challenge');
    });
  });

  test.describe('Content Discovery and Recommendations', () => {
    test('should get personalized story recommendations', async ({ page, context }) => {
      // Setup interaction history to generate recommendations
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Create stories with tags
      const taggedStory = E2ETestDataFactory.createTestStory({
        title: 'Fantasy Adventure',
        tags: ['fantasy', 'adventure', 'magic']
      });
      await E2EStoryHelper.createStory(secondUserPage, taggedStory);
      
      // Primary user interacts with fantasy stories
      await page.goto('/discover');
      await page.getByTestId('filter-tag').filter({ hasText: 'fantasy' }).click();
      await page.getByTestId('story-card').first().click();
      
      // Go to recommendations page
      await page.goto('/recommendations');
      
      // Assert personalized recommendations appear
      await E2EAssertions.assertElementVisible(page, '[data-testid="recommended-story"]');
      await E2EAssertions.assertElementVisible(page, '[data-testid="recommendation-reason"]', 'Based on your interest in fantasy');
      
      await secondUserPage.close();
    });

    test('should use advanced story discovery filters', async ({ page }) => {
      await page.goto('/discover');
      
      // Apply multiple filters
      await page.getByTestId('filter-genre-select').selectOption('fantasy');
      await page.getByTestId('filter-difficulty-select').selectOption('intermediate');
      await page.getByTestId('filter-length-select').selectOption('medium');
      await page.getByTestId('filter-rpg-toggle').check();
      
      // Apply filters
      await page.getByTestId('apply-filters-btn').click();
      
      // Assert filtered results
      await page.waitForLoadState('networkidle');
      await E2EAssertions.assertElementVisible(page, '[data-testid="filter-results-count"]');
      
      // Save filter preset
      await page.getByTestId('save-filter-preset-btn').click();
      await page.getByTestId('preset-name-input').fill('My Fantasy Preferences');
      await page.getByTestId('save-preset-btn').click();
      
      // Assert preset saved
      await E2EAssertions.assertSuccessMessage(page, 'Filter preset saved');
    });

    test('should create and manage story collections', async ({ page }) => {
      await page.goto('/collections');
      
      // Create new collection
      await page.getByTestId('create-collection-btn').click();
      await page.getByTestId('collection-name-input').fill('My Favorite Adventures');
      await page.getByTestId('collection-description-textarea').fill('A curated list of my favorite adventure stories');
      await page.getByTestId('collection-visibility-select').selectOption('public');
      await page.getByTestId('create-collection-btn').click();
      
      // Assert collection created
      await E2EAssertions.assertSuccessMessage(page, 'Collection created');
      await E2EAssertions.assertElementVisible(page, '[data-testid="collection-item"]', 'My Favorite Adventures');
      
      // Add story to collection
      await page.goto(`/stories/${testStoryId}`);
      await page.getByTestId('add-to-collection-btn').click();
      await page.getByTestId('collection-select').selectOption('My Favorite Adventures');
      await page.getByTestId('add-to-collection-confirm-btn').click();
      
      // Assert story added
      await E2EAssertions.assertSuccessMessage(page, 'Added to collection');
      
      // View collection
      await page.goto('/collections');
      await page.getByTestId('collection-item').click();
      await E2EAssertions.assertElementVisible(page, '[data-testid="collection-story"]', 'Social Interaction Test Story');
    });
  });

  test.describe('Privacy and Safety', () => {
    test('should manage privacy settings', async ({ page }) => {
      await page.goto('/profile/settings/privacy');
      
      // Configure privacy settings
      await page.getByTestId('profile-visibility-select').selectOption('friends-only');
      await page.getByTestId('story-visibility-default-select').selectOption('private');
      await page.getByTestId('activity-visibility-toggle').uncheck();
      await page.getByTestId('search-visibility-toggle').check();
      
      // Save privacy settings
      await page.getByTestId('save-privacy-settings-btn').click();
      
      // Assert settings saved
      await E2EAssertions.assertSuccessMessage(page, 'Privacy settings updated');
      
      // Verify settings persist
      await page.reload();
      await expect(page.getByTestId('profile-visibility-select')).toHaveValue('friends-only');
      await expect(page.getByTestId('activity-visibility-toggle')).not.toBeChecked();
    });

    test('should handle content warnings and age ratings', async ({ page }) => {
      // Create story with content warnings
      const matureStory = E2ETestDataFactory.createTestStory({
        title: 'Mature Content Story',
        description: 'A story with mature themes'
      });
      
      const matureStoryId = await E2EStoryHelper.createStory(page, matureStory);
      
      // Add content warnings
      await page.goto(`/editor/${matureStoryId}/settings`);
      await page.getByTestId('content-warning-toggle').check();
      await page.getByTestId('violence-warning-checkbox').check();
      await page.getByTestId('mature-themes-checkbox').check();
      await page.getByTestId('age-rating-select').selectOption('18+');
      await page.getByTestId('save-content-settings-btn').click();
      
      // Assert warnings saved
      await E2EAssertions.assertSuccessMessage(page, 'Content settings updated');
      
      // Publish and view story
      await E2EStoryHelper.publishStory(page);
      await page.goto(`/stories/${matureStoryId}`);
      
      // Assert content warning displayed
      await E2EAssertions.assertElementVisible(page, '[data-testid="content-warning"]', 'This story contains mature content');
      await E2EAssertions.assertElementVisible(page, '[data-testid="age-rating"]', '18+');
    });

    test('should implement user safety features', async ({ page, context }) => {
      // Setup second user for safety testing
      const secondUserPage = await context.newPage();
      await E2EAuthHelper.loginUser(secondUserPage, {
        identifier: secondaryUser.user.username,
        password: secondaryUser.user.password
      });
      
      // Report inappropriate user behavior
      await page.goto(`/users/${secondaryUser.user.username}`);
      await page.getByTestId('user-menu-btn').click();
      await page.getByTestId('report-user-btn').click();
      
      await page.getByTestId('report-reason-select').selectOption('harassment');
      await page.getByTestId('report-details-textarea').fill('User has been sending inappropriate messages');
      await page.getByTestId('submit-user-report-btn').click();
      
      // Assert report submitted
      await E2EAssertions.assertSuccessMessage(page, 'Report submitted to moderators');
      
      // Temporarily restrict user to prevent further issues
      await page.getByTestId('restrict-user-btn').click();
      await page.getByTestId('confirm-restrict-btn').click();
      
      // Assert user restricted
      await E2EAssertions.assertSuccessMessage(page, 'User interactions restricted');
      
      await secondUserPage.close();
    });
  });
});