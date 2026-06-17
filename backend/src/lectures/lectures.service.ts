import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Lecture, Prisma } from '@prisma/client';
import { CoursesService } from 'src/courses/courses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionsService } from 'src/sections/sections.service';
import { CreateLectureDto } from './dto/CreateLecture.dto';
import { UpdateLectureDto } from './dto/UpdateLecture.dto';

@Injectable()
export class LecturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
    private readonly sectionsService: SectionsService,
  ) {}

  async create(
    courseId: string,
    sectionId: string,
    userId: string,
    createLectureDto: CreateLectureDto,
  ): Promise<Lecture> {
    await this.validateCreateRule(userId, courseId, sectionId);

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT id FROM sections WHERE id = ${sectionId} FOR UPDATE`;

      const lastOrderLecture = await tx.lecture.findFirst({
        where: {
          sectionId: sectionId,
          deletedAt: null,
        },
        orderBy: {
          order: 'desc',
        },
      });

      return tx.lecture.create({
        data: {
          title: createLectureDto.title,
          description: createLectureDto.description,
          sectionId: sectionId,
          courseId: courseId,
          order: (lastOrderLecture?.order ?? 0) + 1,
        },
      });
    });
  }

  async findValidated(id: string): Promise<Lecture> {
    const lecture = await this.prisma.lecture.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!lecture) {
      throw new NotFoundException(`수업이 존재하지 않습니다. lectureId: ${id}`);
    }

    return lecture;
  }

  async update(
    lectureId: string,
    userId: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture> {
    await this.validateUpdateRule(userId, lectureId, updateLectureDto);
    const data: Prisma.LectureUpdateInput = {};

    if (updateLectureDto.title) {
      data.title = updateLectureDto.title;
    }
    if (updateLectureDto.description) {
      data.description = updateLectureDto.description;
    }
    if (updateLectureDto.order) {
      data.order = updateLectureDto.order;
    }
    if (updateLectureDto.videoStorageInfo) {
      data.videoStorageInfo = updateLectureDto.videoStorageInfo.toObject();
    }

    return this.prisma.lecture.update({
      data,
      where: {
        id: lectureId,
        deletedAt: null,
      },
    });
  }

  async delete(lectureId: string, userId: string): Promise<void> {
    await this.validateDeleteRule(userId, lectureId);

    await this.prisma.lecture.update({
      data: { deletedAt: new Date() },
      where: { id: lectureId, deletedAt: null },
    });
  }

  private async validateDeleteRule(userId: string, lectureId: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId, deletedAt: null },
      include: { section: { select: { id: true, course: { select: { instructorId: true } } } } },
    });

    if (!lecture) {
      throw new NotFoundException(`수업이 존재하지 않습니다. lectureId: ${lectureId}`);
    }

    if (lecture.section.course.instructorId !== userId) {
      throw new UnauthorizedException(`수업 삭제 권한이 없습니다. courseId: ${lecture.courseId}`);
    }
  }

  private async validateUpdateRule(
    userId: string,
    lectureId: string,
    updateLectureDto: UpdateLectureDto,
  ) {
    const lecture = await this.findValidated(lectureId);
    const [course, duplicateOrderLecture] = await Promise.all([
      this.coursesService.findById(lecture.courseId),
      this.prisma.lecture.findFirst({
        where: {
          id: { not: lectureId },
          sectionId: lecture.sectionId,
          order: updateLectureDto.order,
          deletedAt: null,
        },
      }),
    ]);

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${lecture.courseId}`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`수업 수정 권한이 없습니다. courseId: ${lecture.courseId}`);
    }

    if (duplicateOrderLecture) {
      throw new BadRequestException(
        `수업 순서가 중복되었습니다. 순서를 다시 확인해주세요. order: ${updateLectureDto.order}`,
      );
    }

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${lecture.courseId}`);
    }
  }

  private async validateCreateRule(userId: string, courseId: string, sectionId: string) {
    const [course, section] = await Promise.all([
      this.coursesService.findById(courseId),
      this.sectionsService.findById(sectionId),
    ]);

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${courseId}`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`수업 생성 권한이 없습니다. courseId: ${courseId}`);
    }

    if (!section) {
      throw new NotFoundException(`섹션이 존재하지 않습니다. sectionId: ${sectionId}`);
    }
  }
}
