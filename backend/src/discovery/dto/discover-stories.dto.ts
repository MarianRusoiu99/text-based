import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DiscoverStoriesDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tags?: string[];

  @IsOptional()
  @IsUUID()
  @Type(() => String)
  authorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  minRating?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  maxRating?: number = 5;

  @IsOptional()
  @IsIn(['newest', 'oldest', 'rating', 'popular', 'trending'])
  @Type(() => String)
  sortBy?: 'newest' | 'oldest' | 'rating' | 'popular' | 'trending' = 'newest';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}