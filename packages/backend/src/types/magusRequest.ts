import { FastifyRequest } from 'fastify'

import { Client } from '@magus/types'
import { UserInfo } from './userInfo'

export interface MagusRequest extends FastifyRequest {
    client?: Client
    userInfo?: UserInfo
}
