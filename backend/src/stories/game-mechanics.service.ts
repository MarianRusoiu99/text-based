import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface PlayerState {
  variables: Record<string, any>;
  inventory: string[]; // Array of item IDs
  currentNodeId: string;
}

interface Condition {
  type: 'variable' | 'item' | 'and' | 'or' | 'not';
  variableName?: string;
  operator?:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'contains';
  value?: any;
  itemId?: string;
  conditions?: Condition[];
}

interface Effect {
  type: 'set_variable' | 'add_item' | 'remove_item' | 'modify_variable';
  variableName?: string;
  value?: any;
  itemId?: string;
  operator?: 'add' | 'subtract' | 'multiply' | 'divide';
  amount?: number;
}

@Injectable()
export class GameMechanicsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Evaluate conditions for a choice
   */
  async evaluateConditions(
    conditions: Condition | null,
    playerState: PlayerState,
    storyId: string,
  ): Promise<boolean> {
    if (!conditions) {
      return true; // No conditions means always available
    }

    return this.evaluateCondition(conditions, playerState, storyId);
  }

  private async evaluateCondition(
    condition: Condition,
    playerState: PlayerState,
    storyId: string,
  ): Promise<boolean> {
    switch (condition.type) {
      case 'variable':
        return this.evaluateVariableCondition(condition, playerState);

      case 'item':
        return this.evaluateItemCondition(condition, playerState);

      case 'and':
        if (!condition.conditions) return true;
        for (const subCondition of condition.conditions) {
          if (
            !(await this.evaluateCondition(subCondition, playerState, storyId))
          ) {
            return false;
          }
        }
        return true;

      case 'or':
        if (!condition.conditions) return false;
        for (const subCondition of condition.conditions) {
          if (
            await this.evaluateCondition(subCondition, playerState, storyId)
          ) {
            return true;
          }
        }
        return false;

      case 'not':
        if (!condition.conditions || condition.conditions.length === 0)
          return true;
        return !(await this.evaluateCondition(
          condition.conditions[0],
          playerState,
          storyId,
        ));

      default:
        return true;
    }
  }

  private evaluateVariableCondition(
    condition: Condition,
    playerState: PlayerState,
  ): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { variableName, operator = 'equals', value }: Condition = condition;
    if (!variableName) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const currentValue = playerState.variables[variableName];

    switch (operator) {
      case 'equals':
        return currentValue === value;
      case 'not_equals':
        return currentValue !== value;
      case 'greater_than':
        return (
          typeof currentValue === 'number' &&
          typeof value === 'number' &&
          currentValue > value
        );
      case 'less_than':
        return (
          typeof currentValue === 'number' &&
          typeof value === 'number' &&
          currentValue < value
        );
      case 'contains':
        return Array.isArray(currentValue) && currentValue.includes(value);
      default:
        return true;
    }
  }

  private evaluateItemCondition(
    condition: Condition,
    playerState: PlayerState,
  ): boolean {
    const { itemId } = condition;
    if (!itemId) return true;

    return playerState.inventory.includes(itemId);
  }

  /**
   * Apply effects to player state
   */
  async applyEffects(
    effects: Effect[],
    playerState: PlayerState,
    storyId: string,
    userId: string,
  ): Promise<PlayerState> {
    const newState = { ...playerState };

    for (const effect of effects) {
      await this.applyEffect(effect, newState, storyId, userId);
    }

    return newState;
  }

  private async applyEffect(
    effect: Effect,
    playerState: PlayerState,
    storyId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
  ): Promise<void> {
    switch (effect.type) {
      case 'set_variable':
        if (effect.variableName) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          playerState.variables[effect.variableName] = effect.value;
        }
        break;

      case 'add_item':
        if (effect.itemId && !playerState.inventory.includes(effect.itemId)) {
          // Verify item exists in story
          const item = await this.prisma.item.findFirst({
            where: { id: effect.itemId, storyId },
          });
          if (item) {
            playerState.inventory.push(effect.itemId);
          }
        }
        break;

      case 'remove_item':
        if (effect.itemId) {
          const index = playerState.inventory.indexOf(effect.itemId);
          if (index > -1) {
            playerState.inventory.splice(index, 1);
          }
        }
        break;

      case 'modify_variable':
        if (effect.variableName && typeof effect.amount === 'number') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const currentValue = playerState.variables[effect.variableName] || 0;
          if (typeof currentValue === 'number') {
            switch (effect.operator) {
              case 'add':
                playerState.variables[effect.variableName] =
                  currentValue + effect.amount;
                break;
              case 'subtract':
                playerState.variables[effect.variableName] =
                  currentValue - effect.amount;
                break;
              case 'multiply':
                playerState.variables[effect.variableName] =
                  currentValue * effect.amount;
                break;
              case 'divide':
                if (effect.amount !== 0) {
                  playerState.variables[effect.variableName] =
                    currentValue / effect.amount;
                }
                break;
            }
          }
        }
        break;
    }
  }

  /**
   * Get available choices for a node based on player state
   */
  async getAvailableChoices(
    nodeId: string,
    playerState: PlayerState,
    storyId: string,
  ): Promise<any[]> {
    const choices = await this.prisma.choice.findMany({
      where: { fromNodeId: nodeId },
      include: { toNode: true },
    });

    const availableChoices: any[] = [];

    for (const choice of choices) {
      const isAvailable = await this.evaluateConditions(
        choice.conditions as unknown as Condition,
        playerState,
        storyId,
      );

      if (isAvailable) {
        availableChoices.push(choice);
      }
    }

    return availableChoices;
  }

  /**
   * Initialize player state for a new game session
   */
  async initializePlayerState(storyId: string): Promise<PlayerState> {
    // Get default variables for the story
    const variables = await this.prisma.storyVariable.findMany({
      where: { storyId },
    });

    const variableState: Record<string, any> = {};
    for (const variable of variables) {
      variableState[variable.variableName] = variable.defaultValue;
    }

    return {
      variables: variableState,
      inventory: [],
      currentNodeId: '', // Will be set when starting the story
    };
  }

  /**
   * Validate that conditions and effects reference valid story elements
   */
  async validateConditionsAndEffects(
    conditions: Condition | null,
    effects: Effect[],
    storyId: string,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate conditions
    if (conditions) {
      await this.validateCondition(conditions, storyId, errors);
    }

    // Validate effects
    for (const effect of effects) {
      await this.validateEffect(effect, storyId, errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private async validateCondition(
    condition: Condition,
    storyId: string,
    errors: string[],
  ): Promise<void> {
    switch (condition.type) {
      case 'variable':
        if (condition.variableName) {
          const variable = await this.prisma.storyVariable.findFirst({
            where: { storyId, variableName: condition.variableName },
          });
          if (!variable) {
            errors.push(
              `Variable '${condition.variableName}' does not exist in story`,
            );
          }
        }
        break;

      case 'item':
        if (condition.itemId) {
          const item = await this.prisma.item.findFirst({
            where: { id: condition.itemId, storyId },
          });
          if (!item) {
            errors.push(`Item '${condition.itemId}' does not exist in story`);
          }
        }
        break;

      case 'and':
      case 'or':
        if (condition.conditions) {
          for (const subCondition of condition.conditions) {
            await this.validateCondition(subCondition, storyId, errors);
          }
        }
        break;

      case 'not':
        if (condition.conditions && condition.conditions.length > 0) {
          await this.validateCondition(
            condition.conditions[0],
            storyId,
            errors,
          );
        }
        break;
    }
  }

  private async validateEffect(
    effect: Effect,
    storyId: string,
    errors: string[],
  ): Promise<void> {
    switch (effect.type) {
      case 'set_variable':
      case 'modify_variable':
        if (effect.variableName) {
          const variable = await this.prisma.storyVariable.findFirst({
            where: { storyId, variableName: effect.variableName },
          });
          if (!variable) {
            errors.push(
              `Variable '${effect.variableName}' does not exist in story`,
            );
          }
        }
        break;

      case 'add_item':
      case 'remove_item':
        if (effect.itemId) {
          const item = await this.prisma.item.findFirst({
            where: { id: effect.itemId, storyId },
          });
          if (!item) {
            errors.push(`Item '${effect.itemId}' does not exist in story`);
          }
        }
        break;
    }
  }
}
