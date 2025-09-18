import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CreateStoryVariableDto } from './dto/create-story-variable.dto';
import { UpdateStoryVariableDto } from './dto/update-story-variable.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class StoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createStoryDto: CreateStoryDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    findAll(query?: any): Promise<{
        success: boolean;
        data: {
            stories: ({
                author: {
                    username: string;
                    displayName: string | null;
                    id: string;
                };
            } & {
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
            })[];
            pagination: {
                page: any;
                limit: any;
                total: number;
                pages: number;
            };
        };
    }>;
    findOne(id: string, userId?: string): Promise<{
        success: boolean;
        data: {
            author: {
                username: string;
                displayName: string | null;
                id: string;
            };
            chapters: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                chapterOrder: number;
                isPublished: boolean;
                storyId: string;
            }[];
        } & {
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
    }>;
    update(id: string, userId: string, updateData: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    publish(id: string, userId: string, isPublished: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    createChapter(storyId: string, userId: string, createChapterDto: CreateChapterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            chapterOrder: number;
            isPublished: boolean;
            storyId: string;
        };
    }>;
    findChapters(storyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            chapterOrder: number;
            isPublished: boolean;
            storyId: string;
        }[];
    }>;
    findChapter(storyId: string, chapterId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            chapterOrder: number;
            isPublished: boolean;
            storyId: string;
        };
    }>;
    updateChapter(storyId: string, chapterId: string, userId: string, updateChapterDto: UpdateChapterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            chapterOrder: number;
            isPublished: boolean;
            storyId: string;
        };
    }>;
    deleteChapter(storyId: string, chapterId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderChapters(storyId: string, userId: string, chapterOrders: {
        id: string;
        order: number;
    }[]): Promise<{
        success: boolean;
        message: string;
    }>;
    createStoryVariable(storyId: string, userId: string, createVariableDto: CreateStoryVariableDto): Promise<{
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
    findStoryVariables(storyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            variableName: string;
            variableType: string;
            defaultValue: import("@prisma/client/runtime/library").JsonValue | null;
            storyId: string;
        }[];
    }>;
    updateStoryVariable(storyId: string, variableId: string, userId: string, updateVariableDto: UpdateStoryVariableDto): Promise<{
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
    deleteStoryVariable(storyId: string, variableId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createItem(storyId: string, userId: string, createItemDto: CreateItemDto): Promise<{
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
    findItems(storyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            description: string | null;
            itemName: string;
            imageUrl: string | null;
            storyId: string;
        }[];
    }>;
    updateItem(storyId: string, itemId: string, userId: string, updateItemDto: UpdateItemDto): Promise<{
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
    deleteItem(storyId: string, itemId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
