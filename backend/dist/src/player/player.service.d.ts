import { PrismaService } from '../prisma/prisma.service';
import { StoriesService } from '../stories/stories.service';
import { RpgMechanicsService } from '../rpg-templates/rpg-mechanics.service';
import { AchievementsService } from '../achievements/achievements.service';
import { StartPlaySessionDto, UpdateGameStateDto, MakeChoiceDto } from './dto/player.dto';
export declare class PlayerService {
    private prisma;
    private storiesService;
    private rpgMechanicsService;
    private achievementsService;
    constructor(prisma: PrismaService, storiesService: StoriesService, rpgMechanicsService: RpgMechanicsService, achievementsService: AchievementsService);
    startPlaySession(userId: string, startDto: StartPlaySessionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            session: {
                story: {
                    id: string;
                    title: string;
                    description: string | null;
                    rpgTemplate: {
                        id: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        creatorId: string;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                    } | null;
                };
            } & {
                id: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
                userId: string;
            };
            currentNode: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                storyId: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
            } | undefined;
            unlockedAchievements: any[] | undefined;
        };
    }>;
    getCurrentNode(userId: string, sessionId: string): Promise<{
        success: boolean;
        data: {
            session: {
                id: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
            };
            node: {
                toChoices: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    fromNodeId: string;
                    toNodeId: string;
                    choiceText: string;
                    conditions: import("@prisma/client/runtime/library").JsonValue | null;
                    effects: import("@prisma/client/runtime/library").JsonValue | null;
                }[];
            } & {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                storyId: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
            };
            choices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                fromNodeId: string;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        };
    }>;
    makeChoice(userId: string, sessionId: string, choiceDto: MakeChoiceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            session: {
                id: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
                userId: string;
            };
            nextNode: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                storyId: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
            };
            unlockedAchievements: any[] | undefined;
        };
    }>;
    updateGameState(userId: string, sessionId: string, updateDto: UpdateGameStateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
            userId: string;
        };
    }>;
    getPlaySessions(userId: string, storyId?: string): Promise<{
        success: boolean;
        data: ({
            story: {
                id: string;
                title: string;
                isPublished: boolean;
            };
        } & {
            id: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
            userId: string;
        })[];
    }>;
    getPlaySession(userId: string, sessionId: string): Promise<{
        success: boolean;
        data: {
            story: {
                id: string;
                title: string;
                description: string | null;
                isPublished: boolean;
            };
        } & {
            id: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
            userId: string;
        };
    }>;
    savePlaySession(userId: string, sessionId: string, saveName?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            userId: string;
            sessionId: string;
            saveName: string;
        };
    }>;
    loadSavedGame(userId: string, savedGameId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            session: {
                story: {
                    id: string;
                    title: string;
                    description: string | null;
                    rpgTemplate: {
                        id: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        creatorId: string;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                    } | null;
                };
            } & {
                id: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
                userId: string;
            };
            savedGame: {
                story: {
                    id: string;
                    title: string;
                    description: string | null;
                    isPublished: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                userId: string;
                sessionId: string;
                saveName: string;
            };
        };
    }>;
    getSavedGames(userId: string, storyId?: string): Promise<{
        success: boolean;
        data: ({
            story: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            userId: string;
            sessionId: string;
            saveName: string;
        })[];
    }>;
    deleteSavedGame(userId: string, savedGameId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
