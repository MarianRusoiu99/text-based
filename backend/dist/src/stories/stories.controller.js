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
const create_node_dto_1 = require("./dto/create-node.dto");
const create_choice_dto_1 = require("./dto/create-choice.dto");
const create_item_dto_1 = require("./dto/create-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let StoriesController = class StoriesController {
    storiesService;
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    create(createStoryDto, req) {
        const userId = req.user?.id || 'test-user-id';
        return this.storiesService.create(userId, createStoryDto);
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
        return this.storiesService.createStoryVariable(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', createVariableDto);
    }
    findStoryVariables(storyId) {
        return this.storiesService.findStoryVariables(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    updateStoryVariable(storyId, variableId, updateVariableDto) {
        return this.storiesService.updateStoryVariable(storyId, variableId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', updateVariableDto);
    }
    deleteStoryVariable(storyId, variableId) {
        return this.storiesService.deleteStoryVariable(storyId, variableId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    createItem(storyId, createItemDto) {
        return this.storiesService.createItem(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', createItemDto);
    }
    findItems(storyId) {
        return this.storiesService.findItems(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    updateItem(storyId, itemId, updateItemDto) {
        return this.storiesService.updateItem(storyId, itemId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', updateItemDto);
    }
    deleteItem(storyId, itemId) {
        return this.storiesService.deleteItem(storyId, itemId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    createNode(storyId, createNodeDto) {
        return this.storiesService.createNode(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', createNodeDto);
    }
    findNodes(storyId) {
        return this.storiesService.findNodes(storyId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    updateNode(nodeId, updateNodeDto) {
        return this.storiesService.updateNode(nodeId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', updateNodeDto);
    }
    removeNode(nodeId) {
        return this.storiesService.removeNode(nodeId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
    createChoice(fromNodeId, createChoiceDto) {
        return this.storiesService.createChoice(fromNodeId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', createChoiceDto);
    }
    updateChoice(choiceId, updateChoiceDto) {
        return this.storiesService.updateChoice(choiceId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9', updateChoiceDto);
    }
    removeChoice(choiceId) {
        return this.storiesService.removeChoice(choiceId, '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9');
    }
};
exports.StoriesController = StoriesController;
__decorate([
    (0, common_1.Post)(),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findStoryVariables", null);
__decorate([
    (0, common_1.Put)(':storyId/variables/:variableId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('variableId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_story_variable_dto_1.UpdateStoryVariableDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateStoryVariable", null);
__decorate([
    (0, common_1.Delete)(':storyId/variables/:variableId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('variableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "deleteStoryVariable", null);
__decorate([
    (0, common_1.Post)(':storyId/items'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)(':storyId/items'),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findItems", null);
__decorate([
    (0, common_1.Put)(':storyId/items/:itemId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':storyId/items/:itemId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)(':storyId/nodes'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_node_dto_1.CreateNodeDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createNode", null);
__decorate([
    (0, common_1.Get)(':storyId/nodes'),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "findNodes", null);
__decorate([
    (0, common_1.Put)('nodes/:nodeId'),
    __param(0, (0, common_1.Param)('nodeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_node_dto_1.UpdateNodeDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateNode", null);
__decorate([
    (0, common_1.Delete)('nodes/:nodeId'),
    __param(0, (0, common_1.Param)('nodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "removeNode", null);
__decorate([
    (0, common_1.Post)('nodes/:fromNodeId/choices'),
    __param(0, (0, common_1.Param)('fromNodeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_choice_dto_1.CreateChoiceDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "createChoice", null);
__decorate([
    (0, common_1.Put)('choices/:choiceId'),
    __param(0, (0, common_1.Param)('choiceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_choice_dto_1.UpdateChoiceDto]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "updateChoice", null);
__decorate([
    (0, common_1.Delete)('choices/:choiceId'),
    __param(0, (0, common_1.Param)('choiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "removeChoice", null);
exports.StoriesController = StoriesController = __decorate([
    (0, common_1.Controller)('stories'),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], StoriesController);
//# sourceMappingURL=stories.controller.js.map