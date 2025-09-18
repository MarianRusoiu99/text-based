import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
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
        _count: {
          select: {
            stories: true,
            followers: true,
            following: true,
            ratings: true,
            comments: true,
            playSessions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: {
        ...user,
        stats: {
          totalStories: user._count.stories,
          totalFollowers: user._count.followers,
          totalFollowing: user._count.following,
          totalRatings: user._count.ratings,
          totalComments: user._count.comments,
          totalPlaySessions: user._count.playSessions,
        },
      },
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: updateProfileDto.displayName,
        bio: updateProfileDto.bio,
        avatarUrl: updateProfileDto.avatarUrl,
        updatedAt: new Date(),
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

    return {
      success: true,
      message: 'Profile updated successfully',
      data: user,
    };
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            stories: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: {
        ...user,
        stats: {
          totalStories: user._count.stories,
          totalFollowers: user._count.followers,
          totalFollowing: user._count.following,
        },
      },
    };
  }
}
