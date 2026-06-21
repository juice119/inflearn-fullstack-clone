import { expect, test } from '@playwright/test';
import { E2eAuthHelper } from '../helpers/E2eAuthHelper';
import { E2eDbHelper } from '../helpers/E2eDbHelper';

test.describe('UserController', () => {
  const e2eDbHelper = new E2eDbHelper();
  const e2eAuthHelper = new E2eAuthHelper();

  test.beforeAll(async () => {
    await e2eDbHelper.connect();
  });

  test.beforeEach(async () => {
    await e2eDbHelper.cleanData();
  });

  test.afterAll(async () => {
    await e2eDbHelper.disconnect();
  });

  test.describe('GET /user/my-profile', () => {
    test('인증된 사용자의 프로필을 조회한다.', async ({ request }) => {
      // given
      const user = await e2eDbHelper.createUser({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });
      const accessToken = await e2eAuthHelper.createAccessToken(user.id, user.email!);

      // when
      const response = await request.get('/user/my-profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // then
      expect(response.ok()).toBeTruthy();
      expect(await response.json()).toEqual({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });
    });

    test('인증 토큰 없이 요청하면 401 Unauthorized를 반환한다.', async ({ request }) => {
      // given
      // when
      const response = await request.get('/user/my-profile');

      // then
      expect(response.status()).toBe(401);
    });
  });

  test.describe('PATCH /user/my-profile', () => {
    test('인증된 사용자의 프로필을 수정한다.', async ({ request }) => {
      // given
      const user = await e2eDbHelper.createUser({
        name: '기존 이름',
        bio: '기존 자기소개',
      });
      const accessToken = await e2eAuthHelper.createAccessToken(user.id, user.email!);

      // when
      const response = await request.patch('/user/my-profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          name: '새 이름',
          image: 'https://cdn.example.com/new-profile.jpg',
          bio: '새 자기소개',
        },
      });

      // then
      expect(response.ok()).toBeTruthy();
      expect(await response.json()).toEqual({
        name: '새 이름',
        image: 'https://cdn.example.com/new-profile.jpg',
        bio: '새 자기소개',
      });
    });

    test('인증 토큰 없이 요청하면 401 Unauthorized를 반환한다.', async ({ request }) => {
      // given
      // when
      const response = await request.patch('/user/my-profile', {
        data: {
          name: '홍길동',
        },
      });

      // then
      expect(response.status()).toBe(401);
    });

    test('유효하지 않은 요청 본문이면 400 Bad Request를 반환한다.', async ({ request }) => {
      // given
      const user = await e2eDbHelper.createUser();
      const accessToken = await e2eAuthHelper.createAccessToken(user.id, user.email!);

      // when
      const response = await request.patch('/user/my-profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          name: 123,
        },
      });

      // then
      expect(response.status()).toBe(400);
    });
  });
});
