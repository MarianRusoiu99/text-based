import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from './discovery.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DiscoveryService', () => {
  let service: DiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveryService,
        {
          provide: PrismaService,
          useFactory: jest.fn(() => ({
            story: {
              findMany: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
            },
            playSession: {
              findMany: jest.fn(),
            },
            rating: {
              findMany: jest.fn(),
            },
          })),
        },
      ],
    }).compile();

    service = module.get<DiscoveryService>(DiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
