import { ConflictException, NotFoundException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpRequestDto } from 'src/user/dto/SignUpRequest.dto';
import { UpdateMyProfileRequestDto } from 'src/user/dto/UpdateMyProfileRequest.dto';
import { UserService } from 'src/user/user.service';
import { AppTestHepler } from '../helpers/AppTestHepler';
import { TestDataHelper } from '../helpers/TestDataHelper';

describe('UserService', () => {
  let service: UserService;
  let appTestHelper: AppTestHepler;
  let testDataHelper: TestDataHelper;
  let prisma: PrismaService;

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
    prisma = module.get(PrismaService);
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

  describe('signUp', () => {
    it('회원가입 시 사용자를 생성한다.', async () => {
      // given
      const signUpRequestDto = buildSignUpRequestDto({
        email: 'newuser@example.com',
        password: 'abc123',
        nickname: '홍길동',
      });

      // when
      const createdUser = await service.signUp(signUpRequestDto);

      // then
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe('newuser@example.com');
      expect(createdUser.name).toBe('홍길동');
      expect(createdUser.hashedPassword).toBeDefined();
      expect(compareSync('abc123', createdUser.hashedPassword!)).toBe(true);
    });

    it('비밀번호는 암호화해서 저장한다.', async () => {
      // given
      const signUpRequestDto = buildSignUpRequestDto({
        email: 'newuser@example.com',
        password: 'abc123',
        nickname: '홍길동',
      });

      // when
      const createdUser = await service.signUp(signUpRequestDto);

      // then
      expect(createdUser.hashedPassword).toBeDefined();
      expect(compareSync('abc123', createdUser.hashedPassword!)).toBe(true);
    });

    it('이미 사용 중인 이메일로 가입하면 예외를 발생시킨다.', async () => {
      // given
      const existingEmail = 'existing@example.com';
      await prisma.user.create({
        data: {
          email: existingEmail,
          hashedPassword: hashSync('abc123', 10),
        },
      });
      const signUpRequestDto = buildSignUpRequestDto({
        email: existingEmail,
        password: 'abc123',
        nickname: '홍길동',
      });

      // when
      const error = await service.signUp(signUpRequestDto).catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).message).toContain('이미 사용 중인 이메일입니다.');
    });

    it('이미 사용 중인 닉네임으로 가입하면 예외를 발생시킨다.', async () => {
      // given
      const existingNickname = '홍길동';
      await prisma.user.create({
        data: {
          name: existingNickname,
          email: 'existing@example.com',
          hashedPassword: hashSync('abc123', 10),
        },
      });
      const signUpRequestDto = buildSignUpRequestDto({
        email: 'newuser@example.com',
        password: 'abc123',
        nickname: existingNickname,
      });

      // when
      const error = await service.signUp(signUpRequestDto).catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).message).toContain('이미 사용 중인 닉네임입니다.');
    });
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
        name: '새이름',
      });

      // when
      const updatedUser = await service.updateProfile(user.id, updateMyProfileRequestDto);

      // then
      expect(updatedUser.name).toBe('새이름');
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

    it('이미 사용 중인 닉네임으로 수정하면 예외를 발생시킨다.', async () => {
      // given
      const user = await testDataHelper.createUser();
      const otherUser = await testDataHelper.createUser();
      const updateMyProfileRequestDto = new UpdateMyProfileRequestDto();
      Object.assign(updateMyProfileRequestDto, {
        name: otherUser.name!,
      });

      // when
      const error = await service
        .updateProfile(user.id, updateMyProfileRequestDto)
        .catch((e: unknown) => e);

      // then
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).message).toContain('이미 사용 중인 닉네임입니다.');
    });

    it('본인의 기존 닉네임과 동일한 값으로 수정하면 예외를 발생시키지 않는다.', async () => {
      // given
      const user = await prisma.user.create({
        data: {
          name: '홍길동',
          email: 'same-nickname@example.com',
          hashedPassword: hashSync('abc123', 10),
        },
      });
      const updateMyProfileRequestDto = new UpdateMyProfileRequestDto();
      Object.assign(updateMyProfileRequestDto, {
        name: '홍길동',
      });

      // when
      const updatedUser = await service.updateProfile(user.id, updateMyProfileRequestDto);

      // then
      expect(updatedUser.name).toBe('홍길동');
    });
  });
});

function buildSignUpRequestDto({
  email,
  password,
  nickname,
}: {
  email: string;
  password: string;
  nickname: string;
}): SignUpRequestDto {
  const signUpRequestDto = new SignUpRequestDto();
  Object.assign(signUpRequestDto, {
    email,
    password,
    nickname,
  });
  return signUpRequestDto;
}
