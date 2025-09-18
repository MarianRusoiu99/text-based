import { PrismaService } from '../prisma/prisma.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
export declare class ChoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChoiceDto: CreateChoiceDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    findAll(storyId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            toNode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                storyId: string;
                chapterId: string | null;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
            };
            fromNode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                storyId: string;
                chapterId: string | null;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    findOne(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            toNode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                storyId: string;
                chapterId: string | null;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
            };
            fromNode: {
                story: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    visibility: string;
                    isPublished: boolean;
                    coverImageUrl: string | null;
                    category: string | null;
                    tags: string[];
                    isFeatured: boolean;
                    contentRating: string;
                    estimatedDuration: number | null;
                    publishedAt: Date | null;
                    authorId: string;
                    rpgTemplateId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                storyId: string;
                chapterId: string | null;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    update(id: string, updateChoiceDto: UpdateChoiceDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
}
