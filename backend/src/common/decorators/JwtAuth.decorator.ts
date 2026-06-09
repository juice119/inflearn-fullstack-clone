import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guards';

export function JwtAuth() {
  return applyDecorators(
    UseGuards(AccessTokenGuard),
    ApiBearerAuth('access-token'),
  );
}
