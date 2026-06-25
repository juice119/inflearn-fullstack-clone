import { Transform } from 'class-transformer';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export function Trim(): PropertyDecorator {
  return Transform(trim);
}
