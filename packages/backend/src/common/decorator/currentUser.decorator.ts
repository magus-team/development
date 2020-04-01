import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { MagusRequest } from 'types/magusRequest'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const { req } = GqlExecutionContext.create(ctx).getContext<{ req: MagusRequest }>()
    return req.userInfo
})
