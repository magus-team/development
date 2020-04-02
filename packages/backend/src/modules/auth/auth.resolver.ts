import { InjectConfig } from 'nestjs-config'
import { JwtService } from '@nestjs/jwt'
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { UseGuards, BadRequestException, ForbiddenException } from '@nestjs/common'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

import {
    LoginResultUnion,
    Client,
    LoginInput,
    MutationStatus,
    IsUnverified,
    IsSuspended,
    TrustedUserApp,
    JWTPayload,
    UserToken,
    RefreshTokenInput,
    VerifyEmailAddressInput,
    User,
} from '@magus/types'

import { AuthGuard } from 'common/guard/auth.guard'
import { ClientGuard } from 'common/guard/client.guard'
import { CurrentClient } from 'common/decorator/currentClient.decorator'
import { CurrentUser } from 'common/decorator/currentUser.decorator'
import { TrustedUserAppService } from './trustedUserApp.service'
import { UserInfo } from 'types/userInfo'
import { UserService } from 'modules/user/user.service'

@Resolver()
export class AuthResolver {
    constructor(
        private userService: UserService,
        private readonly trustedUserAppService: TrustedUserAppService,
        private readonly jwtService: JwtService,
        @InjectConfig() private readonly config,
    ) {
        this.refreshTokenExpire = config.get('jwt.refreshTokenExpireInMin') * 60 * 1000
    }
    private readonly refreshTokenExpire: number

    async getNewUserToken(user: User, client: Client): Promise<UserToken> {
        const clearRefreshToken = v4()

        let app = new TrustedUserApp()
        const hashedRefreshToken = await bcrypt.hash(clearRefreshToken, 3)
        app.refreshToken = hashedRefreshToken
        app.tokenRefreshedAt = new Date()
        app.refreshTokenExpireAt = new Date(Date.now() + this.refreshTokenExpire)
        app.user = user
        app.client = client

        app = await this.trustedUserAppService.create(app)

        const jwtPayload: JWTPayload = {
            userId: user.id,
            name: user.displayName,
            roles: user.roles.map((ur) => ur.role),
            appId: app.id,
        }
        const jwt = await this.jwtService.sign(jwtPayload)

        return new UserToken(jwt, clearRefreshToken)
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => [LoginResultUnion])
    async login(
        @CurrentClient() client: Client,
        @Args('data') { email, password }: LoginInput,
    ): Promise<typeof LoginResultUnion[]> {
        const user = await this.userService.findByEmail(email, ['roles'])
        if (!user) {
            return [new MutationStatus(false, 'email or password is incorrect.')]
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return [new MutationStatus(false, 'email or password is incorrect.')]
        }

        if (!user.isVerified) {
            return [new IsUnverified('your email address is not verified, please verify your email.')]
        }

        if (user.isSuspended) {
            return [new IsSuspended('your account has been suspended.', `you don't follow the privacy policy!`)]
        }

        return [await this.getNewUserToken(user, client)]
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => UserToken)
    async refreshToken(
        @CurrentClient() client: Client,
        @Args('data') { appId, refreshToken }: RefreshTokenInput,
    ): Promise<UserToken> {
        const tokenIsInvalidError = new BadRequestException(undefined, 'The token is invalid')

        const app = await this.trustedUserAppService.findByIdWithUserRoles(appId)
        if (!app) {
            throw tokenIsInvalidError
        }

        const isValid = await bcrypt.compare(refreshToken, app.refreshToken)
        if (!isValid) {
            throw tokenIsInvalidError
        }

        const now = new Date()
        if (app.refreshTokenExpireAt < now) {
            throw tokenIsInvalidError
        }

        if (!app.user.isVerified) {
            throw new ForbiddenException(undefined, 'your email address is not verified, please verify your email.')
        }

        if (app.user.isSuspended) {
            throw new ForbiddenException(undefined, 'the target account has been suspended.')
        }

        const newClearRefreshToken = v4()
        const newHashedRefreshToken = await bcrypt.hash(newClearRefreshToken, 3)
        app.refreshToken = newHashedRefreshToken
        app.tokenRefreshedAt = now
        app.refreshTokenExpireAt = new Date(now.getTime() + this.refreshTokenExpire)
        this.trustedUserAppService.save(app)

        const jwtPayload: JWTPayload = {
            userId: app.user.id,
            name: app.user.displayName,
            roles: app.user.roles.map((ur) => ur.role),
            appId: app.id,
        }
        const jwt = await this.jwtService.sign(jwtPayload)

        return new UserToken(jwt, newClearRefreshToken)
    }

    @UseGuards(AuthGuard)
    @Query((returns) => [TrustedUserApp])
    async apps(@CurrentUser() { userId }: UserInfo): Promise<TrustedUserApp[]> {
        return await this.trustedUserAppService.findByUserIdWithClient(userId)
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => MutationStatus)
    async revoke(
        @CurrentUser() { appId }: UserInfo,
        @Args('appId', { nullable: true }) appIdFromArg?: string,
    ): Promise<MutationStatus> {
        // should revoke the current appId like logout action if the appIdFromArg is not provided
        const canDeleteIt = await this.trustedUserAppService.deleteById(appIdFromArg || appId)
        if (canDeleteIt) {
            return new MutationStatus(true, 'The application successfully has been revoked.')
        }
        return new MutationStatus(false, 'There is no application with this id!')
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => UserToken)
    async verifyEmailAddress(
        @CurrentClient() client: Client,
        @Args('data') { email, token }: VerifyEmailAddressInput,
    ): Promise<UserToken> {
        const tokenIsInvalidError = new BadRequestException(undefined, 'The token is invalid')

        const user = await this.userService.findByEmail(email, ['roles'])
        if (user && user.isVerified) {
            return await this.getNewUserToken(user, client)
        }
        if (!user || !user.actionTokens.verifyEmail) {
            throw tokenIsInvalidError
        }
        // check the token
        const actionToken = user.actionTokens.verifyEmail
        if (actionToken.token !== token) {
            throw tokenIsInvalidError
        }
        const now = new Date()
        if (actionToken.validUntil < now) {
            throw tokenIsInvalidError
        }
        // for saving user object should remove the roles as relation
        const tmpRoles = user.roles
        delete user.roles

        user.isVerified = true
        user.actionTokens.verifyEmail = undefined
        await this.userService.save(user)

        user.roles = tmpRoles
        return await this.getNewUserToken(user, client)
    }
}
