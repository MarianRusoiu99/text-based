"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailProvider;
    logger;
    constructor(prisma, jwtService, emailProvider, logger) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailProvider = emailProvider;
        this.logger = logger;
    }
    async onModuleInit() {
        const defaultUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: 'test@example.com' }, { username: 'testuser' }],
            },
        });
        if (!defaultUser) {
            const hashedPassword = await bcrypt.hash('password123', 12);
            await this.prisma.user.create({
                data: {
                    email: 'test@example.com',
                    username: 'testuser',
                    displayName: 'Test User',
                    passwordHash: hashedPassword,
                    isVerified: true,
                },
            });
            console.log('Default test user created: test@example.com / password123');
        }
    }
    async register(registerDto) {
        const { email, username, password, displayName } = registerDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                passwordHash: hashedPassword,
                displayName,
            },
        });
        const verificationToken = await this.generateVerificationToken(user.id, 'email_verification');
        await this.sendVerificationEmail(user.email, verificationToken);
        const tokens = this.generateTokens(user.id);
        this.logger.log('info', 'User registered successfully', {
            userId: user.id,
            email: user.email,
        });
        return {
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    displayName: user.displayName,
                    isVerified: user.isVerified,
                },
                ...tokens,
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const tokens = this.generateTokens(user.id);
        return {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    displayName: user.displayName,
                },
                ...tokens,
            },
        };
    }
    refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const tokens = this.generateTokens(payload.sub);
            return {
                success: true,
                message: 'Token refreshed successfully',
                data: tokens,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async verifyEmail(verifyEmailDto) {
        const { token } = verifyEmailDto;
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!verificationToken) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        if (verificationToken.usedAt) {
            throw new common_1.BadRequestException('Token has already been used');
        }
        if (verificationToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification token has expired');
        }
        await this.prisma.$transaction([
            this.prisma.verificationToken.update({
                where: { id: verificationToken.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: verificationToken.userId },
                data: { isVerified: true },
            }),
        ]);
        this.logger.log('info', 'Email verified successfully', { userId: verificationToken.userId });
        return {
            success: true,
            message: 'Email verified successfully',
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent.',
            };
        }
        await this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() },
        });
        const resetToken = await this.generatePasswordResetToken(user.id);
        await this.sendPasswordResetEmail(user.email, resetToken);
        this.logger.log('info', 'Password reset requested', { userId: user.id, email: user.email });
        return {
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent.',
        };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid reset token');
        }
        if (resetToken.usedAt) {
            throw new common_1.BadRequestException('Token has already been used');
        }
        if (resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash: hashedPassword },
            }),
        ]);
        this.logger.log('info', 'Password reset successfully', { userId: resetToken.userId });
        return {
            success: true,
            message: 'Password reset successfully',
        };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedNewPassword },
        });
        this.logger.log('info', 'Password changed successfully', { userId });
        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                token: refreshToken,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
        this.logger.log('info', 'User logged out', { userId });
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }
    generateTokens(userId) {
        const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '24h' });
        const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '30d', secret: process.env.JWT_REFRESH_SECRET });
        return {
            accessToken,
            refreshToken,
        };
    }
    async generateVerificationToken(userId, type) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.prisma.verificationToken.create({
            data: {
                userId,
                token,
                type,
                expiresAt,
            },
        });
        return token;
    }
    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        await this.emailProvider.sendEmail({
            to: email,
            subject: 'Verify your email address',
            html: `
        <h1>Welcome to Text-Based Adventure Platform!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
            text: `Welcome to Text-Based Adventure Platform! Please visit ${verificationUrl} to verify your email address. This link will expire in 24 hours.`,
        });
    }
    async generatePasswordResetToken(userId) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
        return token;
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.emailProvider.sendEmail({
            to: email,
            subject: 'Reset your password',
            html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
            text: `You requested a password reset. Visit ${resetUrl} to reset your password. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('IEmailProvider')),
    __param(3, (0, common_1.Inject)('ILoggerProvider')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, Object, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map