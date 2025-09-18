import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RpgService } from './rpg.service';
import { RpgController } from './rpg.controller';
import { StoryRpgController } from './story-rpg.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RpgController, StoryRpgController],
  providers: [RpgService],
  exports: [RpgService],
})
export class RpgModule {}
