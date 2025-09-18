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
                    description: string | null;
                    rpgTemplate: {
                        id: string;
                        name: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                        creatorId: string;
                    } | null;
                    title: string;
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
    makeChoice(sessionId: string, choiceDto: MakeChoiceDto, req: AuthenticatedRequest): Promise<{
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
    updateGameState(sessionId: string, updateDto: UpdateGameStateDto, req: AuthenticatedRequest): Promise<{
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
    getPlaySession(sessionId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            story: {
                id: string;
                description: string | null;
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
        };
    }>;
    saveGame(sessionId: string, saveDto: SaveGameDto, req: AuthenticatedRequest): Promise<{
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
    loadGame(loadDto: LoadGameDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            session: {
                story: {
                    id: string;
                    description: string | null;
                    rpgTemplate: {
                        id: string;
                        name: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        version: string;
                        isPublic: boolean;
                        config: import("@prisma/client/runtime/library").JsonValue;
                        creatorId: string;
                    } | null;
                    title: string;
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
                    description: string | null;
                    title: string;
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
            userId: string;
            storyId: string;
            currentNodeId: string | null;
            gameState: import("@prisma/client/runtime/library").JsonValue;
            isCompleted: boolean;
            saveName: string;
            sessionId: string;
        })[];
    }>;
    deleteSavedGame(savedGameId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
