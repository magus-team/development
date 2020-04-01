import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TrustedUserApp } from '@magus/types'

@Injectable()
export class TrustedUserAppService {
    constructor(
        @InjectRepository(TrustedUserApp)
        private trustedUserAppRepository: Repository<TrustedUserApp>,
    ) {}

    async create(app: TrustedUserApp): Promise<TrustedUserApp> {
        return await this.trustedUserAppRepository.save(app)
    }

    async findByIdWithUserRoles(id: string): Promise<TrustedUserApp> {
        return await this.trustedUserAppRepository.findOne({ where: { id }, relations: ['user', 'user.roles'] })
    }

    async save(app: TrustedUserApp) {
        return await app.save()
    }
}
