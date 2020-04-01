import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRole, RoleType } from '@magus/types'

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {}

    async haveAtLeastOneUserWithAdministratorRole(): Promise<boolean> {
        return (await this.userRoleRepository.count({ where: { role: RoleType.ADMINISTRATOR } })) > 0
    }

    async create(userRole: UserRole): Promise<UserRole> {
        return this.userRoleRepository.save(userRole)
    }
}
