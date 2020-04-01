import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IsUnverified {
    constructor(message: string) {
        this.message = message
        return this
    }

    __typename: 'IsUnverified'

    @Field()
    message: string
}
