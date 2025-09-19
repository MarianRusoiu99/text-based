import { Injectable, BadRequestException } from '@nestjs/common';
import {
  RpgTemplateConfig,
  RpgCharacterState,
  RpgCheckResult,
  RpgFormulaResult,
  RpgValidationResult,
  RpgValidationError,
  RpgStatDefinition,
  RpgCheckDefinition,
  RpgFormula,
  RpgModifier,
  RpgModifierResult,
} from './types/rpg-mechanics.types';

@Injectable()
export class RpgMechanicsService {
  /**
   * Validates an RPG template configuration
   */
  validateTemplateConfig(config: RpgTemplateConfig): RpgValidationResult {
    const errors: RpgValidationError[] = [];
    const warnings: string[] = [];

    // Validate version
    if (!config.version || !/^\d+\.\d+\.\d+$/.test(config.version)) {
      errors.push({
        field: 'version',
        message: 'Version must be in semantic versioning format (e.g., 1.0.0)',
        code: 'INVALID_VERSION',
      });
    }

    // Validate stats
    if (!config.stats || !Array.isArray(config.stats)) {
      errors.push({
        field: 'stats',
        message: 'Stats must be an array',
        code: 'INVALID_STATS',
      });
    } else {
      config.stats.forEach((stat, index) => {
        const statErrors = this.validateStatDefinition(stat, index);
        errors.push(...statErrors);
      });

      // Check for duplicate stat IDs
      const statIds = config.stats.map((s) => s.id);
      const duplicateStats = statIds.filter(
        (id, index) => statIds.indexOf(id) !== index,
      );
      if (duplicateStats.length > 0) {
        errors.push({
          field: 'stats',
          message: `Duplicate stat IDs found: ${duplicateStats.join(', ')}`,
          code: 'DUPLICATE_STAT_IDS',
        });
      }
    }

    // Validate checks
    if (!config.checks || !Array.isArray(config.checks)) {
      errors.push({
        field: 'checks',
        message: 'Checks must be an array',
        code: 'INVALID_CHECKS',
      });
    } else {
      config.checks.forEach((check, index) => {
        const checkErrors = this.validateCheckDefinition(
          check,
          index,
          config.stats,
        );
        errors.push(...checkErrors);
      });
    }

    // Validate formulas
    if (!config.formulas || !Array.isArray(config.formulas)) {
      errors.push({
        field: 'formulas',
        message: 'Formulas must be an array',
        code: 'INVALID_FORMULAS',
      });
    } else {
      config.formulas.forEach((formula, index) => {
        const formulaErrors = this.validateFormula(
          formula,
          index,
          config.stats,
        );
        errors.push(...formulaErrors);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a stat definition
   */
  private validateStatDefinition(
    stat: RpgStatDefinition,
    index: number,
  ): RpgValidationError[] {
    const errors: RpgValidationError[] = [];
    const field = `stats[${index}]`;

    if (!stat.id || typeof stat.id !== 'string') {
      errors.push({
        field: `${field}.id`,
        message: 'Stat ID must be a non-empty string',
        code: 'INVALID_STAT_ID',
      });
    }

    if (!stat.name || typeof stat.name !== 'string') {
      errors.push({
        field: `${field}.name`,
        message: 'Stat name must be a non-empty string',
        code: 'INVALID_STAT_NAME',
      });
    }

    if (!['number', 'string', 'boolean', 'array'].includes(stat.type)) {
      errors.push({
        field: `${field}.type`,
        message: 'Stat type must be one of: number, string, boolean, array',
        code: 'INVALID_STAT_TYPE',
      });
    }

    if (stat.type === 'number') {
      if (typeof stat.defaultValue !== 'number') {
        errors.push({
          field: `${field}.defaultValue`,
          message: 'Default value must be a number for number type stats',
          code: 'INVALID_DEFAULT_VALUE',
        });
      }

      if (
        stat.minValue !== undefined &&
        stat.maxValue !== undefined &&
        stat.minValue > stat.maxValue
      ) {
        errors.push({
          field: `${field}.minValue`,
          message: 'Minimum value cannot be greater than maximum value',
          code: 'INVALID_MIN_MAX',
        });
      }
    }

    return errors;
  }

  /**
   * Validates a check definition
   */
  private validateCheckDefinition(
    check: RpgCheckDefinition,
    index: number,
    stats: RpgStatDefinition[],
  ): RpgValidationError[] {
    const errors: RpgValidationError[] = [];
    const field = `checks[${index}]`;

    if (!check.id || typeof check.id !== 'string') {
      errors.push({
        field: `${field}.id`,
        message: 'Check ID must be a non-empty string',
        code: 'INVALID_CHECK_ID',
      });
    }

    if (!check.formula || typeof check.formula !== 'string') {
      errors.push({
        field: `${field}.formula`,
        message: 'Check formula must be a non-empty string',
        code: 'INVALID_CHECK_FORMULA',
      });
    } else {
      // Validate that formula references valid stat IDs
      const formulaErrors = this.validateFormulaExpression(
        check.formula,
        stats,
      );
      formulaErrors.forEach((error) => {
        errors.push({
          field: `${field}.formula`,
          message: error.message,
          code: error.code,
        });
      });
    }

    if (typeof check.successThreshold !== 'number') {
      errors.push({
        field: `${field}.successThreshold`,
        message: 'Success threshold must be a number',
        code: 'INVALID_SUCCESS_THRESHOLD',
      });
    }

    return errors;
  }

  /**
   * Validates a formula
   */
  private validateFormula(
    formula: RpgFormula,
    index: number,
    stats: RpgStatDefinition[],
  ): RpgValidationError[] {
    const errors: RpgValidationError[] = [];
    const field = `formulas[${index}]`;

    if (!formula.id || typeof formula.id !== 'string') {
      errors.push({
        field: `${field}.id`,
        message: 'Formula ID must be a non-empty string',
        code: 'INVALID_FORMULA_ID',
      });
    }

    if (!formula.expression || typeof formula.expression !== 'string') {
      errors.push({
        field: `${field}.expression`,
        message: 'Formula expression must be a non-empty string',
        code: 'INVALID_FORMULA_EXPRESSION',
      });
    } else {
      const expressionErrors = this.validateFormulaExpression(
        formula.expression,
        stats,
      );
      expressionErrors.forEach((error) => {
        errors.push({
          field: `${field}.expression`,
          message: error.message,
          code: error.code,
        });
      });
    }

    if (!['number', 'boolean', 'string'].includes(formula.returnType)) {
      errors.push({
        field: `${field}.returnType`,
        message: 'Return type must be one of: number, boolean, string',
        code: 'INVALID_RETURN_TYPE',
      });
    }

    return errors;
  }

  /**
   * Validates a formula expression
   */
  private validateFormulaExpression(
    expression: string,
    stats: RpgStatDefinition[],
  ): RpgValidationError[] {
    const errors: RpgValidationError[] = [];

    // Extract variable names from expression (simple regex for word characters)
    const variables = expression.match(/\b\w+\b/g) || [];
    const statIds = stats.map((s) => s.id);

    // Check for undefined variables
    const undefinedVars = variables.filter(
      (v) => !statIds.includes(v) && !['true', 'false', 'null'].includes(v),
    );
    if (undefinedVars.length > 0) {
      // Filter out common math operators and functions
      const filteredVars = undefinedVars.filter(
        (v) =>
          ![
            'Math',
            'min',
            'max',
            'floor',
            'ceil',
            'round',
            'abs',
            'sqrt',
            'pow',
            'sin',
            'cos',
            'tan',
          ].includes(v) && !/^\d+$/.test(v), // Filter out numbers
      );

      if (filteredVars.length > 0) {
        errors.push({
          field: 'expression',
          message: `Undefined variables in expression: ${filteredVars.join(', ')}`,
          code: 'UNDEFINED_VARIABLES',
        });
      }
    }

    return errors;
  }

  /**
   * Evaluates a formula with given character state
   */
  evaluateFormula(
    formula: RpgFormula,
    characterState: RpgCharacterState,
  ): RpgFormulaResult {
    try {
      // Use a safer evaluation method
      const result = this.safeEvaluateExpression(
        formula.expression,
        characterState.stats,
      );

      return {
        formulaId: formula.id,
        result,
        variables: { ...characterState.stats },
        expression: formula.expression,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to evaluate formula ${formula.id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Safely evaluates a mathematical expression
   */
  private safeEvaluateExpression(
    expression: string,
    variables: Record<string, number>,
  ): number {
    // Replace variable names with their values
    let safeExpression = expression;

    // Sort variable names by length (longest first) to avoid partial replacements
    const sortedVars = Object.keys(variables).sort(
      (a, b) => b.length - a.length,
    );

    for (const varName of sortedVars) {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      safeExpression = safeExpression.replace(
        regex,
        String(variables[varName]),
      );
    }

    // Simple safe expression evaluation for basic math operations
    return this.evaluateMathExpression(safeExpression);
  }

  /**
   * Safely evaluates a condition expression returning boolean
   */
  private evaluateSafeCondition(
    condition: string,
    context: Record<string, number>,
  ): boolean {
    // Replace variables in condition
    let safeCondition = condition;

    // Sort variable names by length (longest first) to avoid partial replacements
    const sortedVars = Object.keys(context).sort((a, b) => b.length - a.length);

    for (const varName of sortedVars) {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      safeCondition = safeCondition.replace(regex, String(context[varName]));
    }

    // Simple condition evaluation for basic comparisons
    return this.evaluateConditionExpression(safeCondition);
  }

  /**
   * Evaluates basic math expressions safely without eval or Function constructor
   */
  private evaluateMathExpression(expression: string): number {
    // For now, return a simple numeric value if it's just a number
    // In a production system, you'd want a proper expression parser
    const numMatch = expression.match(/^\s*([+-]?\d*\.?\d+)\s*$/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }

    // For complex expressions, we'd need a proper math expression parser
    // For now, throw an error to avoid security issues
    throw new Error(
      `Complex expression evaluation not implemented: ${expression}`,
    );
  }

  /**
   * Evaluates basic condition expressions safely
   */
  private evaluateConditionExpression(condition: string): boolean {
    // Simple comparison patterns
    const gtMatch = condition.match(
      /^\s*(\d+(?:\.\d+)?)\s*>\s*(\d+(?:\.\d+)?)\s*$/,
    );
    if (gtMatch) {
      return parseFloat(gtMatch[1]) > parseFloat(gtMatch[2]);
    }

    const ltMatch = condition.match(
      /^\s*(\d+(?:\.\d+)?)\s*<\s*(\d+(?:\.\d+)?)\s*$/,
    );
    if (ltMatch) {
      return parseFloat(ltMatch[1]) < parseFloat(ltMatch[2]);
    }

    const eqMatch = condition.match(
      /^\s*(\d+(?:\.\d+)?)\s*==\s*(\d+(?:\.\d+)?)\s*$/,
    );
    if (eqMatch) {
      return parseFloat(eqMatch[1]) === parseFloat(eqMatch[2]);
    }

    // For complex conditions, return true as fallback
    // In production, you'd want a proper condition parser
    return true;
  }

  /**
   * Performs an RPG check
   */
  performCheck(
    check: RpgCheckDefinition,
    characterState: RpgCharacterState,
  ): RpgCheckResult {
    try {
      // Evaluate the check formula
      const formulaResult = this.evaluateFormula(
        {
          id: check.id,
          name: check.name,
          expression: check.formula,
          variables: [],
          returnType: 'number',
        },
        characterState,
      );

      const roll =
        typeof formulaResult.result === 'number' ? formulaResult.result : 0;
      const threshold = check.successThreshold;

      // Apply modifiers
      let total = typeof roll === 'number' ? roll : 0;
      const modifierResults: RpgModifierResult[] = [];

      if (check.modifiers) {
        for (const modifier of check.modifiers) {
          const modifierResult = this.applyModifier(modifier, characterState);
          if (modifierResult.applied) {
            if (modifier.type === 'additive') {
              total += modifierResult.value;
            } else if (modifier.type === 'multiplicative') {
              total *= modifierResult.value;
            }
            modifierResults.push(modifierResult);
          }
        }
      }

      const success = total >= threshold;
      const critical =
        (check.criticalSuccess && total >= check.criticalSuccess) ||
        (check.criticalFailure && total <= check.criticalFailure) ||
        false;

      return {
        checkId: check.id,
        roll: roll,
        threshold,
        success,
        critical,
        modifiers: modifierResults,
        total: total,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to perform check ${check.id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Applies a modifier to a check
   */
  private applyModifier(
    modifier: RpgModifier,
    characterState: RpgCharacterState,
  ): RpgModifierResult {
    let applied = true;
    const value = typeof modifier.value === 'number' ? modifier.value : 0;

    // Evaluate condition if present
    if (modifier.condition) {
      try {
        const context = { ...characterState.stats };
        applied = !!this.evaluateSafeCondition(modifier.condition, context);
      } catch {
        applied = false;
      }
    }

    return {
      modifierId: modifier.id,
      value,
      applied,
      reason: applied ? 'Condition met' : 'Condition not met',
    };
  }

  /**
   * Initializes a new character state from a template
   */
  initializeCharacterState(
    templateId: string,
    config: RpgTemplateConfig,
  ): RpgCharacterState {
    const stats: Record<string, number> = {};

    // Initialize all stats with their default values
    for (const stat of config.stats) {
      const defaultValue =
        typeof stat.defaultValue === 'number' ? stat.defaultValue : 0;
      stats[stat.id] = defaultValue;
    }

    return {
      templateId,
      stats,
      flags: {},
      variables: {},
      inventory: [],
      achievements: [],
    };
  }
}
