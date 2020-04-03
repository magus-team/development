import { InputType, Field } from '@nestjs/graphql'
import { IsUUID, IsEmail } from 'class-validator'

import { PasswordInput } from './passwordInput'

@InputType()
export class ResetPasswordInput extends PasswordInput {
    @Field()
    @IsEmail()
    email: string

    @Field()
    @IsUUID('4')
    token: string
}
