import { Configurable, ConfigParam } from 'nestjs-config'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import * as bcrypt from 'bcryptjs'

import { MutationStatus, User, UserRole, RoleType, RegisterInput } from '@magus/types'
import { UseGuards, BadRequestException } from '@nestjs/common'

import { SystemGuard } from 'common/guard/system.guard'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'
import { ClientGuard } from 'common/guard/client.guard'

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

    @UseGuards(ClientGuard)
    @Mutation((returns) => MutationStatus)
    async register(@Args('data') { email, password }: RegisterInput): Promise<MutationStatus> {
        // first check do we have any user with this email address
        if (await this.userService.doAlreadyHaveUserWithThisEmail(email)) {
            throw new BadRequestException(
                undefined,
                'already have a user with this email, please login with this email.',
            )
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        let user = new User()
        user.email = email
        user.password = hashedPassword

        user = await this.userService.create(user)

        //TODO: send verify email

        return new MutationStatus(true, 'you successfully registered, please check your email to verify your account.')
    }
}
