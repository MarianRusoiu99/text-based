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
exports.StoriesController = void 0;
const common_1 = require("@nestjs/common");
const stories_service_1 = require("./stories.service");
const create_story_dto_1 = require("./dto/create-story.dto");
const create_chapter_dto_1 = require("./dto/create-chapter.dto");
const update_chapter_dto_1 = require("./dto/update-chapter.dto");
const create_story_variable_dto_1 = require("./dto/create-story-variable.dto");
const update_story_variable_dto_1 = require("./dto/update-story-variable.dto");
const create_item_dto_1 = require("./dto/create-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let StoriesController = class StoriesController {
    storiesService;
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    create(createStoryDto, req) {
        return this.storiesService.create(req.user.id, createStoryDto);
    }
    findAll(query) {
        return this.storiesService.findAll(query);
    }
    findOne(id, req) {
        return this.storiesService.findOne(id, req.user?.id);
    }
    update(id, updateData, req) {
        return this.storiesService.update(id, req.user.id, updateData);
    }
    remove(id, req) {
        return this.storiesService.remove(id, req.user.id);
    }
    publish(id, isPublished, req) {
        return this.storiesService.publish(id, req.user.id, isPublished);
    }
    createChapter(storyId, createChapterDto, req) {
        return this.storiesService.createChapter(storyId, req.user.id, createChapterDto);
    }
    findChapters(storyId, req) {
        return this.storiesService.findChapters(storyId, req.user?.id);
    }
    findChapter(storyId, chapterId, req) {
        return this.storiesService.findChapter(storyId, chapterId, req.user?.id);
    }
    updateChapter(storyId, chapterId, updateChapterDto, req) {
        return this.storiesService.updateChapter(storyId, chapterId, req.user.id, updateChapterDto);
    }
    deleteChapter(storyId, chapterId, req) {
        return this.storiesService.deleteChapter(storyId, chapterId, req.user.id);
    }
    reorderChapters(storyId, chapterOrders, req) {
        return this.storiesService.reorderChapters(storyId, req.user.id, chapterOrders);
    }
    createStoryVariable(storyId, createVariableDto, req) {
        return this.storiesService.createStoryVariable(storyId, req.user.id, createVariableDto);
    }
    findStoryVariables(storyId, req) {
        return this.storiesService.findStoryVariables(storyId, req.user?.id);
    }
    updateStoryVariable(storyId, variableId, updateVariableDto, req) {
        return this.storiesService.updateStoryVariable(storyId, variableId, req.user.id, updateVariableDto);
    }
    deleteStoryVariable(storyId, variableId, req) {
        return this.storiesService.deleteStoryVariable(storyId, variableId, req.user.id);
    }
    createItem(storyId, createItemDto, req) {
        return this.storiesService.createItem(storyId, req.user.id, createItemDto);
    }
    findItems(storyId, req) {
        return this.storiesService.findItems(storyId, req.user?.id);
    }
    updateItem(storyId, itemId, updateItemDto, req) {
        return this.storiesService.updateItem(storyId, itemId, req.user.id, updateItemDto);
    }
    deleteItem(storyId, itemId, req) {
        return this.storiesService.deleteItem(storyId, itemId, req.user.id);
    }
};
exports.StoriesController = StoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_story_dto_1.CreateStoryDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isPublished')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':storyId/chapters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chapter_dto_1.CreateChapterDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createChapter", null);
__decorate([
    (0, common_1.Get)(':storyId/chapters'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findChapters", null);
__decorate([
    (0, common_1.Get)(':storyId/chapters/:chapterId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('chapterId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findChapter", null);
__decorate([
    (0, common_1.Put)(':storyId/chapters/:chapterId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('chapterId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_chapter_dto_1.UpdateChapterDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateChapter", null);
__decorate([
    (0, common_1.Delete)(':storyId/chapters/:chapterId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('chapterId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "deleteChapter", null);
__decorate([
    (0, common_1.Post)(':storyId/chapters/reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)('chapterOrders')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "reorderChapters", null);
__decorate([
    (0, common_1.Post)(':storyId/variables'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_story_variable_dto_1.CreateStoryVariableDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createStoryVariable", null);
__decorate([
    (0, common_1.Get)(':storyId/variables'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findStoryVariables", null);
__decorate([
    (0, common_1.Put)(':storyId/variables/:variableId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('variableId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_story_variable_dto_1.UpdateStoryVariableDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateStoryVariable", null);
__decorate([
    (0, common_1.Delete)(':storyId/variables/:variableId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('variableId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "deleteStoryVariable", null);
__decorate([
    (0, common_1.Post)(':storyId/items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_item_dto_1.CreateItemDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)(':storyId/items'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findItems", null);
__decorate([
    (0, common_1.Put)(':storyId/items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_item_dto_1.UpdateItemDto, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':storyId/items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "deleteItem", null);
exports.StoriesController = StoriesController = __decorate([
    (0, common_1.Controller)('stories'),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], StoriesController);
//# sourceMappingURL=stories.controller.js.map