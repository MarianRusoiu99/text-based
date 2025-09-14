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
            username: string;
            email: string;
            displayName: string | null;
            id: string;
            bio: string | null;
            avatarUrl: string | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateProfile(req: {
        user: RequestUser;
    }, updateProfileDto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            username: string;
            email: string;
            displayName: string | null;
            id: string;
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
            username: string;
            displayName: string | null;
            id: string;
            bio: string | null;
            avatarUrl: string | null;
            createdAt: Date;
        };
    }>;
}
