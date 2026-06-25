import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import 'reflect-metadata';
import { UpdateMyProfileRequestDto } from 'src/user/dto/UpdateMyProfileRequest.dto';

describe('UpdateMyProfileRequestDto', () => {
  describe('validateSync', () => {
    it('유효한 프로필 수정 요청은 검증을 통과한다.', () => {
      // given
      const dto = toDto({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
    });

    it('빈 객체는 검증을 통과한다.', () => {
      // given
      const dto = toDto({});

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
    });

    it('name이 문자열이 아니면 에러가 발생한다.', () => {
      // given
      const dto = toDto({ name: 123 });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('닉네임이 2자 미만이면 에러가 발생한다.', () => {
      // given
      const dto = toDto({ name: 'a' });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(Object.values(errors[0].constraints ?? {})).toContain(
        '닉네임은 2자 이상이어야 합니다.',
      );
    });

    it('image가 문자열이 아니면 에러가 발생한다.', () => {
      // given
      const dto = toDto({ image: 123 });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('image');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('bio가 문자열이 아니면 에러가 발생한다.', () => {
      // given
      const dto = toDto({ bio: 123 });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('bio');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('@Transform', () => {
    it('name 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({ name: '  홍길동  ' });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('홍길동');
    });

    it('image 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({ image: '  https://cdn.example.com/profile.jpg  ' });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.image).toBe('https://cdn.example.com/profile.jpg');
    });

    it('bio 앞뒤 공백을 제거한다.', () => {
      // given
      const dto = toDto({ bio: '  안녕하세요.  ' });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toHaveLength(0);
      expect(dto.bio).toBe('안녕하세요.');
    });
  });
});

function toDto(plain: Record<string, unknown>): UpdateMyProfileRequestDto {
  return plainToInstance(UpdateMyProfileRequestDto, plain);
}
