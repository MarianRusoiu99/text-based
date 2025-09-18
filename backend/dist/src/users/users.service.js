"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        stories: true,
                        followers: true,
                        following: true,
                        ratings: true,
                        comments: true,
                        playSessions: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: {
                ...user,
                stats: {
                    totalStories: user._count.stories,
                    totalFollowers: user._count.followers,
                    totalFollowing: user._count.following,
                    totalRatings: user._count.ratings,
                    totalComments: user._count.comments,
                    totalPlaySessions: user._count.playSessions,
                },
            },
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                displayName: updateProfileDto.displayName,
                bio: updateProfileDto.bio,
                avatarUrl: updateProfileDto.avatarUrl,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return {
            success: true,
            message: 'Profile updated successfully',
            data: user,
        };
    }
    async getPublicProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        stories: true,
                        followers: true,
                        following: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: {
                ...user,
                stats: {
                    totalStories: user._count.stories,
                    totalFollowers: user._count.followers,
                    totalFollowing: user._count.following,
                },
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map