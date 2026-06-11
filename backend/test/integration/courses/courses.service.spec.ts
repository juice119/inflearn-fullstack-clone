import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { Test } from '@nestjs/testing';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { CoursesService } from 'src/courses/courses.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;
  let prismaClient: PrismaService;
  let prismaTestingHelper: PrismaTestingHelper<PrismaService>;

  beforeAll(async () => {
    const appConfig = AppConfig.ofYml();
    prismaClient = new PrismaService(appConfig);
    await prismaClient.$connect();
    prismaTestingHelper = new PrismaTestingHelper(prismaClient);
    prisma = prismaTestingHelper.getProxyClient();

    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: AppConfig,
          useValue: appConfig,
        },
      ],
    }).compile();

    service = module.get(CoursesService);
  });

  beforeEach(async () => {
    await prismaTestingHelper.startNewTransaction({ timeout: 10_000 });
  });

  afterEach(() => {
    prismaTestingHelper.rollbackCurrentTransaction();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
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
