/**
 * RPG Mechanics Types and Interfaces
 * Defines the flexible RPG system configuration structure
 */

export interface RpgStatDefinition {
  id: string;
  name: string;
  description?: string;
  type: 'number' | 'string' | 'boolean' | 'array';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  displayFormat?: string;
  category?: string;
}

export interface RpgCheckDefinition {
  id: string;
  name: string;
  description?: string;
  formula: string; // Expression to evaluate (e.g., "strength + dexterity / 2")
  successThreshold: number;
  criticalSuccess?: number;
  criticalFailure?: number;
  modifiers?: RpgModifier[];
}

export interface RpgModifier {
  id: string;
  name: string;
  description?: string;
  type: 'additive' | 'multiplicative' | 'conditional';
  value: number | string;
  condition?: string; // Expression that must be true for modifier to apply
}

export interface RpgFormula {
  id: string;
  name: string;
  expression: string; // Mathematical expression (e.g., "strength * 2 + agility")
  variables: string[]; // List of stat IDs used in the expression
  returnType: 'number' | 'boolean' | 'string';
}

export interface RpgTemplateConfig {
  version: string;
  stats: RpgStatDefinition[];
  checks: RpgCheckDefinition[];
  formulas: RpgFormula[];
  metadata: {
    name: string;
    description?: string;
    author?: string;
    tags?: string[];
  };
}

export interface RpgCharacterState {
  templateId: string;
  stats: Record<string, any>; // statId -> value
  flags: Record<string, boolean>; // flagId -> boolean
  variables: Record<string, any>; // variableId -> value
  inventory: RpgInventoryItem[];
  achievements: string[];
}

export interface RpgInventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  properties: Record<string, any>;
}

export interface RpgCheckResult {
  checkId: string;
  roll: number;
  threshold: number;
  success: boolean;
  critical: boolean;
  modifiers: RpgModifierResult[];
  total: number;
}

export interface RpgModifierResult {
  modifierId: string;
  value: number;
  applied: boolean;
  reason?: string;
}

export interface RpgFormulaResult {
  formulaId: string;
  result: any;
  variables: Record<string, any>;
  expression: string;
}

/**
 * Validation interfaces for RPG configurations
 */
export interface RpgValidationError {
  field: string;
  message: string;
  code: string;
}

export interface RpgValidationResult {
  valid: boolean;
  errors: RpgValidationError[];
  warnings: string[];
}
