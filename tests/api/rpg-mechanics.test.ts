import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe.serial('RPG Mechanics API', () => {
  let userId: string;
  let storyId: string;
  let startNodeId: string;
  let endNodeId: string;
  let healthVariableId: string;
  let potionItemId: string;
  let authToken: string;  test.beforeAll(async () => {
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
      username: 'rpg_testuser',
      email: 'rpg_test@example.com',
      password: 'password123',
      displayName: 'RPG Test User',
    };

    const registerResponse = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    expect(registerResponse.status).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData).toHaveProperty('success', true);
    expect(registerData.data).toHaveProperty('accessToken');
    authToken = registerData.data.accessToken;
    userId = registerData.data.user.id;

    // Create a test story
    const storyData = {
      title: 'RPG Mechanics Test Story',
      description: 'A test story for RPG mechanics API testing',
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
    // Clean up
    await prisma.choice.deleteMany();
    await prisma.node.deleteMany();
    await prisma.storyVariable.deleteMany();
    await prisma.item.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.story.deleteMany();
    await prisma.user.deleteMany();
  });

  test('should create story variables', async () => {
    const variableData = {
      variableName: 'player_health',
      variableType: 'integer',
      defaultValue: 100,
    };

    const response = await fetch(`http://localhost:3000/stories/${storyId}/variables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(variableData),
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.variableName).toBe('player_health');
    expect(result.data.variableType).toBe('integer');
    expect(result.data.defaultValue).toBe(100);

    healthVariableId = result.data.id;
  });

  test('should create story items', async () => {
    const itemData = {
      itemName: 'health_potion',
      description: 'Restores 50 health points',
    };

    const response = await fetch(`http://localhost:3000/stories/${storyId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(itemData),
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.itemName).toBe('health_potion');
    expect(result.data.description).toBe('Restores 50 health points');

    potionItemId = result.data.id;
  });

  test('should retrieve story variables and items', async () => {
    // Test variables
    const variablesResponse = await fetch(`http://localhost:3000/stories/${storyId}/variables`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(variablesResponse.status).toBe(200);
    const variablesResult = await variablesResponse.json();
    expect(variablesResult.success).toBe(true);
    expect(variablesResult.data).toHaveLength(1);
    expect(variablesResult.data[0].variableName).toBe('player_health');

    // Test items
    const itemsResponse = await fetch(`http://localhost:3000/stories/${storyId}/items`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(itemsResponse.status).toBe(200);
    const itemsResult = await itemsResponse.json();
    expect(itemsResult.success).toBe(true);
    expect(itemsResult.data).toHaveLength(1);
    expect(itemsResult.data[0].itemName).toBe('health_potion');
  });

  test('should create story nodes', async () => {
    // Create start node
    const startNodeData = {
      title: 'Story Start',
      content: { text: 'You wake up in a dark forest.' },
      position: { x: 100, y: 100 },
    };

    const startNodeResponse = await fetch(`http://localhost:3000/stories/${storyId}/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(startNodeData),
    });

    expect(startNodeResponse.status).toBe(201);
    const startNodeResult = await startNodeResponse.json();
    expect(startNodeResult.success).toBe(true);
    startNodeId = startNodeResult.data.id;

    // Create end node
    const endNodeData = {
      title: 'Good Ending',
      nodeType: 'ending',
      content: { text: 'You found your way out safely!' },
      position: { x: 300, y: 100 },
    };

    const endNodeResponse = await fetch(`http://localhost:3000/stories/${storyId}/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(endNodeData),
    });

    expect(endNodeResponse.status).toBe(201);
    const endNodeResult = await endNodeResponse.json();
    expect(endNodeResult.success).toBe(true);
    endNodeId = endNodeResult.data.id;
  });

  test('should create choice with conditions and effects', async () => {
    const choiceData = {
      toNodeId: endNodeId,
      choiceText: 'Use health potion to escape',
      conditions: {
        type: 'AND',
        conditions: [
          {
            type: 'VARIABLE',
            variableName: 'player_health',
            operator: '>',
            value: 50,
          },
          {
            type: 'ITEM',
            itemName: 'health_potion',
            operator: 'HAS',
          },
        ],
      },
      effects: [
        {
          type: 'VARIABLE',
          variableName: 'player_health',
          operation: 'ADD',
          value: 50,
        },
        {
          type: 'ITEM',
          itemName: 'health_potion',
          operation: 'REMOVE',
          quantity: 1,
        },
      ],
    };

    const response = await fetch(`http://localhost:3000/stories/nodes/${startNodeId}/choices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(choiceData),
    });

    if (response.status !== 201) {
      const errorText = await response.text();
      console.log('Choice creation error:', errorText);
    }
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.choiceText).toBe('Use health potion to escape');
    expect(result.data.conditions).toBeDefined();
    expect(result.data.effects).toBeDefined();
  });

  test('should retrieve choices for a node', async () => {
    const response = await fetch(`http://localhost:3000/choices/story/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].choiceText).toBe('Use health potion to escape');
    expect(result.data[0].fromNodeId).toBe(startNodeId);
    expect(result.data[0].toNodeId).toBe(endNodeId);
  });

  test('should test backend condition evaluation', async () => {
    // This would require implementing the game-mechanics service
    // For now, we'll just verify the data structure is correct
    const choicesResponse = await fetch(`http://localhost:3000/choices/story/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const choicesResult = await choicesResponse.json();
    const choice = choicesResult.data[0];

    // Verify conditions structure
    expect(choice.conditions.type).toBe('AND');
    expect(choice.conditions.conditions).toHaveLength(2);
    expect(choice.conditions.conditions[0].type).toBe('VARIABLE');
    expect(choice.conditions.conditions[0].variableName).toBe('player_health');
    expect(choice.conditions.conditions[1].type).toBe('ITEM');
    expect(choice.conditions.conditions[1].itemName).toBe('health_potion');

    // Verify effects structure
    expect(choice.effects).toHaveLength(2);
    expect(choice.effects[0].type).toBe('VARIABLE');
    expect(choice.effects[0].variableName).toBe('player_health');
    expect(choice.effects[0].operation).toBe('ADD');
    expect(choice.effects[0].value).toBe(50);
    expect(choice.effects[1].type).toBe('ITEM');
    expect(choice.effects[1].itemName).toBe('health_potion');
    expect(choice.effects[1].operation).toBe('REMOVE');
    expect(choice.effects[1].quantity).toBe(1);
  });
});