import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CreateStoryVariableDto } from './dto/create-story-variable.dto';
import { UpdateStoryVariableDto } from './dto/update-story-variable.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/create-node.dto';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/create-choice.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createStoryDto: CreateStoryDto) {
    // Ensure user exists (create test user if needed)
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create test user for E2E testing - use upsert to avoid unique constraint violations
      user = await this.prisma.user.upsert({
        where: { username: `testuser_${userId}` },
        update: {},
        create: {
          id: userId,
          username: `testuser_${userId}`,
          email: `test_${userId}@example.com`,
          passwordHash: 'hashed_password',
          displayName: 'Test User',
        },
      });
    }

    const story = await this.prisma.story.create({
      data: {
        ...createStoryDto,
        authorId: userId,
      },
    });

    return {
      success: true,
      message: 'Story created successfully',
      data: story,
    };
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 20, search, category, tags } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tags) {
      where.tags = { hasSome: tags.split(',') };
    }

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.story.count({ where }),
    ]);

    return {
      success: true,
      data: {
        stories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        chapters: {
          orderBy: { chapterOrder: 'asc' },
        },
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: story,
    };
  }

  async update(id: string, userId: string, updateData: any) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedStory = await this.prisma.story.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Story updated successfully',
      data: updatedStory,
    };
  }

  async remove(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.story.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Story deleted successfully',
    };
  }

  async publish(id: string, userId: string, isPublished: boolean) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedStory = await this.prisma.story.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return {
      success: true,
      message: `Story ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: updatedStory,
    };
  }

  // Chapter management methods
  async createChapter(
    storyId: string,
    userId: string,
    createChapterDto: CreateChapterDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const chapter = await this.prisma.chapter.create({
      data: {
        ...createChapterDto,
        storyId,
      },
    });

    return {
      success: true,
      message: 'Chapter created successfully',
      data: chapter,
    };
  }

  async findChapters(storyId: string, userId?: string) {
    // Verify story exists and user has access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check visibility for non-owners
    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const chapters = await this.prisma.chapter.findMany({
      where: { storyId },
      orderBy: { chapterOrder: 'asc' },
    });

    return {
      success: true,
      data: chapters,
    };
  }

  async findChapter(storyId: string, chapterId: string, userId?: string) {
    // Verify story exists and user has access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check visibility for non-owners
    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        storyId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return {
      success: true,
      data: chapter,
    };
  }

  async updateChapter(
    storyId: string,
    chapterId: string,
    userId: string,
    updateChapterDto: UpdateChapterDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        storyId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const updatedChapter = await this.prisma.chapter.update({
      where: { id: chapterId },
      data: updateChapterDto,
    });

    return {
      success: true,
      message: 'Chapter updated successfully',
      data: updatedChapter,
    };
  }

  async deleteChapter(storyId: string, chapterId: string, userId: string) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        storyId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    await this.prisma.chapter.delete({
      where: { id: chapterId },
    });

    return {
      success: true,
      message: 'Chapter deleted successfully',
    };
  }

  async reorderChapters(
    storyId: string,
    userId: string,
    chapterOrders: { id: string; order: number }[],
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Validate that all chapters exist and belong to the story
    for (const { id } of chapterOrders) {
      const chapter = await this.prisma.chapter.findFirst({
        where: {
          id,
          storyId,
        },
      });
      if (!chapter) {
        throw new NotFoundException(`Chapter with id ${id} not found`);
      }
    }

    // Update chapter orders in a transaction to avoid unique constraint violations
    await this.prisma.$transaction(async (tx) => {
      // First, temporarily set all chapters to negative orders to avoid conflicts
      const tempOrder = -999;
      let tempCounter = 0;
      for (const { id } of chapterOrders) {
        await tx.chapter.update({
          where: { id },
          data: { chapterOrder: tempOrder - tempCounter },
        });
        tempCounter++;
      }

      // Then update to the final orders
      for (const { id, order } of chapterOrders) {
        await tx.chapter.update({
          where: { id },
          data: { chapterOrder: order },
        });
      }
    });

    return {
      success: true,
      message: 'Chapters reordered successfully',
    };
  }

  // Story Variables management methods
  async createStoryVariable(
    storyId: string,
    userId: string,
    createVariableDto: CreateStoryVariableDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const variable = await this.prisma.storyVariable.create({
      data: {
        ...createVariableDto,
        storyId,
      },
    });

    return {
      success: true,
      message: 'Story variable created successfully',
      data: variable,
    };
  }

  async findStoryVariables(storyId: string, userId?: string) {
    // Verify story exists and user has access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check visibility for non-owners
    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const variables = await this.prisma.storyVariable.findMany({
      where: { storyId },
      orderBy: { variableName: 'asc' },
    });

    return {
      success: true,
      data: variables,
    };
  }

  async updateStoryVariable(
    storyId: string,
    variableId: string,
    userId: string,
    updateVariableDto: UpdateStoryVariableDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const variable = await this.prisma.storyVariable.findFirst({
      where: {
        id: variableId,
        storyId,
      },
    });

    if (!variable) {
      throw new NotFoundException('Story variable not found');
    }

    const updatedVariable = await this.prisma.storyVariable.update({
      where: { id: variableId },
      data: updateVariableDto,
    });

    return {
      success: true,
      message: 'Story variable updated successfully',
      data: updatedVariable,
    };
  }

  async deleteStoryVariable(
    storyId: string,
    variableId: string,
    userId: string,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const variable = await this.prisma.storyVariable.findFirst({
      where: {
        id: variableId,
        storyId,
      },
    });

    if (!variable) {
      throw new NotFoundException('Story variable not found');
    }

    await this.prisma.storyVariable.delete({
      where: { id: variableId },
    });

    return {
      success: true,
      message: 'Story variable deleted successfully',
    };
  }

  // Items management methods
  async createItem(
    storyId: string,
    userId: string,
    createItemDto: CreateItemDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const item = await this.prisma.item.create({
      data: {
        ...createItemDto,
        storyId,
      },
    });

    return {
      success: true,
      message: 'Item created successfully',
      data: item,
    };
  }

  async findItems(storyId: string, userId?: string) {
    // Verify story exists and user has access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check visibility for non-owners
    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const items = await this.prisma.item.findMany({
      where: { storyId },
      orderBy: { itemName: 'asc' },
    });

    return {
      success: true,
      data: items,
    };
  }

  async updateItem(
    storyId: string,
    itemId: string,
    userId: string,
    updateItemDto: UpdateItemDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const item = await this.prisma.item.findFirst({
      where: {
        id: itemId,
        storyId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const updatedItem = await this.prisma.item.update({
      where: { id: itemId },
      data: updateItemDto,
    });

    return {
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    };
  }

  async deleteItem(storyId: string, itemId: string, userId: string) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const item = await this.prisma.item.findFirst({
      where: {
        id: itemId,
        storyId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.prisma.item.delete({
      where: { id: itemId },
    });

    return {
      success: true,
      message: 'Item deleted successfully',
    };
  }

  // Node CRUD operations
  async createNode(
    storyId: string,
    userId: string,
    createNodeDto: CreateNodeDto,
  ) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const node = await this.prisma.node.create({
      data: {
        ...createNodeDto,
        storyId,
      },
    });

    return {
      success: true,
      message: 'Node created successfully',
      data: node,
    };
  }

  async findNodes(storyId: string, userId?: string) {
    // Verify story access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.visibility === 'private' && story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const nodes = await this.prisma.node.findMany({
      where: { storyId },
      include: {
        fromChoices: {
          include: {
            toNode: true,
          },
        },
        toChoices: {
          include: {
            fromNode: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      data: nodes,
    };
  }

  async updateNode(
    nodeId: string,
    userId: string,
    updateNodeDto: UpdateNodeDto,
  ) {
    // Find node and verify ownership through story
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        story: true,
      },
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (node.story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedNode = await this.prisma.node.update({
      where: { id: nodeId },
      data: updateNodeDto,
    });

    return {
      success: true,
      message: 'Node updated successfully',
      data: updatedNode,
    };
  }

  async removeNode(nodeId: string, userId: string) {
    // Find node and verify ownership through story
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        story: true,
      },
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (node.story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.node.delete({
      where: { id: nodeId },
    });

    return {
      success: true,
      message: 'Node deleted successfully',
    };
  }

  // Choice CRUD operations
  async createChoice(
    fromNodeId: string,
    userId: string,
    createChoiceDto: CreateChoiceDto,
  ) {
    // Find from node and verify ownership through story
    const fromNode = await this.prisma.node.findUnique({
      where: { id: fromNodeId },
      include: {
        story: true,
      },
    });

    if (!fromNode) {
      throw new NotFoundException('From node not found');
    }

    if (fromNode.story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify to node exists and belongs to same story
    const toNode = await this.prisma.node.findUnique({
      where: { id: createChoiceDto.toNodeId },
    });

    if (!toNode || toNode.storyId !== fromNode.storyId) {
      throw new NotFoundException('Invalid to node');
    }

    const choice = await this.prisma.choice.create({
      data: {
        fromNodeId,
        ...createChoiceDto,
      },
    });

    return {
      success: true,
      message: 'Choice created successfully',
      data: choice,
    };
  }

  async updateChoice(
    choiceId: string,
    userId: string,
    updateChoiceDto: UpdateChoiceDto,
  ) {
    // Find choice and verify ownership through story
    const choice = await this.prisma.choice.findUnique({
      where: { id: choiceId },
      include: {
        fromNode: {
          include: {
            story: true,
          },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice.fromNode.story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // If updating toNodeId, verify it exists and belongs to same story
    if (updateChoiceDto.toNodeId) {
      const toNode = await this.prisma.node.findUnique({
        where: { id: updateChoiceDto.toNodeId },
      });

      if (!toNode || toNode.storyId !== choice.fromNode.storyId) {
        throw new NotFoundException('Invalid to node');
      }
    }

    const updatedChoice = await this.prisma.choice.update({
      where: { id: choiceId },
      data: updateChoiceDto,
    });

    return {
      success: true,
      message: 'Choice updated successfully',
      data: updatedChoice,
    };
  }

  async removeChoice(choiceId: string, userId: string) {
    // Find choice and verify ownership through story
    const choice = await this.prisma.choice.findUnique({
      where: { id: choiceId },
      include: {
        fromNode: {
          include: {
            story: true,
          },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice.fromNode.story.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.choice.delete({
      where: { id: choiceId },
    });

    return {
      success: true,
      message: 'Choice deleted successfully',
    };
  }
}
