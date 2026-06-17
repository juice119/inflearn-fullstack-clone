import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VideoStorageInfoDto } from './VideoStorageInfo.dto';

export class UpdateLectureDto {
  @ApiProperty({ description: '수업 제목', example: '테스트 수업', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '수업 설명', example: '테스트 수업 설명', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: '강의 순서', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: '비디오 정보', type: () => VideoStorageInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => VideoStorageInfoDto)
  videoStorageInfo?: VideoStorageInfoDto;
}
