import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesService } from './choices.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ChoicesService', () => {
  let service: ChoicesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoicesService,
        {
          provide: PrismaService,
          useValue: {
            choice: {
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

    service = module.get<ChoicesService>(ChoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
