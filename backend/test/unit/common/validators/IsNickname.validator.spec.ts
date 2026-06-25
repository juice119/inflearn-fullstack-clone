import 'reflect-metadata';
import { IsNicknameConstraint } from 'src/common/validators/IsNickname.validator';

describe('IsNicknameConstraint', () => {
  const constraint = new IsNicknameConstraint();

  describe('validate', () => {
    it('유효한 닉네임은 검증을 통과한다.', () => {
      // given
      const validNicknames = ['홍길동', 'user01', '가나다', 'Ab12'];

      // when & then
      for (const nickname of validNicknames) {
        expect(constraint.validate(nickname)).toBe(true);
      }
    });

    it('문자열이 아니면 검증에 실패한다.', () => {
      // given
      // when
      const result = constraint.validate(123);

      // then
      expect(result).toBe(false);
      expect(constraint.defaultMessage()).toBe('닉네임은 문자열이어야 합니다.');
    });

    it('2자 미만이면 검증에 실패한다.', () => {
      // given
      // when
      const result = constraint.validate('a');

      // then
      expect(result).toBe(false);
      expect(constraint.defaultMessage()).toBe('닉네임은 2자 이상이어야 합니다.');
    });

    it('8자를 초과하면 검증에 실패한다.', () => {
      // given
      // when
      const result = constraint.validate('abcdefghi');

      // then
      expect(result).toBe(false);
      expect(constraint.defaultMessage()).toBe('닉네임은 8자 이하이어야 합니다.');
    });

    it('한글 또는 영문이 없으면 검증에 실패한다.', () => {
      // given
      // when
      const result = constraint.validate('1234');

      // then
      expect(result).toBe(false);
      expect(constraint.defaultMessage()).toBe('한글 또는 영문을 포함해야 합니다.');
    });

    it('허용되지 않는 문자가 포함되면 검증에 실패한다.', () => {
      // given
      const invalidNicknames = ['홍 길동', 'user@01', '닉네임!'];

      // when & then
      for (const nickname of invalidNicknames) {
        expect(constraint.validate(nickname)).toBe(false);
        expect(constraint.defaultMessage()).toBe('허용되지 않는 문자가 포함되어 있습니다.');
      }
    });
  });
});
