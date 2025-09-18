import { Module } from '@nestjs/common';
import { RpgTemplatesService } from './rpg-templates.service';
import { RpgTemplatesController } from './rpg-templates.controller';

@Module({
  providers: [RpgTemplatesService],
  controllers: [RpgTemplatesController]
})
export class RpgTemplatesModule {}
