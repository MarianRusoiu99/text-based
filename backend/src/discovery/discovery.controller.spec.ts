import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

describe('DiscoveryController', () => {
  let controller: DiscoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [
        {
          provide: DiscoveryService,
          useFactory: jest.fn(() => ({
            discoverStories: jest.fn(),
            getFeaturedStories: jest.fn(),
            getTrendingStories: jest.fn(),
            getRecommendedStories: jest.fn(),
            getCategories: jest.fn(),
            getTags: jest.fn(),
          })),
        },
      ],
    }).compile();

    controller = module.get<DiscoveryController>(DiscoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
