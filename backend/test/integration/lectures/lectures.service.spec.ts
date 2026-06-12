import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { LecturesService } from 'src/lectures/lectures.service';
import { SectionsService } from 'src/sections/sections.service';
import { AppTestHepler } from '../helpers/AppTestHepler';
import { LectureTestDataHelper } from '../helpers/LectureTestDataHelper';

describe('LecturesService', () => {
  let appTestHelper: AppTestHepler;
  let testDataHelper: LectureTestDataHelper;
  let lectureService: LecturesService;

  beforeAll(async () => {
    appTestHelper = await AppTestHepler.of();
    await appTestHelper.cleanData();

    const module = await appTestHelper
      .createTestingModule({
        providers: [LecturesService, CoursesService, SectionsService],
      })
      .compile();

    testDataHelper = new LectureTestDataHelper(module);
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
    it('새로운 유닛을 생성한다.', async () => {
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
      expect(lecture.order).toBe(createLectureDto.order);
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

    it('유저가 유닛을 생성할 수 있는 권한이 없는 경우, 예외를 발생시킨다.', async () => {
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
      expect((error as UnauthorizedException).message).toContain(
        '유닛을 만들 수 있는 권한이 없습니다.',
      );
    });

    it('유닛 순서가 중복되는 경우, 예외를 발생시킨다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const course = await testDataHelper.createCourse(user);
      const section = await testDataHelper.createSection(course, user);
      const createLectureDto = await testDataHelper.createLecture(section, user);

      const duplicateOrderLectureDto = testDataHelper.buildCreateLectureDto();
      duplicateOrderLectureDto.title = '중복 순서 유닛';
      duplicateOrderLectureDto.order = createLectureDto.order;

      // when
      const error = await lectureService
        .create(course.id, section.id, user.id, duplicateOrderLectureDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).message).toContain('유닛 순서가 중복되었습니다.');
    });
  });

  describe('findValidated', () => {
    it('유효한 유닛을 조회한다.', () => {});

    it('유닛이 존재하지 않는 경우, 예외를 발생시킨다.', () => {});

    it('삭제된 유닛은 조회하지 않는다.', () => {});
  });

  describe('update', () => {
    it('유닛을 수정한다', () => {});

    it('유저가 유닛을 수정할 수 있는 권한이 없는 경우, 예외를 발생시킨다.', () => {});

    it('유닛 순서가 중복되는 경우, 예외를 발생시킨다.', () => {});
  });

  describe('delete', () => {
    it('유닛을 삭제한다', () => {});

    it('유닛 삭제 권한이 없는 경우, 예외를 발생시킨다.', () => {});
  });
});
