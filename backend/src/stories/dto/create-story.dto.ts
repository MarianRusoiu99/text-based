import { IsString, IsOptional, MaxLength, IsIn, IsArray, IsUUID } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'unlisted', 'private'])
  visibility?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @IsOptional()
  @IsUUID()
  rpgTemplateId?: string;
}
