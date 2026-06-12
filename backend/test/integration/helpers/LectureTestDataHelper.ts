import { fakerKO as faker } from '@faker-js/faker';
import { TestingModule } from '@nestjs/testing';
import { Course, Lecture, Section, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/CreateCourseDto';
import { CreateLectureDto } from 'src/lectures/dto/CreateLecture.dto';
import { LecturesService } from 'src/lectures/lectures.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from 'src/sections/dto/CreateSection.dto';
import { SectionsService } from 'src/sections/sections.service';

export class LectureTestDataHelper {
  private prisma: PrismaService;
  private module: TestingModule;

  constructor(module: TestingModule) {
    this.module = module;
    this.prisma = module.get(PrismaService);
  }

  createSection(course: Course, user: User): Promise<Section> {
    const createSectionDto = new CreateSectionDto();
    createSectionDto.title = faker.word.noun();
    return this.module.get(SectionsService).create(course.id, user.id, createSectionDto);
  }

  createCourse(user: User): Promise<Course> {
    const createCourseDto = new CreateCourseDto();
    createCourseDto.title = faker.book.title();
    createCourseDto.slug = faker.word.noun();
    createCourseDto.description = faker.commerce.productDescription();
    createCourseDto.price = faker.number.int({ min: 1000, max: 90000000 });
    return this.module.get(CoursesService).create(user.id, createCourseDto);
  }

  createUser(): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        emailVerified: faker.date.recent(),
        hashedPassword: hashSync(faker.internet.password(), 10),
      },
    });
  }

  createLecture(section: Section, user: User, update: Partial<Lecture> = {}): Promise<Lecture> {
    const createLectureDto = new CreateLectureDto();
    createLectureDto.title = update.title || faker.word.noun();
    createLectureDto.description = update.description || faker.commerce.productDescription();
    createLectureDto.order = update.order || 1;

    return this.module
      .get(LecturesService)
      .create(section.courseId, section.id, user.id, createLectureDto);
  }

  buildCreateLectureDto(): CreateLectureDto {
    const createLectureDto = new CreateLectureDto();
    createLectureDto.title = '테스트 유닛';
    createLectureDto.description = '테스트 유닛 설명';
    createLectureDto.order = 1;
    return createLectureDto;
  }
}
