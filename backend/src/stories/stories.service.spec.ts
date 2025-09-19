import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StoriesService', () => {
  let service: StoriesService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      story: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      node: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      choice: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      chapter: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      storyVariable: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      item: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StoriesService>(StoriesService);
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNode', () => {
    it('should create a node successfully', async () => {
      const storyId = 'story-1';
      const userId = 'user-1';
      const createNodeDto = {
        title: 'Test Node',
        content: { text: 'Test content' },
        position: { x: 100, y: 200 },
      };
      const mockNode = { id: 'node-1', ...createNodeDto, storyId };

      prismaService.story.findUnique.mockResolvedValue({
        id: storyId,
        authorId: userId,
      });
      prismaService.node.create.mockResolvedValue(mockNode);

      const result = await service.createNode(
        storyId,
        userId,
        createNodeDto as any,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockNode);
      expect(prismaService.node.create).toHaveBeenCalledWith({
        data: { ...createNodeDto, storyId },
      });
    });

    it('should throw NotFoundException if story not found', async () => {
      prismaService.story.findUnique.mockResolvedValue(null);

      await expect(
        service.createNode('invalid-id', 'user-1', {} as any),
      ).rejects.toThrow('Story not found');
    });

    it('should throw ForbiddenException if user is not author', async () => {
      prismaService.story.findUnique.mockResolvedValue({
        id: 'story-1',
        authorId: 'other-user',
      });

      await expect(
        service.createNode('story-1', 'user-1', {} as any),
      ).rejects.toThrow('Access denied');
    });
  });

  describe('createChoice', () => {
    it('should create a choice successfully', async () => {
      const fromNodeId = 'node-1';
      const userId = 'user-1';
      const createChoiceDto = {
        toNodeId: 'node-2',
        choiceText: 'Test Choice',
      };
      const mockChoice = { id: 'choice-1', fromNodeId, ...createChoiceDto };

      prismaService.node.findUnique
        .mockResolvedValueOnce({
          id: fromNodeId,
          storyId: 'story-1',
          story: { id: 'story-1', authorId: userId },
        })
        .mockResolvedValueOnce({
          id: 'node-2',
          storyId: 'story-1',
        });
      prismaService.choice.create.mockResolvedValue(mockChoice);

      const result = await service.createChoice(
        fromNodeId,
        userId,
        createChoiceDto as any,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockChoice);
    });
  });
});
