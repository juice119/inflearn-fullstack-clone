import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MediaUploadResponseDto {
  private readonly _originalFileName: string;
  private readonly _fileSize: number;
  private readonly _contentType: string;
  private readonly _fileUrl: string;

  constructor({ originalFileName, fileSize, contentType, fileUrl }) {
    this._originalFileName = originalFileName;
    this._fileSize = fileSize;
    this._contentType = contentType;
    this._fileUrl = fileUrl;
  }

  @Expose()
  @ApiProperty({ type: String, description: '원본 파일명', example: 'lecture-video.mp4' })
  get originalFileName(): string {
    return this._originalFileName;
  }

  @Expose()
  @ApiProperty({ type: Number, description: '파일 크기 (bytes)', example: 1048576 })
  get fileSize(): number {
    return this._fileSize;
  }

  @Expose()
  @ApiProperty({ type: String, description: '컨텐츠 타입', example: 'video/mp4' })
  get contentType(): string {
    return this._contentType;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '업로드된 파일 URL',
    example: 'https://cdn.example.com/media/user-id/2026-6-17/uuid.mp4',
  })
  get fileUrl(): string {
    return this._fileUrl;
  }
}
