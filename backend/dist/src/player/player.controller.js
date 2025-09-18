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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("./player.service");
const player_dto_1 = require("./dto/player.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PlayerController = class PlayerController {
    playerService;
    constructor(playerService) {
        this.playerService = playerService;
    }
    async startSession(startDto, req) {
        return this.playerService.startPlaySession(req.user.id, startDto);
    }
    async getCurrentNode(sessionId, req) {
        return this.playerService.getCurrentNode(req.user.id, sessionId);
    }
    async makeChoice(sessionId, choiceDto, req) {
        return this.playerService.makeChoice(req.user.id, sessionId, choiceDto);
    }
    async updateGameState(sessionId, updateDto, req) {
        return this.playerService.updateGameState(req.user.id, sessionId, updateDto);
    }
    async getPlaySessions(req, storyId) {
        return this.playerService.getPlaySessions(req.user.id, storyId);
    }
    async getPlaySession(sessionId, req) {
        return this.playerService.getPlaySession(req.user.id, sessionId);
    }
    async saveGame(sessionId, saveDto, req) {
        return this.playerService.savePlaySession(req.user.id, sessionId, saveDto.saveName);
    }
    async loadGame(loadDto, req) {
        return this.playerService.loadSavedGame(req.user.id, loadDto.savedGameId);
    }
    async getSavedGames(req, storyId) {
        return this.playerService.getSavedGames(req.user.id, storyId);
    }
    async deleteSavedGame(savedGameId, req) {
        return this.playerService.deleteSavedGame(req.user.id, savedGameId);
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_dto_1.StartPlaySessionDto, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "startSession", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getCurrentNode", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/choices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_dto_1.MakeChoiceDto, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "makeChoice", null);
__decorate([
    (0, common_1.Patch)('sessions/:sessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_dto_1.UpdateGameStateDto, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateGameState", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlaySessions", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId/details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlaySession", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/save'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, player_dto_1.SaveGameDto, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "saveGame", null);
__decorate([
    (0, common_1.Post)('saved-games/load'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_dto_1.LoadGameDto, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "loadGame", null);
__decorate([
    (0, common_1.Get)('saved-games'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getSavedGames", null);
__decorate([
    (0, common_1.Delete)('saved-games/:savedGameId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('savedGameId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "deleteSavedGame", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map