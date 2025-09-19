import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Stories API', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async () => {
    // Clean up
    await prisma.choice.deleteMany();
    await prisma.node.deleteMany();
    await prisma.story.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get token
    const userData = {
      username: 'stories_testuser',
      email: 'stories_test@example.com',
      password: 'password123',
      displayName: 'Stories Test User',
    };

    const registerResponse = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const registerData = await registerResponse.json();
    authToken = registerData.data.accessToken;
    userId = registerData.data.user.id;
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /stories - should create a new story', async ({ request }) => {
    const storyData = {
      title: 'Test Story',
      description: 'A test story for API testing',
      visibility: 'public',
    };

    const response = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data.title).toBe(storyData.title);
    expect(responseBody.data.authorId).toBe(userId);
  });

  test('POST /stories - should not create story without authentication', async ({ request }) => {
    const storyData = {
      title: 'Unauthorized Story',
      description: 'Should fail',
    };

    const response = await request.post('http://localhost:3000/stories', {
      data: storyData,
    });

    expect(response.status()).toBe(401);
  });

  test('GET /stories - should get all public stories', async ({ request }) => {
    const response = await request.get('http://localhost:3000/stories');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(Array.isArray(responseBody.data.stories)).toBe(true);
    expect(responseBody.data.stories.length).toBe(0);
  });

  test('GET /stories/:id - should get story by id', async ({ request }) => {
    // Create a story for this test
    const storyData = {
      title: 'Test Story for GET by ID',
      description: 'A test story for GET by ID testing',
      visibility: 'public',
    };

    const createResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    const storyId = createBody.data.id;

    // Now test GET /stories/:id
    const response = await request.get(`http://localhost:3000/stories/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.id).toBe(storyId);
    expect(responseBody.data.title).toBe(storyData.title);
  });

  test('PUT /stories/:id - should update story', async ({ request }) => {
    // Create a story for this test
    const storyData = {
      title: 'Test Story for PUT',
      description: 'A test story for PUT testing',
      visibility: 'public',
    };

    const createResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    const storyId = createBody.data.id;

    // Now test PUT /stories/:id
    const updateData = {
      title: 'Updated Test Story',
      description: 'Updated description',
      visibility: 'private',
    };

    const response = await request.put(`http://localhost:3000/stories/${storyId}`, {
      data: updateData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.title).toBe(updateData.title);
  });

  test('POST /stories/:id/publish - should publish story', async ({ request }) => {
    // Create a story for this test
    const storyData = {
      title: 'Test Story for Publish',
      description: 'A test story for publish testing',
      visibility: 'public',
    };

    const createResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    const storyId = createBody.data.id;

    // Now test POST /stories/:id/publish
    const response = await request.post(`http://localhost:3000/stories/${storyId}/publish`, {
      data: { isPublished: true },
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
  });
});
