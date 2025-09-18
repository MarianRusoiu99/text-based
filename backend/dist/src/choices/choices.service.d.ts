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
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
            fromNodeId: string;
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
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
                storyId: string;
            };
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
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
                storyId: string;
            };
            fromNode: {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
            fromNodeId: string;
        };
    }>;
    update(id: string, updateChoiceDto: UpdateChoiceDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
            fromNodeId: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
            fromNodeId: string;
        };
    }>;
}
