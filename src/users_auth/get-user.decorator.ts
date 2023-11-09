import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './schemas/user.schema';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
