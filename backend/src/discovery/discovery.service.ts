import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscoverStoriesDto } from './dto/discover-stories.dto';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) {}

  async discoverStories(filters: DiscoverStoriesDto = {}) {
    const {
      search,
      category,
      tags,
      authorId,
      minRating = 0,
      maxRating = 5,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause with proper typing
    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { displayName: { contains: search, mode: 'insensitive' } } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // Build order by
    let orderBy: any;
    switch (sortBy) {
      case 'newest':
        orderBy = { publishedAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { publishedAt: 'asc' };
        break;
      case 'rating':
        // We'll handle this after fetching
        orderBy = { publishedAt: 'desc' };
        break;
      case 'popular':
        // Sort by total play sessions
        orderBy = { playSessions: { _count: 'desc' } };
        break;
      case 'trending':
        // Sort by recent play sessions (last 30 days)
        orderBy = { publishedAt: 'desc' }; // Simplified for now
        break;
      default:
        orderBy = { publishedAt: 'desc' };
    }

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
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
              comments: true,
              playSessions: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.story.count({ where }),
    ]);

    // Calculate ratings and filter by rating range
    let filteredStories = stories.map((story) => {
      const ratings = story.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        ...story,
        averageRating,
        totalRatings: story._count.ratings,
        totalComments: story._count.comments,
        totalPlays: story._count.playSessions,
      };
    });

    // Filter by rating range
    filteredStories = filteredStories.filter(
      (story) =>
        story.averageRating >= minRating && story.averageRating <= maxRating,
    );

    // Sort by rating if requested
    if (sortBy === 'rating') {
      filteredStories.sort((a, b) => b.averageRating - a.averageRating);
    }

    return {
      success: true,
      data: {
        stories: filteredStories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          applied: {
            search,
            category,
            tags,
            authorId,
            minRating,
            maxRating,
            sortBy,
          },
        },
      },
    };
  }

  async getFeaturedStories(limit = 10) {
    const stories = await this.prisma.story.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
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
            comments: true,
            playSessions: true,
          },
        },
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });

    const storiesWithStats = stories.map((story) => {
      const ratings = story.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        ...story,
        averageRating,
        totalRatings: story._count.ratings,
        totalComments: story._count.comments,
        totalPlays: story._count.playSessions,
      };
    });

    return {
      success: true,
      data: storiesWithStats,
    };
  }

  async getTrendingStories(limit = 10) {
    // Get stories with most play sessions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stories = await this.prisma.story.findMany({
      where: {
        isPublished: true,
        playSessions: {
          some: {
            startedAt: {
              gte: sevenDaysAgo,
            },
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
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
            comments: true,
            playSessions: {
              where: {
                startedAt: {
                  gte: sevenDaysAgo,
                },
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        playSessions: {
          _count: 'desc',
        },
      },
    });

    const storiesWithStats = stories.map((story) => {
      const ratings = story.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        ...story,
        averageRating,
        totalRatings: story._count.ratings,
        totalComments: story._count.comments,
        recentPlays: story._count.playSessions,
      };
    });

    return {
      success: true,
      data: storiesWithStats,
    };
  }

  async getRecommendedStories(userId: string, limit = 10) {
    // Simple recommendation based on user's play history and ratings
    // Get genres/tags from user's highly rated stories
    const userRatings = await this.prisma.rating.findMany({
      where: {
        userId,
        rating: {
          gte: 4, // Highly rated stories
        },
      },
      include: {
        story: {
          select: {
            tags: true,
            category: true,
          },
        },
      },
    });

    const preferredTags = new Set<string>();
    const preferredCategories = new Set<string>();

    userRatings.forEach((rating) => {
      rating.story.tags.forEach((tag) => preferredTags.add(tag));
      if (rating.story.category) {
        preferredCategories.add(rating.story.category);
      }
    });

    // Find stories with similar tags/categories that user hasn't played
    const playedStoryIds = await this.prisma.playSession
      .findMany({
        where: { userId },
        select: { storyId: true },
      })
      .then((sessions) => sessions.map((s) => s.storyId));

    // Find stories with similar tags/categories that user hasn't played
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseWhere: any = {
      isPublished: true,
      id: {
        notIn: playedStoryIds,
      },
      authorId: {
        not: userId, // Don't recommend own stories
      },
    };

    // Add tag/category preferences
    if (preferredTags.size > 0 || preferredCategories.size > 0) {
      baseWhere.OR = [];

      if (preferredTags.size > 0) {
        baseWhere.OR.push({
          tags: {
            hasSome: Array.from(preferredTags),
          },
        });
      }

      if (preferredCategories.size > 0) {
        baseWhere.OR.push({
          category: {
            in: Array.from(preferredCategories),
          },
        });
      }
    }

    const stories = await this.prisma.story.findMany({
      where: baseWhere,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
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
            comments: true,
            playSessions: true,
          },
        },
      },
      take: limit,
      orderBy: {
        ratings: {
          _count: 'desc', // Popular stories first
        },
      },
    });

    const storiesWithStats = stories.map((story) => {
      const ratings = story.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        ...story,
        averageRating,
        totalRatings: story._count.ratings,
        totalComments: story._count.comments,
        totalPlays: story._count.playSessions,
      };
    });

    return {
      success: true,
      data: storiesWithStats,
    };
  }

  async getCategories() {
    const categories = await this.prisma.story.groupBy({
      by: ['category'],
      where: {
        isPublished: true,
        category: {
          not: null,
        },
      },
      _count: {
        category: true,
      },
    });

    const categoryStats = categories.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));

    return {
      success: true,
      data: categoryStats,
    };
  }

  async getTags(limit = 50) {
    // Get all tags with their usage count
    const stories = await this.prisma.story.findMany({
      where: { isPublished: true },
      select: {
        tags: true,
      },
    });

    const tagCounts = new Map<string, number>();

    stories.forEach((story) => {
      story.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ name: tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return {
      success: true,
      data: tags,
    };
  }
}
