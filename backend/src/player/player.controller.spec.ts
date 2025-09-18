import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const mockPlayerService = {
      startPlaySession: jest.fn(),
      getCurrentNode: jest.fn(),
      makeChoice: jest.fn(),
      updateGameState: jest.fn(),
      getPlaySessions: jest.fn(),
      getPlaySession: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
