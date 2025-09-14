import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Create default test user if it doesn't exist
    const defaultUser = await this.prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!defaultUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await this.prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          passwordHash: hashedPassword,
        },
      });
      console.log('Default test user created: test@example.com / password123');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, displayName } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        displayName,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        },
        ...tokens,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        },
        ...tokens,
      },
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokens = this.generateTokens(payload.sub);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '24h' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '30d', secret: process.env.JWT_REFRESH_SECRET },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
