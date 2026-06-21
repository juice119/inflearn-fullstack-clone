import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class MyProfileResponseDto {
  private readonly _name: string | null;
  private readonly _image: string | null;
  private readonly _bio: string | null;

  constructor({
    name,
    image,
    bio,
  }: {
    name: string | null;
    image: string | null;
    bio: string | null;
  }) {
    this._name = name;
    this._image = image;
    this._bio = bio;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '사용자 이름',
    example: '홍길동',
    required: false,
    nullable: true,
  })
  get name(): string | null {
    return this._name;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '프로필 이미지 URL',
    example: 'https://cdn.example.com/profile.jpg',
    required: false,
    nullable: true,
  })
  get image(): string | null {
    return this._image;
  }

  @Expose()
  @ApiProperty({
    type: String,
    description: '자기소개',
    example: '안녕하세요. 개발자입니다.',
    required: false,
    nullable: true,
  })
  get bio(): string | null {
    return this._bio;
  }

  static from(user: User): MyProfileResponseDto {
    return new MyProfileResponseDto({
      name: user.name,
      image: user.image,
      bio: user.bio,
    });
  }
}
