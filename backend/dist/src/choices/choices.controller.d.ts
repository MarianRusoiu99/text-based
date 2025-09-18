import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
}
export declare class ChoicesController {
    private readonly choicesService;
    constructor(choicesService: ChoicesService);
    create(createChoiceDto: CreateChoiceDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    findAll(storyId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    findOne(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    coverImageUrl: string | null;
                    category: string | null;
                    tags: string[];
                    isPublished: boolean;
                    isFeatured: boolean;
                    visibility: string;
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
    update(id: string, updateChoiceDto: UpdateChoiceDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    remove(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
export {};
