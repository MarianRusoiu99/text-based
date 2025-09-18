import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { RpgTemplatesModule } from './rpg-templates/rpg-templates.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 100,
      },
    ]),
    AuthModule,
    PrismaModule,
    StoriesModule,
    NodesModule,
    ChoicesModule,
    CacheModule,
    UsersModule,
    LoggerModule,
    RpgTemplatesModule,
  ],
  controllers: [AppController, NodesController, ChoicesController],
  providers: [AppService, NodesService, ChoicesService],
})
export class AppModule {}
