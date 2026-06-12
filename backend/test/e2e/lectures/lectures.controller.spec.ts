import { test } from '@playwright/test';

const { describe, expect } = test;

describe('LecturesController', () => {
  describe('POST /courses/:courseId/sections/:sectionId/lectures', () => {
    test('새로운 유닛 생성한다.', ({ request }) => {
      // given
      // when
      // then
      expect(request).toBeTruthy();
    });
  });

  describe('GET /lectures/:id', () => {
    test('유닛 상세 정보를 조회한다.', ({ request }) => {
      // given
      // when
      // then
      expect(request).toBeTruthy();
    });
  });

  describe('PATCH /lectures/:id', () => {
    test('유닛 정보를 수정한다.', ({ request }) => {
      expect(request).toBeTruthy();
    });
  });

  describe('DELETE /lectures/:id', () => {
    test('유닛 정보를 삭제한다.', ({ request }) => {
      expect(request).toBeTruthy();
    });
  });
});
