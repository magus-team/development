import { ConfigModule, ConfigService } from 'nestjs-config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'

import { Client, User, UserRole, TrustedUserApp } from '@magus/types'
@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) =>
                Object.assign(
                    {
                        type: 'postgres',
                        entities: [Client, User, UserRole, TrustedUserApp],
                        synchronize: true,
                    },
                    config.get('typeorm'),
                ),
            inject: [ConfigService],
        }),
    ],
})
export class TypeOrmModuleWithRoot {}
