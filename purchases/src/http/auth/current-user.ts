import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface AuthUser {
  sub: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;

    return request.user;
  },
);
