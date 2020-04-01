import { createUnionType } from '@nestjs/graphql'

import { IsSuspended } from './isSuspended'
import { IsUnverified } from './isUnverified'
import { MutationStatus } from './mutationStatus'
import { UserToken } from './userToken'

export const LoginResultUnion = createUnionType({
    name: 'LoginResult',
    types: () => [MutationStatus, IsSuspended, IsUnverified, UserToken],
})

export type LoginResult = MutationStatus | IsSuspended | IsUnverified | UserToken
