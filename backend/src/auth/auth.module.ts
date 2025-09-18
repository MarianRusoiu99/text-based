import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { ConsoleEmailProvider } from './providers/console-email.provider';
import { ConsoleLoggerProvider } from './providers/console-logger.provider';
import type { IEmailProvider } from './providers/email-provider.interface';
import type { ILoggerProvider } from './providers/logger-provider.interface';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'IEmailProvider',
      useClass: ConsoleEmailProvider,
    },
    {
      provide: 'ILoggerProvider',
      useClass: ConsoleLoggerProvider,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
