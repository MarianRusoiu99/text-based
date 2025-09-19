import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CreateStoryVariableDto } from './dto/create-story-variable.dto';
import { UpdateStoryVariableDto } from './dto/update-story-variable.dto';
import { CreateNodeDto, UpdateNodeDto } from './dto/create-node.dto';
import { CreateChoiceDto, UpdateChoiceDto } from './dto/create-choice.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
}
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(createStoryDto: CreateStoryDto, req: {
        user?: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        data: {
            stories: ({
                author: {
                    id: string;
                    username: string;
                    displayName: string | null;
                };
            } & {
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
            })[];
            pagination: {
                page: any;
                limit: any;
                total: number;
                pages: number;
            };
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            author: {
                id: string;
                username: string;
                displayName: string | null;
            };
            chapters: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                isPublished: boolean;
                chapterOrder: number;
                storyId: string;
            }[];
        } & {
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
    }>;
    update(id: string, updateData: any, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    remove(id: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    publish(id: string, isPublished: boolean, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    createChapter(storyId: string, createChapterDto: CreateChapterDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            isPublished: boolean;
            chapterOrder: number;
            storyId: string;
        };
    }>;
    findChapters(storyId: string, req: {
        user?: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            isPublished: boolean;
            chapterOrder: number;
            storyId: string;
        }[];
    }>;
    findChapter(storyId: string, chapterId: string, req: {
        user?: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            isPublished: boolean;
            chapterOrder: number;
            storyId: string;
        };
    }>;
    updateChapter(storyId: string, chapterId: string, updateChapterDto: UpdateChapterDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            isPublished: boolean;
            chapterOrder: number;
            storyId: string;
        };
    }>;
    deleteChapter(storyId: string, chapterId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderChapters(storyId: string, chapterOrders: {
        id: string;
        order: number;
    }[], req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createStoryVariable(storyId: string, createVariableDto: CreateStoryVariableDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            variableName: string;
            variableType: string;
            defaultValue: import("@prisma/client/runtime/library").JsonValue | null;
            storyId: string;
        };
    }>;
    findStoryVariables(storyId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            variableName: string;
            variableType: string;
            defaultValue: import("@prisma/client/runtime/library").JsonValue | null;
            storyId: string;
        }[];
    }>;
    updateStoryVariable(storyId: string, variableId: string, updateVariableDto: UpdateStoryVariableDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            variableName: string;
            variableType: string;
            defaultValue: import("@prisma/client/runtime/library").JsonValue | null;
            storyId: string;
        };
    }>;
    deleteStoryVariable(storyId: string, variableId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createItem(storyId: string, createItemDto: CreateItemDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            description: string | null;
            itemName: string;
            imageUrl: string | null;
            storyId: string;
        };
    }>;
    findItems(storyId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            description: string | null;
            itemName: string;
            imageUrl: string | null;
            storyId: string;
        }[];
    }>;
    updateItem(storyId: string, itemId: string, updateItemDto: UpdateItemDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            description: string | null;
            itemName: string;
            imageUrl: string | null;
            storyId: string;
        };
    }>;
    deleteItem(storyId: string, itemId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createNode(storyId: string, createNodeDto: CreateNodeDto, req: {
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
    findNodes(storyId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
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
    updateNode(nodeId: string, updateNodeDto: UpdateNodeDto, req: {
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
    removeNode(nodeId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createChoice(fromNodeId: string, createChoiceDto: CreateChoiceDto, req: {
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
    updateChoice(choiceId: string, updateChoiceDto: UpdateChoiceDto, req: {
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
    removeChoice(choiceId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
