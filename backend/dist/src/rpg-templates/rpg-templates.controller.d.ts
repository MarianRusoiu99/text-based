import { RpgTemplatesService } from './rpg-templates.service';
import { CreateRpgTemplateDto, UpdateRpgTemplateDto } from './dto/create-rpg-template.dto';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';
interface AuthenticatedRequest extends Request {
    user: RequestUser;
}
export declare class RpgTemplatesController {
    private readonly rpgTemplatesService;
    constructor(rpgTemplatesService: RpgTemplatesService);
    create(createRpgTemplateDto: CreateRpgTemplateDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                id: string;
                username: string;
                displayName: string | null;
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
    findAll(query: any): Promise<{
        success: boolean;
        data: {
            templates: ({
                creator: {
                    id: string;
                    username: string;
                    displayName: string | null;
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
    findOne(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            creator: {
                id: string;
                username: string;
                displayName: string | null;
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
    update(id: string, updateRpgTemplateDto: UpdateRpgTemplateDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                id: string;
                username: string;
                displayName: string | null;
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
    remove(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
