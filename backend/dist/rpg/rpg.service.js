"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpgService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RpgService = class RpgService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    get rpgDelegate() {
        return this.prisma.rpgTemplate;
    }
    async list(userId) {
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
    async create(userId, dto) {
        const tpl = await this.rpgDelegate.create({
            data: {
                name: dto.name,
                description: dto.description ?? null,
                isPublic: dto.isPublic ?? false,
                version: 1,
                config: dto.config,
                authorId: userId,
            },
        });
        return {
            success: true,
            message: 'Template created successfully',
            data: tpl,
        };
    }
    async get(id, userId) {
        const tpl = await this.rpgDelegate.findUnique({ where: { id } });
        if (!tpl)
            throw new common_1.NotFoundException('Template not found');
        if (!tpl.isPublic && tpl.authorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return {
            success: true,
            message: 'Template retrieved successfully',
            data: tpl,
        };
    }
    async update(id, userId, dto) {
        const tpl = await this.rpgDelegate.findUnique({ where: { id } });
        if (!tpl)
            throw new common_1.NotFoundException('Template not found');
        if (tpl.authorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        const updated = await this.rpgDelegate.update({
            where: { id },
            data: {
                name: dto.name ?? undefined,
                description: dto.description === undefined ? undefined : dto.description,
                isPublic: dto.isPublic ?? undefined,
                version: dto.version ?? undefined,
                config: dto.config ?? undefined,
            },
        });
        return {
            success: true,
            message: 'Template updated successfully',
            data: updated,
        };
    }
    async remove(id, userId) {
        const tpl = await this.rpgDelegate.findUnique({ where: { id } });
        if (!tpl)
            throw new common_1.NotFoundException('Template not found');
        if (tpl.authorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        await this.rpgDelegate.delete({ where: { id } });
        return {
            success: true,
            message: 'Template deleted successfully',
            data: { id },
        };
    }
    async attachTemplateToStory(storyId, templateId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story)
            throw new common_1.NotFoundException('Story not found');
        if (story.authorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        const tpl = await this.rpgDelegate.findUnique({
            where: { id: templateId },
        });
        if (!tpl)
            throw new common_1.NotFoundException('Template not found');
        await this.prisma.story.update({
            where: { id: storyId },
            data: { rpgTemplateId: templateId },
        });
        return {
            success: true,
            message: 'Template attached to story',
            data: { storyId, templateId },
        };
    }
    async detachTemplateFromStory(storyId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story)
            throw new common_1.NotFoundException('Story not found');
        if (story.authorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        await this.prisma.story.update({
            where: { id: storyId },
            data: { rpgTemplateId: null },
        });
        return {
            success: true,
            message: 'Template detached from story',
            data: { storyId },
        };
    }
};
exports.RpgService = RpgService;
exports.RpgService = RpgService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RpgService);
//# sourceMappingURL=rpg.service.js.map