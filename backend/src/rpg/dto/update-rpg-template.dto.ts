import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateRpgTemplateDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  version?: number;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;
}
