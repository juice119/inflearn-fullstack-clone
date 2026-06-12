import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({ description: '유닛 제목', example: '테스트 유닛' })
  @IsString()
  title: string;

  @ApiProperty({ description: '유닛 설명', example: '테스트 유닛에 대한 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '유닛 순서', example: 1 })
  @IsNumber()
  order: number;
}
