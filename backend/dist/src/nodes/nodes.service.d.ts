import { PrismaService } from '../prisma/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
export declare class NodesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createNodeDto: CreateNodeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
            chapterId: string | null;
            storyId: string;
        };
    }>;
    findAll(storyId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            fromChoices: ({
                toNode: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    nodeType: string;
                    content: import("@prisma/client/runtime/library").JsonValue;
                    position: import("@prisma/client/runtime/library").JsonValue;
                    chapterId: string | null;
                    storyId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
                fromNodeId: string;
            })[];
            toChoices: ({
                fromNode: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    nodeType: string;
                    content: import("@prisma/client/runtime/library").JsonValue;
                    position: import("@prisma/client/runtime/library").JsonValue;
                    chapterId: string | null;
                    storyId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
                fromNodeId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
            chapterId: string | null;
            storyId: string;
        })[];
    }>;
    findOne(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            story: {
                id: string;
                description: string | null;
                category: string | null;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                visibility: string;
                isPublished: boolean;
                coverImageUrl: string | null;
                tags: string[];
                isFeatured: boolean;
                contentRating: string;
                estimatedDuration: number | null;
                publishedAt: Date | null;
                authorId: string;
                rpgTemplateId: string | null;
            };
            fromChoices: ({
                toNode: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    nodeType: string;
                    content: import("@prisma/client/runtime/library").JsonValue;
                    position: import("@prisma/client/runtime/library").JsonValue;
                    chapterId: string | null;
                    storyId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
                fromNodeId: string;
            })[];
            toChoices: ({
                fromNode: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    nodeType: string;
                    content: import("@prisma/client/runtime/library").JsonValue;
                    position: import("@prisma/client/runtime/library").JsonValue;
                    chapterId: string | null;
                    storyId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
                fromNodeId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
            chapterId: string | null;
            storyId: string;
        };
    }>;
    update(id: string, updateNodeDto: UpdateNodeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
            chapterId: string | null;
            storyId: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
            chapterId: string | null;
            storyId: string;
        };
    }>;
}
