/**
 * Comprehensive test utilities following TDD principles and development plan specifications
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
// Using hardcoded values instead of faker to avoid ES module import issues

// Mock types for better type safety
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

/**
 * Comprehensive Prisma service mock with all database operations
 * Following provider-agnostic design principles
 */
export const createMockPrismaService = () => {
  const mockTable = () => ({
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  });

  return {
    // User operations
    user: mockTable(),
    // Story operations
    story: mockTable(),

    // RPG Template operations
    rpgTemplate: mockTable(),

    // Story Variable operations
    storyVariable: mockTable(),

    // Item operations
    item: mockTable(),

    // Node operations
    node: mockTable(),

    // Choice operations
    choice: mockTable(),

    // Social features
    userFollow: mockTable(),
    storyBookmark: mockTable(),
    rating: mockTable(),
    comment: mockTable(),

    // Authentication tokens
    verificationToken: mockTable(),
    passwordResetToken: mockTable(),
    refreshToken: mockTable(),

    // Achievements
    achievement: mockTable(),
    userAchievement: mockTable(),

    // Player session data
    playSession: mockTable(),
    savedGame: mockTable(),

    // Analytics
    choiceAnalytics: mockTable(),

    // Transaction support
    $transaction: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
  };
};

/**
 * Mock JWT service for authentication testing
 */
export const createMockJwtService = (): MockType<JwtService> => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
});

/**
 * Mock email provider interface for testing email functionality
 */
export const createMockEmailProvider = () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
});

/**
 * Mock logger provider interface for testing logging functionality
 */
export const createMockLoggerProvider = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

/**
 * Mock cache service for testing caching functionality
 */
export const createMockCacheService = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  keys: jest.fn(),
  ttl: jest.fn(),
});

/**
 * Test data factories using faker for consistent test data generation
 */
export class TestDataFactory {
  /**
   * Generate a test user with realistic data
   */
  static createUser(overrides: any = {}): any {
    return {
      id: 'user-test-123',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      bio: 'This is a test user bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      lastLoginAt: new Date('2023-01-02'),
      ...overrides,
    };
  }

  /**
   * Generate a test story with realistic data
   */
  static createStory(authorId: string, overrides: any = {}): any {
    return {
      id: 'story-test-123',
      title: 'Test Adventure Story',
      description: 'This is a test story for unit testing purposes',
      authorId,
      isPublished: false,
      visibility: 'private',
      tags: ['adventure', 'test'],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      playCount: 100,
      averageRating: 4.5,
      ratingCount: 20,
      ...overrides,
    };
  }

  /**
   * Generate an RPG template with flexible mechanics
   */
  static createRpgTemplate(creatorId: string, overrides: any = {}): any {
    return {
      id: 'rpg-template-123',
      name: 'Test RPG Template',
      description: 'This is a test RPG template for unit testing',
      creatorId,
      isPublic: true,
      mechanics: {
        stats: [
          { name: 'strength', type: 'integer', defaultValue: 10 },
          { name: 'intelligence', type: 'integer', defaultValue: 10 },
        ],
        skills: [{ name: 'swordplay', type: 'integer', defaultValue: 0 }],
        checkTypes: ['skill', 'stat', 'luck'],
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      ...overrides,
    };
  }

  /**
   * Generate a story variable
   */
  static createStoryVariable(storyId: string, overrides: any = {}): any {
    return {
      id: 'variable-test-123',
      storyId,
      variableName: 'testVariable',
      variableType: 'string',
      defaultValue: 'testValue',
      description: 'This is a test variable',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      ...overrides,
    };
  }

  /**
   * Generate a story item
   */
  static createItem(storyId: string, overrides: any = {}): any {
    return {
      id: 'item-test-123',
      storyId,
      itemName: 'Test Item',
      description: 'This is a test item for unit testing',
      imageUrl: 'https://example.com/test-image.jpg',
      ...overrides,
    };
  }

  /**
   * Generate a story node
   */
  static createNode(storyId: string, overrides: any = {}): any {
    return {
      id: 'node-test-123',
      storyId,
      title: 'Test Story Node',
      content:
        'This is test content for a story node. It contains the narrative text that players will read.',
      type: 'story',
      position: { x: 100, y: 200 },
      metadata: {},
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      ...overrides,
    };
  }

  /**
   * Generate a choice between nodes
   */
  static createChoice(
    fromNodeId: string,
    toNodeId: string,
    overrides: any = {},
  ): any {
    return {
      id: 'choice-test-123',
      fromNodeId,
      toNodeId,
      text: 'This is a test choice option',
      conditions: {},
      effects: {},
      order: 1,
      ...overrides,
    };
  }

  /**
   * Generate JWT tokens for testing
   */
  static createJwtTokens(userId: string): any {
    return {
      accessToken: `test.access.token.${userId}`,
      refreshToken: `test.refresh.token.${userId}`,
    };
  }

  /**
   * Generate verification token
   */
  static createVerificationToken(userId: string): any {
    return {
      id: 'token-test-123',
      userId,
      token: 'test-verification-token-12345678',
      expiresAt: new Date('2023-12-31'),
      createdAt: new Date('2023-01-01'),
    };
  }
}

/**
 * Utility functions for test setup and teardown
 */
export class TestUtils {
  /**
   * Create a test module with common providers mocked
   */
  static async createTestModule(
    providers: any[],
    imports: any[] = [],
  ): Promise<TestingModule> {
    return Test.createTestingModule({
      imports,
      providers: [
        ...providers,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
        {
          provide: JwtService,
          useValue: createMockJwtService(),
        },
      ],
    }).compile();
  }

  /**
   * Setup authenticated user for testing
   */
  static setupAuthenticatedUser(mockPrisma: any, user: any) {
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.findFirst.mockResolvedValue(user);
    return user;
  }

  /**
   * Setup mock responses for common database operations
   */
  static setupCommonMocks(mockPrisma: any) {
    // Default empty responses
    mockPrisma.story.findMany.mockResolvedValue([]);
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.rpgTemplate.findMany.mockResolvedValue([]);

    // Default count responses
    mockPrisma.story.count.mockResolvedValue(0);
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.rpgTemplate.count.mockResolvedValue(0);
  }

  /**
   * Reset all mocks to clean state
   */
  static resetAllMocks(
    mockPrisma: any,
    mockJwt: any,
    mockEmail?: any,
    mockLogger?: any,
  ) {
    jest.clearAllMocks();

    // Reset Prisma mocks
    Object.values(mockPrisma).forEach((table: any) => {
      if (typeof table === 'object') {
        Object.values(table).forEach((method: any) => {
          if (jest.isMockFunction(method)) {
            method.mockReset();
          }
        });
      }
    });

    // Reset JWT mocks
    Object.values(mockJwt).forEach((method: any) => {
      if (jest.isMockFunction(method)) {
        method.mockReset();
      }
    });

    // Reset additional service mocks
    if (mockEmail) {
      Object.values(mockEmail).forEach((method: any) => {
        if (jest.isMockFunction(method)) {
          method.mockReset();
        }
      });
    }

    if (mockLogger) {
      Object.values(mockLogger).forEach((method: any) => {
        if (jest.isMockFunction(method)) {
          method.mockReset();
        }
      });
    }
  }

  /**
   * Create error response for testing error handling
   */
  static createErrorResponse(
    statusCode: number,
    message: string,
    errorCode?: string,
  ) {
    return {
      statusCode,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create success response for testing API responses
   */
  static createSuccessResponse(data: any, message?: string, meta?: any) {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully',
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }
}

/**
 * Test assertion helpers for common validation patterns
 */
export class TestAssertions {
  /**
   * Assert that a response follows the standard API format
   */
  static assertApiResponse(response: any, expectSuccess: boolean = true) {
    expect(response).toHaveProperty('success', expectSuccess);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('message');

    if (response.meta) {
      expect(response.meta).toHaveProperty('timestamp');
    }
  }

  /**
   * Assert that pagination data is properly formatted
   */
  static assertPaginationMeta(
    meta: any,
    expectedPage: number,
    expectedLimit: number,
  ) {
    expect(meta).toHaveProperty('pagination');
    expect(meta.pagination).toHaveProperty('page', expectedPage);
    expect(meta.pagination).toHaveProperty('limit', expectedLimit);
    expect(meta.pagination).toHaveProperty('total');
    expect(meta.pagination).toHaveProperty('totalPages');
  }

  /**
   * Assert that error response follows standard format
   */
  static assertErrorResponse(
    response: any,
    expectedStatusCode: number,
    expectedMessage?: string,
  ) {
    expect(response).toHaveProperty('statusCode', expectedStatusCode);
    expect(response).toHaveProperty('message');

    if (expectedMessage) {
      expect(response.message).toContain(expectedMessage);
    }
  }

  /**
   * Assert that service method was called with correct parameters
   */
  static assertServiceMethodCall(
    mockMethod: jest.Mock,
    expectedArgs: any[],
    callIndex: number = 0,
  ) {
    expect(mockMethod).toHaveBeenCalledTimes(callIndex + 1);
    expect(mockMethod).toHaveBeenNthCalledWith(callIndex + 1, ...expectedArgs);
  }
}
