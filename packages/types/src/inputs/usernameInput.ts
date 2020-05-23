import { InputType, Field } from '@nestjs/graphql'
import { Length, Matches } from 'class-validator'

@InputType('UsernameInput')
export class UsernameInput {
    @Field()
    @Length(4, 128)
    @Matches(/^[a-zA-Z0-9_]{4,128}$/)
    username: string
}
