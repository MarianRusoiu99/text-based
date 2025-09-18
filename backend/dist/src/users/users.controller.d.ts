import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RequestUser } from '../auth/request-user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: {
        user: RequestUser;
    }): Promise<{
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
    updateProfile(req: {
        user: RequestUser;
    }, updateProfileDto: UpdateProfileDto): Promise<{
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
