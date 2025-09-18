"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoicesModule = void 0;
const common_1 = require("@nestjs/common");
const choices_service_1 = require("./choices.service");
const choices_controller_1 = require("./choices.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ChoicesModule = class ChoicesModule {
};
exports.ChoicesModule = ChoicesModule;
exports.ChoicesModule = ChoicesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [choices_controller_1.ChoicesController],
        providers: [choices_service_1.ChoicesService],
        exports: [choices_service_1.ChoicesService],
    })
], ChoicesModule);
//# sourceMappingURL=choices.module.js.map