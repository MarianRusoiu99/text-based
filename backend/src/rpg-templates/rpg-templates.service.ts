import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/create-rpg-template.dto';

@Injectable()
export class RpgTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRpgTemplateDto: CreateRpgTemplateDto) {
    const template = await this.prisma.rpgTemplate.create({
      data: {
        ...createRpgTemplateDto,
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'RPG template created successfully',
      data: template,
    };
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 20, search, creatorId, isPublic } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    const [templates, total] = await Promise.all([
      this.prisma.rpgTemplate.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rpgTemplate.count({ where }),
    ]);

    return {
      success: true,
      data: {
        templates,
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
    const template = await this.prisma.rpgTemplate.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('RPG template not found');
    }

    // Check visibility
    if (!template.isPublic && template.creatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: template,
    };
  }

  async update(
    id: string,
    userId: string,
    updateRpgTemplateDto: UpdateRpgTemplateDto,
  ) {
    const template = await this.prisma.rpgTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('RPG template not found');
    }

    if (template.creatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedTemplate = await this.prisma.rpgTemplate.update({
      where: { id },
      data: updateRpgTemplateDto,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'RPG template updated successfully',
      data: updatedTemplate,
    };
  }

  async remove(id: string, userId: string) {
    const template = await this.prisma.rpgTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('RPG template not found');
    }

    if (template.creatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.rpgTemplate.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'RPG template deleted successfully',
    };
  }
}
