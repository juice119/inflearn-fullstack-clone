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
    const [course, section, duplicateOrderLecture] = await Promise.all([
      this.coursesService.findById(courseId),
      this.sectionsService.findById(sectionId),
      this.prisma.lecture.findUnique({
        where: {
          sectionId_order: { sectionId, order: createLectureDto.order },
        },
      }),
    ]);

    if (!course) {
      throw new NotFoundException(`강의가 존재하지 않습니다. courseId: ${courseId}`);
    }

    if (!section) {
      throw new NotFoundException(`섹션이 존재하지 않습니다. sectionId: ${sectionId}`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`유닛을 만들 수 있는 권한이 없습니다. courseId: ${courseId}`);
    }

    if (duplicateOrderLecture) {
      throw new BadRequestException(
        `유닛 순서가 중복되었습니다. 순서를 다시 확인해주세요. order: ${createLectureDto.order}`,
      );
    }

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

  findValidated(id: string) {
    throw new Error('Method not implemented.');
  }

  update(lectureId: string, userId: string, updateLectureDto: UpdateLectureDto) {
    throw new Error('Method not implemented.');
  }

  delete(lectureId: string, userId: string) {
    throw new Error('Method not implemented.');
  }
}
