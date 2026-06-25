import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/common/transform/trim';
import { IsNickname } from 'src/common/validators/IsNickname.validator';

export class UpdateMyProfileRequestDto {
  @ApiProperty({ type: String, description: '사용자 이름', example: '홍길동', required: false })
  @Trim()
  @IsOptional()
  @IsString()
  @IsNickname()
  readonly name?: string;

  @ApiProperty({
    type: String,
    description: '프로필 이미지 URL',
    example: 'https://cdn.example.com/profile.jpg',
    required: false,
  })
  @Trim()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({
    type: String,
    description: '자기소개',
    example: '안녕하세요. 개발자입니다.',
    required: false,
  })
  @Trim()
  @IsOptional()
  @IsString()
  readonly bio?: string;
}
