import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Course, Section, User } from '@prisma/client';
import { CoursesService } from 'src/courses/courses.service';
import { CreateLectureDto } from 'src/lectures/dto/CreateLecture.dto';
import { LecturesService } from 'src/lectures/lectures.service';
import { SectionsService } from 'src/sections/sections.service';
import { AppTestHepler } from '../helpers/AppTestHepler';
import { TestDataHelper } from '../helpers/TestDataHelper';

describe('LecturesService', () => {
  let appTestHelper: AppTestHepler;
  let testDataHelper: TestDataHelper;
  let lectureService: LecturesService;

  beforeAll(async () => {
    appTestHelper = await AppTestHepler.of();
    await appTestHelper.cleanData();

    const module = await appTestHelper
      .createTestingModule({
        providers: [LecturesService, CoursesService, SectionsService],
      })
      .compile();

    testDataHelper = new TestDataHelper(module);
    lectureService = module.get(LecturesService);
  });

  beforeEach(async () => {
    await appTestHelper.startTransaction();
  });

  afterEach(() => {
    appTestHelper.rollbackTransaction();
  });

  afterAll(async () => {
    await appTestHelper.disconnetDBConnection();
  });

  describe('create', () => {
    it('새로운 수업을 생성한다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);

      const createLectureDto = testDataHelper.buildCreateLectureDto();

      // when
      const lecture = await lectureService.create(course.id, section.id, user.id, createLectureDto);

      // then
      expect(lecture.title).toBe(createLectureDto.title);
      expect(lecture.description).toBe(createLectureDto.description);
    });

    it('수업은 마지막 순서 바로 위에 생성된다.', async () => {
      // given
      const {
        user,
        course,
        section,
        lecture: firstOrderLecture,
      } = await createTestLecture(testDataHelper);

      // when
      const lecture = await lectureService.create(
        course.id,
        section.id,
        user.id,
        testDataHelper.buildCreateLectureDto(),
      );

      //then
      expect(lecture.order).toBe(firstOrderLecture.order + 1);
    });

    it('강의가 존재하지 않는 경우, 예외를 발생시킨다.', async () => {
      // given
      const notExistCourseId = 'not-exist-course-id';
      const createLectureDto = testDataHelper.buildCreateLectureDto();

      // when
      const error = await lectureService
        .create(notExistCourseId, 'not-exist-section-id', 'not-exist-user-id', createLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('강의가 존재하지 않습니다.');
    });

    it('섹션이 존재하지 않는 경우, 예외를 발생시킨다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const notExistSectionId = 'not-exist-section-id';
      const createLectureDto = testDataHelper.buildCreateLectureDto();

      // when
      const error = await lectureService
        .create(course.id, notExistSectionId, user.id, createLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('섹션이 존재하지 않습니다.');
    });

    it('유저가 수업을 생성할 수 있는 권한이 없는 경우, 예외를 발생시킨다.', async () => {
      // given
      const instructor = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(instructor);
      const section = await testDataHelper.createSection(course, instructor);
      const unauthorizedUser = await testDataHelper.createUser();
      const createLectureDto = testDataHelper.buildCreateLectureDto();

      // when
      const error = await lectureService
        .create(course.id, section.id, unauthorizedUser.id, createLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toContain('수업 생성 권한이 없습니다.');
    });
  });

  describe('findValidated', () => {
    it('유효한 수업을 조회한다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);
      const lecture = await testDataHelper.createLecture(section, user);

      // when
      const result = await lectureService.findValidated(lecture.id);

      // then
      expect(result.id).toBe(lecture.id);
      expect(result.title).toBe(lecture.title);
      expect(result.description).toBe(lecture.description);
      expect(result.order).toBe(lecture.order);
    });

    it('수업이 존재하지 않는 경우, 예외를 발생시킨다.', async () => {
      // given
      const notExistLectureId = 'not-exist-lecture-id';

      // when
      const error = await lectureService.findValidated(notExistLectureId).catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('수업이 존재하지 않습니다.');
    });
  });

  describe('update', () => {
    it('수업을 수정한다', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);
      const lecture = await testDataHelper.createLecture(section, user);

      const updateLectureDto = testDataHelper.buildUpdateLectureDto();

      // when
      const result = await lectureService.update(lecture.id, user.id, updateLectureDto);

      // then
      expect(result.id).toBe(lecture.id);
      expect(result.title).toBe(updateLectureDto.title);
      expect(result.description).toBe(updateLectureDto.description);
      expect(result.order).toBe(updateLectureDto.order);
    });

    it('수업이 존재하지 않는 경우, 예외를 발생시킨다.', async () => {
      // given
      const notExistLectureId = 'not-exist-lecture-id';
      const updateLectureDto = testDataHelper.buildUpdateLectureDto();

      // when
      const error = await lectureService
        .update(notExistLectureId, 'not-exist-user-id', updateLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('수업이 존재하지 않습니다.');
    });

    it('유저가 수업을 수정할 수 있는 권한이 없는 경우, 예외를 발생시킨다.', async () => {
      // given
      const instructor = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(instructor);
      const section = await testDataHelper.createSection(course, instructor);
      const lecture = await testDataHelper.createLecture(section, instructor);
      const unauthorizedUser = await testDataHelper.createUser();
      const updateLectureDto = testDataHelper.buildUpdateLectureDto();

      // when
      const error = await lectureService
        .update(lecture.id, unauthorizedUser.id, updateLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toContain('수업 수정 권한이 없습니다.');
    });

    it('수업 순서가 중복되는 경우, 예외를 발생시킨다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);
      const lecture = await testDataHelper.createLecture(section, user); // order: 1
      const otherLecture = await testDataHelper.createLecture(section, user, {
        order: lecture.order + 1,
      });
      const updateLectureDto = testDataHelper.buildUpdateLectureDto();
      updateLectureDto.order = otherLecture.order;

      // when
      const error = await lectureService
        .update(lecture.id, user.id, updateLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).message).toContain('수업 순서가 중복되었습니다.');
    });
  });

  describe('delete', () => {
    it('수업을 삭제한다', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);
      const lecture = await testDataHelper.createLecture(section, user);

      // when
      await lectureService.delete(lecture.id, user.id);

      // then
      const deleteLecture = await appTestHelper.prismaService.lecture.findUnique({
        where: { id: lecture.id },
      });
      expect(deleteLecture?.deletedAt).not.toBeNull();
    });

    it('수업 삭제 권한이 없는 경우, 예외를 발생시킨다.', async () => {
      // given
      const instructor = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(instructor);
      const section = await testDataHelper.createSection(course, instructor);
      const lecture = await testDataHelper.createLecture(section, instructor);
      const unauthorizedUser = await testDataHelper.createUser();

      // when
      const error = await lectureService
        .delete(lecture.id, unauthorizedUser.id)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).message).toContain('수업 삭제 권한이 없습니다.');
    });

    it('수업이 존재하지 않는 경우, 예외를 발생시킨다.', async () => {
      // given
      const notExistLectureId = 'not-exist-lecture-id';

      // when
      const error = await lectureService
        .delete(notExistLectureId, 'not-exist-user-id')
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('수업이 존재하지 않습니다.');
    });
  });
});

async function createTestLecture(
  testDataHelper: TestDataHelper,
  {
    user,
    course,
    section,
    createLectureDto,
  }: { user?: User; course?: Course; section?: Section; createLectureDto?: CreateLectureDto } = {},
) {
  const testUser = user || (await testDataHelper.createUser());
  const testCourse = course || (await testDataHelper.createCourse(testUser));
  const testSection = section || (await testDataHelper.createSection(testCourse, testUser));
  const testLecture = await testDataHelper.createLecture(testSection, testUser, createLectureDto);

  return {
    user: testUser,
    course: testCourse,
    section: testSection,
    lecture: testLecture,
  };
}
