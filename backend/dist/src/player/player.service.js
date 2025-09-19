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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stories_service_1 = require("../stories/stories.service");
const rpg_mechanics_service_1 = require("../rpg-templates/rpg-mechanics.service");
const achievements_service_1 = require("../achievements/achievements.service");
let PlayerService = class PlayerService {
    prisma;
    storiesService;
    rpgMechanicsService;
    achievementsService;
    constructor(prisma, storiesService, rpgMechanicsService, achievementsService) {
        this.prisma = prisma;
        this.storiesService = storiesService;
        this.rpgMechanicsService = rpgMechanicsService;
        this.achievementsService = achievementsService;
    }
    async startPlaySession(userId, startDto) {
        const story = await this.prisma.story.findUnique({
            where: { id: startDto.storyId },
            include: {
                nodes: true,
                rpgTemplate: true,
            },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (!story.isPublished) {
            throw new common_1.BadRequestException('Story is not published');
        }
        let startingNodeId = startDto.startingNodeId;
        if (!startingNodeId && story.nodes.length > 0) {
            startingNodeId = story.nodes[0].id;
        }
        if (!startingNodeId) {
            throw new common_1.BadRequestException('No starting node available for this story');
        }
        let gameState = {};
        if (story.rpgTemplate) {
            const characterState = this.rpgMechanicsService.initializeCharacterState(story.rpgTemplate.id, story.rpgTemplate.config);
            gameState = JSON.parse(JSON.stringify(characterState));
        }
        const playSession = await this.prisma.playSession.create({
            data: {
                userId,
                storyId: startDto.storyId,
                currentNodeId: startingNodeId,
                gameState: gameState,
            },
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        rpgTemplate: true,
                    },
                },
            },
        });
        const currentNode = story.nodes.find((n) => n.id === startingNodeId);
        const unlockedAchievements = await this.achievementsService.checkAndUnlockAchievements(userId, 'play_sessions_started', { storyId: startDto.storyId });
        return {
            success: true,
            message: 'Play session started successfully',
            data: {
                session: playSession,
                currentNode,
                unlockedAchievements: unlockedAchievements.length > 0 ? unlockedAchievements : undefined,
            },
        };
    }
    async getCurrentNode(userId, sessionId) {
        const session = await this.prisma.playSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
            include: {
                story: {
                    include: {
                        nodes: {
                            include: {
                                toChoices: true,
                            },
                        },
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Play session not found');
        }
        const currentNode = session.story.nodes.find((n) => n.id === session.currentNodeId);
        if (!currentNode) {
            throw new common_1.NotFoundException('Current node not found in story');
        }
        return {
            success: true,
            data: {
                session: {
                    id: session.id,
                    currentNodeId: session.currentNodeId,
                    gameState: session.gameState,
                    isCompleted: session.isCompleted,
                },
                node: currentNode,
                choices: currentNode.toChoices,
            },
        };
    }
    async makeChoice(userId, sessionId, choiceDto) {
        const session = await this.prisma.playSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
            include: {
                story: {
                    include: {
                        nodes: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Play session not found');
        }
        if (session.isCompleted) {
            throw new common_1.BadRequestException('Play session is already completed');
        }
        const choice = await this.prisma.choice.findFirst({
            where: {
                id: choiceDto.choiceId,
                fromNodeId: session.currentNodeId,
            },
            include: {
                toNode: true,
            },
        });
        if (!choice) {
            throw new common_1.NotFoundException('Choice not found');
        }
        let updatedGameState = session.gameState;
        if (choiceDto.gameStateUpdate) {
            updatedGameState = {
                ...updatedGameState,
                ...choiceDto.gameStateUpdate,
            };
        }
        await this.prisma.choiceAnalytics.create({
            data: {
                choiceId: choice.id,
                sessionId: session.id,
            },
        });
        const isEnding = choice.toNode
            ? (await this.prisma.choice.count({
                where: { fromNodeId: choice.toNodeId },
            })) === 0
            : true;
        const updatedSession = await this.prisma.playSession.update({
            where: { id: sessionId },
            data: {
                currentNodeId: choice.toNodeId,
                gameState: updatedGameState,
                isCompleted: isEnding,
                completedAt: isEnding ? new Date() : null,
            },
        });
        let unlockedAchievements = [];
        if (isEnding) {
            unlockedAchievements =
                await this.achievementsService.checkAndUnlockAchievements(userId, 'story_completed', { storyId: session.storyId, completed: true });
        }
        const choiceAchievements = await this.achievementsService.checkAndUnlockAchievements(userId, 'choices_made', { choiceId: choice.id, sessionId });
        unlockedAchievements = [...unlockedAchievements, ...choiceAchievements];
        return {
            success: true,
            message: 'Choice made successfully',
            data: {
                session: updatedSession,
                nextNode: choice.toNode,
                unlockedAchievements: unlockedAchievements.length > 0 ? unlockedAchievements : undefined,
            },
        };
    }
    async updateGameState(userId, sessionId, updateDto) {
        const session = await this.prisma.playSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Play session not found');
        }
        const updateData = {};
        if (updateDto.currentNodeId !== undefined) {
            updateData.currentNodeId = updateDto.currentNodeId;
        }
        if (updateDto.gameState !== undefined) {
            const currentGameState = session.gameState || {};
            updateData.gameState = {
                ...currentGameState,
                ...updateDto.gameState,
            };
        }
        if (updateDto.isCompleted !== undefined) {
            updateData.isCompleted = updateDto.isCompleted;
            if (updateDto.isCompleted) {
                updateData.completedAt = new Date();
            }
        }
        const updatedSession = await this.prisma.playSession.update({
            where: { id: sessionId },
            data: updateData,
        });
        return {
            success: true,
            message: 'Game state updated successfully',
            data: updatedSession,
        };
    }
    async getPlaySessions(userId, storyId) {
        const where = { userId };
        if (storyId) {
            where.storyId = storyId;
        }
        const sessions = await this.prisma.playSession.findMany({
            where,
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        isPublished: true,
                    },
                },
            },
            orderBy: { lastPlayedAt: 'desc' },
        });
        return {
            success: true,
            data: sessions,
        };
    }
    async getPlaySession(userId, sessionId) {
        const session = await this.prisma.playSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        isPublished: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Play session not found');
        }
        return {
            success: true,
            data: session,
        };
    }
    async savePlaySession(userId, sessionId, saveName) {
        const session = await this.prisma.playSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Play session not found');
        }
        const savedGame = await this.prisma.savedGame.create({
            data: {
                userId,
                sessionId,
                storyId: session.storyId,
                saveName: saveName || `Save at ${new Date().toLocaleString()}`,
                currentNodeId: session.currentNodeId,
                gameState: session.gameState,
                isCompleted: session.isCompleted,
            },
        });
        return {
            success: true,
            message: 'Game saved successfully',
            data: savedGame,
        };
    }
    async loadSavedGame(userId, savedGameId) {
        const savedGame = await this.prisma.savedGame.findFirst({
            where: {
                id: savedGameId,
                userId,
            },
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        isPublished: true,
                    },
                },
            },
        });
        if (!savedGame) {
            throw new common_1.NotFoundException('Saved game not found');
        }
        const existingSession = await this.prisma.playSession.findFirst({
            where: {
                userId,
                storyId: savedGame.storyId,
            },
        });
        const playSession = existingSession
            ? await this.prisma.playSession.update({
                where: { id: existingSession.id },
                data: {
                    currentNodeId: savedGame.currentNodeId,
                    gameState: savedGame.gameState,
                    isCompleted: savedGame.isCompleted,
                    lastPlayedAt: new Date(),
                },
                include: {
                    story: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            rpgTemplate: true,
                        },
                    },
                },
            })
            : await this.prisma.playSession.create({
                data: {
                    userId,
                    storyId: savedGame.storyId,
                    currentNodeId: savedGame.currentNodeId,
                    gameState: savedGame.gameState,
                    isCompleted: savedGame.isCompleted,
                },
                include: {
                    story: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            rpgTemplate: true,
                        },
                    },
                },
            });
        return {
            success: true,
            message: 'Saved game loaded successfully',
            data: {
                session: playSession,
                savedGame,
            },
        };
    }
    async getSavedGames(userId, storyId) {
        const where = { userId };
        if (storyId) {
            where.storyId = storyId;
        }
        const savedGames = await this.prisma.savedGame.findMany({
            where,
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: savedGames,
        };
    }
    async deleteSavedGame(userId, savedGameId) {
        const savedGame = await this.prisma.savedGame.findFirst({
            where: {
                id: savedGameId,
                userId,
            },
        });
        if (!savedGame) {
            throw new common_1.NotFoundException('Saved game not found');
        }
        await this.prisma.savedGame.delete({
            where: { id: savedGameId },
        });
        return {
            success: true,
            message: 'Saved game deleted successfully',
        };
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stories_service_1.StoriesService,
        rpg_mechanics_service_1.RpgMechanicsService,
        achievements_service_1.AchievementsService])
], PlayerService);
//# sourceMappingURL=player.service.js.map