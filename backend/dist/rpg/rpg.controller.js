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
exports.RpgController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rpg_service_1 = require("./rpg.service");
const create_rpg_template_dto_1 = require("./dto/create-rpg-template.dto");
const update_rpg_template_dto_1 = require("./dto/update-rpg-template.dto");
let RpgController = class RpgController {
    rpgService;
    constructor(rpgService) {
        this.rpgService = rpgService;
    }
    list(req) {
        return this.rpgService.list(req.user.id);
    }
    create(dto, req) {
        return this.rpgService.create(req.user.id, dto);
    }
    get(id, req) {
        return this.rpgService.get(id, req.user.id);
    }
    update(id, dto, req) {
        return this.rpgService.update(id, req.user.id, dto);
    }
    remove(id, req) {
        return this.rpgService.remove(id, req.user.id);
    }
};
exports.RpgController = RpgController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RpgController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rpg_template_dto_1.CreateRpgTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], RpgController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RpgController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rpg_template_dto_1.UpdateRpgTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], RpgController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RpgController.prototype, "remove", null);
exports.RpgController = RpgController = __decorate([
    (0, common_1.Controller)('rpg/templates'),
    __metadata("design:paramtypes", [rpg_service_1.RpgService])
], RpgController);
//# sourceMappingURL=rpg.controller.js.map