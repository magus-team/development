import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsUUID } from 'class-validator'

@InputType()
export class VerifyEmailAddressInput {
    @Field()
    @IsEmail()
    email: string

    @Field()
    @IsUUID('4')
    token: string
}
