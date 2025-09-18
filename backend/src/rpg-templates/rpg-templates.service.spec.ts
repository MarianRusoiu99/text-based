import { Test, TestingModule } from '@nestjs/testing';
import { RpgTemplatesService } from './rpg-templates.service';

describe('RpgTemplatesService', () => {
  let service: RpgTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpgTemplatesService],
    }).compile();

    service = module.get<RpgTemplatesService>(RpgTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
