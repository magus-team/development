import { Module } from '@nestjs/common'

import ConfigModule from './config'
import { GraphqlModuleWithRoot } from './graphql.module'

@Module({
    imports: [ConfigModule, GraphqlModuleWithRoot],
})
export class AppModule {}
