/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/update-rpg-template.dto';

@Injectable()
export class RpgService {
  constructor(private readonly prisma: PrismaService) {}

  // Access to potential not-yet-typed Prisma delegates (after recent schema changes)
  private get rpgDelegate(): any {
    return (this.prisma as any).rpgTemplate;
  }

  async list(userId: string) {
    const templates = await this.rpgDelegate.findMany({
      where: { OR: [{ isPublic: true }, { authorId: userId }] },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      message: 'Templates retrieved successfully',
      data: { items: templates, total: templates.length },
    };
  }

  async create(userId: string, dto: CreateRpgTemplateDto) {
    const tpl = await this.rpgDelegate.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        isPublic: dto.isPublic ?? false,
        version: 1,
        config: dto.config as unknown as object,
        authorId: userId,
      },
    });
    return {
      success: true,
      message: 'Template created successfully',
      data: tpl,
    };
  }

  async get(id: string, userId: string) {
    const tpl = await this.rpgDelegate.findUnique({ where: { id } });
    if (!tpl) throw new NotFoundException('Template not found');
    if (!tpl.isPublic && tpl.authorId !== userId)
      throw new ForbiddenException('Access denied');
    return {
      success: true,
      message: 'Template retrieved successfully',
      data: tpl,
    };
  }

  async update(id: string, userId: string, dto: UpdateRpgTemplateDto) {
    const tpl = await this.rpgDelegate.findUnique({ where: { id } });
    if (!tpl) throw new NotFoundException('Template not found');
    if (tpl.authorId !== userId) throw new ForbiddenException('Access denied');

    const updated = await this.rpgDelegate.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        description:
          dto.description === undefined ? undefined : dto.description,
        isPublic: dto.isPublic ?? undefined,
        version: dto.version ?? undefined,
        config: (dto.config as unknown as object) ?? undefined,
      },
    });
    return {
      success: true,
      message: 'Template updated successfully',
      data: updated,
    };
  }

  async remove(id: string, userId: string) {
    const tpl = await this.rpgDelegate.findUnique({ where: { id } });
    if (!tpl) throw new NotFoundException('Template not found');
    if (tpl.authorId !== userId) throw new ForbiddenException('Access denied');

    await this.rpgDelegate.delete({ where: { id } });
    return {
      success: true,
      message: 'Template deleted successfully',
      data: { id },
    };
  }

  async attachTemplateToStory(
    storyId: string,
    templateId: string,
    userId: string,
  ) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== userId)
      throw new ForbiddenException('Access denied');

    const tpl = await this.rpgDelegate.findUnique({
      where: { id: templateId },
    });
    if (!tpl) throw new NotFoundException('Template not found');

    await (this.prisma as any).story.update({
      where: { id: storyId },
      data: { rpgTemplateId: templateId },
    });
    return {
      success: true,
      message: 'Template attached to story',
      data: { storyId, templateId },
    };
  }

  async detachTemplateFromStory(storyId: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== userId)
      throw new ForbiddenException('Access denied');

    await (this.prisma as any).story.update({
      where: { id: storyId },
      data: { rpgTemplateId: null },
    });
    return {
      success: true,
      message: 'Template detached from story',
      data: { storyId },
    };
  }
}
