import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async checkAndUnlockAchievements(
    userId: string,
    eventType: string,
    eventData: any = {},
  ) {
    const achievements = await this.prisma.achievement.findMany({
      where: {
        isActive: true,
        triggerType: eventType,
      },
    });

    const unlockedAchievements: any[] = [];

    for (const achievement of achievements) {
      const alreadyUnlocked = await this.prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (alreadyUnlocked) continue;

      // Check if achievement conditions are met
      if (
        await this.checkAchievementCondition(achievement, userId, eventData)
      ) {
        const userAchievement = await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: eventData, // Store progress data
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

  private async checkAchievementCondition(
    achievement: any,
    userId: string,
    eventData: any,
  ): Promise<boolean> {
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
        // Story completed without wrong choices (if such tracking exists)
        return eventData.perfect === true;

      default:
        return false;
    }
  }

  async getAchievementStats(userId: string) {
    const [totalAchievements, userAchievements] = await Promise.all([
      this.prisma.achievement.count({ where: { isActive: true } }),
      this.prisma.userAchievement.count({ where: { userId } }),
    ]);

    // Get total points by joining with achievements
    const userAchievementsWithPoints =
      await this.prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: {
            select: { points: true },
          },
        },
      });

    const totalPoints = userAchievementsWithPoints.reduce(
      (sum, ua) => sum + (ua.achievement.points || 0),
      0,
    );

    return {
      totalAchievements,
      unlockedAchievements: userAchievements,
      completionPercentage:
        totalAchievements > 0
          ? (userAchievements / totalAchievements) * 100
          : 0,
      totalPoints,
    };
  }
}
