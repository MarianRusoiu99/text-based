import { PrismaService } from '../prisma/prisma.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/create-rpg-template.dto';
export declare class RpgTemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createRpgTemplateDto: CreateRpgTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                username: string;
                displayName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            version: string;
            isPublic: boolean;
            config: import("@prisma/client/runtime/library").JsonValue;
            creatorId: string;
        };
    }>;
    findAll(query?: any): Promise<{
        success: boolean;
        data: {
            templates: ({
                creator: {
                    username: string;
                    displayName: string | null;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                version: string;
                isPublic: boolean;
                config: import("@prisma/client/runtime/library").JsonValue;
                creatorId: string;
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
            creator: {
                username: string;
                displayName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            version: string;
            isPublic: boolean;
            config: import("@prisma/client/runtime/library").JsonValue;
            creatorId: string;
        };
    }>;
    update(id: string, userId: string, updateRpgTemplateDto: UpdateRpgTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                username: string;
                displayName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            version: string;
            isPublic: boolean;
            config: import("@prisma/client/runtime/library").JsonValue;
            creatorId: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
