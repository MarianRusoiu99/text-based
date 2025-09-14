import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService implements OnModuleInit {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                username: string;
                email: string;
                displayName: string | null;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                username: string;
                email: string;
                displayName: string | null;
            };
        };
    }>;
    refreshToken(refreshToken: string): {
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    };
    private generateTokens;
}
