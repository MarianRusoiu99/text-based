import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
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
  @IsObject()
  effects?: any;
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
  @IsObject()
  effects?: any;
}