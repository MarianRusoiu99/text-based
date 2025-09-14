"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMechanicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameMechanicsService = class GameMechanicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async evaluateConditions(conditions, playerState, storyId) {
        if (!conditions) {
            return true;
        }
        return this.evaluateCondition(conditions, playerState, storyId);
    }
    async evaluateCondition(condition, playerState, storyId) {
        switch (condition.type) {
            case 'variable':
                return this.evaluateVariableCondition(condition, playerState);
            case 'item':
                return this.evaluateItemCondition(condition, playerState);
            case 'and':
                if (!condition.conditions)
                    return true;
                for (const subCondition of condition.conditions) {
                    if (!(await this.evaluateCondition(subCondition, playerState, storyId))) {
                        return false;
                    }
                }
                return true;
            case 'or':
                if (!condition.conditions)
                    return false;
                for (const subCondition of condition.conditions) {
                    if (await this.evaluateCondition(subCondition, playerState, storyId)) {
                        return true;
                    }
                }
                return false;
            case 'not':
                if (!condition.conditions || condition.conditions.length === 0)
                    return true;
                return !(await this.evaluateCondition(condition.conditions[0], playerState, storyId));
            default:
                return true;
        }
    }
    evaluateVariableCondition(condition, playerState) {
        const { variableName, operator = 'equals', value } = condition;
        if (!variableName)
            return true;
        const currentValue = playerState.variables[variableName];
        switch (operator) {
            case 'equals':
                return currentValue === value;
            case 'not_equals':
                return currentValue !== value;
            case 'greater_than':
                return (typeof currentValue === 'number' &&
                    typeof value === 'number' &&
                    currentValue > value);
            case 'less_than':
                return (typeof currentValue === 'number' &&
                    typeof value === 'number' &&
                    currentValue < value);
            case 'contains':
                return Array.isArray(currentValue) && currentValue.includes(value);
            default:
                return true;
        }
    }
    evaluateItemCondition(condition, playerState) {
        const { itemId } = condition;
        if (!itemId)
            return true;
        return playerState.inventory.includes(itemId);
    }
    async applyEffects(effects, playerState, storyId, userId) {
        const newState = { ...playerState };
        for (const effect of effects) {
            await this.applyEffect(effect, newState, storyId, userId);
        }
        return newState;
    }
    async applyEffect(effect, playerState, storyId, userId) {
        switch (effect.type) {
            case 'set_variable':
                if (effect.variableName) {
                    playerState.variables[effect.variableName] = effect.value;
                }
                break;
            case 'add_item':
                if (effect.itemId && !playerState.inventory.includes(effect.itemId)) {
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
    async getAvailableChoices(nodeId, playerState, storyId) {
        const choices = await this.prisma.choice.findMany({
            where: { fromNodeId: nodeId },
            include: { toNode: true },
        });
        const availableChoices = [];
        for (const choice of choices) {
            const isAvailable = await this.evaluateConditions(choice.conditions, playerState, storyId);
            if (isAvailable) {
                availableChoices.push(choice);
            }
        }
        return availableChoices;
    }
    async initializePlayerState(storyId) {
        const variables = await this.prisma.storyVariable.findMany({
            where: { storyId },
        });
        const variableState = {};
        for (const variable of variables) {
            variableState[variable.variableName] = variable.defaultValue;
        }
        return {
            variables: variableState,
            inventory: [],
            currentNodeId: '',
        };
    }
    async validateConditionsAndEffects(conditions, effects, storyId) {
        const errors = [];
        if (conditions) {
            await this.validateCondition(conditions, storyId, errors);
        }
        for (const effect of effects) {
            await this.validateEffect(effect, storyId, errors);
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    async validateCondition(condition, storyId, errors) {
        switch (condition.type) {
            case 'variable':
                if (condition.variableName) {
                    const variable = await this.prisma.storyVariable.findFirst({
                        where: { storyId, variableName: condition.variableName },
                    });
                    if (!variable) {
                        errors.push(`Variable '${condition.variableName}' does not exist in story`);
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
                    await this.validateCondition(condition.conditions[0], storyId, errors);
                }
                break;
        }
    }
    async validateEffect(effect, storyId, errors) {
        switch (effect.type) {
            case 'set_variable':
            case 'modify_variable':
                if (effect.variableName) {
                    const variable = await this.prisma.storyVariable.findFirst({
                        where: { storyId, variableName: effect.variableName },
                    });
                    if (!variable) {
                        errors.push(`Variable '${effect.variableName}' does not exist in story`);
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
};
exports.GameMechanicsService = GameMechanicsService;
exports.GameMechanicsService = GameMechanicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameMechanicsService);
//# sourceMappingURL=game-mechanics.service.js.map