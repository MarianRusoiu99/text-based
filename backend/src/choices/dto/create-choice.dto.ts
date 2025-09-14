import { IsString, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateChoiceDto {
  @IsUUID()
  fromNodeId: string;

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
