/**
 * Comprehensive test utilities following TDD principles and development plan specifications
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

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
      id: faker.string.uuid(),
      username: faker.internet.username().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      displayName: faker.person.fullName(),
      passwordHash: bcrypt.hashSync('TestPassword123!', 12),
      isVerified: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      bio: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatar(),
      lastLoginAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate a test story with realistic data
   */
  static createStory(authorId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      authorId,
      isPublished: false,
      visibility: 'private',
      tags: [faker.lorem.word(), faker.lorem.word()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      playCount: faker.number.int({ min: 0, max: 1000 }),
      averageRating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      ratingCount: faker.number.int({ min: 0, max: 100 }),
      ...overrides,
    };
  }

  /**
   * Generate an RPG template with flexible mechanics
   */
  static createRpgTemplate(creatorId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      creatorId,
      isPublic: true,
      mechanics: {
        stats: [
          { name: 'strength', type: 'integer', defaultValue: 10 },
          { name: 'intelligence', type: 'integer', defaultValue: 10 },
        ],
        skills: [
          { name: 'swordplay', type: 'integer', defaultValue: 0 },
        ],
        checkTypes: ['skill', 'stat', 'luck'],
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate a story variable
   */
  static createStoryVariable(storyId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      storyId,
      variableName: faker.lorem.word(),
      variableType: faker.helpers.arrayElement(['string', 'integer', 'boolean']),
      defaultValue: faker.lorem.word(),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate a story item
   */
  static createItem(storyId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      storyId,
      itemName: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      imageUrl: faker.image.url(),
      ...overrides,
    };
  }

  /**
   * Generate a story node
   */
  static createNode(storyId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      storyId,
      title: faker.lorem.words(3),
      content: faker.lorem.paragraphs(2),
      type: 'story',
      position: { x: faker.number.int({ min: 0, max: 1000 }), y: faker.number.int({ min: 0, max: 1000 }) },
      metadata: {},
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate a choice between nodes
   */
  static createChoice(fromNodeId: string, toNodeId: string, overrides: any = {}): any {
    return {
      id: faker.string.uuid(),
      fromNodeId,
      toNodeId,
      text: faker.lorem.sentence(),
      conditions: {},
      effects: {},
      order: faker.number.int({ min: 0, max: 10 }),
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
      id: faker.string.uuid(),
      userId,
      token: faker.string.alphanumeric(32),
      expiresAt: faker.date.future(),
      createdAt: faker.date.recent(),
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
    imports: any[] = []
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
  static resetAllMocks(mockPrisma: any, mockJwt: any, mockEmail?: any, mockLogger?: any) {
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
  static createErrorResponse(statusCode: number, message: string, errorCode?: string) {
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
  static assertPaginationMeta(meta: any, expectedPage: number, expectedLimit: number) {
    expect(meta).toHaveProperty('pagination');
    expect(meta.pagination).toHaveProperty('page', expectedPage);
    expect(meta.pagination).toHaveProperty('limit', expectedLimit);
    expect(meta.pagination).toHaveProperty('total');
    expect(meta.pagination).toHaveProperty('totalPages');
  }

  /**
   * Assert that error response follows standard format
   */
  static assertErrorResponse(response: any, expectedStatusCode: number, expectedMessage?: string) {
    expect(response).toHaveProperty('statusCode', expectedStatusCode);
    expect(response).toHaveProperty('message');
    
    if (expectedMessage) {
      expect(response.message).toContain(expectedMessage);
    }
  }

  /**
   * Assert that service method was called with correct parameters
   */
  static assertServiceMethodCall(mockMethod: jest.Mock, expectedArgs: any[], callIndex: number = 0) {
    expect(mockMethod).toHaveBeenCalledTimes(callIndex + 1);
    expect(mockMethod).toHaveBeenNthCalledWith(callIndex + 1, ...expectedArgs);
  }
}