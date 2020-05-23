import { Configurable, ConfigParam } from 'nestjs-config'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards, BadRequestException, NotFoundException } from '@nestjs/common'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

import { MutationStatus, User, UserRole, RoleType, RegisterInput, ResetPasswordInput } from '@magus/types'

import { ClientGuard } from 'common/guard/client.guard'
import { EmailUtils } from 'common/utils/email.utils'
import { SystemGuard } from 'common/guard/system.guard'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly userRoleService: UserRoleService,
        private readonly emailUtils: EmailUtils,
    ) {}

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

        const token = v4()
        const validUntil = new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
        user.actionTokens = { verifyEmail: { token, validUntil } }

        user = await this.userService.create(user)
        await this.userRoleService.create(new UserRole(user.id))

        this.emailUtils.sendVerifyAccountEmail(email, token)

        return new MutationStatus(true, 'you successfully registered, please check your email to verify your account.')
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => MutationStatus)
    async forgotPassword(@Args('email') email: string): Promise<MutationStatus> {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            return new MutationStatus(false, 'there is no account with this email address')
        }

        const token = v4()
        const validUntil = new Date(new Date().getTime() + 1000 * 60 * 60 * 5) // 5 hours
        user.actionTokens.resetPassword = { token, validUntil }

        await this.userService.save(user)

        this.emailUtils.sendResetPasswordLink(email, token)

        return new MutationStatus(true, 'the reset password link email has been send, please check your email.')
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => MutationStatus)
    async resetPassword(@Args('data') { email, token, password }: ResetPasswordInput): Promise<MutationStatus> {
        const tokenIsInvalidError = new BadRequestException(undefined, 'the token is invalid')

        const user = await this.userService.findByEmail(email)
        if (!user || !user.actionTokens.resetPassword) {
            throw tokenIsInvalidError
        }
        const actionToken = user.actionTokens.resetPassword
        if (actionToken.token !== token) {
            throw tokenIsInvalidError
        }

        if (actionToken.validUntil < new Date()) {
            throw tokenIsInvalidError
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        user.password = hashedPassword
        user.actionTokens.resetPassword = undefined

        await this.userService.save(user)

        return new MutationStatus(true, 'the new password has been set successfully.')
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => MutationStatus)
    async resendVerifyEmail(@Args('email') email: string): Promise<MutationStatus> {
        const token = v4()
        const validUntil = new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
        const result = await this.userService.updateVerifyEmail(email, { token, validUntil })
        if (result.affected === 0) {
            throw new NotFoundException('There is no account with this email that is not verified yet!')
        }

        this.emailUtils.sendVerifyAccountEmail(email, token)

        return new MutationStatus(true, 'The verification email has been send, Please check your email.')
    }
}
