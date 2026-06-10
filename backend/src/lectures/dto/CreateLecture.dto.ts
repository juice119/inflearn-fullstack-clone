import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({ description: '강의 제목', example: '테스트 강의' })
  @IsString()
  title: string;

  @ApiProperty({ description: '강의 설명', example: '테스트 강의에 대한 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '강의 순서', example: 1 })
  @IsNumber()
  order: number;
}
