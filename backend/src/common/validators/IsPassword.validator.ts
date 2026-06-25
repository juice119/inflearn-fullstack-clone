import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_PASSWORD_CHARS = /^[A-Za-z0-9!@#$%^&*()]+$/;

@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (value.length < 6 || value.length > 16) {
      return false;
    }

    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return false;
    }

    if (/\s/.test(value)) {
      return false;
    }

    return ALLOWED_PASSWORD_CHARS.test(value);
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
