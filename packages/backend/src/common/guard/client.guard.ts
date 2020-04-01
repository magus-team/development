import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { ClientService } from 'modules/client/client.service'
import { MagusRequest } from 'types/magusRequest'

@Injectable()
export class ClientGuard implements CanActivate {
    constructor(private readonly clientService: ClientService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const { req } = ctx.getContext<{ req: MagusRequest }>()
        const clientId = (req.headers['client-id'] as string) || undefined
        const clientKey = (req.headers['client-key'] as string) || undefined
        const client = await this.clientService.validateClient(clientId, clientKey)
        req.client = client
        return client !== undefined
    }
}
