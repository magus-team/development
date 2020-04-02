import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User, UserRole, Client } from '@magus/types'

import { JWTWithConfig } from 'modules/jwt.module'
import { UserResolver } from './user.resolver'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'
import { ClientService } from 'modules/client/client.service'

@Module({
    imports: [JWTWithConfig, TypeOrmModule.forFeature([User, UserRole, Client])],
    providers: [UserService, UserRoleService, ClientService, UserResolver],
})
export class UserModule {}
