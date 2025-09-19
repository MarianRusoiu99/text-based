import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Nodes API', () => {
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
      username: 'nodes_testuser',
      email: 'nodes_test@example.com',
      password: 'password123',
      displayName: 'Nodes Test User',
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

  test('POST /nodes - should create a new node', async ({ request }) => {
    // Create a story first
    const storyData = {
      title: 'Test Story for Node',
      description: 'A test story for node testing',
      visibility: 'public',
    };

    const storyResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(storyResponse.status()).toBe(201);
    const storyBody = await storyResponse.json();
    const storyId = storyBody.data.id;

    // Now create a node
    const nodeData = {
      storyId,
      title: 'Test Node',
      content: {
        text: 'This is a test node content',
        character: 'Narrator',
        background: 'A dark forest',
      },
      position: { x: 100, y: 100 },
    };

    const response = await request.post('http://localhost:3000/nodes', {
      data: nodeData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data.title).toBe(nodeData.title);
    expect(responseBody.data.storyId).toBe(storyId);
  });

  test('GET /nodes/story/:storyId - should get all nodes for a story', async ({ request }) => {
    // Create a story and node for this test
    const storyData = {
      title: 'Test Story for GET Nodes',
      description: 'A test story for getting nodes',
      visibility: 'public',
    };

    const storyResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(storyResponse.status()).toBe(201);
    const storyBody = await storyResponse.json();
    const testStoryId = storyBody.data.id;

    // Create a node for the story
    const nodeData = {
      storyId: testStoryId,
      title: 'Test Node for GET',
      content: {
        text: 'This is a test node content',
        character: 'Narrator',
        background: 'A dark forest',
      },
      position: { x: 100, y: 100 },
    };

    const nodeResponse = await request.post('http://localhost:3000/nodes', {
      data: nodeData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(nodeResponse.status()).toBe(201);

    // Now test GET /nodes/story/:storyId
    const response = await request.get(`http://localhost:3000/nodes/story/${testStoryId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);
  });

  test('GET /nodes/:id - should get node by id', async ({ request }) => {
    // Create a story and node for this test
    const storyData = {
      title: 'Test Story for GET Node by ID',
      description: 'A test story for getting node by id',
      visibility: 'public',
    };

    const storyResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(storyResponse.status()).toBe(201);
    const storyBody = await storyResponse.json();
    const testStoryId = storyBody.data.id;

    // Create a node for the story
    const nodeData = {
      storyId: testStoryId,
      title: 'Test Node for GET by ID',
      content: {
        text: 'This is a test node content',
        character: 'Narrator',
        background: 'A dark forest',
      },
      position: { x: 100, y: 100 },
    };

    const nodeResponse = await request.post('http://localhost:3000/nodes', {
      data: nodeData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(nodeResponse.status()).toBe(201);
    const nodeBody = await nodeResponse.json();
    const testNodeId = nodeBody.data.id;

    // Now test GET /nodes/:id
    const response = await request.get(`http://localhost:3000/nodes/${testNodeId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody.data).toHaveProperty('id', testNodeId);
    expect(responseBody.data.title).toBe(nodeData.title);
  });

  test('PATCH /nodes/:id - should update node', async ({ request }) => {
    // Create a story and node for this test
    const storyData = {
      title: 'Test Story for PATCH Node',
      description: 'A test story for patching node',
      visibility: 'public',
    };

    const storyResponse = await request.post('http://localhost:3000/stories', {
      data: storyData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(storyResponse.status()).toBe(201);
    const storyBody = await storyResponse.json();
    const testStoryId = storyBody.data.id;

    // Create a node for the story
    const nodeData = {
      storyId: testStoryId,
      title: 'Test Node for PATCH',
      content: {
        text: 'This is a test node content',
        character: 'Narrator',
        background: 'A dark forest',
      },
      position: { x: 100, y: 100 },
    };

    const nodeResponse = await request.post('http://localhost:3000/nodes', {
      data: nodeData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(nodeResponse.status()).toBe(201);
    const nodeBody = await nodeResponse.json();
    const testNodeId = nodeBody.data.id;

    // Now test PATCH /nodes/:id
    const updateData = {
      title: 'Updated Test Node',
      content: {
        text: 'Updated content',
        character: 'Updated Character',
      },
    };

    const response = await request.patch(`http://localhost:3000/nodes/${testNodeId}`, {
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
});
