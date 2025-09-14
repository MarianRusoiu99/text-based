import { Module } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { ChoicesController } from './choices.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChoicesController],
  providers: [ChoicesService],
  exports: [ChoicesService],
})
export class ChoicesModule {}
