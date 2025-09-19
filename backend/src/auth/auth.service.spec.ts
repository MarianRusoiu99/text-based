import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { IEmailProvider } from './providers/email-provider.interface';
import type { ILoggerProvider } from './providers/logger-provider.interface';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;
  let emailProvider: any;
  let loggerProvider: any;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      verificationToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      passwordResetToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockEmailProvider = {
      sendEmail: jest.fn(),
    };

    const mockLoggerProvider = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'IEmailProvider',
          useValue: mockEmailProvider,
        },
        {
          provide: 'ILoggerProvider',
          useValue: mockLoggerProvider,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = mockPrismaService;
    jwtService = mockJwtService;
    emailProvider = mockEmailProvider;
    loggerProvider = mockLoggerProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      };

      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        username: registerDto.username,
        displayName: registerDto.displayName,
      };

      prismaService.user.findFirst.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.register(registerDto);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { username: registerDto.username },
          ],
        },
      });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password123',
      };

      prismaService.user.findFirst.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        username: 'testuser',
        displayName: 'Test User',
        passwordHash: await bcrypt.hash(loginDto.password, 10),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.update.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(result.success).toBe(true);
      expect(result.data.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user-123',
        passwordHash: await bcrypt.hash('correctpassword', 10),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully with valid refresh token', () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user-123' };

      jwtService.verify.mockReturnValue(payload);
      jwtService.sign.mockReturnValue('new-token');

      const result = service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        accessToken: 'new-token',
        refreshToken: 'new-token',
      });
    });

    it('should throw UnauthorizedException for invalid refresh token', () => {
      const refreshToken = 'invalid-refresh-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.refreshToken(refreshToken)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        token: 'valid-token',
      };

      const mockToken = {
        id: 'token-123',
        userId: 'user-123',
        token: 'valid-token',
        type: 'email_verification',
        usedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
        user: { id: 'user-123' },
      };

      prismaService.verificationToken.findUnique.mockResolvedValue(mockToken);
      prismaService.verificationToken.update.mockResolvedValue(mockToken);
      prismaService.user.update.mockResolvedValue({
        id: 'user-123',
        isVerified: true,
      });

      const result = await service.verifyEmail(verifyEmailDto);

      expect(prismaService.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token: 'valid-token' },
        include: { user: true },
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verified successfully');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        token: 'invalid-token',
      };

      prismaService.verificationToken.findUnique.mockResolvedValue(null);

      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for expired token', async () => {
      const verifyEmailDto: VerifyEmailDto = {
        token: 'expired-token',
      };

      const mockToken = {
        id: 'token-123',
        token: 'expired-token',
        usedAt: null,
        expiresAt: new Date(Date.now() - 3600000), // Expired
      };

      prismaService.verificationToken.findUnique.mockResolvedValue(mockToken);

      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email for existing user', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };

      const mockUser = { id: 'user-123', email: 'test@example.com' };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.passwordResetToken.create.mockResolvedValue({
        id: 'token-123',
      });
      emailProvider.sendEmail.mockResolvedValue(undefined);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'If an account with this email exists, a password reset link has been sent.',
      );
      expect(emailProvider.sendEmail).toHaveBeenCalled();
    });

    it('should not reveal if email does not exist', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'If an account with this email exists, a password reset link has been sent.',
      );
      expect(emailProvider.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'valid-reset-token',
        newPassword: 'newpassword123',
      };

      const mockToken = {
        id: 'token-123',
        userId: 'user-123',
        token: 'valid-reset-token',
        usedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
        user: { id: 'user-123' },
      };

      prismaService.passwordResetToken.findUnique.mockResolvedValue(mockToken);
      prismaService.passwordResetToken.update.mockResolvedValue(mockToken);
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.resetPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw BadRequestException for invalid reset token', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'invalid-token',
        newPassword: 'newpassword123',
      };

      prismaService.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      const mockUser = {
        id: 'user-123',
        passwordHash: await bcrypt.hash('oldpassword', 10),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.changePassword(
        'user-123',
        changePasswordDto,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password changed successfully');
    });

    it('should throw BadRequestException for incorrect current password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      const mockUser = {
        id: 'user-123',
        passwordHash: await bcrypt.hash('correctpassword', 10),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.changePassword('user-123', changePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'password',
        newPassword: 'newpassword123',
      };

      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('nonexistent-user', changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
