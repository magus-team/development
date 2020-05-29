import { ConfigModule, ConfigService } from 'nestjs-config'
import { Module, DynamicModule } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as path from 'path'

import { Client, User, UserRole, TrustedUserApp } from '@magus/types'
import { DEFAULT_TESTING_DATABASE_NAME } from 'common/constants'

const ENV = process.env.NODE_ENV
@Module({})
export class TypeOrmModuleWithRoot {
    static register(testingDatabaseName = DEFAULT_TESTING_DATABASE_NAME): DynamicModule {
        return {
            module: TypeOrmModuleWithRoot,
            imports: [
                ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
                TypeOrmModule.forRootAsync({
                    useFactory: (config: ConfigService) =>
                        ({
                            type: 'postgres',
                            host: config.get('pg.host'),
                            port: config.get('pg.port'),
                            username: config.get('pg.username'),
                            password: config.get('pg.password'),
                            database: ENV === 'test' ? testingDatabaseName : config.get('pg.database'),
                            entities: [Client, User, UserRole, TrustedUserApp],
                            synchronize: true,
                            logging: ENV !== 'test',
                            dropSchema: ENV === 'test',
                        } as TypeOrmModuleOptions),
                    inject: [ConfigService],
                }),
            ],
        }
    }
}
