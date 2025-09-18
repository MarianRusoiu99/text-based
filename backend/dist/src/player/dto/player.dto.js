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
exports.DeleteSavedGameDto = exports.LoadGameDto = exports.SaveGameDto = exports.MakeChoiceDto = exports.UpdateGameStateDto = exports.StartPlaySessionDto = void 0;
const class_validator_1 = require("class-validator");
class StartPlaySessionDto {
    storyId;
    startingNodeId;
}
exports.StartPlaySessionDto = StartPlaySessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartPlaySessionDto.prototype, "storyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartPlaySessionDto.prototype, "startingNodeId", void 0);
class UpdateGameStateDto {
    currentNodeId;
    gameState;
    isCompleted;
}
exports.UpdateGameStateDto = UpdateGameStateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGameStateDto.prototype, "currentNodeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateGameStateDto.prototype, "gameState", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGameStateDto.prototype, "isCompleted", void 0);
class MakeChoiceDto {
    choiceId;
    gameStateUpdate;
}
exports.MakeChoiceDto = MakeChoiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakeChoiceDto.prototype, "choiceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MakeChoiceDto.prototype, "gameStateUpdate", void 0);
class SaveGameDto {
    saveName;
}
exports.SaveGameDto = SaveGameDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SaveGameDto.prototype, "saveName", void 0);
class LoadGameDto {
    savedGameId;
}
exports.LoadGameDto = LoadGameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoadGameDto.prototype, "savedGameId", void 0);
class DeleteSavedGameDto {
    savedGameId;
}
exports.DeleteSavedGameDto = DeleteSavedGameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteSavedGameDto.prototype, "savedGameId", void 0);
//# sourceMappingURL=player.dto.js.map