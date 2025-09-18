import { IsString, IsOptional, IsObject, IsBoolean, MaxLength } from 'class-validator';

export class StartPlaySessionDto {
  @IsString()
  storyId: string;

  @IsOptional()
  @IsString()
  startingNodeId?: string;
}

export class UpdateGameStateDto {
  @IsString()
  currentNodeId?: string;

  @IsOptional()
  @IsObject()
  gameState?: any;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class MakeChoiceDto {
  @IsString()
  choiceId: string;

  @IsOptional()
  @IsObject()
  gameStateUpdate?: any;
}

export class SaveGameDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  saveName?: string;
}

export class LoadGameDto {
  @IsString()
  savedGameId: string;
}

export class DeleteSavedGameDto {
  @IsString()
  savedGameId: string;
}