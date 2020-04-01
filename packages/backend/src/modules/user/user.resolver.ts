import { Configurable, ConfigParam } from 'nestjs-config'
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import * as bcrypt from 'bcryptjs'

import { MutationStatus, User, UserRole, RoleType } from '@magus/types'
import { UseGuards } from '@nestjs/common'

import { SystemGuard } from 'common/guard/system.guard'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService, private readonly userRoleService: UserRoleService) {}

    @Query((returns) => String)
    async hello(): Promise<string> {
        // this is just for testing
        return 'hello world'
    }

    @UseGuards(SystemGuard)
    @Mutation((returns) => MutationStatus)
    @Configurable()
    async initAdminUser(
        @ConfigParam('management.adminEmailAddress') adminEmailAddress: string,
    ): Promise<MutationStatus> {
        if (!(await this.userRoleService.haveAtLeastOneUserWithAdministratorRole())) {
            const hashedPassword = await bcrypt.hash(adminEmailAddress, 12)
            let user = new User()
            user.email = adminEmailAddress
            user.displayName = 'root'
            user.password = hashedPassword
            user.isVerified = true
            user = await this.userService.create(user)
            await Promise.all([
                this.userRoleService.create(new UserRole(user.id)),
                this.userRoleService.create(new UserRole(user.id, RoleType.ADMINISTRATOR)),
            ])
            return new MutationStatus(true, 'The administrator account has been created')
        }
        return new MutationStatus(false, 'The system already has an administrator account')
    }
}
