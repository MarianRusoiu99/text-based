import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Chapters API', () => {
  let authToken: string;
  let userId: string;
  let storyId: string;

  test.beforeAll(async () => {
    // Clean up
    await prisma.choice.deleteMany();
    await prisma.node.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.story.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get token
    const userData = {
      username: 'chapters_testuser',
      email: 'chapters_test@example.com',
      password: 'password123',
      displayName: 'Chapters Test User',
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
      title: 'Test Story for Chapters',
      description: 'A test story for chapter API testing',
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

  test('POST /stories/:storyId/chapters - should create a new chapter', async ({ request }) => {
    const chapterData = {
      title: 'Chapter 1: The Beginning',
      description: 'The first chapter of our story',
      chapterOrder: 1,
      isPublished: false,
    };

    const response = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data.title).toBe(chapterData.title);
    expect(responseBody.data.storyId).toBe(storyId);
    expect(responseBody.data.chapterOrder).toBe(chapterData.chapterOrder);
  });

  test('POST /stories/:storyId/chapters - should not create chapter without authentication', async ({ request }) => {
    const chapterData = {
      title: 'Unauthorized Chapter',
      description: 'Should fail',
      chapterOrder: 2,
    };

    const response = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
    });

    expect(response.status()).toBe(401);
  });

  test('GET /stories/:storyId/chapters - should get all chapters for a story', async ({ request }) => {
    // First create a chapter
    const chapterData = {
      title: 'Chapter for GET test',
      description: 'A chapter for testing GET endpoint',
      chapterOrder: 1,
    };

    await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const response = await request.get(`http://localhost:3000/stories/${storyId}/chapters`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);
    expect(responseBody.data[0]).toHaveProperty('title');
    expect(responseBody.data[0].storyId).toBe(storyId);
  });

  test('GET /stories/:storyId/chapters/:chapterId - should get chapter by id', async ({ request }) => {
    // Create a chapter first
    const chapterData = {
      title: 'Chapter for GET by ID test',
      description: 'A chapter for testing GET by ID endpoint',
      chapterOrder: 2,
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const chapterId = createResponseBody.data.id;

    const response = await request.get(`http://localhost:3000/stories/${storyId}/chapters/${chapterId}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.id).toBe(chapterId);
    expect(responseBody.data.title).toBe(chapterData.title);
    expect(responseBody.data.storyId).toBe(storyId);
  });

  test('PUT /stories/:storyId/chapters/:chapterId - should update a chapter', async ({ request }) => {
    // Create a chapter first
    const chapterData = {
      title: 'Chapter to Update',
      description: 'Original description',
      chapterOrder: 3,
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const chapterId = createResponseBody.data.id;

    const updateData = {
      title: 'Updated Chapter Title',
      description: 'Updated description',
      chapterOrder: 4,
      isPublished: true,
    };

    const response = await request.put(`http://localhost:3000/stories/${storyId}/chapters/${chapterId}`, {
      data: updateData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data.title).toBe(updateData.title);
    expect(responseBody.data.description).toBe(updateData.description);
    expect(responseBody.data.chapterOrder).toBe(updateData.chapterOrder);
    expect(responseBody.data.isPublished).toBe(updateData.isPublished);
  });

  test('DELETE /stories/:storyId/chapters/:chapterId - should delete a chapter', async ({ request }) => {
    // Create a chapter first
    const chapterData = {
      title: 'Chapter to Delete',
      description: 'This chapter will be deleted',
      chapterOrder: 5,
    };

    const createResponse = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapterData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const createResponseBody = await createResponse.json();
    const chapterId = createResponseBody.data.id;

    const response = await request.delete(`http://localhost:3000/stories/${storyId}/chapters/${chapterId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.message).toBe('Chapter deleted successfully');
  });

  test('POST /stories/:storyId/chapters/reorder - should reorder chapters', async ({ request }) => {
    // Create multiple chapters with high order numbers to avoid conflicts
    const chapter1Data = {
      title: 'Chapter 1',
      description: 'First chapter',
      chapterOrder: 1001,
    };

    const chapter2Data = {
      title: 'Chapter 2',
      description: 'Second chapter',
      chapterOrder: 1002,
    };

    const create1Response = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapter1Data,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const create2Response = await request.post(`http://localhost:3000/stories/${storyId}/chapters`, {
      data: chapter2Data,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(create1Response.status()).toBe(201);
    expect(create2Response.status()).toBe(201);

    const chapter1Body = await create1Response.json();
    const chapter2Body = await create2Response.json();

    expect(chapter1Body.success).toBe(true);
    expect(chapter2Body.success).toBe(true);

    const chapterId1 = chapter1Body.data.id;
    const chapterId2 = chapter2Body.data.id;

    // Reorder chapters (swap their order)
    const reorderData = {
      chapterOrders: [
        { id: chapterId1, order: 1002 },
        { id: chapterId2, order: 1001 },
      ],
    };

    const response = await request.post(`http://localhost:3000/stories/${storyId}/chapters/reorder`, {
      data: reorderData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.message).toBe('Chapters reordered successfully');
  });
});
