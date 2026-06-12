import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/CreateSection.dto';
import { UpdateSectionDto } from './dto/UpdateSection.dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(courseId: string, userId: string, createSectionDto: CreateSectionDto) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course)
      throw new NotFoundException(`섹션을 만들 강의가 존재하지 않습니다.courseId: ${courseId}`);

    if (course.instructorId !== userId)
      throw new UnauthorizedException(`섹션을 만들 수 있는 권한이 없습니다. courseId: ${courseId}`);

    const lastOrderSection = await this.prisma.section.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    // TODO: 섹션 순서 검증 로직 추가

    return this.prisma.section.create({
      data: {
        title: createSectionDto.title,
        order: lastOrderSection?.order || 0 + 1,
        courseId: courseId,
        createdUserId: userId,
      },
    });
  }

  findById(sectionId: string) {
    return this.prisma.section.findUnique({
      where: {
        id: sectionId,
        deletedAt: null,
      },
    });
  }

  findAllByCourseId(courseId: string) {
    return this.prisma.section.findMany({
      where: {
        courseId: courseId,
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async update(sectionId: string, userId: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.findActiveSection(sectionId);

    if (!section) throw new NotFoundException(`섹션을 찾을 수 없습니다. sectionId: ${sectionId}`);

    if (section.createdUserId !== userId)
      throw new UnauthorizedException(
        `섹션의 소유자만 수정할 수 있습니다. sectionId: ${sectionId}`,
      );

    return this.prisma.section.update({
      where: {
        id: sectionId,
        deletedAt: null,
      },
      data: {
        title: updateSectionDto.title,
        description: updateSectionDto.description,
      },
    });
  }

  async delete(sectionId: string, userId: string) {
    const section = await this.findActiveSection(sectionId);

    if (!section) throw new NotFoundException(`섹션을 찾을 수 없습니다. sectionId: ${sectionId}`);

    if (section.createdUserId !== userId)
      throw new UnauthorizedException(
        `섹션의 소유자만 삭제할 수 있습니다. sectionId: ${sectionId}`,
      );

    return this.prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private findActiveSection(sectionId: string) {
    return this.prisma.section.findUnique({
      where: {
        id: sectionId,
        deletedAt: null,
      },
    });
  }
}
