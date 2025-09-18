import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // Following System
  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = await this.prisma.userFollow.create({
      data: {
        followerId,
        followingId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'User followed successfully',
      data: follow,
    };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return {
      success: true,
      message: 'User unfollowed successfully',
    };
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.prisma.userFollow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userFollow.count({
        where: { followingId: userId },
      }),
    ]);

    return {
      success: true,
      data: {
        followers: followers.map(f => f.follower),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      this.prisma.userFollow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userFollow.count({
        where: { followerId: userId },
      }),
    ]);

    return {
      success: true,
      data: {
        following: following.map(f => f.following),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return {
      success: true,
      data: {
        isFollowing: !!follow,
      },
    };
  }

  // Story Ratings
  async rateStory(userId: string, storyId: string, rating: number, review?: string) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Verify story exists and is published
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, isPublished: true, authorId: true },
    });

    if (!story || !story.isPublished) {
      throw new NotFoundException('Story not found or not published');
    }

    if (story.authorId === userId) {
      throw new BadRequestException('Cannot rate your own story');
    }

    const userRating = await this.prisma.rating.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId,
        },
      },
      update: {
        rating,
        review,
        updatedAt: new Date(),
      },
      create: {
        storyId,
        userId,
        rating,
        review,
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Story rated successfully',
      data: userRating,
    };
  }

  async getStoryRating(userId: string, storyId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId,
        },
      },
    });

    return {
      success: true,
      data: rating,
    };
  }

  async getStoryRatings(storyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [ratings, total, stats] = await Promise.all([
      this.prisma.rating.findMany({
        where: { storyId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rating.count({ where: { storyId } }),
      this.prisma.rating.aggregate({
        where: { storyId },
        _count: { rating: true },
        _avg: { rating: true },
      }),
    ]);

    return {
      success: true,
      data: {
        ratings,
        stats: {
          totalRatings: total,
          averageRating: stats._avg.rating || 0,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  // Story Comments
  async addComment(userId: string, storyId: string, content: string, parentCommentId?: string) {
    // Verify story exists and is published
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, isPublished: true },
    });

    if (!story || !story.isPublished) {
      throw new NotFoundException('Story not found or not published');
    }

    // If parent comment exists, verify it belongs to the same story
    if (parentCommentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentCommentId },
        select: { storyId: true },
      });

      if (!parentComment || parentComment.storyId !== storyId) {
        throw new BadRequestException('Invalid parent comment');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        storyId,
        userId,
        content,
        parentCommentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      success: true,
      message: 'Comment added successfully',
      data: comment,
    };
  }

  async getStoryComments(storyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Get top-level comments only (no parent)
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          storyId,
          parentCommentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: { replies: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({
        where: {
          storyId,
          parentCommentId: null,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('Cannot delete another user\'s comment');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }

  // Story Bookmarks
  async bookmarkStory(userId: string, storyId: string) {
    // Verify story exists and is published
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, isPublished: true },
    });

    if (!story || !story.isPublished) {
      throw new NotFoundException('Story not found or not published');
    }

    // Check if already bookmarked
    const existingBookmark = await this.prisma.storyBookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (existingBookmark) {
      throw new BadRequestException('Story already bookmarked');
    }

    const bookmark = await this.prisma.storyBookmark.create({
      data: {
        userId,
        storyId,
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImageUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Story bookmarked successfully',
      data: bookmark,
    };
  }

  async unbookmarkStory(userId: string, storyId: string) {
    const bookmark = await this.prisma.storyBookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.storyBookmark.delete({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    return {
      success: true,
      message: 'Story unbookmarked successfully',
    };
  }

  async getUserBookmarks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.storyBookmark.findMany({
        where: { userId },
        include: {
          story: {
            select: {
              id: true,
              title: true,
              description: true,
              coverImageUrl: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                },
              },
              ratings: {
                select: {
                  rating: true,
                },
              },
              _count: {
                select: {
                  ratings: true,
                  playSessions: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.storyBookmark.count({ where: { userId } }),
    ]);

    // Calculate average ratings for each story
    const bookmarksWithStats = bookmarks.map(bookmark => ({
      ...bookmark,
      story: {
        ...bookmark.story,
        averageRating: bookmark.story.ratings.length > 0
          ? bookmark.story.ratings.reduce((sum, r) => sum + r.rating, 0) / bookmark.story.ratings.length
          : 0,
        totalRatings: bookmark.story._count.ratings,
        totalPlays: bookmark.story._count.playSessions,
      },
    }));

    return {
      success: true,
      data: {
        bookmarks: bookmarksWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async isBookmarked(userId: string, storyId: string) {
    const bookmark = await this.prisma.storyBookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    return {
      success: true,
      data: {
        isBookmarked: !!bookmark,
      },
    };
  }
}
