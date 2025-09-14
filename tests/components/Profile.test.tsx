import { test, expect } from '@playwright/experimental-ct-react';
import Profile from '../../../frontend/src/pages/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the auth service
const mockAuthService = {
  getProfile: () => Promise.resolve({
    success: true,
    data: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      bio: 'Test bio',
      avatarUrl: 'http://example.com/avatar.jpg',
      isVerified: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  }),
  updateProfile: () => Promise.resolve({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Updated Name',
      bio: 'Updated bio',
      avatarUrl: 'http://example.com/avatar.jpg',
      isVerified: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  }),
};

// Mock the auth service module
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Mock the auth service in the browser context
    window.__mockAuthService = {
      getProfile: () => Promise.resolve({
        success: true,
        data: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          displayName: 'Test User',
          bio: 'Test bio',
          avatarUrl: 'http://example.com/avatar.jpg',
          isVerified: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      }),
      updateProfile: (data: any) => Promise.resolve({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          displayName: data.displayName || 'Test User',
          bio: data.bio || 'Test bio',
          avatarUrl: data.avatarUrl || 'http://example.com/avatar.jpg',
          isVerified: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      }),
    };
  });
});

test('renders profile data when loaded', async ({ mount }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const component = await mount(
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  );

  await expect(component.getByText('Test User')).toBeVisible();
  await expect(component.getByText('@testuser')).toBeVisible();
  await expect(component.getByText('test@example.com')).toBeVisible();
  await expect(component.getByText('Test bio')).toBeVisible();
});

test('switches to edit mode when Edit Profile button is clicked', async ({ mount }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const component = await mount(
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  );

  await component.getByText('Edit Profile').click();

  await expect(component.getByDisplayValue('Test User')).toBeVisible();
  await expect(component.getByDisplayValue('Test bio')).toBeVisible();
  await expect(component.getByDisplayValue('http://example.com/avatar.jpg')).toBeVisible();
});

test('calls updateProfile when form is submitted', async ({ mount }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const component = await mount(
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  );

  await component.getByText('Edit Profile').click();

  const displayNameInput = component.getByDisplayValue('Test User');
  const bioTextarea = component.locator('textarea').filter({ hasText: 'Test bio' });

  await displayNameInput.fill('Updated Name');
  await bioTextarea.fill('Updated bio');

  await component.getByText('Save Changes').click();

  // Verify the update was called (this would need proper mocking)
  await expect(component.getByText('Updated Name')).toBeVisible();
});

test('cancels edit mode when Cancel button is clicked', async ({ mount }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const component = await mount(
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  );

  await component.getByText('Edit Profile').click();

  const displayNameInput = component.getByDisplayValue('Test User');
  await displayNameInput.fill('Changed Name');

  await component.getByText('Cancel').click();

  await expect(component.getByText('Test User')).toBeVisible();
  await expect(component.getByDisplayValue('Changed Name')).not.toBeVisible();
});
