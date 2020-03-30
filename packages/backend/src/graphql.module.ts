import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import baseConfiguration from './config/base'
import { UserModule } from './user/user.module'

const config = baseConfiguration()

@Module({
    imports: [
        UserModule,
        GraphQLModule.forRoot({
            debug: config.debug,
            playground: config.enableGraphqlPlayground,
            autoSchemaFile: 'schema.gql',
        }),
    ],
})
export class GraphqlModuleWithRoot {}
