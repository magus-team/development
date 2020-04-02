import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '@magus/types'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(user: User): Promise<User> {
        return await this.userRepository.save(user)
    }

    async findByEmail(email: string, relations?: string[]): Promise<User> {
        return await this.userRepository.findOne({ where: { email }, relations })
    }

    async doAlreadyHaveUserWithThisEmail(email: string): Promise<boolean> {
        return (await this.userRepository.count({ where: { email } })) === 1
    }

    async save(user: User) {
        await this.userRepository.save(user)
    }
}
