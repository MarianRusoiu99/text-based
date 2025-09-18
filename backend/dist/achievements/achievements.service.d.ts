import { PrismaService } from '../prisma/prisma.service';
export declare class AchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAchievements(): Promise<{
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
    }[]>;
    getUserAchievements(userId: string): Promise<({
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
    })[]>;
    checkAndUnlockAchievements(userId: string, eventType: string, eventData?: any): Promise<any[]>;
    private checkAchievementCondition;
    getAchievementStats(userId: string): Promise<{
        totalAchievements: number;
        unlockedAchievements: number;
        completionPercentage: number;
        totalPoints: number;
    }>;
}
