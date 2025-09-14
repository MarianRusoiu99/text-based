import { config } from 'dotenv';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

test.describe('Authentication API', () => {
  test.beforeAll(async () => {
    // Clean up
    await prisma.user.deleteMany();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test.describe('POST /auth/register', () => {
    test('should register a new user', async ({ request }) => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };

      const response = await request.post('http://localhost:3000/auth/register', {
        data: userData,
      });

      expect(response.status()).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success', true);
      expect(responseBody).toHaveProperty('message', 'User registered successfully');
      expect(responseBody.data).toHaveProperty('user');
      expect(responseBody.data).toHaveProperty('accessToken');
      expect(responseBody.data).toHaveProperty('refreshToken');
    });

    test('should not register user with existing email', async ({ request }) => {
      // First register a user
      const firstUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };

      await request.post('http://localhost:3000/auth/register', {
        data: firstUserData,
      });

      // Now try to register with the same email
      const userData = {
        username: 'testuser2',
        email: 'test@example.com', // Same email
        password: 'password123',
        displayName: 'Test User 2',
      };

      const response = await request.post('http://localhost:3000/auth/register', {
        data: userData,
      });

      expect(response.status()).toBe(409);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error', 'Conflict');
      expect(responseBody).toHaveProperty('message', 'User with this email or username already exists');
      expect(responseBody).toHaveProperty('statusCode', 409);
    });
  });

  test.describe('POST /auth/login', () => {
    test('should login with valid credentials', async ({ request }) => {
      // First register a user
      const registerData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };

      await request.post('http://localhost:3000/auth/register', {
        data: registerData,
      });

      // Now try to login
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request.post('http://localhost:3000/auth/login', {
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

    test('should not login with invalid credentials', async ({ request }) => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request.post('http://localhost:3000/auth/login', {
        data: loginData,
      });

      expect(response.status()).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error', 'Unauthorized');
      expect(responseBody).toHaveProperty('message', 'Invalid credentials');
      expect(responseBody).toHaveProperty('statusCode', 401);
    });
  });
});
