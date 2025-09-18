import { Test, TestingModule } from '@nestjs/testing';
import { RpgTemplatesController } from './rpg-templates.controller';
import { RpgTemplatesService } from './rpg-templates.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RpgTemplatesController', () => {
  let controller: RpgTemplatesController;
  let service: RpgTemplatesService;

  beforeEach(async () => {
    const mockPrismaService = {
      rpgTemplate: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RpgTemplatesController],
      providers: [
        RpgTemplatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<RpgTemplatesController>(RpgTemplatesController);
    service = module.get<RpgTemplatesService>(RpgTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
