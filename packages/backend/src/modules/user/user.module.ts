import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User, UserRole } from '@magus/types'

import { UserResolver } from './user.resolver'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole])],
    providers: [UserService, UserRoleService, UserResolver],
})
export class UserModule {}
