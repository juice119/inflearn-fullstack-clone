import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpRequestDto } from './dto/SignUpRequest.dto';
import { UpdateMyProfileRequestDto } from './dto/UpdateMyProfileRequest.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
    await this.validateSignUp(signUpRequestDto);

    return this.prisma.user.create({
      data: {
        name: signUpRequestDto.nickname,
        email: signUpRequestDto.email,
        hashedPassword: hashSync(signUpRequestDto.password, SALT_ROUNDS),
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다. userId: ${id}`);
    }

    return user;
  }

  async updateProfile(
    id: string,
    updateMyProfileRequestDto: UpdateMyProfileRequestDto,
  ): Promise<User> {
    await this.findById(id);

    if (updateMyProfileRequestDto.name !== undefined) {
      await this.assertNicknameAvailable(updateMyProfileRequestDto.name, id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateMyProfileRequestDto.name,
        image: updateMyProfileRequestDto.image,
        bio: updateMyProfileRequestDto.bio,
      },
    });
  }

  private async validateSignUp(signUpRequestDto: SignUpRequestDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signUpRequestDto.email,
      },
    });

    if (user) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    await this.assertNicknameAvailable(signUpRequestDto.nickname);
  }

  private async assertNicknameAvailable(nickname: string, excludeUserId?: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        name: nickname,
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
  }
}
