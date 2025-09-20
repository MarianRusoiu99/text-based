import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  username: 'testuser_comprehensive',
  email: 'comprehensive@example.com',
  password: 'password123',
  displayName: 'Comprehensive Test User',
};

const testUser2 = {
  username: 'testuser2_comprehensive',
  email: 'comprehensive2@example.com',
  password: 'password123',
  displayName: 'Second Test User',
};

let authToken: string;
let refreshToken: string;
let userId: string;
let userId2: string;
let authToken2: string;
let storyId: string;
let chapterId: string;
let nodeId: string;
let choiceId: string;
let variableId: string;
let itemId: string;
let rpgTemplateId: string;
let sessionId: string;

test.describe('Comprehensive API Test Suite', () => {
  test.beforeAll(async () => {
    // Clean up database
    await prisma.userAchievement.deleteMany();
    await prisma.userFollow.deleteMany();
    await prisma.storyBookmark.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.savedGame.deleteMany();
    await prisma.playSession.deleteMany();
    await prisma.choice.deleteMany();
    await prisma.node.deleteMany();
    await prisma.storyVariable.deleteMany();
    await prisma.item.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.story.deleteMany();
    await prisma.rpgTemplate.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test.describe('1. Authentication Endpoints', () => {
    test('1.1. POST /auth/register - should register a new user', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/register`, {
        data: testUser,
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody).toHaveProperty('message', 'User registered successfully');
      expect(responseBody.data).toHaveProperty('user');
      expect(responseBody.data).toHaveProperty('accessToken');
      expect(responseBody.data).toHaveProperty('refreshToken');

      // Store tokens and user ID for subsequent tests
      authToken = responseBody.data.accessToken;
      refreshToken = responseBody.data.refreshToken;
      userId = responseBody.data.user.id;

      expect(responseBody.data.user.username).toBe(testUser.username);
      expect(responseBody.data.user.email).toBe(testUser.email);
    });

    test('1.2. POST /auth/register - should not register user with existing email', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/register`, {
        data: testUser, // Same user data
      });

      expect(response.status()).toBe(409);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error', 'Conflict');
      expect(responseBody).toHaveProperty('message', 'User with this email or username already exists');
    });

    test('1.3. POST /auth/login - should login with valid credentials', async ({ request }) => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await request.post(`${BASE_URL}/auth/login`, {
        data: loginData,
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody).toHaveProperty('message', 'Login successful');
      expect(responseBody.data).toHaveProperty('user');
      expect(responseBody.data).toHaveProperty('accessToken');
      expect(responseBody.data).toHaveProperty('refreshToken');
    });

    test('1.4. POST /auth/login - should not login with invalid credentials', async ({ request }) => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await request.post(`${BASE_URL}/auth/login`, {
        data: loginData,
      });

      expect(response.status()).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error', 'Unauthorized');
      expect(responseBody).toHaveProperty('message', 'Invalid credentials');
    });

    test('1.5. POST /auth/refresh - should refresh access token', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/refresh`, {
        data: { refreshToken },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('accessToken');
      expect(responseBody.data).toHaveProperty('refreshToken');

      // Update tokens for subsequent tests
      authToken = responseBody.data.accessToken;
      refreshToken = responseBody.data.refreshToken;
    });

    test('1.6. POST /auth/verify-email-test - should verify email for testing', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/verify-email-test`, {
        data: { email: testUser.email },
      });

      expect(response.status()).toBe(200);
    });

    test('1.7. POST /auth/change-password - should change password for authenticated user', async ({ request }) => {
      const changePasswordData = {
        currentPassword: testUser.password,
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const response = await request.post(`${BASE_URL}/auth/change-password`, {
        data: changePasswordData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      // Update password for subsequent tests
      testUser.password = 'newpassword123';
    });

    test('1.8. Register second user for social features testing', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/register`, {
        data: testUser2,
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      userId2 = responseBody.data.user.id;
      authToken2 = responseBody.data.accessToken;
    });
  });

  test.describe('2. User Management Endpoints', () => {
    test('2.1. GET /users/profile - should get authenticated user profile', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('id', userId);
      expect(responseBody.data).toHaveProperty('username', testUser.username);
      expect(responseBody.data).toHaveProperty('email', testUser.email);
    });

    test('2.2. PUT /users/profile - should update user profile', async ({ request }) => {
      const updateData = {
        displayName: 'Updated Display Name',
        bio: 'This is my test bio',
      };

      const response = await request.put(`${BASE_URL}/users/profile`, {
        data: updateData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.displayName).toBe(updateData.displayName);
      expect(responseBody.data.bio).toBe(updateData.bio);
    });

    test('2.3. GET /users/{userId} - should get public user profile', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/users/${userId}`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('id', userId);
      expect(responseBody.data).toHaveProperty('username', testUser.username);
      expect(responseBody.data).toHaveProperty('displayName', 'Updated Display Name');
      expect(responseBody.data).not.toHaveProperty('email'); // Should not include private info
    });
  });

  test.describe('3. RPG Template Endpoints', () => {
    test('3.1. POST /rpg-templates - should create RPG template', async ({ request }) => {
      const templateData = {
        name: 'Test D&D System',
        description: 'A test RPG template based on D&D mechanics',
        isPublic: true,
        config: {
          stats: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
          skills: ['athletics', 'stealth', 'perception', 'persuasion'],
          attributes: ['health', 'mana'],
          diceSystem: 'd20'
        }
      };

      const response = await request.post(`${BASE_URL}/rpg-templates`, {
        data: templateData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.name).toBe(templateData.name);
      rpgTemplateId = responseBody.data.id;
    });

    test('3.2. GET /rpg-templates - should get all public RPG templates', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/rpg-templates`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data.length).toBeGreaterThan(0);
    });

    test('3.3. GET /rpg-templates/{id} - should get specific RPG template', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/rpg-templates/${rpgTemplateId}`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.id).toBe(rpgTemplateId);
      expect(responseBody.data.name).toBe('Test D&D System');
    });
  });

  test.describe('4. Story Management Endpoints', () => {
    test('4.1. POST /stories - should create a new story', async ({ request }) => {
      const storyData = {
        title: 'Test Adventure Story',
        description: 'A comprehensive test adventure story',
        category: 'Fantasy',
        tags: ['adventure', 'fantasy', 'test'],
        visibility: 'public',
        rpgTemplateId: rpgTemplateId,
      };

      const response = await request.post(`${BASE_URL}/stories`, {
        data: storyData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.title).toBe(storyData.title);
      expect(responseBody.data.authorId).toBe(userId);
      storyId = responseBody.data.id;
    });

    test('4.2. GET /stories - should get all public stories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('stories');
      expect(Array.isArray(responseBody.data.stories)).toBe(true);
    });

    test('4.3. GET /stories/{id} - should get story by ID', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.id).toBe(storyId);
      expect(responseBody.data.title).toBe('Test Adventure Story');
    });

    test('4.4. PUT /stories/{id} - should update story', async ({ request }) => {
      const updateData = {
        title: 'Updated Test Adventure Story',
        description: 'Updated description for comprehensive testing',
        category: 'Adventure',
      };

      const response = await request.put(`${BASE_URL}/stories/${storyId}`, {
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

    test('4.5. POST /stories/{storyId}/chapters - should create a chapter', async ({ request }) => {
      const chapterData = {
        title: 'Chapter 1: The Beginning',
        description: 'The first chapter of our test story',
        order: 1,
      };

      const response = await request.post(`${BASE_URL}/stories/${storyId}/chapters`, {
        data: chapterData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.title).toBe(chapterData.title);
      chapterId = responseBody.data.id;
    });

    test('4.6. GET /stories/{storyId}/chapters - should get story chapters', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories/${storyId}/chapters`, {
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

    test('4.7. POST /stories/{storyId}/variables - should create story variable', async ({ request }) => {
      const variableData = {
        variableName: 'playerHealth',
        variableType: 'number',
        defaultValue: 100,
        description: 'Player health points',
      };

      const response = await request.post(`${BASE_URL}/stories/${storyId}/variables`, {
        data: variableData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.variableName).toBe(variableData.variableName);
      variableId = responseBody.data.id;
    });

    test('4.8. GET /stories/{storyId}/variables - should get story variables', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories/${storyId}/variables`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('4.9. POST /stories/{storyId}/items - should create story item', async ({ request }) => {
      const itemData = {
        name: 'Magic Sword',
        description: 'A powerful magical sword',
        type: 'weapon',
        properties: {
          damage: 10,
          durability: 100,
          magicType: 'fire'
        }
      };

      const response = await request.post(`${BASE_URL}/stories/${storyId}/items`, {
        data: itemData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.name).toBe(itemData.name);
      itemId = responseBody.data.id;
    });

    test('4.10. GET /stories/{storyId}/items - should get story items', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories/${storyId}/items`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });
  });

  test.describe('5. Node Management Endpoints', () => {
    test('5.1. POST /stories/{storyId}/nodes - should create story node', async ({ request }) => {
      const nodeData = {
        title: 'The Forest Entrance',
        content: 'You stand at the entrance of a dark, mysterious forest. Ancient trees tower above you, their branches intertwining to form a natural canopy that blocks most of the sunlight.',
        nodeType: 'story',
        chapterId: chapterId,
        characterName: 'Narrator',
        position: { x: 100, y: 100 }
      };

      const response = await request.post(`${BASE_URL}/stories/${storyId}/nodes`, {
        data: nodeData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.title).toBe(nodeData.title);
      nodeId = responseBody.data.id;
    });

    test('5.2. GET /stories/{storyId}/nodes - should get story nodes', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/stories/${storyId}/nodes`, {
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

    test('5.3. GET /nodes/{id} - should get specific node', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/nodes/${nodeId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.id).toBe(nodeId);
    });

    test('5.4. Create second node for choice testing', async ({ request }) => {
      const nodeData = {
        title: 'Deep in the Forest',
        content: 'You venture deeper into the forest and discover a clearing with a mysterious glowing stone.',
        nodeType: 'story',
        chapterId: chapterId,
        position: { x: 200, y: 200 }
      };

      const response = await request.post(`${BASE_URL}/stories/${storyId}/nodes`, {
        data: nodeData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);
      const responseBody = await response.json();
      // Store second node ID for choice creation
      test.info().annotations.push({ type: 'secondNodeId', description: responseBody.data.id });
    });
  });

  test.describe('6. Choice Management Endpoints', () => {
    let secondNodeId: string;

    test.beforeAll(async ({ request }) => {
      // Get the second node ID
      const nodesResponse = await request.get(`${BASE_URL}/stories/${storyId}/nodes`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const nodesData = await nodesResponse.json();
      secondNodeId = nodesData.data.find((node: any) => node.title === 'Deep in the Forest')?.id;
    });

    test('6.1. POST /nodes/{fromNodeId}/choices - should create choice', async ({ request }) => {
      const choiceData = {
        text: 'Enter the forest',
        toNodeId: secondNodeId,
        conditions: {},
        effects: { courage: 1 },
        order: 1
      };

      const response = await request.post(`${BASE_URL}/nodes/${nodeId}/choices`, {
        data: choiceData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.text).toBe(choiceData.text);
      choiceId = responseBody.data.id;
    });

    test('6.2. GET /choices/{id} - should get specific choice', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/choices/${choiceId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.id).toBe(choiceId);
    });

    test('6.3. PUT /choices/{choiceId} - should update choice', async ({ request }) => {
      const updateData = {
        text: 'Boldly enter the mysterious forest',
        effects: { courage: 2, experience: 5 }
      };

      const response = await request.put(`${BASE_URL}/choices/${choiceId}`, {
        data: updateData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.text).toBe(updateData.text);
    });
  });

  test.describe('7. Player/Gameplay Endpoints', () => {
    test('7.1. POST /stories/{id}/publish - should publish story first', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/stories/${storyId}/publish`, {
        data: { isPublished: true },
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(201);
    });

    test('7.2. POST /player/sessions - should start play session', async ({ request }) => {
      const sessionData = {
        storyId: storyId,
        characterName: 'Test Hero',
        initialStats: {
          strength: 15,
          dexterity: 12,
          constitution: 14,
          intelligence: 13,
          wisdom: 11,
          charisma: 10
        }
      };

      const response = await request.post(`${BASE_URL}/player/sessions`, {
        data: sessionData,
        headers: {
          'Authorization': `Bearer ${authToken2}`, // Use second user to play
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.storyId).toBe(storyId);
      sessionId = responseBody.data.id;
    });

    test('7.3. GET /player/sessions/{sessionId} - should get current node', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/player/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('currentNode');
      expect(responseBody.data).toHaveProperty('gameState');
    });

    test('7.4. POST /player/sessions/{sessionId}/choices - should make choice', async ({ request }) => {
      const choiceData = {
        choiceId: choiceId,
        additionalData: { playerNotes: 'Choosing to be brave' }
      };

      const response = await request.post(`${BASE_URL}/player/sessions/${sessionId}/choices`, {
        data: choiceData,
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('7.5. PATCH /player/sessions/{sessionId} - should update game state', async ({ request }) => {
      const updateData = {
        stats: { courage: 3, experience: 10 },
        inventory: ['torch', 'rope'],
        variables: { playerHealth: 95 }
      };

      const response = await request.patch(`${BASE_URL}/player/sessions/${sessionId}`, {
        data: updateData,
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('7.6. POST /player/sessions/{sessionId}/save - should save game', async ({ request }) => {
      const saveData = {
        saveName: 'Forest Entrance Save'
      };

      const response = await request.post(`${BASE_URL}/player/sessions/${sessionId}/save`, {
        data: saveData,
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('7.7. GET /player/saved-games - should get saved games', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/player/saved-games`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('7.8. GET /player/sessions - should get play sessions', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/player/sessions`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });
  });

  test.describe('8. Social Features Endpoints', () => {
    test('8.1. POST /social/users/{userId}/follow - should follow user', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/social/users/${userId}/follow`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('8.2. GET /social/users/{userId}/is-following - should check if following', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/users/${userId}/is-following`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.isFollowing).toBe(true);
    });

    test('8.3. GET /social/users/{userId}/followers - should get user followers', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/users/${userId}/followers`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('8.4. POST /social/stories/{storyId}/rate - should rate story', async ({ request }) => {
      const ratingData = {
        rating: 5,
        review: 'Amazing story! Really enjoyed the adventure and RPG elements.'
      };

      const response = await request.post(`${BASE_URL}/social/stories/${storyId}/rate`, {
        data: ratingData,
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('8.5. GET /social/stories/{storyId}/ratings - should get story ratings', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/stories/${storyId}/ratings`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('8.6. POST /social/stories/{storyId}/comments - should add comment', async ({ request }) => {
      const commentData = {
        content: 'Great story! Looking forward to more chapters.',
        parentCommentId: null
      };

      const response = await request.post(`${BASE_URL}/social/stories/${storyId}/comments`, {
        data: commentData,
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.content).toBe(commentData.content);
    });

    test('8.7. GET /social/stories/{storyId}/comments - should get story comments', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/stories/${storyId}/comments`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('8.8. POST /social/stories/{storyId}/bookmark - should bookmark story', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/social/stories/${storyId}/bookmark`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('8.9. GET /social/stories/{storyId}/is-bookmarked - should check if bookmarked', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/stories/${storyId}/is-bookmarked`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data.isBookmarked).toBe(true);
    });

    test('8.10. GET /social/bookmarks - should get user bookmarks', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/social/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${authToken2}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });
  });

  test.describe('9. Achievement Endpoints', () => {
    test('9.1. GET /achievements - should get all achievements', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/achievements`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('9.2. GET /achievements/user - should get user achievements', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/achievements/user`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('9.3. GET /achievements/stats - should get achievement stats', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/achievements/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('totalAchievements');
      expect(responseBody.data).toHaveProperty('unlockedAchievements');
    });
  });

  test.describe('10. Discovery Endpoints', () => {
    test('10.1. GET /discovery/stories - should discover stories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/stories?search=test&category=Fantasy`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody.data).toHaveProperty('stories');
      expect(Array.isArray(responseBody.data.stories)).toBe(true);
    });

    test('10.2. GET /discovery/featured - should get featured stories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/featured?limit=5`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('10.3. GET /discovery/trending - should get trending stories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/trending?limit=5`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('10.4. GET /discovery/recommended - should get recommended stories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/recommended?limit=5`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('10.5. GET /discovery/categories - should get categories', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/categories`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test('10.6. GET /discovery/tags - should get popular tags', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/discovery/tags?limit=10`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });
  });

  test.describe('11. Cleanup and Authentication Flow', () => {
    test('11.1. POST /auth/logout - should logout user', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth/logout`, {
        data: { refreshToken },
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
    });

    test('11.2. Should not access protected endpoint after logout', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(401);
    });
  });
});