import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateChoiceDto {
  @IsUUID()
  toNodeId: string;

  @IsString()
  choiceText: string;

  @IsOptional()
  @IsObject()
  conditions?: any;

  @IsOptional()
  @IsArray()
  effects?: any[];
}

export class UpdateChoiceDto {
  @IsOptional()
  @IsUUID()
  toNodeId?: string;

  @IsOptional()
  @IsString()
  choiceText?: string;

  @IsOptional()
  @IsObject()
  conditions?: any;

  @IsOptional()
  @IsArray()
  effects?: any[];
}