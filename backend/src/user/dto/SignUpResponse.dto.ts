import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignUpResponseDto {
  private readonly _id: string;
  private readonly _email: string;
  private readonly _name: string | null;

  constructor({ id, email, name }: { id: string; email: string; name: string | null }) {
    this._id = id;
    this._email = email;
    this._name = name;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '사용자 ID',
    example: 'clx1234567890',
    required: true,
  })
  get id(): string {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'user@example.com',
    required: true,
  })
  get email(): string {
    return this._email;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '닉네임',
    example: null,
    required: false,
    nullable: true,
  })
  get name(): string | null {
    return this._name;
  }
}
