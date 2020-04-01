import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Client } from '@magus/types'

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
    ) {}

    async haveAtLeastOneWebClient(): Promise<boolean> {
        return (await this.clientRepository.count({ where: { isWebApp: true } })) > 0
    }

    async create(client: Client): Promise<Client> {
        return await this.clientRepository.save(client)
    }
}
