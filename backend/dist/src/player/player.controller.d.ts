import { PlayerService } from './player.service';
import { StartPlaySessionDto, UpdateGameStateDto, MakeChoiceDto, SaveGameDto, LoadGameDto } from './dto/player.dto';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';
interface AuthenticatedRequest extends Request {
    user: RequestUser;
}
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    startSession(startDto: StartPlaySessionDto, req: AuthenticatedRequest): Promise<{
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
    getCurrentNode(sessionId: string, req: AuthenticatedRequest): Promise<{
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
    makeChoice(sessionId: string, choiceDto: MakeChoiceDto, req: AuthenticatedRequest): Promise<{
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
    updateGameState(sessionId: string, updateDto: UpdateGameStateDto, req: AuthenticatedRequest): Promise<{
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
    getPlaySessions(req: AuthenticatedRequest, storyId?: string): Promise<{
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
    getPlaySession(sessionId: string, req: AuthenticatedRequest): Promise<{
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
    saveGame(sessionId: string, saveDto: SaveGameDto, req: AuthenticatedRequest): Promise<{
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
    loadGame(loadDto: LoadGameDto, req: AuthenticatedRequest): Promise<{
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
    getSavedGames(req: AuthenticatedRequest, storyId?: string): Promise<{
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
    deleteSavedGame(savedGameId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
