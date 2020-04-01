import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User, UserRole } from '@magus/types'

import { JWTWithConfig } from 'modules/jwt.module'
import { UserResolver } from './user.resolver'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'

@Module({
    imports: [JWTWithConfig, TypeOrmModule.forFeature([User, UserRole])],
    providers: [UserService, UserRoleService, UserResolver],
})
export class UserModule {}
