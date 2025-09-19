import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class RateStoryDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  review?: string;
}

export class AddCommentDto {
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}

export class GetPaginatedDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
