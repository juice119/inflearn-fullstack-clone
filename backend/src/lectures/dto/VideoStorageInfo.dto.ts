import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class VideoStorageInfoDto {
  @ApiProperty({ description: '파일 이름', example: 'test.mp4' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일 크기', example: 1000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: '파일 URL', example: 'https://example.com/test.mp4' })
  @IsUrl()
  fileUrl: string;
}
