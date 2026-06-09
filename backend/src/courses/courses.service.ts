import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/UpdateCourseDto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    const { categoryIds, ...otherData } = createCourseDto;

    return this.prisma.course.create({
      data: {
        ...otherData,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : {},
        instructorId: userId,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string, include: string[] = []) {
    const includeObject = {};

    if (include) {
      include.forEach((item) => {
        includeObject[item] = true;
      });
    }

    const course = await this.prisma.course.findUnique({
      where: { id },
      include: include.length > 0 ? includeObject : undefined,
    });

    return course;
  }

  async update(id: string, userId: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException(`ID ${id} 코스를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`강의 소유자만 수정 할 수 있습니다.`);
    }

    return this.prisma.course.update({
      data: updateCourseDto,
      where: { id },
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException(`ID ${id} 코스를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(`강의의 소유자만 삭제할 수 있습니다.`);
    }

    return this.prisma.course.delete({ where: { id } });
  }
}
