import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Story Variables API', () => {
  let authToken: string;
  let userId: string;
  let storyId: string;

  test.beforeAll(async () => {
    // Clean up
    await prisma.choice.deleteMany();
    await prisma.node.deleteMany();
    await prisma.storyVariable.deleteMany();
    await prisma.item.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.story.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get token
    const userData = {
      username: 'variables_testuser',
      email: 'variables_test@example.com',
      password: 'password123',
      displayName: 'Variables Test User',
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

    // Create a test story
    const storyData = {
      title: 'Test Story for Variables',
      description: 'A test story for variable API testing',
      visibility: 'public',
    };

    const storyResponse = await fetch('http://localhost:3000/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(storyData),
    });

    const storyResponseData = await storyResponse.json();
    storyId = storyResponseData.data.id;
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /stories/:storyId/variables - should create a new story variable', async ({ request }) => {
    const variableData = {
      variableName: 'hasKey',
      variableType: 'boolean',
      defaultValue: false,
    };

    const response = await request.post(`http://localhost:3000/stories/${storyId}/variables`, {
      data: variableData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data.variableName).toBe(variableData.variableName);
    expect(responseBody.data.variableType).toBe(variableData.variableType);
    expect(responseBody.data.storyId).toBe(storyId);
  });

  test('GET /stories/:storyId/variables - should get all variables for a story', async ({ request }) => {
    // First create a variable
    const variableData = {
      variableName: 'playerHealth',
      variableType: 'integer',
      defaultValue: 100,
    };

    await request.post(`http://localhost:3000/stories/${storyId}/variables`, {
      data: variableData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const response = await request.get(`http://localhost:3000/stories/${storyId}/variables`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);
    expect(responseBody.data[0]).toHaveProperty('variableName');
    expect(responseBody.data[0].storyId).toBe(storyId);
  });

  test('PUT /stories/:storyId/variables/:variableId - should update a story variable', async ({ request }) => {
    // Create a variable first
    const variableData = {
      variableName: 'tempVar',
      variableType: 'string',
      defaultValue: 'default',
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/variables`, {
      data: variableData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const variableId = createResponseBody.data.id;

    const updateData = {
      variableName: 'updatedVar',
      variableType: 'string',
      defaultValue: 'updated',
    };

    const response = await request.put(`http://localhost:3000/stories/${storyId}/variables/${variableId}`, {
      data: updateData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.variableName).toBe(updateData.variableName);
    expect(responseBody.data.defaultValue).toBe(updateData.defaultValue);
  });

  test('DELETE /stories/:storyId/variables/:variableId - should delete a story variable', async ({ request }) => {
    // Create a variable first
    const variableData = {
      variableName: 'toDelete',
      variableType: 'boolean',
      defaultValue: true,
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/variables`, {
      data: variableData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const variableId = createResponseBody.data.id;

    const response = await request.delete(`http://localhost:3000/stories/${storyId}/variables/${variableId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.message).toBe('Story variable deleted successfully');
  });
});
