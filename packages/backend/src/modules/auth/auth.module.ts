import { ConfigModule, ConfigService } from 'nestjs-config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'

import { TrustedUserApp, User, Client } from '@magus/types'

import { AuthResolver } from './auth.resolver'
import { ClientService } from 'modules/client/client.service'
import { TrustedUserAppService } from './trustedUserApp.service'
import { UserService } from 'modules/user/user.service'

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        JwtModule.registerAsync({
            useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
                publicKey: config.get('jwt.publicKey'),
                privateKey: config.get('jwt.privateKey'),
                signOptions: { algorithm: 'RS256', expiresIn: `${config.get('jwt.tokenExpiresInMin')}m` },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Client, User, TrustedUserApp]),
    ],
    providers: [ClientService, UserService, TrustedUserAppService, AuthResolver],
})
export class AuthModule {}
