import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

@Injectable()
export class NodesService {
  constructor(private prisma: PrismaService) {}

  async create(createNodeDto: CreateNodeDto, userId: string) {
    // Verify story ownership
    const story = await this.prisma.story.findUnique({
      where: { id: createNodeDto.storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only create nodes for your own stories',
      );
    }

    return this.prisma.node.create({
      data: {
        storyId: createNodeDto.storyId,
        chapterId: createNodeDto.chapterId,
        nodeType: createNodeDto.nodeType,
        title: createNodeDto.title,
        content: createNodeDto.content,
        position: createNodeDto.position,
      },
    });
  }

  async findAll(storyId: string, userId: string) {
    // Verify story ownership or public access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId && story.visibility === 'private') {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.node.findMany({
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
    });
  }

  async findOne(id: string, userId: string) {
    const node = await this.prisma.node.findUnique({
      where: { id },
      include: {
        story: true,
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
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (node.story.authorId !== userId && node.story.visibility === 'private') {
      throw new ForbiddenException('Access denied');
    }

    return node;
  }

  async update(id: string, updateNodeDto: UpdateNodeDto, userId: string) {
    const node = await this.prisma.node.findUnique({
      where: { id },
      include: { story: true },
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (node.story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only update nodes for your own stories',
      );
    }

    return this.prisma.node.update({
      where: { id },
      data: {
        chapterId: updateNodeDto.chapterId,
        nodeType: updateNodeDto.nodeType,
        title: updateNodeDto.title,
        content: updateNodeDto.content,
        position: updateNodeDto.position,
      },
    });
  }

  async remove(id: string, userId: string) {
    const node = await this.prisma.node.findUnique({
      where: { id },
      include: { story: true },
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (node.story.authorId !== userId) {
      throw new ForbiddenException(
        'You can only delete nodes for your own stories',
      );
    }

    return this.prisma.node.delete({
      where: { id },
    });
  }
}
