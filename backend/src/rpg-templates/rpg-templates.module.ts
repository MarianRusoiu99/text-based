import { Module } from '@nestjs/common';
import { RpgTemplatesService } from './rpg-templates.service';
import { RpgTemplatesController } from './rpg-templates.controller';
import { RpgMechanicsService } from './rpg-mechanics.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RpgTemplatesService, RpgMechanicsService],
  controllers: [RpgTemplatesController],
  exports: [RpgMechanicsService],
})
export class RpgTemplatesModule {}
