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
exports.UpdateStoryVariableDto = exports.CreateStoryVariableDto = void 0;
const class_validator_1 = require("class-validator");
class CreateStoryVariableDto {
    variableName;
    variableType;
    defaultValue;
}
exports.CreateStoryVariableDto = CreateStoryVariableDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateStoryVariableDto.prototype, "variableName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['boolean', 'integer', 'string', 'float']),
    __metadata("design:type", String)
], CreateStoryVariableDto.prototype, "variableType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateStoryVariableDto.prototype, "defaultValue", void 0);
class UpdateStoryVariableDto {
    variableName;
    variableType;
    defaultValue;
}
exports.UpdateStoryVariableDto = UpdateStoryVariableDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateStoryVariableDto.prototype, "variableName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['boolean', 'integer', 'string', 'float']),
    __metadata("design:type", String)
], UpdateStoryVariableDto.prototype, "variableType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStoryVariableDto.prototype, "defaultValue", void 0);
//# sourceMappingURL=create-story-variable.dto.js.map