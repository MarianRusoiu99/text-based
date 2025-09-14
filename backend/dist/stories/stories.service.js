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
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StoriesService = class StoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createStoryDto) {
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
    async findAll(query = {}) {
        const { page = 1, limit = 20, search, category, tags } = query;
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.visibility === 'private' && story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            success: true,
            data: story,
        };
    }
    async update(id, userId, updateData) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async remove(id, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.story.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Story deleted successfully',
        };
    }
    async publish(id, userId, isPublished) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async createChapter(storyId, userId, createChapterDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async findChapters(storyId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.visibility === 'private' && story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async findChapter(storyId, chapterId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.visibility === 'private' && story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const chapter = await this.prisma.chapter.findFirst({
            where: {
                id: chapterId,
                storyId,
            },
        });
        if (!chapter) {
            throw new common_1.NotFoundException('Chapter not found');
        }
        return {
            success: true,
            data: chapter,
        };
    }
    async updateChapter(storyId, chapterId, userId, updateChapterDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const chapter = await this.prisma.chapter.findFirst({
            where: {
                id: chapterId,
                storyId,
            },
        });
        if (!chapter) {
            throw new common_1.NotFoundException('Chapter not found');
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
    async deleteChapter(storyId, chapterId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const chapter = await this.prisma.chapter.findFirst({
            where: {
                id: chapterId,
                storyId,
            },
        });
        if (!chapter) {
            throw new common_1.NotFoundException('Chapter not found');
        }
        await this.prisma.chapter.delete({
            where: { id: chapterId },
        });
        return {
            success: true,
            message: 'Chapter deleted successfully',
        };
    }
    async reorderChapters(storyId, userId, chapterOrders) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        for (const { id } of chapterOrders) {
            const chapter = await this.prisma.chapter.findFirst({
                where: {
                    id,
                    storyId,
                },
            });
            if (!chapter) {
                throw new common_1.NotFoundException(`Chapter with id ${id} not found`);
            }
        }
        for (const { id, order } of chapterOrders) {
            await this.prisma.chapter.update({
                where: { id },
                data: { chapterOrder: order },
            });
        }
        return {
            success: true,
            message: 'Chapters reordered successfully',
        };
    }
    async createStoryVariable(storyId, userId, createVariableDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async findStoryVariables(storyId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.visibility === 'private' && story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async updateStoryVariable(storyId, variableId, userId, updateVariableDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const variable = await this.prisma.storyVariable.findFirst({
            where: {
                id: variableId,
                storyId,
            },
        });
        if (!variable) {
            throw new common_1.NotFoundException('Story variable not found');
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
    async deleteStoryVariable(storyId, variableId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const variable = await this.prisma.storyVariable.findFirst({
            where: {
                id: variableId,
                storyId,
            },
        });
        if (!variable) {
            throw new common_1.NotFoundException('Story variable not found');
        }
        await this.prisma.storyVariable.delete({
            where: { id: variableId },
        });
        return {
            success: true,
            message: 'Story variable deleted successfully',
        };
    }
    async createItem(storyId, userId, createItemDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async findItems(storyId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.visibility === 'private' && story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async updateItem(storyId, itemId, userId, updateItemDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const item = await this.prisma.item.findFirst({
            where: {
                id: itemId,
                storyId,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
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
    async deleteItem(storyId, itemId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const item = await this.prisma.item.findFirst({
            where: {
                id: itemId,
                storyId,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        await this.prisma.item.delete({
            where: { id: itemId },
        });
        return {
            success: true,
            message: 'Item deleted successfully',
        };
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map