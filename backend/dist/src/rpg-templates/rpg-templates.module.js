"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpgTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const rpg_templates_service_1 = require("./rpg-templates.service");
const rpg_templates_controller_1 = require("./rpg-templates.controller");
const rpg_mechanics_service_1 = require("./rpg-mechanics.service");
const prisma_module_1 = require("../prisma/prisma.module");
let RpgTemplatesModule = class RpgTemplatesModule {
};
exports.RpgTemplatesModule = RpgTemplatesModule;
exports.RpgTemplatesModule = RpgTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [rpg_templates_service_1.RpgTemplatesService, rpg_mechanics_service_1.RpgMechanicsService],
        controllers: [rpg_templates_controller_1.RpgTemplatesController],
        exports: [rpg_mechanics_service_1.RpgMechanicsService],
    })
], RpgTemplatesModule);
//# sourceMappingURL=rpg-templates.module.js.map