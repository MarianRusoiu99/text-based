"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpgModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const rpg_service_1 = require("./rpg.service");
const rpg_controller_1 = require("./rpg.controller");
const story_rpg_controller_1 = require("./story-rpg.controller");
let RpgModule = class RpgModule {
};
exports.RpgModule = RpgModule;
exports.RpgModule = RpgModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [rpg_controller_1.RpgController, story_rpg_controller_1.StoryRpgController],
        providers: [rpg_service_1.RpgService],
        exports: [rpg_service_1.RpgService],
    })
], RpgModule);
//# sourceMappingURL=rpg.module.js.map