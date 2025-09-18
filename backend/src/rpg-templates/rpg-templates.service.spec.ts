import { Test, TestingModule } from '@nestjs/testing';
import { RpgTemplatesService } from './rpg-templates.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RpgTemplatesService', () => {
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
      providers: [
        RpgTemplatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RpgTemplatesService>(RpgTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
