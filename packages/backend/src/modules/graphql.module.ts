import { ConfigService, ConfigModule } from 'nestjs-config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'
import * as path from 'path'

import { ClientModule } from 'modules/client/client.module'
import { UserModule } from 'modules/user/user.module'
@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        UserModule,
        ClientModule,
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
