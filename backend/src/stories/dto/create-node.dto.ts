import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  MaxLength,
  IsIn,
} from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @IsIn(['story', 'choice', 'rpg_check', 'ending'])
  nodeType?: string = 'story';

  @IsObject()
  content: any;

  @IsObject()
  position: any;

  @IsOptional()
  @IsUUID()
  chapterId?: string;
}

export class UpdateNodeDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(['story', 'choice', 'rpg_check', 'ending'])
  nodeType?: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsObject()
  position?: any;

  @IsOptional()
  @IsUUID()
  chapterId?: string;
}
