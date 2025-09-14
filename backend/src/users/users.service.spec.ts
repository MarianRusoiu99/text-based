import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'http://example.com/avatar.jpg',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'user-123';
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = 'user-123';
      const updateDto: UpdateProfileDto = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };
      const mockUpdatedUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Updated Name',
        bio: 'Updated bio',
        avatarUrl: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateProfile(userId, updateDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          displayName: updateDto.displayName,
          bio: updateDto.bio,
          avatarUrl: updateDto.avatarUrl,
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual({
        success: true,
        message: 'Profile updated successfully',
        data: mockUpdatedUser,
      });
    });
  });

  describe('getPublicProfile', () => {
    it('should return public user profile successfully', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        username: 'testuser',
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'http://example.com/avatar.jpg',
        createdAt: new Date(),
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getPublicProfile(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'user-123';
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getPublicProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
