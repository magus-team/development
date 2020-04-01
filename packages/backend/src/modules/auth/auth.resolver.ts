import { InjectConfig } from 'nestjs-config'
import { JwtService } from '@nestjs/jwt'
import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
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
    RefreshTokenResultUnion,
} from '@magus/types'

import { ClientGuard } from 'common/guard/client.guard'
import { CurrentClient } from 'common/decorator/currentClient.decorator'
import { TrustedUserAppService } from './trustedUserApp.service'
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

    @UseGuards(ClientGuard)
    @Mutation((returns) => [LoginResultUnion])
    async login(
        @CurrentClient() client: Client,
        @Args('data') { email, password }: LoginInput,
    ): Promise<typeof LoginResultUnion[]> {
        const user = await this.userService.findByEmailWithRoles(email)
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

        return [new UserToken(jwt, clearRefreshToken)]
    }

    @UseGuards(ClientGuard)
    @Mutation((returns) => [RefreshTokenResultUnion])
    async refreshToken(
        @CurrentClient() client: Client,
        @Args('data') { appId, refreshToken }: RefreshTokenInput,
    ): Promise<typeof RefreshTokenResultUnion[]> {
        const tokenIsInvalidResult = [new MutationStatus(false, 'The token is invalid')]

        const app = await this.trustedUserAppService.findByIdWithUserRoles(appId)
        if (!app) {
            return tokenIsInvalidResult
        }

        const isValid = await bcrypt.compare(refreshToken, app.refreshToken)
        if (!isValid) {
            return tokenIsInvalidResult
        }

        const now = new Date()
        if (app.refreshTokenExpireAt < now) {
            return [new MutationStatus(false, 'The refresh token is expired')]
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

        return [new UserToken(jwt, newClearRefreshToken)]
    }
}
