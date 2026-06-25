import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import 'reflect-metadata';
import { SignUpRequestDto } from 'src/user/dto/SignUpRequest.dto';

describe('SignUpRequestDto', () => {
  describe('validateSync', () => {
    it('유효한 회원가입 요청은 검증을 통과한다.', () => {
      // given
      const dto = toDto(validSignUpData());

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
    });

    it('email이 누락되면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        password: 'abc123',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'email')).toBe(true);
    });

    it('password가 누락되면 에러막가 발생한다.', () => {
      // given
      const dto = toDto({
        email: 'user@example.com',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('이메일 형식이 올바르지 않으면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        email: 'invalid-email',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(Object.values(errors[0].constraints ?? {})).toContain(
        '올바른 이메일 형식이 아닙니다.',
      );
    });

    it('비밀번호가 6자 미만이면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: 'ab1',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('비밀번호가 16자를 초과하면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: 'a1' + 'b'.repeat(15),
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('비밀번호에 영문이 없으면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: '123456',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('비밀번호에 숫자가 없으면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: 'abcdef',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('비밀번호에 허용되지 않는 문자가 포함되면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: 'abc 123',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('nickname이 누락되면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        email: 'user@example.com',
        password: 'abc123',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'nickname')).toBe(true);
    });

    it('닉네임이 2자 미만이면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        nickname: 'a',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('nickname');
      expect(Object.values(errors[0].constraints ?? {})).toContain(
        '닉네임은 2자 이상이어야 합니다.',
      );
    });

    it('숫자만으로 구성된 닉네임이면 에러가 발생한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        nickname: '1234',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'nickname')).toBe(true);
      expect(
        Object.values(errors.find((error) => error.property === 'nickname')?.constraints ?? {}),
      ).toContain('한글 또는 영문을 포함해야 합니다.');
    });
  });

  describe('@Transform', () => {
    it('email 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        email: '  user@example.com  ',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.email).toBe('user@example.com');
    });

    it('password는 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        password: ' abc123',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.password).toBe('abc123');
    });

    it('nickname 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({
        ...validSignUpData(),
        nickname: '  홍길동  ',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.nickname).toBe('홍길동');
    });
  });
});

function validSignUpData(): Record<string, string> {
  return {
    email: 'user@example.com',
    password: 'abc123',
    nickname: '홍길동',
  };
}

function toDto(plain: Record<string, unknown>): SignUpRequestDto {
  return plainToInstance(SignUpRequestDto, plain);
}
