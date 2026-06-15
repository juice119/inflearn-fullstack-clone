import { test } from '@playwright/test';

const { describe, expect } = test;

describe('LecturesController', () => {
  describe('POST /courses/:courseId/sections/:sectionId/lectures', () => {
    test('새로운 수업 생성한다.', ({ request }) => {
      // given
      // when
      // then
      expect(request).toBeTruthy();
    });
  });

  describe('GET /lectures/:id', () => {
    test('수업 상세 정보를 조회한다.', ({ request }) => {
      // given
      // when
      // then
      expect(request).toBeTruthy();
    });
  });

  describe('PATCH /lectures/:id', () => {
    test('수업 정보를 수정한다.', ({ request }) => {
      expect(request).toBeTruthy();
    });
  });

  describe('DELETE /lectures/:id', () => {
    test('수업 정보를 삭제한다.', ({ request }) => {
      expect(request).toBeTruthy();
    });
  });
});
