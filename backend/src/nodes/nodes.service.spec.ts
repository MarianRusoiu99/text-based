import { Test, TestingModule } from '@nestjs/testing';
import { NodesService } from './nodes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NodesService', () => {
  let service: NodesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodesService,
        {
          provide: PrismaService,
          useValue: {
            storyNode: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NodesService>(NodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
