import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

@Injectable()
export class ChoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createChoiceDto: CreateChoiceDto, userId: string) {
    // Verify fromNode ownership
    const fromNode = await this.prisma.node.findUnique({
      where: { id: createChoiceDto.fromNodeId },
      include: { story: true },
    });

    if (!fromNode) {
      throw new NotFoundException('From node not found');
    }

    if (fromNode.story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only create choices for your own stories',
      );
    }

    // Verify toNode exists and belongs to same story
    const toNode = await this.prisma.node.findUnique({
      where: { id: createChoiceDto.toNodeId },
    });

    if (!toNode) {
      throw new NotFoundException('To node not found');
    }

    if (toNode.storyId !== fromNode.storyId) {
      throw new ForbiddenException(
        'Choice nodes must belong to the same story',
      );
    }

    return this.prisma.choice.create({
      data: {
        fromNodeId: createChoiceDto.fromNodeId,
        toNodeId: createChoiceDto.toNodeId,
        choiceText: createChoiceDto.choiceText,
        conditions: createChoiceDto.conditions,
        effects: createChoiceDto.effects,
      },
    });
  }

  async findAll(storyId: string, userId: string) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId && story.visibility === 'private') {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.choice.findMany({
      where: {
        fromNode: {
          storyId,
        },
      },
      include: {
        fromNode: true,
        toNode: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const choice = await this.prisma.choice.findUnique({
      where: { id },
      include: {
        fromNode: {
          include: { story: true },
        },
        toNode: true,
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (
      choice.fromNode.story.authorId !== userId &&
      choice.fromNode.story.visibility === 'private'
    ) {
      throw new ForbiddenException('Access denied');
    }

    return choice;
  }

  async update(id: string, updateChoiceDto: UpdateChoiceDto, userId: string) {
    const choice = await this.prisma.choice.findUnique({
      where: { id },
      include: {
        fromNode: {
          include: { story: true },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice.fromNode.story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only update choices for your own stories',
      );
    }

    // If updating toNode, verify it exists and belongs to same story
    if (updateChoiceDto.toNodeId) {
      const toNode = await this.prisma.node.findUnique({
        where: { id: updateChoiceDto.toNodeId },
      });

      if (!toNode) {
        throw new NotFoundException('To node not found');
      }

      if (toNode.storyId !== choice.fromNode.storyId) {
        throw new ForbiddenException(
          'Choice nodes must belong to the same story',
        );
      }
    }

    return this.prisma.choice.update({
      where: { id },
      data: {
        toNodeId: updateChoiceDto.toNodeId,
        choiceText: updateChoiceDto.choiceText,
        conditions: updateChoiceDto.conditions,
        effects: updateChoiceDto.effects,
      },
    });
  }

  async remove(id: string, userId: string) {
    const choice = await this.prisma.choice.findUnique({
      where: { id },
      include: {
        fromNode: {
          include: { story: true },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice.fromNode.story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only delete choices for your own stories',
      );
    }

    return this.prisma.choice.delete({
      where: { id },
    });
  }
}
