export declare class StartPlaySessionDto {
    storyId: string;
    startingNodeId?: string;
}
export declare class UpdateGameStateDto {
    currentNodeId?: string;
    gameState?: any;
    isCompleted?: boolean;
}
export declare class MakeChoiceDto {
    choiceId: string;
    gameStateUpdate?: any;
}
export declare class SaveGameDto {
    saveName?: string;
}
export declare class LoadGameDto {
    savedGameId: string;
}
export declare class DeleteSavedGameDto {
    savedGameId: string;
}
