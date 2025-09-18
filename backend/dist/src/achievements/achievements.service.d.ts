import { PrismaService } from '../prisma/prisma.service';
export declare class AchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAchievements(): Promise<{
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
    }[]>;
    getUserAchievements(userId: string): Promise<({
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
