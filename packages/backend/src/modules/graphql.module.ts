import { ConfigService } from 'nestjs-config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { ClientModule } from 'modules/client/client.module'
import { UserModule } from 'modules/user/user.module'
@Module({
    imports: [
        UserModule,
        ClientModule,
        AuthModule,
        GraphQLModule.forRootAsync({
            useFactory: (config: ConfigService) =>
                Object.assign(
                    {
                        autoSchemaFile: 'schema.gql',
                        context: ({ req }) => ({ req }),
                    },
                    config.get('graphql'),
                ),
            inject: [ConfigService],
        }),
    ],
})
export class GraphqlModuleWithRoot {}
