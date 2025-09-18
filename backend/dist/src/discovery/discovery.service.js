"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscoveryService = class DiscoveryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async discoverStories(filters = {}) {
        const { search, category, tags, authorId, minRating = 0, maxRating = 5, sortBy = 'newest', page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const where = {
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
        let orderBy;
        switch (sortBy) {
            case 'newest':
                orderBy = { publishedAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { publishedAt: 'asc' };
                break;
            case 'rating':
                orderBy = { publishedAt: 'desc' };
                break;
            case 'popular':
                orderBy = { playSessions: { _count: 'desc' } };
                break;
            case 'trending':
                orderBy = { publishedAt: 'desc' };
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
        let filteredStories = stories.map((story) => {
            const ratings = story.ratings;
            const averageRating = ratings.length > 0
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
        filteredStories = filteredStories.filter((story) => story.averageRating >= minRating && story.averageRating <= maxRating);
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
            const averageRating = ratings.length > 0
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
            const averageRating = ratings.length > 0
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
    async getRecommendedStories(userId, limit = 10) {
        const userRatings = await this.prisma.rating.findMany({
            where: {
                userId,
                rating: {
                    gte: 4,
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
        const preferredTags = new Set();
        const preferredCategories = new Set();
        userRatings.forEach((rating) => {
            rating.story.tags.forEach((tag) => preferredTags.add(tag));
            if (rating.story.category) {
                preferredCategories.add(rating.story.category);
            }
        });
        const playedStoryIds = await this.prisma.playSession
            .findMany({
            where: { userId },
            select: { storyId: true },
        })
            .then((sessions) => sessions.map((s) => s.storyId));
        const baseWhere = {
            isPublished: true,
            id: {
                notIn: playedStoryIds,
            },
            authorId: {
                not: userId,
            },
        };
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
                    _count: 'desc',
                },
            },
        });
        const storiesWithStats = stories.map((story) => {
            const ratings = story.ratings;
            const averageRating = ratings.length > 0
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
        const stories = await this.prisma.story.findMany({
            where: { isPublished: true },
            select: {
                tags: true,
            },
        });
        const tagCounts = new Map();
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
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map