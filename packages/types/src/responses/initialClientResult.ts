import { createUnionType } from '@nestjs/graphql'

import { MutationStatus } from './mutationStatus'
import { Client } from '../entities/client'

export const InitialClientResultUnion = createUnionType({
    name: 'InitialClientResult',
    types: () => [MutationStatus, Client],
})
