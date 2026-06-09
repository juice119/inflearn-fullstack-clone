import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '강의 제목', example: '테스트 강의' })
  @IsString()
  title: string;

  @ApiProperty({ description: '강의 슬러그', example: 'test-lecture' })
  @IsString()
  slug: string;

  @ApiProperty({
    description: '강의 짦은 설명',
    example: '테스트 강의에 짦은 설명',
  })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: '강의 설명', example: '강의 설명 입니다' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://google.com',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '강의 가격', example: 1000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '강의 할인 가격' })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ description: '강의 레벨', example: 'BEGINNER' })
  @IsString()
  @IsOptional()
  level: string;

  @ApiProperty({
    description: '강의 카테고리 ID 목록',
    example: ['9f586aad-07d5-47c6-92df-8e6f1a8bb974'],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];
}
