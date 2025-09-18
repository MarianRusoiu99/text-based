import { RpgService } from './rpg.service';
import { RequestUser } from '../auth/request-user.interface';
export declare class StoryRpgController {
    private readonly rpgService;
    constructor(rpgService: RpgService);
    attach(storyId: string, templateId: string, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            storyId: string;
            templateId: string;
        };
    }>;
    detach(storyId: string, req: {
        user: RequestUser;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            storyId: string;
        };
    }>;
}
