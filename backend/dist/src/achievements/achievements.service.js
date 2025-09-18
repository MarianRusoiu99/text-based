"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AchievementsService = class AchievementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAchievements() {
        return this.prisma.achievement.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getUserAchievements(userId) {
        return this.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });
    }
    async checkAndUnlockAchievements(userId, eventType, eventData = {}) {
        const achievements = await this.prisma.achievement.findMany({
            where: {
                isActive: true,
                triggerType: eventType,
            },
        });
        const unlockedAchievements = [];
        for (const achievement of achievements) {
            const alreadyUnlocked = await this.prisma.userAchievement.findUnique({
                where: {
                    userId_achievementId: {
                        userId,
                        achievementId: achievement.id,
                    },
                },
            });
            if (alreadyUnlocked)
                continue;
            if (await this.checkAchievementCondition(achievement, userId, eventData)) {
                const userAchievement = await this.prisma.userAchievement.create({
                    data: {
                        userId,
                        achievementId: achievement.id,
                        progress: eventData,
                    },
                    include: {
                        achievement: true,
                    },
                });
                unlockedAchievements.push(userAchievement);
            }
        }
        return unlockedAchievements;
    }
    async checkAchievementCondition(achievement, userId, eventData) {
        const triggerData = achievement.triggerData;
        switch (achievement.triggerType) {
            case 'story_completed':
                return eventData.storyId && eventData.completed === true;
            case 'stories_created':
                const storyCount = await this.prisma.story.count({
                    where: { authorId: userId },
                });
                return storyCount >= (triggerData?.count || 1);
            case 'choices_made':
                const choiceCount = await this.prisma.choiceAnalytics.count({
                    where: {
                        session: { userId },
                    },
                });
                return choiceCount >= (triggerData?.count || 1);
            case 'play_sessions_started':
                const sessionCount = await this.prisma.playSession.count({
                    where: { userId },
                });
                return sessionCount >= (triggerData?.count || 1);
            case 'perfect_story_completion':
                return eventData.perfect === true;
            default:
                return false;
        }
    }
    async getAchievementStats(userId) {
        const [totalAchievements, userAchievements] = await Promise.all([
            this.prisma.achievement.count({ where: { isActive: true } }),
            this.prisma.userAchievement.count({ where: { userId } }),
        ]);
        const userAchievementsWithPoints = await this.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: {
                    select: { points: true },
                },
            },
        });
        const totalPoints = userAchievementsWithPoints.reduce((sum, ua) => sum + (ua.achievement.points || 0), 0);
        return {
            totalAchievements,
            unlockedAchievements: userAchievements,
            completionPercentage: totalAchievements > 0 ? (userAchievements / totalAchievements) * 100 : 0,
            totalPoints,
        };
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map