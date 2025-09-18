import { PrismaService } from '../prisma/prisma.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/update-rpg-template.dto';
export declare class RpgService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get rpgDelegate();
    list(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            items: any;
            total: any;
        };
    }>;
    create(userId: string, dto: CreateRpgTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    get(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, userId: string, dto: UpdateRpgTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
        };
    }>;
    attachTemplateToStory(storyId: string, templateId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            storyId: string;
            templateId: string;
        };
    }>;
    detachTemplateFromStory(storyId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            storyId: string;
        };
    }>;
}
