import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IsAvailable')
export class IsAvailable {
    constructor(available: boolean, message: string) {
        this.available = available
        this.message = message
    }
    @Field()
    available: boolean

    @Field()
    message: string
}
