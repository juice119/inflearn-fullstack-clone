import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLectureDto } from './CreateLecture.dto';
import { IsNumber } from 'class-validator';

export class UpdateLectureDto extends PartialType(CreateLectureDto) {
  @ApiProperty({ description: '강의 순서', example: 1 })
  @IsNumber()
  order: number;
}
