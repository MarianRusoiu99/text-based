import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
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
