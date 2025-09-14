import { IsString, IsOptional, MaxLength, IsIn } from 'class-validator';

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
}
