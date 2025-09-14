import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesController } from './choices.controller';

describe('ChoicesController', () => {
  let controller: ChoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoicesController],
    }).compile();

    controller = module.get<ChoicesController>(ChoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
