import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = mockPrismaService;
    jwtService = mockJwtService;
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
});
