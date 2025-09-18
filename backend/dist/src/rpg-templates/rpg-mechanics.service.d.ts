import { RpgTemplateConfig, RpgCharacterState, RpgCheckResult, RpgFormulaResult, RpgValidationResult, RpgCheckDefinition, RpgFormula } from './types/rpg-mechanics.types';
export declare class RpgMechanicsService {
    validateTemplateConfig(config: RpgTemplateConfig): RpgValidationResult;
    private validateStatDefinition;
    private validateCheckDefinition;
    private validateFormula;
    private validateFormulaExpression;
    evaluateFormula(formula: RpgFormula, characterState: RpgCharacterState): RpgFormulaResult;
    private safeEvaluateExpression;
    performCheck(check: RpgCheckDefinition, characterState: RpgCharacterState): RpgCheckResult;
    private applyModifier;
    initializeCharacterState(templateId: string, config: RpgTemplateConfig): RpgCharacterState;
}
