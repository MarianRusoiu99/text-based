import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  chapterOrder: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
