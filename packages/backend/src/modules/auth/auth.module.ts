import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TrustedUserApp, User, Client } from '@magus/types'

import { AuthResolver } from './auth.resolver'
import { ClientService } from 'modules/client/client.service'
import { JWTWithConfig } from 'modules/jwt.module'
import { TrustedUserAppService } from './trustedUserApp.service'
import { UserService } from 'modules/user/user.service'

@Module({
    imports: [JWTWithConfig, TypeOrmModule.forFeature([Client, User, TrustedUserApp])],
    providers: [ClientService, UserService, TrustedUserAppService, AuthResolver],
})
export class AuthModule {}
