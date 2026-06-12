import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Lecture } from '@prisma/client';
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
    await this.validateCreateRule(userId, courseId, sectionId, createLectureDto.order);

    return this.prisma.lecture.create({
      data: {
        title: createLectureDto.title,
        description: createLectureDto.description,
        order: createLectureDto.order,
        sectionId: sectionId,
        courseId: courseId,
      },
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
      throw new NotFoundException(`유닛이 존재하지 않습니다. lectureId: ${id}`);
    }

    return lecture;
  }

  async update(
    lectureId: string,
    userId: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture> {
    await this.validateUpdateRule(userId, lectureId, updateLectureDto);

    return this.prisma.lecture.update({
      data: {
        title: updateLectureDto.title,
        description: updateLectureDto.description,
        order: updateLectureDto.order,
      },
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
      throw new NotFoundException(`유닛이 존재하지 않습니다. lectureId: ${lectureId}`);
    }

    if (lecture.section.course.instructorId !== userId) {
      throw new UnauthorizedException(`유닛 삭제 권한이 없습니다. courseId: ${lecture.courseId}`);
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
      throw new UnauthorizedException(`유닛 수정 권한이 없습니다. courseId: ${lecture.courseId}`);
    }

    if (duplicateOrderLecture) {
      throw new BadRequestException(
        `유닛 순서가 중복되었습니다. 순서를 다시 확인해주세요. order: ${updateLectureDto.order}`,
      );
    }

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${lecture.courseId}`);
    }
  }

  private async validateCreateRule(
    userId: string,
    courseId: string,
    sectionId: string,
    order: number,
  ) {
    const [course, section, duplicateOrderLecture] = await Promise.all([
      this.coursesService.findById(courseId),
      this.sectionsService.findById(sectionId),
      this.prisma.lecture.findFirst({
        where: {
          sectionId,
          order,
          deletedAt: null,
        },
      }),
    ]);

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${courseId}`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`유닛 생성 권한이 없습니다. courseId: ${courseId}`);
    }

    if (!section) {
      throw new NotFoundException(`섹션이 존재하지 않습니다. sectionId: ${sectionId}`);
    }

    if (duplicateOrderLecture) {
      throw new BadRequestException(
        `유닛 순서가 중복되었습니다. 순서를 다시 확인해주세요. order: ${order}`,
      );
    }
  }
}
