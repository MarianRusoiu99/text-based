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
            storyId: string;
            chapterId: string | null;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
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
            toChoices: ({
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
            fromChoices: ({
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
            toChoices: ({
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
            storyId: string;
            chapterId: string | null;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
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
            storyId: string;
            chapterId: string | null;
            nodeType: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            position: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
}
export {};
