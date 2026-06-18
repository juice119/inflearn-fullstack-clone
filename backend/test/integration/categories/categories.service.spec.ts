import { CategoriesService } from 'src/categories/categories.service';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { AppTestHepler } from '../helpers/AppTestHepler';
import { TestDataHelper } from '../helpers/TestDataHelper';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let appTestHelper: AppTestHepler;
  let testDataHelper: TestDataHelper;

  beforeAll(async () => {
    const appConfig = AppConfig.ofYml('test');
    appTestHelper = await AppTestHepler.of(appConfig);
    await appTestHelper.cleanData();

    const module = await appTestHelper
      .createTestingModule({
        providers: [CategoriesService],
      })
      .compile();

    testDataHelper = new TestDataHelper(module);
    service = module.get(CategoriesService);
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

  describe('findAll', () => {
    it('카테고리가 없으면 빈 배열을 반환한다.', async () => {
      // when
      const categories = await service.findAll();

      // then
      expect(categories).toEqual([]);
    });

    it('모든 카테고리를 조회한다.', async () => {
      // given
      const category = await testDataHelper.createCategory();

      // when
      const categories = await service.findAll();

      // then
      expect(categories).toHaveLength(1);
      expect(categories[0].id).toBe(category.id);
      expect(categories[0].name).toBe(category.name);
      expect(categories[0].slug).toBe(category.slug);
      expect(categories[0].description).toBe(category.description);
    });
  });
});
