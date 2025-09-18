import { AchievementsService } from './achievements.service';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';
interface AuthenticatedRequest extends Request {
    user: RequestUser;
}
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    getAllAchievements(): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            name: string;
            description: string | null;
            category: string;
            iconUrl: string | null;
            triggerType: string;
            triggerData: import("@prisma/client/runtime/library").JsonValue | null;
            points: number;
            rarity: string;
        }[];
    }>;
    getUserAchievements(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: ({
            achievement: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                name: string;
                description: string | null;
                category: string;
                iconUrl: string | null;
                triggerType: string;
                triggerData: import("@prisma/client/runtime/library").JsonValue | null;
                points: number;
                rarity: string;
            };
        } & {
            id: string;
            userId: string;
            achievementId: string;
            unlockedAt: Date;
            progress: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    getAchievementStats(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            totalAchievements: number;
            unlockedAchievements: number;
            completionPercentage: number;
            totalPoints: number;
        };
    }>;
}
export {};
