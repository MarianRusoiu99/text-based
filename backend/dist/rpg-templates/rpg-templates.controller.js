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
exports.RpgTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const rpg_templates_service_1 = require("./rpg-templates.service");
const create_rpg_template_dto_1 = require("./dto/create-rpg-template.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RpgTemplatesController = class RpgTemplatesController {
    rpgTemplatesService;
    constructor(rpgTemplatesService) {
        this.rpgTemplatesService = rpgTemplatesService;
    }
    async create(createRpgTemplateDto, req) {
        return this.rpgTemplatesService.create(req.user.id, createRpgTemplateDto);
    }
    async findAll(query) {
        return this.rpgTemplatesService.findAll(query);
    }
    async findOne(id, req) {
        const userId = req.user?.id;
        return this.rpgTemplatesService.findOne(id, userId);
    }
    async update(id, updateRpgTemplateDto, req) {
        return this.rpgTemplatesService.update(id, req.user.id, updateRpgTemplateDto);
    }
    async remove(id, req) {
        return this.rpgTemplatesService.remove(id, req.user.id);
    }
};
exports.RpgTemplatesController = RpgTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rpg_template_dto_1.CreateRpgTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], RpgTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RpgTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RpgTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_rpg_template_dto_1.UpdateRpgTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], RpgTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RpgTemplatesController.prototype, "remove", null);
exports.RpgTemplatesController = RpgTemplatesController = __decorate([
    (0, common_1.Controller)('rpg-templates'),
    __metadata("design:paramtypes", [rpg_templates_service_1.RpgTemplatesService])
], RpgTemplatesController);
//# sourceMappingURL=rpg-templates.controller.js.map