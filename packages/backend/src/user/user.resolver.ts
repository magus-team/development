import { Resolver, Query } from '@nestjs/graphql'

import { User } from '@magus/types'

@Resolver()
export class UserResolver {
    @Query((returns) => User)
    async hello(): Promise<User> {
        // this is just for testing
        return new User('NEW_USER_ID', 'the name of user')
    }
}
