import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Items API', () => {
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
      username: 'items_testuser',
      email: 'items_test@example.com',
      password: 'password123',
      displayName: 'Items Test User',
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
      title: 'Test Story for Items',
      description: 'A test story for item API testing',
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

  test('POST /stories/:storyId/items - should create a new item', async ({ request }) => {
    const itemData = {
      itemName: 'Magic Key',
      description: 'A shiny key that opens magical doors',
      imageUrl: 'https://example.com/key.png',
    };

    const response = await request.post(`http://localhost:3000/stories/${storyId}/items`, {
      data: itemData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data.itemName).toBe(itemData.itemName);
    expect(responseBody.data.description).toBe(itemData.description);
    expect(responseBody.data.storyId).toBe(storyId);
  });

  test('GET /stories/:storyId/items - should get all items for a story', async ({ request }) => {
    // First create an item
    const itemData = {
      itemName: 'Health Potion',
      description: 'Restores health when consumed',
    };

    await request.post(`http://localhost:3000/stories/${storyId}/items`, {
      data: itemData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const response = await request.get(`http://localhost:3000/stories/${storyId}/items`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);
    expect(responseBody.data[0]).toHaveProperty('itemName');
    expect(responseBody.data[0].storyId).toBe(storyId);
  });

  test('PUT /stories/:storyId/items/:itemId - should update an item', async ({ request }) => {
    // Create an item first
    const itemData = {
      itemName: 'Old Sword',
      description: 'A rusty old sword',
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/items`, {
      data: itemData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const itemId = createResponseBody.data.id;

    const updateData = {
      itemName: 'Legendary Sword',
      description: 'A powerful sword with magical properties',
      imageUrl: 'https://example.com/sword.png',
    };

    const response = await request.put(`http://localhost:3000/stories/${storyId}/items/${itemId}`, {
      data: updateData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.itemName).toBe(updateData.itemName);
    expect(responseBody.data.description).toBe(updateData.description);
    expect(responseBody.data.imageUrl).toBe(updateData.imageUrl);
  });

  test('DELETE /stories/:storyId/items/:itemId - should delete an item', async ({ request }) => {
    // Create an item first
    const itemData = {
      itemName: 'Temporary Item',
      description: 'This item will be deleted',
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/items`, {
      data: itemData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const itemId = createResponseBody.data.id;

    const response = await request.delete(`http://localhost:3000/stories/${storyId}/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.message).toBe('Item deleted successfully');
  });
});
