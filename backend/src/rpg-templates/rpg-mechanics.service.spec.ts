import { Test, TestingModule } from '@nestjs/testing';
import { RpgMechanicsService } from './rpg-mechanics.service';
import {
  RpgTemplateConfig,
  RpgCharacterState,
} from './types/rpg-mechanics.types';

describe('RpgMechanicsService', () => {
  let service: RpgMechanicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpgMechanicsService],
    }).compile();

    service = module.get<RpgMechanicsService>(RpgMechanicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTemplateConfig', () => {
    it('should validate a correct template config', () => {
      const config: RpgTemplateConfig = {
        version: '1.0.0',
        stats: [
          {
            id: 'strength',
            name: 'Strength',
            type: 'number',
            defaultValue: 10,
            minValue: 1,
            maxValue: 20,
          },
          {
            id: 'agility',
            name: 'Agility',
            type: 'number',
            defaultValue: 10,
            minValue: 1,
            maxValue: 20,
          },
        ],
        checks: [
          {
            id: 'attack',
            name: 'Attack Check',
            formula: 'strength + agility / 2',
            successThreshold: 15,
          },
        ],
        formulas: [
          {
            id: 'damage',
            name: 'Damage Calculation',
            expression: 'strength * 2',
            variables: ['strength'],
            returnType: 'number',
          },
        ],
        metadata: {
          name: 'Basic RPG System',
          description: 'A simple RPG system for testing',
        },
      };

      const result = service.validateTemplateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid version format', () => {
      const config: RpgTemplateConfig = {
        version: 'invalid',
        stats: [],
        checks: [],
        formulas: [],
        metadata: { name: 'Test' },
      };

      const result = service.validateTemplateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'version',
          code: 'INVALID_VERSION',
        }),
      );
    });
  });

  describe('evaluateFormula', () => {
    it('should evaluate a simple formula', () => {
      const formula = {
        id: 'test',
        name: 'Test Formula',
        expression: 'strength + 5',
        variables: ['strength'],
        returnType: 'number' as const,
      };

      const characterState: RpgCharacterState = {
        templateId: 'test-template',
        stats: { strength: 10 },
        flags: {},
        variables: {},
        inventory: [],
        achievements: [],
      };

      const result = service.evaluateFormula(formula, characterState);

      expect(result.result).toBe(15);
      expect(result.formulaId).toBe('test');
    });

    it('should evaluate a complex formula with Math functions', () => {
      const formula = {
        id: 'complex',
        name: 'Complex Formula',
        expression: 'Math.max(strength, agility) + Math.floor(dexterity / 2)',
        variables: ['strength', 'agility', 'dexterity'],
        returnType: 'number' as const,
      };

      const characterState: RpgCharacterState = {
        templateId: 'test-template',
        stats: { strength: 12, agility: 15, dexterity: 7 },
        flags: {},
        variables: {},
        inventory: [],
        achievements: [],
      };

      const result = service.evaluateFormula(formula, characterState);

      expect(result.result).toBe(15 + 3); // max(12,15) = 15, floor(7/2) = 3
    });
  });

  describe('initializeCharacterState', () => {
    it('should initialize character state with default values', () => {
      const config: RpgTemplateConfig = {
        version: '1.0.0',
        stats: [
          {
            id: 'strength',
            name: 'Strength',
            type: 'number',
            defaultValue: 10,
          },
          {
            id: 'health',
            name: 'Health',
            type: 'number',
            defaultValue: 100,
          },
        ],
        checks: [],
        formulas: [],
        metadata: { name: 'Test RPG' },
      };

      const result = service.initializeCharacterState('test-template', config);

      expect(result.templateId).toBe('test-template');
      expect(result.stats.strength).toBe(10);
      expect(result.stats.health).toBe(100);
      expect(result.flags).toEqual({});
      expect(result.inventory).toEqual([]);
    });
  });
});
