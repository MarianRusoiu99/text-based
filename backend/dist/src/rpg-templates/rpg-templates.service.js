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
exports.RpgTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RpgTemplatesService = class RpgTemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createRpgTemplateDto) {
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
    async findAll(query = {}) {
        const { page = 1, limit = 20, search, creatorId, isPublic } = query;
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('RPG template not found');
        }
        if (!template.isPublic && template.creatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            success: true,
            data: template,
        };
    }
    async update(id, userId, updateRpgTemplateDto) {
        const template = await this.prisma.rpgTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('RPG template not found');
        }
        if (template.creatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async remove(id, userId) {
        const template = await this.prisma.rpgTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('RPG template not found');
        }
        if (template.creatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.rpgTemplate.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'RPG template deleted successfully',
        };
    }
};
exports.RpgTemplatesService = RpgTemplatesService;
exports.RpgTemplatesService = RpgTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RpgTemplatesService);
//# sourceMappingURL=rpg-templates.service.js.map