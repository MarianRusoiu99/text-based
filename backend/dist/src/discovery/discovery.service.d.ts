import { PrismaService } from '../prisma/prisma.service';
import { DiscoverStoriesDto } from './dto/discover-stories.dto';
export declare class DiscoveryService {
    private prisma;
    constructor(prisma: PrismaService);
    discoverStories(filters?: DiscoverStoriesDto): Promise<{
        success: boolean;
        data: {
            stories: {
                averageRating: number;
                totalRatings: number;
                totalComments: number;
                totalPlays: number;
                ratings: {
                    rating: number;
                }[];
                _count: {
                    ratings: number;
                    comments: number;
                    playSessions: number;
                };
                author: {
                    id: string;
                    username: string;
                    displayName: string | null;
                    avatarUrl: string | null;
                };
                id: string;
                description: string | null;
                category: string | null;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                visibility: string;
                isPublished: boolean;
                coverImageUrl: string | null;
                tags: string[];
                isFeatured: boolean;
                contentRating: string;
                estimatedDuration: number | null;
                publishedAt: Date | null;
                authorId: string;
                rpgTemplateId: string | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
            filters: {
                applied: {
                    search: string | undefined;
                    category: string | undefined;
                    tags: string[] | undefined;
                    authorId: string | undefined;
                    minRating: number;
                    maxRating: number;
                    sortBy: "rating" | "newest" | "oldest" | "popular" | "trending";
                };
            };
        };
    }>;
    getFeaturedStories(limit?: number): Promise<{
        success: boolean;
        data: {
            averageRating: number;
            totalRatings: number;
            totalComments: number;
            totalPlays: number;
            ratings: {
                rating: number;
            }[];
            _count: {
                ratings: number;
                comments: number;
                playSessions: number;
            };
            author: {
                id: string;
                username: string;
                displayName: string | null;
                avatarUrl: string | null;
            };
            id: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            visibility: string;
            isPublished: boolean;
            coverImageUrl: string | null;
            tags: string[];
            isFeatured: boolean;
            contentRating: string;
            estimatedDuration: number | null;
            publishedAt: Date | null;
            authorId: string;
            rpgTemplateId: string | null;
        }[];
    }>;
    getTrendingStories(limit?: number): Promise<{
        success: boolean;
        data: {
            averageRating: number;
            totalRatings: number;
            totalComments: number;
            recentPlays: number;
            ratings: {
                rating: number;
            }[];
            _count: {
                ratings: number;
                comments: number;
                playSessions: number;
            };
            author: {
                id: string;
                username: string;
                displayName: string | null;
                avatarUrl: string | null;
            };
            id: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            visibility: string;
            isPublished: boolean;
            coverImageUrl: string | null;
            tags: string[];
            isFeatured: boolean;
            contentRating: string;
            estimatedDuration: number | null;
            publishedAt: Date | null;
            authorId: string;
            rpgTemplateId: string | null;
        }[];
    }>;
    getRecommendedStories(userId: string, limit?: number): Promise<{
        success: boolean;
        data: {
            averageRating: number;
            totalRatings: number;
            totalComments: number;
            totalPlays: number;
            ratings: {
                rating: number;
            }[];
            _count: {
                ratings: number;
                comments: number;
                playSessions: number;
            };
            author: {
                id: string;
                username: string;
                displayName: string | null;
                avatarUrl: string | null;
            };
            id: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            visibility: string;
            isPublished: boolean;
            coverImageUrl: string | null;
            tags: string[];
            isFeatured: boolean;
            contentRating: string;
            estimatedDuration: number | null;
            publishedAt: Date | null;
            authorId: string;
            rpgTemplateId: string | null;
        }[];
    }>;
    getCategories(): Promise<{
        success: boolean;
        data: {
            name: string | null;
            count: number;
        }[];
    }>;
    getTags(limit?: number): Promise<{
        success: boolean;
        data: {
            name: string;
            count: number;
        }[];
    }>;
}
