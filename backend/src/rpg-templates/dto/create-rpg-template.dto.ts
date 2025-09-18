import { IsString, IsOptional, IsObject, IsBoolean, MaxLength } from 'class-validator';

export class CreateRpgTemplateDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  version?: string = '1.0.0';

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @IsObject()
  config: any;
}

export class UpdateRpgTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  version?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsObject()
  config?: any;
}