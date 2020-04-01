import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserToken {
    constructor(jwt: string, refreshToken: string) {
        this.jwt = jwt
        this.refreshToken = refreshToken
        return this
    }

    __typename: 'UserToken'

    @Field()
    jwt: string

    @Field()
    refreshToken: string
}
