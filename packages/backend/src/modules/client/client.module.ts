import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Client } from '@magus/types'

import { ClientResolver } from './client.resolver'
import { ClientService } from './client.service'

@Module({
    imports: [TypeOrmModule.forFeature([Client])],
    providers: [ClientService, ClientResolver],
})
export class ClientModule {}
