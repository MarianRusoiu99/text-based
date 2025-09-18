import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { IEmailProvider } from './providers/email-provider.interface';
import type { ILoggerProvider } from './providers/logger-provider.interface';
export declare class AuthService implements OnModuleInit {
    private prisma;
    private jwtService;
    private emailProvider;
    private logger;
    constructor(prisma: PrismaService, jwtService: JwtService, emailProvider: IEmailProvider, logger: ILoggerProvider);
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
                isVerified: boolean;
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
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateTokens;
    private generateVerificationToken;
    private sendVerificationEmail;
    private generatePasswordResetToken;
    private sendPasswordResetEmail;
}
