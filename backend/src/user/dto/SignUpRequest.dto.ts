import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/transform/trim';
import { IsNickname } from 'src/common/validators/IsNickname.validator';
import { IsPassword } from 'src/common/validators/IsPassword.validator';

export class SignUpRequestDto {
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'user@example.com',
    required: true,
  })
  @Trim()
  @IsNotEmpty()
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: 'abc123',
    required: true,
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  @IsPassword({ message: '비밀번호가 올바르지 않습니다.' })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: '닉네임',
    example: '홍길동',
    required: true,
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  @IsNickname()
  readonly nickname: string;
}
