import { SocialService } from './social.service';
import { RateStoryDto, AddCommentDto, GetPaginatedDto } from './dto/social.dto';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';
interface AuthenticatedRequest extends Request {
    user: RequestUser;
}
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    followUser(userId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            following: {
                id: string;
                username: string;
                displayName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            followerId: string;
            followingId: string;
        };
    }>;
    unfollowUser(userId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    getFollowers(userId: string, query: GetPaginatedDto): Promise<{
        success: boolean;
        data: {
            followers: {
                id: string;
                username: string;
                displayName: string | null;
                bio: string | null;
                avatarUrl: string | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getFollowing(userId: string, query: GetPaginatedDto): Promise<{
        success: boolean;
        data: {
            following: {
                id: string;
                username: string;
                displayName: string | null;
                bio: string | null;
                avatarUrl: string | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    isFollowing(userId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            isFollowing: boolean;
        };
    }>;
    rateStory(storyId: string, rateDto: RateStoryDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            story: {
                id: string;
                title: string;
                author: {
                    id: string;
                    username: string;
                    displayName: string | null;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            updatedAt: Date;
            userId: string;
            storyId: string;
            review: string | null;
        };
    }>;
    getStoryRating(storyId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            rating: number;
            updatedAt: Date;
            userId: string;
            storyId: string;
            review: string | null;
        } | null;
    }>;
    getStoryRatings(storyId: string, query: GetPaginatedDto): Promise<{
        success: boolean;
        data: {
            ratings: ({
                user: {
                    id: string;
                    username: string;
                    displayName: string | null;
                    avatarUrl: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                rating: number;
                updatedAt: Date;
                userId: string;
                storyId: string;
                review: string | null;
            })[];
            stats: {
                totalRatings: number;
                averageRating: number;
            };
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    addComment(storyId: string, commentDto: AddCommentDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                username: string;
                displayName: string | null;
                avatarUrl: string | null;
            };
            replies: ({
                user: {
                    id: string;
                    username: string;
                    displayName: string | null;
                    avatarUrl: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                storyId: string;
                parentCommentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            storyId: string;
            parentCommentId: string | null;
        };
    }>;
    getStoryComments(storyId: string, query: GetPaginatedDto): Promise<{
        success: boolean;
        data: {
            comments: ({
                user: {
                    id: string;
                    username: string;
                    displayName: string | null;
                    avatarUrl: string | null;
                };
                _count: {
                    replies: number;
                };
                replies: ({
                    user: {
                        id: string;
                        username: string;
                        displayName: string | null;
                        avatarUrl: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    content: string;
                    storyId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                storyId: string;
                parentCommentId: string | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    deleteComment(commentId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    bookmarkStory(storyId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            story: {
                id: string;
                description: string | null;
                title: string;
                coverImageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            storyId: string;
        };
    }>;
    unbookmarkStory(storyId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserBookmarks(req: AuthenticatedRequest, query: GetPaginatedDto): Promise<{
        success: boolean;
        data: {
            bookmarks: {
                story: {
                    averageRating: number;
                    totalRatings: number;
                    totalPlays: number;
                    id: string;
                    description: string | null;
                    ratings: {
                        rating: number;
                    }[];
                    _count: {
                        ratings: number;
                        playSessions: number;
                    };
                    title: string;
                    coverImageUrl: string | null;
                    author: {
                        id: string;
                        username: string;
                        displayName: string | null;
                    };
                };
                id: string;
                createdAt: Date;
                userId: string;
                storyId: string;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    isBookmarked(storyId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            isBookmarked: boolean;
        };
    }>;
}
export {};
