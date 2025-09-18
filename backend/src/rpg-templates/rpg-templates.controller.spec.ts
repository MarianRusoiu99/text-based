import { Test, TestingModule } from '@nestjs/testing';
import { RpgTemplatesController } from './rpg-templates.controller';

describe('RpgTemplatesController', () => {
  let controller: RpgTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RpgTemplatesController],
    }).compile();

    controller = module.get<RpgTemplatesController>(RpgTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
