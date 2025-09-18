import { PrismaService } from '../prisma/prisma.service';
export declare class SocialService {
    private prisma;
    constructor(prisma: PrismaService);
    followUser(followerId: string, followingId: string): Promise<{
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
    unfollowUser(followerId: string, followingId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
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
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
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
    isFollowing(followerId: string, followingId: string): Promise<{
        success: boolean;
        data: {
            isFollowing: boolean;
        };
    }>;
    rateStory(userId: string, storyId: string, rating: number, review?: string): Promise<{
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
            updatedAt: Date;
            rating: number;
            userId: string;
            storyId: string;
            review: string | null;
        };
    }>;
    getStoryRating(userId: string, storyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            userId: string;
            storyId: string;
            review: string | null;
        } | null;
    }>;
    getStoryRatings(storyId: string, page?: number, limit?: number): Promise<{
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
                updatedAt: Date;
                rating: number;
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
    addComment(userId: string, storyId: string, content: string, parentCommentId?: string): Promise<{
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
    getStoryComments(storyId: string, page?: number, limit?: number): Promise<{
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
    deleteComment(userId: string, commentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    bookmarkStory(userId: string, storyId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            story: {
                id: string;
                title: string;
                description: string | null;
                coverImageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            storyId: string;
        };
    }>;
    unbookmarkStory(userId: string, storyId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserBookmarks(userId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            bookmarks: {
                story: {
                    averageRating: number;
                    totalRatings: number;
                    totalPlays: number;
                    id: string;
                    ratings: {
                        rating: number;
                    }[];
                    title: string;
                    description: string | null;
                    coverImageUrl: string | null;
                    author: {
                        id: string;
                        username: string;
                        displayName: string | null;
                    };
                    _count: {
                        ratings: number;
                        playSessions: number;
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
    isBookmarked(userId: string, storyId: string): Promise<{
        success: boolean;
        data: {
            isBookmarked: boolean;
        };
    }>;
}
