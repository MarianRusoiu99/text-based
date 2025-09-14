import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  itemName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
