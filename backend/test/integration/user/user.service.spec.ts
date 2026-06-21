import { NotFoundException } from '@nestjs/common';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { UpdateMyProfileRequestDto } from 'src/user/dto/UpdateMyProfileRequest.dto';
import { UserService } from 'src/user/user.service';
import { AppTestHepler } from '../helpers/AppTestHepler';
import { TestDataHelper } from '../helpers/TestDataHelper';

describe('UserService', () => {
  let service: UserService;
  let appTestHelper: AppTestHepler;
  let testDataHelper: TestDataHelper;

  beforeAll(async () => {
    const appConfig = AppConfig.ofYml('test');
    appTestHelper = await AppTestHepler.of(appConfig);
    await appTestHelper.cleanData();

    const module = await appTestHelper
      .createTestingModule({
        providers: [UserService],
      })
      .compile();

    testDataHelper = new TestDataHelper(module);
    service = module.get(UserService);
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

  describe('findById', () => {
    it('ID로 사용자를 조회한다.', async () => {
      // given
      const user = await testDataHelper.createUser();

      // when
      const foundUser = await service.findById(user.id);

      // then
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.email).toBe(user.email);
      expect(foundUser.name).toBe(user.name);
    });

    it('존재하지 않는 사용자 ID로 조회하면 예외를 발생시킨다.', async () => {
      // given
      const notExistUserId = 'not-exist-user-id';

      // when
      const error = await service.findById(notExistUserId).catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('사용자를 찾을 수 없습니다.');
    });
  });

  describe('updateProfile', () => {
    it('프로필 정보를 수정한다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const updateMyProfileRequestDto = new UpdateMyProfileRequestDto();
      Object.assign(updateMyProfileRequestDto, {
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });

      // when
      const updatedUser = await service.updateProfile(user.id, updateMyProfileRequestDto);

      // then
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.name).toBe('홍길동');
      expect(updatedUser.image).toBe('https://cdn.example.com/profile.jpg');
      expect(updatedUser.bio).toBe('안녕하세요. 개발자입니다.');
    });

    it('일부 필드만 수정하면 나머지 필드는 유지된다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const updateMyProfileRequestDto = new UpdateMyProfileRequestDto();
      Object.assign(updateMyProfileRequestDto, {
        name: '새 이름',
      });

      // when
      const updatedUser = await service.updateProfile(user.id, updateMyProfileRequestDto);

      // then
      expect(updatedUser.name).toBe('새 이름');
      expect(updatedUser.image).toBe(user.image);
      expect(updatedUser.bio).toBe(user.bio);
    });

    it('존재하지 않는 사용자 ID로 수정하면 예외를 발생시킨다.', async () => {
      // given
      const notExistUserId = 'not-exist-user-id';
      const updateMyProfileRequestDto = new UpdateMyProfileRequestDto();
      Object.assign(updateMyProfileRequestDto, {
        name: '홍길동',
      });

      // when
      const error = await service
        .updateProfile(notExistUserId, updateMyProfileRequestDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toContain('사용자를 찾을 수 없습니다.');
    });
  });
});
