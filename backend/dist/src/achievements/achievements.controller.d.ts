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
            name: string;
            description: string | null;
            iconUrl: string | null;
            category: string;
            triggerType: string;
            triggerData: import("@prisma/client/runtime/library").JsonValue | null;
            points: number;
            rarity: string;
            isActive: boolean;
            createdAt: Date;
        }[];
    }>;
    getUserAchievements(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: ({
            achievement: {
                id: string;
                name: string;
                description: string | null;
                iconUrl: string | null;
                category: string;
                triggerType: string;
                triggerData: import("@prisma/client/runtime/library").JsonValue | null;
                points: number;
                rarity: string;
                isActive: boolean;
                createdAt: Date;
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
