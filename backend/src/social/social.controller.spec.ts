import { Test, TestingModule } from '@nestjs/testing';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialController;

  beforeEach(async () => {
    const mockSocialService = {
      followUser: jest.fn(),
      unfollowUser: jest.fn(),
      getFollowers: jest.fn(),
      getFollowing: jest.fn(),
      isFollowing: jest.fn(),
      rateStory: jest.fn(),
      getStoryRating: jest.fn(),
      getStoryRatings: jest.fn(),
      addComment: jest.fn(),
      getStoryComments: jest.fn(),
      deleteComment: jest.fn(),
      bookmarkStory: jest.fn(),
      unbookmarkStory: jest.fn(),
      getUserBookmarks: jest.fn(),
      isBookmarked: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialController],
      providers: [
        {
          provide: SocialService,
          useValue: mockSocialService,
        },
      ],
    }).compile();

    controller = module.get<SocialController>(SocialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
