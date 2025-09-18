import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getAllAchievements() {
    const achievements = await this.achievementsService.getAllAchievements();
    return {
      success: true,
      data: achievements,
    };
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserAchievements(@Req() req: AuthenticatedRequest) {
    const achievements = await this.achievementsService.getUserAchievements(req.user.id);
    return {
      success: true,
      data: achievements,
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getAchievementStats(@Req() req: AuthenticatedRequest) {
    const stats = await this.achievementsService.getAchievementStats(req.user.id);
    return {
      success: true,
      data: stats,
    };
  }
}
