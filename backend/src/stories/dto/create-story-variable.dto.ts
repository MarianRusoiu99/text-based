import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class CreateStoryVariableDto {
  @IsString()
  @MaxLength(100)
  variableName: string;

  @IsString()
  @IsIn(['boolean', 'integer', 'string', 'float'])
  variableType: string;

  @IsOptional()
  defaultValue?: any;
}

export class UpdateStoryVariableDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  variableName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['boolean', 'integer', 'string', 'float'])
  variableType?: string;

  @IsOptional()
  defaultValue?: any;
}
