import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

import { PasswordInput } from './passwordInput'

@InputType()
export class LoginInput extends PasswordInput {
    @Field()
    @IsEmail()
    email: string
}
