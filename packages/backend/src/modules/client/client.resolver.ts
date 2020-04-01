import { Configurable, ConfigParam } from 'nestjs-config'
import { Resolver, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

import { InitialClientResultUnion, Client, MutationStatus } from '@magus/types'

import { ClientService } from 'modules/client/client.service'
import { SystemGuard } from 'common/guard/system.guard'

@Resolver()
export class ClientResolver {
    constructor(private readonly clientService: ClientService) {}

    @UseGuards(SystemGuard)
    @Mutation((returns) => [InitialClientResultUnion])
    @Configurable()
    async initialPWAClient(
        @ConfigParam('pwa.PWAClientId') pwaClientId: string,
    ): Promise<typeof InitialClientResultUnion[]> {
        if (!(await this.clientService.haveAtLeastOneWebClient())) {
            const pwaClientKey = v4()
            const hashedPWAClientKey = await bcrypt.hash(pwaClientKey, 12)
            const pwaClient = new Client()
            pwaClient.id = pwaClientId
            pwaClient.key = hashedPWAClientKey
            pwaClient.isWebApp = true
            pwaClient.deviceType = 'web'
            await this.clientService.create(pwaClient)
            // show the clear client key to the initializer
            pwaClient.key = pwaClientKey
            return [pwaClient]
        }
        return [new MutationStatus(false, 'The system already have PWA client')]
    }
}
