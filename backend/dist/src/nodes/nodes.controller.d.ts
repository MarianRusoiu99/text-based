import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
}
export declare class NodesController {
    private readonly nodesService;
    constructor(nodesService: NodesService);
    create(createNodeDto: CreateNodeDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    findAll(storyId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    findOne(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
    update(id: string, updateNodeDto: UpdateNodeDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
    remove(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
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
export {};
