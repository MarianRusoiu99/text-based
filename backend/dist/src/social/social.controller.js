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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const social_service_1 = require("./social.service");
const social_dto_1 = require("./dto/social.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SocialController = class SocialController {
    socialService;
    constructor(socialService) {
        this.socialService = socialService;
    }
    async followUser(userId, req) {
        return this.socialService.followUser(req.user.id, userId);
    }
    async unfollowUser(userId, req) {
        return this.socialService.unfollowUser(req.user.id, userId);
    }
    async getFollowers(userId, query) {
        return this.socialService.getFollowers(userId, query.page, query.limit);
    }
    async getFollowing(userId, query) {
        return this.socialService.getFollowing(userId, query.page, query.limit);
    }
    async isFollowing(userId, req) {
        return this.socialService.isFollowing(req.user.id, userId);
    }
    async rateStory(storyId, rateDto, req) {
        return this.socialService.rateStory(req.user.id, storyId, rateDto.rating, rateDto.review);
    }
    async getStoryRating(storyId, req) {
        return this.socialService.getStoryRating(req.user.id, storyId);
    }
    async getStoryRatings(storyId, query) {
        return this.socialService.getStoryRatings(storyId, query.page, query.limit);
    }
    async addComment(storyId, commentDto, req) {
        return this.socialService.addComment(req.user.id, storyId, commentDto.content, commentDto.parentCommentId);
    }
    async getStoryComments(storyId, query) {
        return this.socialService.getStoryComments(storyId, query.page, query.limit);
    }
    async deleteComment(commentId, req) {
        return this.socialService.deleteComment(req.user.id, commentId);
    }
    async bookmarkStory(storyId, req) {
        return this.socialService.bookmarkStory(req.user.id, storyId);
    }
    async unbookmarkStory(storyId, req) {
        return this.socialService.unbookmarkStory(req.user.id, storyId);
    }
    async getUserBookmarks(req, query) {
        return this.socialService.getUserBookmarks(req.user.id, query.page, query.limit);
    }
    async isBookmarked(storyId, req) {
        return this.socialService.isBookmarked(req.user.id, storyId);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Post)('users/:userId/follow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "followUser", null);
__decorate([
    (0, common_1.Delete)('users/:userId/follow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)('users/:userId/followers'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.GetPaginatedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)('users/:userId/following'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.GetPaginatedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.Get)('users/:userId/is-following'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "isFollowing", null);
__decorate([
    (0, common_1.Post)('stories/:storyId/rate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.RateStoryDto, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "rateStory", null);
__decorate([
    (0, common_1.Get)('stories/:storyId/rating'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getStoryRating", null);
__decorate([
    (0, common_1.Get)('stories/:storyId/ratings'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.GetPaginatedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getStoryRatings", null);
__decorate([
    (0, common_1.Post)('stories/:storyId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.AddCommentDto, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('stories/:storyId/comments'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.GetPaginatedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getStoryComments", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)('stories/:storyId/bookmark'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "bookmarkStory", null);
__decorate([
    (0, common_1.Delete)('stories/:storyId/bookmark'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "unbookmarkStory", null);
__decorate([
    (0, common_1.Get)('bookmarks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, social_dto_1.GetPaginatedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getUserBookmarks", null);
__decorate([
    (0, common_1.Get)('stories/:storyId/is-bookmarked'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "isBookmarked", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('social'),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map