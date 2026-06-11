import { expect, test } from '@playwright/test';

test.describe('AppController', () => {
  test.describe('/hc', () => {
    test('헬스체크 엔드포인트가 정상 응답한다.', async ({ request }) => {
      // given
      // when
      const response = await request.get('/hc');

      // then
      expect(response.ok()).toBeTruthy();
      expect(await response.json()).toEqual({ ok: true });
    });
  });
});
