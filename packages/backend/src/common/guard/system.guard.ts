import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { ConfigService } from 'nestjs-config'
import { GqlExecutionContext } from '@nestjs/graphql'

import { MagusRequest } from 'types/magusRequest'

@Injectable()
export class SystemGuard implements CanActivate {
    constructor(private readonly config: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context)
        const { req } = ctx.getContext<{ req: MagusRequest }>()
        const systemKeyHeader = (req.headers['system-key'] as string) || undefined
        return systemKeyHeader === this.config.get('management.systemKey')
    }
}
