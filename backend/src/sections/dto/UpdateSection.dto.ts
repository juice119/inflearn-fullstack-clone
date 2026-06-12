import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateSectionDto } from './CreateSection.dto';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @ApiProperty({ description: '섹션 설명', example: '테스트 섹션에 대한 설명' })
  @IsString()
  @IsOptional()
  description?: string;
}
