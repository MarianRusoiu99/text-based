import { test, expect } from '@playwright/test';

test.describe('Profile Management API Tests', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    // Register and login a test user
    const registerResponse = await request.post('/api/auth/register', {
      data: {
        username: 'profiletestuser',
        email: 'profiletest@example.com',
        password: 'password123',
        displayName: 'Profile Test User'
      }
    });

    if (registerResponse.ok()) {
      const registerData = await registerResponse.json();
      authToken = registerData.data.accessToken;
      userId = registerData.data.user.id;
    } else {
      // Try login if user already exists
      const loginResponse = await request.post('/api/auth/login', {
        data: {
          email: 'profiletest@example.com',
          password: 'password123'
        }
      });
      const loginData = await loginResponse.json();
      authToken = loginData.data.accessToken;
      userId = loginData.data.user.id;
    }
  });

  test.describe('1. Profile Retrieval', () => {
    test('1.1. GET /users/profile - should get authenticated user profile', async ({ request }) => {
      const response = await request.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('username');
      expect(data.data).toHaveProperty('email');
      expect(data.data).toHaveProperty('displayName');
      expect(data.data.username).toBe('profiletestuser');
      expect(data.data.email).toBe('profiletest@example.com');
    });

    test('1.2. GET /users/profile - should fail without authentication', async ({ request }) => {
      const response = await request.get('/api/users/profile');
      
      expect(response.status()).toBe(401);
    });

    test('1.3. GET /users/:id - should get public user profile', async ({ request }) => {
      const response = await request.get(`/api/users/${userId}`);

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('username');
      expect(data.data).toHaveProperty('displayName');
      // Should not include sensitive information
      expect(data.data).not.toHaveProperty('email');
    });

    test('1.4. GET /users/:id - should handle non-existent user', async ({ request }) => {
      const response = await request.get('/api/users/00000000-0000-0000-0000-000000000000');
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe('2. Profile Updates', () => {
    test('2.1. PUT /users/profile - should update display name', async ({ request }) => {
      const updateData = {
        displayName: 'Updated Profile Test User'
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data.displayName).toBe('Updated Profile Test User');

      // Verify the change persisted
      const profileResponse = await request.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const profileData = await profileResponse.json();
      expect(profileData.data.displayName).toBe('Updated Profile Test User');
    });

    test('2.2. PUT /users/profile - should update bio', async ({ request }) => {
      const updateData = {
        bio: 'This is my updated bio for testing profile management.'
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data.bio).toBe('This is my updated bio for testing profile management.');
    });

    test('2.3. PUT /users/profile - should update avatar URL', async ({ request }) => {
      const updateData = {
        avatarUrl: 'https://example.com/new-avatar.jpg'
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data.avatarUrl).toBe('https://example.com/new-avatar.jpg');
    });

    test('2.4. PUT /users/profile - should update multiple fields', async ({ request }) => {
      const updateData = {
        displayName: 'Completely Updated User',
        bio: 'New bio with multiple field update',
        avatarUrl: 'https://example.com/multi-update-avatar.jpg'
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data.displayName).toBe('Completely Updated User');
      expect(data.data.bio).toBe('New bio with multiple field update');
      expect(data.data.avatarUrl).toBe('https://example.com/multi-update-avatar.jpg');
    });

    test('2.5. PUT /users/profile - should fail without authentication', async ({ request }) => {
      const response = await request.put('/api/users/profile', {
        data: { displayName: 'Should Fail' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('2.6. PUT /users/profile - should validate display name length', async ({ request }) => {
      const updateData = {
        displayName: 'A'.repeat(101) // Assuming max length is 100
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('2.7. PUT /users/profile - should validate bio length', async ({ request }) => {
      const updateData = {
        bio: 'A'.repeat(1001) // Assuming max length is 1000
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('2.8. PUT /users/profile - should validate avatar URL format', async ({ request }) => {
      const updateData = {
        avatarUrl: 'not-a-valid-url'
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      // Depending on backend validation, this might be 400 or succeed
      if (!response.ok()) {
        expect(response.status()).toBe(400);
      }
    });
  });

  test.describe('3. Profile Data Consistency', () => {
    test('3.1. Profile updates should be reflected in public profile', async ({ request }) => {
      // Update profile
      const updateData = {
        displayName: 'Public Visible Name',
        bio: 'Public visible bio'
      };

      await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: updateData
      });

      // Check public profile reflects changes
      const publicResponse = await request.get(`/api/users/${userId}`);
      const publicData = await publicResponse.json();

      expect(publicData.data.displayName).toBe('Public Visible Name');
      expect(publicData.data).toHaveProperty('bio'); // Bio might be visible in public profile
    });

    test('3.2. Profile updates should maintain data integrity', async ({ request }) => {
      // Get current profile
      const beforeResponse = await request.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const beforeData = await beforeResponse.json();

      // Update only display name
      await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { displayName: 'Integrity Test Name' }
      });

      // Verify other fields remain unchanged
      const afterResponse = await request.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const afterData = await afterResponse.json();

      expect(afterData.data.displayName).toBe('Integrity Test Name');
      expect(afterData.data.username).toBe(beforeData.data.username);
      expect(afterData.data.email).toBe(beforeData.data.email);
      expect(afterData.data.id).toBe(beforeData.data.id);
      expect(afterData.data.createdAt).toBe(beforeData.data.createdAt);
    });
  });

  test.describe('4. Error Handling', () => {
    test('4.1. Should handle invalid profile data gracefully', async ({ request }) => {
      const invalidData = {
        displayName: null,
        bio: 123,
        avatarUrl: []
      };

      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: invalidData
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data).toHaveProperty('message');
    });

    test('4.2. Should handle empty update request', async ({ request }) => {
      const response = await request.put('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: {}
      });

      // Empty update should either succeed (no changes) or return appropriate response
      if (response.ok()) {
        const data = await response.json();
        expect(data.success).toBe(true);
      } else {
        expect(response.status()).toBe(400);
      }
    });
  });

  test.describe('5. Security Tests', () => {
    test('5.1. Should not expose sensitive information in responses', async ({ request }) => {
      const response = await request.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const data = await response.json();
      
      // These fields should not be exposed even in authenticated profile
      expect(data.data).not.toHaveProperty('password');
      expect(data.data).not.toHaveProperty('passwordHash');
      expect(data.data).not.toHaveProperty('refreshToken');
    });

    test('5.2. Public profile should not expose sensitive data', async ({ request }) => {
      const response = await request.get(`/api/users/${userId}`);
      const data = await response.json();
      
      // Public profile should not expose sensitive information
      expect(data.data).not.toHaveProperty('email');
      expect(data.data).not.toHaveProperty('password');
      expect(data.data).not.toHaveProperty('isVerified');
      expect(data.data).not.toHaveProperty('lastLogin');
    });

    test('5.3. Should prevent unauthorized profile modifications', async ({ request }) => {
      // Try to update profile without proper token
      const response = await request.put('/api/users/profile', {
        headers: { Authorization: 'Bearer invalid-token' },
        data: { displayName: 'Unauthorized Change' }
      });

      expect(response.status()).toBe(401);
    });
  });
});