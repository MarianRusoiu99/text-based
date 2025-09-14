import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoriesModule } from './stories/stories.module';
import { NodesService } from './nodes/nodes.service';
import { NodesController } from './nodes/nodes.controller';
import { NodesModule } from './nodes/nodes.module';
import { ChoicesService } from './choices/choices.service';
import { ChoicesController } from './choices/choices.controller';
import { ChoicesModule } from './choices/choices.module';
import { CacheModule } from './cache/cache.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StoriesModule,
    NodesModule,
    ChoicesModule,
    CacheModule,
    UsersModule,
    LoggerModule,
  ],
  controllers: [AppController, NodesController, ChoicesController],
  providers: [AppService, NodesService, ChoicesService],
})
export class AppModule {}
