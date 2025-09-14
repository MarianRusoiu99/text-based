import { PrismaService } from '../prisma/prisma.service';
interface PlayerState {
    variables: Record<string, any>;
    inventory: string[];
    currentNodeId: string;
}
interface Condition {
    type: 'variable' | 'item' | 'and' | 'or' | 'not';
    variableName?: string;
    operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
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
export declare class GameMechanicsService {
    private prisma;
    constructor(prisma: PrismaService);
    evaluateConditions(conditions: Condition | null, playerState: PlayerState, storyId: string): Promise<boolean>;
    private evaluateCondition;
    private evaluateVariableCondition;
    private evaluateItemCondition;
    applyEffects(effects: Effect[], playerState: PlayerState, storyId: string, userId: string): Promise<PlayerState>;
    private applyEffect;
    getAvailableChoices(nodeId: string, playerState: PlayerState, storyId: string): Promise<any[]>;
    initializePlayerState(storyId: string): Promise<PlayerState>;
    validateConditionsAndEffects(conditions: Condition | null, effects: Effect[], storyId: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    private validateCondition;
    private validateEffect;
}
export {};
