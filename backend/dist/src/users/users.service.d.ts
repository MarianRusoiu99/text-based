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
            createdAt: Date;
            username: string;
            email: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            isVerified: boolean;
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
            createdAt: Date;
            username: string;
            email: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            isVerified: boolean;
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
            createdAt: Date;
            username: string;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            _count: {
                stories: number;
                followers: number;
                following: number;
            };
        };
    }>;
}
