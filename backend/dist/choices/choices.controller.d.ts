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
            fromNodeId: string;
            toNodeId: string;
            choiceText: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            effects: import("@prisma/client/runtime/library").JsonValue | null;
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
    update(id: string, updateChoiceDto: UpdateChoiceDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    remove(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
export {};
