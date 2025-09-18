"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const stories_module_1 = require("./stories/stories.module");
const nodes_service_1 = require("./nodes/nodes.service");
const nodes_controller_1 = require("./nodes/nodes.controller");
const nodes_module_1 = require("./nodes/nodes.module");
const choices_service_1 = require("./choices/choices.service");
const choices_controller_1 = require("./choices/choices.controller");
const choices_module_1 = require("./choices/choices.module");
const cache_module_1 = require("./cache/cache.module");
const users_module_1 = require("./users/users.module");
const logger_module_1 = require("./logger/logger.module");
const rpg_templates_module_1 = require("./rpg-templates/rpg-templates.module");
const player_module_1 = require("./player/player.module");
const achievements_module_1 = require("./achievements/achievements.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 60000,
                    limit: 10,
                },
                {
                    name: 'long',
                    ttl: 3600000,
                    limit: 100,
                },
            ]),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            stories_module_1.StoriesModule,
            nodes_module_1.NodesModule,
            choices_module_1.ChoicesModule,
            cache_module_1.CacheModule,
            users_module_1.UsersModule,
            logger_module_1.LoggerModule,
            rpg_templates_module_1.RpgTemplatesModule,
            player_module_1.PlayerModule,
            achievements_module_1.AchievementsModule,
        ],
        controllers: [app_controller_1.AppController, nodes_controller_1.NodesController, choices_controller_1.ChoicesController],
        providers: [app_service_1.AppService, nodes_service_1.NodesService, choices_service_1.ChoicesService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map