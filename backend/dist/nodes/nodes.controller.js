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
exports.NodesController = void 0;
const common_1 = require("@nestjs/common");
const nodes_service_1 = require("./nodes.service");
const create_node_dto_1 = require("./dto/create-node.dto");
const update_node_dto_1 = require("./dto/update-node.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NodesController = class NodesController {
    nodesService;
    constructor(nodesService) {
        this.nodesService = nodesService;
    }
    create(createNodeDto, req) {
        return this.nodesService.create(createNodeDto, req.user.id);
    }
    findAll(storyId, req) {
        return this.nodesService.findAll(storyId, req.user.id);
    }
    findOne(id, req) {
        return this.nodesService.findOne(id, req.user.id);
    }
    update(id, updateNodeDto, req) {
        return this.nodesService.update(id, updateNodeDto, req.user.id);
    }
    remove(id, req) {
        return this.nodesService.remove(id, req.user.id);
    }
};
exports.NodesController = NodesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_node_dto_1.CreateNodeDto, Object]),
    __metadata("design:returntype", void 0)
], NodesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('story/:storyId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NodesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NodesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_node_dto_1.UpdateNodeDto, Object]),
    __metadata("design:returntype", void 0)
], NodesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NodesController.prototype, "remove", null);
exports.NodesController = NodesController = __decorate([
    (0, common_1.Controller)('nodes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [nodes_service_1.NodesService])
], NodesController);
//# sourceMappingURL=nodes.controller.js.map