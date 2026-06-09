import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../AuthenticatedRequest';
import { JwtUserPayLoad } from '../JwtUserPayLoad';

export const User = createParamDecorator<string, JwtUserPayLoad>(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return new JwtUserPayLoad(request.user.sub, request.user.email);
  },
);
