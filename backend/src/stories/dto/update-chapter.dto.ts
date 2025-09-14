import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  chapterOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
