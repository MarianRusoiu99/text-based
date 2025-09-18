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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const discovery_service_1 = require("./discovery.service");
const discover_stories_dto_1 = require("./dto/discover-stories.dto");
let DiscoveryController = class DiscoveryController {
    discoveryService;
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    async discoverStories(filters) {
        return this.discoveryService.discoverStories(filters);
    }
    async getFeaturedStories(limit) {
        return this.discoveryService.getFeaturedStories(limit);
    }
    async getTrendingStories(limit) {
        return this.discoveryService.getTrendingStories(limit);
    }
    async getRecommendedStories(req, limit) {
        return this.discoveryService.getRecommendedStories(req.user.id, limit);
    }
    async getCategories() {
        return this.discoveryService.getCategories();
    }
    async getTags(limit) {
        return this.discoveryService.getTags(limit);
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('stories'),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discover_stories_dto_1.DiscoverStoriesDto]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "discoverStories", null);
__decorate([
    (0, common_1.Get)('featured'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getFeaturedStories", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getTrendingStories", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getRecommendedStories", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('tags'),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getTags", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, common_1.Controller)('discovery'),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map