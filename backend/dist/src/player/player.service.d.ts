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
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        description: string | null;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                        creatorId: string;
                    } | null;
                };
            } & {
                id: string;
                userId: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
            };
            currentNode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
                storyId: string;
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
                    toNodeId: string;
                    choiceText: string;
                    conditions: import("@prisma/client/runtime/library").JsonValue | null;
                    effects: import("@prisma/client/runtime/library").JsonValue | null;
                    fromNodeId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
                storyId: string;
            };
            choices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                toNodeId: string;
                choiceText: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                effects: import("@prisma/client/runtime/library").JsonValue | null;
                fromNodeId: string;
            }[];
        };
    }>;
    makeChoice(userId: string, sessionId: string, choiceDto: MakeChoiceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            session: {
                id: string;
                userId: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
            };
            nextNode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                nodeType: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                position: import("@prisma/client/runtime/library").JsonValue;
                chapterId: string | null;
                storyId: string;
            };
            unlockedAchievements: any[] | undefined;
        };
    }>;
    updateGameState(userId: string, sessionId: string, updateDto: UpdateGameStateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
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
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
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
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            startedAt: Date;
            completedAt: Date | null;
            lastPlayedAt: Date;
        };
    }>;
    savePlaySession(userId: string, sessionId: string, saveName?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            saveName: string;
            sessionId: string;
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
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        description: string | null;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                        creatorId: string;
                    } | null;
                };
            } & {
                id: string;
                userId: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                startedAt: Date;
                completedAt: Date | null;
                lastPlayedAt: Date;
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
                userId: string;
                storyId: string;
                currentNodeId: string | null;
                gameState: import("@prisma/client/runtime/library").JsonValue;
                isCompleted: boolean;
                saveName: string;
                sessionId: string;
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
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            saveName: string;
            sessionId: string;
        })[];
    }>;
    deleteSavedGame(userId: string, savedGameId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
