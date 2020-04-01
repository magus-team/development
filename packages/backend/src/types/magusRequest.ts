import { FastifyRequest } from 'fastify'

import { Client } from '@magus/types'

export interface MagusRequest extends FastifyRequest {
    client?: Client
    clientId?: string
    clientKey?: string
    systemKey?: string
    userAppId?: string
    userId?: string
    userRoles?: [string]
}
