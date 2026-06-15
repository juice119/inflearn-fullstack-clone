import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({ description: '수업 제목', example: '테스트 수업' })
  @IsString()
  title: string;

  @ApiProperty({ description: '수업 설명', example: '테스트 수업에 대한 설명' })
  @IsString()
  description: string;
}
