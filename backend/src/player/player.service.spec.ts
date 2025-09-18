import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PrismaService } from '../prisma/prisma.service';
import { StoriesService } from '../stories/stories.service';
import { RpgMechanicsService } from '../rpg-templates/rpg-mechanics.service';
import { AchievementsService } from '../achievements/achievements.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const mockPrismaService = {
      story: {
        findUnique: jest.fn(),
      },
      playSession: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      choice: {
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      choiceAnalytics: {
        create: jest.fn(),
      },
    };

    const mockStoriesService = {};
    const mockRpgMechanicsService = {
      initializeCharacterState: jest.fn(),
    };
    const mockAchievementsService = {
      checkAndUnlockAchievements: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StoriesService,
          useValue: mockStoriesService,
        },
        {
          provide: RpgMechanicsService,
          useValue: mockRpgMechanicsService,
        },
        {
          provide: AchievementsService,
          useValue: mockAchievementsService,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
