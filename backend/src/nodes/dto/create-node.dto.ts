import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateNodeDto {
  @IsUUID()
  storyId: string;

  @IsOptional()
  @IsUUID()
  chapterId?: string;

  @IsOptional()
  @IsString()
  nodeType?: string;

  @IsString()
  title: string;

  @IsObject()
  content: any;

  @IsObject()
  position: any;
}
