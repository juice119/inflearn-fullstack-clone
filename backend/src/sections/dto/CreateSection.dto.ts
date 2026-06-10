import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ description: '섹션 제목', example: '테스트 섹션' })
  @IsString()
  title: string;
}
