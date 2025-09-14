import { IsString, IsUUID, IsOptional, IsObject } from 'class-validator';

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
