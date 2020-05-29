import { ConfigModule } from 'nestjs-config'
import { Module, DynamicModule } from '@nestjs/common'
import * as path from 'path'

import { DEFAULT_TESTING_DATABASE_NAME } from 'common/constants'
import { GraphqlModuleWithRoot } from './graphql.module'
import { TypeOrmModuleWithRoot } from './typeorm.module'

@Module({})
export class AppModule {
    static register(testingDatabaseName = DEFAULT_TESTING_DATABASE_NAME): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
                GraphqlModuleWithRoot,
                TypeOrmModuleWithRoot.register(testingDatabaseName),
            ],
        }
    }
}
