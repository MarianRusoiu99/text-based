import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StoriesModule } from '../stories/stories.module';
import { RpgTemplatesModule } from '../rpg-templates/rpg-templates.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    PrismaModule,
    StoriesModule,
    RpgTemplatesModule,
    AchievementsModule,
  ],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
