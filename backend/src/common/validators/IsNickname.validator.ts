import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_NICKNAME_CHARS = /^[가-힣A-Za-z0-9]+$/;
const HAS_LETTER = /[가-힣A-Za-z]/;

@ValidatorConstraint({ name: 'isNickname', async: false })
export class IsNicknameConstraint implements ValidatorConstraintInterface {
  private failureMessage = '닉네임 형식이 올바르지 않습니다.';

  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      this.failureMessage = '닉네임은 문자열이어야 합니다.';
      return false;
    }

    if (value.length < 2) {
      this.failureMessage = '닉네임은 2자 이상이어야 합니다.';
      return false;
    }

    if (value.length > 8) {
      this.failureMessage = '닉네임은 8자 이하이어야 합니다.';
      return false;
    }

    if (!HAS_LETTER.test(value)) {
      this.failureMessage = '한글 또는 영문을 포함해야 합니다.';
      return false;
    }

    if (!ALLOWED_NICKNAME_CHARS.test(value)) {
      this.failureMessage = '허용되지 않는 문자가 포함되어 있습니다.';
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return this.failureMessage;
  }
}

export function IsNickname(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNicknameConstraint,
    });
  };
}
