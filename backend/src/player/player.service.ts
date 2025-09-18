import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoriesService } from '../stories/stories.service';
import { RpgMechanicsService } from '../rpg-templates/rpg-mechanics.service';
import { AchievementsService } from '../achievements/achievements.service';
import { StartPlaySessionDto, UpdateGameStateDto, MakeChoiceDto } from './dto/player.dto';
import { RpgCharacterState } from '../rpg-templates/types/rpg-mechanics.types';

@Injectable()
export class PlayerService {
  constructor(
    private prisma: PrismaService,
    private storiesService: StoriesService,
    private rpgMechanicsService: RpgMechanicsService,
    private achievementsService: AchievementsService,
  ) {}

  async startPlaySession(userId: string, startDto: StartPlaySessionDto) {
    // Verify story exists and is published
    const story = await this.prisma.story.findUnique({
      where: { id: startDto.storyId },
      include: {
        nodes: true,
        rpgTemplate: true,
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (!story.isPublished) {
      throw new BadRequestException('Story is not published');
    }

    // Determine starting node - use provided node or first node
    let startingNodeId = startDto.startingNodeId;
    if (!startingNodeId && story.nodes.length > 0) {
      startingNodeId = story.nodes[0].id;
    }

    if (!startingNodeId) {
      throw new BadRequestException('No starting node available for this story');
    }

    // Initialize game state
    let gameState: any = {};
    if (story.rpgTemplate) {
      const characterState = this.rpgMechanicsService.initializeCharacterState(
        story.rpgTemplate.id,
        story.rpgTemplate.config as any,
      );
      gameState = characterState;
    }

    // Create play session
    const playSession = await this.prisma.playSession.create({
      data: {
        userId,
        storyId: startDto.storyId,
        currentNodeId: startingNodeId,
        gameState,
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

    const currentNode = story.nodes.find(n => n.id === startingNodeId);

    // Check for play session achievements
    const unlockedAchievements = await this.achievementsService.checkAndUnlockAchievements(
      userId,
      'play_sessions_started',
      { storyId: startDto.storyId }
    );

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

  async getCurrentNode(userId: string, sessionId: string) {
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
      throw new NotFoundException('Play session not found');
    }

    const currentNode = session.story.nodes.find((n) => n.id === session.currentNodeId);

    if (!currentNode) {
      throw new NotFoundException('Current node not found in story');
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

  async makeChoice(userId: string, sessionId: string, choiceDto: MakeChoiceDto) {
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
      throw new NotFoundException('Play session not found');
    }

    if (session.isCompleted) {
      throw new BadRequestException('Play session is already completed');
    }

    // Find the choice
    const choice = await this.prisma.choice.findFirst({
      where: {
        id: choiceDto.choiceId,
        fromNodeId: session.currentNodeId!,
      },
      include: {
        toNode: true,
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    // Update game state if provided
    let updatedGameState = session.gameState as any;
    if (choiceDto.gameStateUpdate) {
      updatedGameState = {
        ...updatedGameState,
        ...choiceDto.gameStateUpdate,
      };
    }

    // Record choice analytics
    await this.prisma.choiceAnalytics.create({
      data: {
        choiceId: choice.id,
        sessionId: session.id,
      },
    });

    // Check if this is an ending node (no outgoing choices)
    const isEnding = choice.toNode ? (await this.prisma.choice.count({
      where: { fromNodeId: choice.toNodeId },
    })) === 0 : true;

    // Update session
    const updatedSession = await this.prisma.playSession.update({
      where: { id: sessionId },
      data: {
        currentNodeId: choice.toNodeId,
        gameState: updatedGameState,
        isCompleted: isEnding,
        completedAt: isEnding ? new Date() : null,
      },
    });

    // Check for achievements if story was completed
    let unlockedAchievements: any[] = [];
    if (isEnding) {
      unlockedAchievements = await this.achievementsService.checkAndUnlockAchievements(
        userId,
        'story_completed',
        { storyId: session.storyId, completed: true }
      );
    }

    // Check for choice-related achievements
    const choiceAchievements = await this.achievementsService.checkAndUnlockAchievements(
      userId,
      'choices_made',
      { choiceId: choice.id, sessionId }
    );

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

  async updateGameState(userId: string, sessionId: string, updateDto: UpdateGameStateDto) {
    const session = await this.prisma.playSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Play session not found');
    }

    const updateData: any = {};

    if (updateDto.currentNodeId !== undefined) {
      updateData.currentNodeId = updateDto.currentNodeId;
    }

    if (updateDto.gameState !== undefined) {
      const currentGameState = (session.gameState as any) || {};
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

  async getPlaySessions(userId: string, storyId?: string) {
    const where: any = { userId };

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

  async getPlaySession(userId: string, sessionId: string) {
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
      throw new NotFoundException('Play session not found');
    }

    return {
      success: true,
      data: session,
    };
  }

  async savePlaySession(userId: string, sessionId: string, saveName?: string) {
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
      throw new NotFoundException('Play session not found');
    }

    // Create a saved game entry
    const savedGame = await this.prisma.savedGame.create({
      data: {
        userId,
        sessionId,
        storyId: session.storyId,
        saveName: saveName || `Save at ${new Date().toLocaleString()}`,
        currentNodeId: session.currentNodeId,
        gameState: session.gameState as any,
        isCompleted: session.isCompleted,
      },
    });

    return {
      success: true,
      message: 'Game saved successfully',
      data: savedGame,
    };
  }

  async loadSavedGame(userId: string, savedGameId: string) {
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
      throw new NotFoundException('Saved game not found');
    }

    // Create or update play session from saved game
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
            gameState: savedGame.gameState as any,
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
            gameState: savedGame.gameState as any,
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

  async getSavedGames(userId: string, storyId?: string) {
    const where: any = { userId };

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

  async deleteSavedGame(userId: string, savedGameId: string) {
    const savedGame = await this.prisma.savedGame.findFirst({
      where: {
        id: savedGameId,
        userId,
      },
    });

    if (!savedGame) {
      throw new NotFoundException('Saved game not found');
    }

    await this.prisma.savedGame.delete({
      where: { id: savedGameId },
    });

    return {
      success: true,
      message: 'Saved game deleted successfully',
    };
  }
}
