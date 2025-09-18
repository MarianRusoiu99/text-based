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
exports.ChoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChoicesService = class ChoicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createChoiceDto, userId) {
        const fromNode = await this.prisma.node.findUnique({
            where: { id: createChoiceDto.fromNodeId },
            include: { story: true },
        });
        if (!fromNode) {
            throw new common_1.NotFoundException('From node not found');
        }
        if (fromNode.story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only create choices for your own stories');
        }
        const toNode = await this.prisma.node.findUnique({
            where: { id: createChoiceDto.toNodeId },
        });
        if (!toNode) {
            throw new common_1.NotFoundException('To node not found');
        }
        if (toNode.storyId !== fromNode.storyId) {
            throw new common_1.ForbiddenException('Choice nodes must belong to the same story');
        }
        const choice = await this.prisma.choice.create({
            data: {
                fromNodeId: createChoiceDto.fromNodeId,
                toNodeId: createChoiceDto.toNodeId,
                choiceText: createChoiceDto.choiceText,
                conditions: createChoiceDto.conditions,
                effects: createChoiceDto.effects,
            },
        });
        return {
            success: true,
            message: 'Choice created successfully',
            data: choice,
        };
    }
    async findAll(storyId, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId && story.visibility === 'private') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const choices = await this.prisma.choice.findMany({
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
        return {
            success: true,
            message: 'Choices retrieved successfully',
            data: choices,
        };
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Choice not found');
        }
        if (choice.fromNode.story.authorId !== userId &&
            choice.fromNode.story.visibility === 'private') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            success: true,
            message: 'Choice retrieved successfully',
            data: choice,
        };
    }
    async update(id, updateChoiceDto, userId) {
        const choice = await this.prisma.choice.findUnique({
            where: { id },
            include: {
                fromNode: {
                    include: { story: true },
                },
            },
        });
        if (!choice) {
            throw new common_1.NotFoundException('Choice not found');
        }
        if (choice.fromNode.story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update choices for your own stories');
        }
        if (updateChoiceDto.toNodeId) {
            const toNode = await this.prisma.node.findUnique({
                where: { id: updateChoiceDto.toNodeId },
            });
            if (!toNode) {
                throw new common_1.NotFoundException('To node not found');
            }
            if (toNode.storyId !== choice.fromNode.storyId) {
                throw new common_1.ForbiddenException('Choice nodes must belong to the same story');
            }
        }
        const updatedChoice = await this.prisma.choice.update({
            where: { id },
            data: {
                toNodeId: updateChoiceDto.toNodeId,
                choiceText: updateChoiceDto.choiceText,
                conditions: updateChoiceDto.conditions,
                effects: updateChoiceDto.effects,
            },
        });
        return {
            success: true,
            message: 'Choice updated successfully',
            data: updatedChoice,
        };
    }
    async remove(id, userId) {
        const choice = await this.prisma.choice.findUnique({
            where: { id },
            include: {
                fromNode: {
                    include: { story: true },
                },
            },
        });
        if (!choice) {
            throw new common_1.NotFoundException('Choice not found');
        }
        if (choice.fromNode.story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete choices for your own stories');
        }
        const deletedChoice = await this.prisma.choice.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Choice deleted successfully',
            data: deletedChoice,
        };
    }
};
exports.ChoicesService = ChoicesService;
exports.ChoicesService = ChoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChoicesService);
//# sourceMappingURL=choices.service.js.map