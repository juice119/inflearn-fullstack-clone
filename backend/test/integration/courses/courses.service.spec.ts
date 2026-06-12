import { AppConfig } from 'src/common/config/AplicationConfig';
import { CoursesService } from 'src/courses/courses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppTestHepler } from '../helpers/AppTestHepler';

describe('CoursesService', () => {
  let service: CoursesService;
  let appTestHelper: AppTestHepler;
  let prisma: PrismaService;

  beforeAll(async () => {
    const appConfig = AppConfig.ofYml('test');
    appTestHelper = await AppTestHepler.of(appConfig);
    const module = await appTestHelper
      .createTestingModule({
        providers: [CoursesService],
      })
      .compile();

    service = module.get(CoursesService);
    prisma = appTestHelper.prismaService;
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
    it('유효한 데이터로 강의를 생성한다.', async () => {
      // given
      const instructor = await prisma.user.create({
        data: { email: 'instructor@test.com' },
      });
      const createCourseDto = {
        title: '테스트 강의',
        slug: 'test-course',
        description: '강의 설명',
        price: 1000,
        level: 'BEGINNER',
        categoryIds: [],
      };

      // when
      const course = await service.create(instructor.id, createCourseDto);

      // then
      expect(course.title).toBe('테스트 강의');
      expect(course.slug).toBe('test-course');
      expect(course.instructorId).toBe(instructor.id);
      expect(course.status).toBe('DRAFT');
    });
  });
});
