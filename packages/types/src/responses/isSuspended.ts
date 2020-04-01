import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IsSuspended {
    constructor(message: string, reason: string) {
        this.message = message
        this.reason = reason
        return this
    }

    __typename: 'IsSuspended'

    @Field()
    message: string

    @Field()
    reason: string
}
