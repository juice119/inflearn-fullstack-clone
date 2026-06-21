import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMyProfileRequestDto } from './dto/UpdateMyProfileRequest.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateMyProfileRequestDto.name,
        image: updateMyProfileRequestDto.image,
        bio: updateMyProfileRequestDto.bio,
      },
    });
  }
}
