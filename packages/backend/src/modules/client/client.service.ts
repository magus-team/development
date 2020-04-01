import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

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

    async validateClient(clientId: string, clientKey?: string): Promise<Client | undefined> {
        const client = await this.clientRepository.findOne({ where: { id: clientId } })
        if (!client) {
            return undefined
        }
        // for non web client should check the clientKey
        if (!client.isWebApp) {
            if (!clientKey) {
                return undefined
            }
            const isValid = await bcrypt.compare(clientKey, client.key)
            if (!isValid) {
                return undefined
            }
        }
        return client
    }
}
