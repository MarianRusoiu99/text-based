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
exports.NodesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NodesService = class NodesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createNodeDto, userId) {
        const story = await this.prisma.story.findUnique({
            where: { id: createNodeDto.storyId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only create nodes for your own stories');
        }
        const node = await this.prisma.node.create({
            data: {
                storyId: createNodeDto.storyId,
                chapterId: createNodeDto.chapterId,
                nodeType: createNodeDto.nodeType,
                title: createNodeDto.title,
                content: createNodeDto.content,
                position: createNodeDto.position,
            },
        });
        return {
            success: true,
            message: 'Node created successfully',
            data: node,
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
        });
        return {
            success: true,
            message: 'Nodes retrieved successfully',
            data: nodes,
        };
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Node not found');
        }
        if (node.story.authorId !== userId && node.story.visibility === 'private') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            success: true,
            message: 'Node retrieved successfully',
            data: node,
        };
    }
    async update(id, updateNodeDto, userId) {
        const node = await this.prisma.node.findUnique({
            where: { id },
            include: { story: true },
        });
        if (!node) {
            throw new common_1.NotFoundException('Node not found');
        }
        if (node.story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update nodes for your own stories');
        }
        const updatedNode = await this.prisma.node.update({
            where: { id },
            data: {
                chapterId: updateNodeDto.chapterId,
                nodeType: updateNodeDto.nodeType,
                title: updateNodeDto.title,
                content: updateNodeDto.content,
                position: updateNodeDto.position,
            },
        });
        return {
            success: true,
            message: 'Node updated successfully',
            data: updatedNode,
        };
    }
    async remove(id, userId) {
        const node = await this.prisma.node.findUnique({
            where: { id },
            include: { story: true },
        });
        if (!node) {
            throw new common_1.NotFoundException('Node not found');
        }
        if (node.story.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete nodes for your own stories');
        }
        const deletedNode = await this.prisma.node.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Node deleted successfully',
            data: deletedNode,
        };
    }
};
exports.NodesService = NodesService;
exports.NodesService = NodesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NodesService);
//# sourceMappingURL=nodes.service.js.map