import { RpgService } from './rpg.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/update-rpg-template.dto';
import { RequestUser } from '../auth/request-user.interface';
export declare class RpgController {
    private readonly rpgService;
    constructor(rpgService: RpgService);
    list(req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            items: any;
            total: any;
        };
    }>;
    create(dto: CreateRpgTemplateDto, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    get(id: string, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, dto: UpdateRpgTemplateDto, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
        };
    }>;
}
