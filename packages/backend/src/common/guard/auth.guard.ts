import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'

import { JWTPayload, RoleType } from '@magus/types'
import { MagusRequest } from 'types/magusRequest'
import { UserInfo } from 'types/userInfo'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<RoleType[]>('roles', context.getHandler())
        const ctx = GqlExecutionContext.create(context)
        const { req } = ctx.getContext<{ req: MagusRequest }>()
        if (!req.headers.authorization) {
            return false
        }
        const token = req.headers.authorization.replace('Bearer ', '').replace('bearer ', '')
        try {
            const payload = await this.jwtService.verifyAsync<JWTPayload>(token)
            // check the user roles
            if (roles && roles.length > 0) {
                const userRoles = payload.roles
                for (let i = 0; i < roles.length; i++) {
                    if (userRoles.indexOf(roles[i]) === -1) {
                        return false
                    }
                }
            }
            req.userInfo = new UserInfo(payload)
        } catch (error) {
            return false
        }
        return true
    }
}
