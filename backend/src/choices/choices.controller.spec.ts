import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesController } from './choices.controller';
import { ChoicesService } from './choices.service';

describe('ChoicesController', () => {
  let controller: ChoicesController;
  let service: ChoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoicesController],
      providers: [
        {
          provide: ChoicesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChoicesController>(ChoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
