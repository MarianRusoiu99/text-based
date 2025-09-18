import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            stats: {
                totalStories: number;
                totalFollowers: number;
                totalFollowing: number;
                totalRatings: number;
                totalComments: number;
                totalPlaySessions: number;
            };
            id: string;
            username: string;
            email: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                stories: number;
                ratings: number;
                comments: number;
                playSessions: number;
                followers: number;
                following: number;
            };
        };
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            username: string;
            email: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getPublicProfile(userId: string): Promise<{
        success: boolean;
        data: {
            stats: {
                totalStories: number;
                totalFollowers: number;
                totalFollowing: number;
            };
            id: string;
            username: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            _count: {
                stories: number;
                followers: number;
                following: number;
            };
        };
    }>;
}
