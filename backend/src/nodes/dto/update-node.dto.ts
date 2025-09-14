import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class UpdateNodeDto {
  @IsOptional()
  @IsUUID()
  chapterId?: string;

  @IsOptional()
  @IsString()
  nodeType?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsObject()
  position?: any;
}
