import { ConfigService } from 'nestjs-config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'

export const JWTWithConfig = JwtModule.registerAsync({
    useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
        publicKey: config.get('jwt.publicKey'),
        privateKey: config.get('jwt.privateKey'),
        signOptions: { algorithm: 'RS256', expiresIn: `${config.get('jwt.tokenExpiresInMin')}m` },
    }),
    inject: [ConfigService],
})
