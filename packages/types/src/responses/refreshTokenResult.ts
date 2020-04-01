import { createUnionType } from '@nestjs/graphql'

import { MutationStatus } from './mutationStatus'
import { UserToken } from './userToken'

export const RefreshTokenResultUnion = createUnionType({
    name: 'RefreshTokenResult',
    types: () => [MutationStatus, UserToken],
})

export type RefreshTokenResult = MutationStatus | UserToken
