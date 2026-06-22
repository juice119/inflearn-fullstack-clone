import { User } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import 'reflect-metadata';
import { MyProfileResponseDto } from 'src/user/dto/MyProfileResponse.dto';

describe('MyProfileResponseDto', () => {
  describe('from', () => {
    it('User 엔티티의 프로필 필드를 DTO로 매핑한다.', () => {
      // given
      const user = createUser({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });

      // when
      const dto = MyProfileResponseDto.from(user);

      // then
      expect(dto).toBeInstanceOf(MyProfileResponseDto);
      expect(dto.name).toBe('홍길동');
      expect(dto.image).toBe('https://cdn.example.com/profile.jpg');
      expect(dto.bio).toBe('안녕하세요. 개발자입니다.');
    });

    it('프로필 필드가 null이면 null을 반환한다.', () => {
      // given
      const user = createUser({
        name: null,
        image: null,
        bio: null,
      });

      // when
      const dto = MyProfileResponseDto.from(user);

      // then
      expect(dto.name).toBeNull();
      expect(dto.image).toBeNull();
      expect(dto.bio).toBeNull();
    });
  });

  describe('직렬화', () => {
    it('@Expose가 적용된 프로필 필드만 직렬화한다.', () => {
      // given
      const dto = new MyProfileResponseDto({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });

      // when
      const plain = instanceToPlain(dto, { excludeExtraneousValues: true });

      // then
      expect(plain).toEqual({
        name: '홍길동',
        image: 'https://cdn.example.com/profile.jpg',
        bio: '안녕하세요. 개발자입니다.',
      });
    });
  });
});

function createUser(overrides: Partial<Pick<User, 'name' | 'image' | 'bio'>> = {}): User {
  return {
    id: 'user-id',
    name: '기본 이름',
    email: 'user@example.com',
    emailVerified: null,
    hashedPassword: 'hashed-password',
    image: 'https://cdn.example.com/default.jpg',
    bio: '기본 자기소개',
    ...overrides,
  };
}
