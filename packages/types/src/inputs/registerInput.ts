import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

import { PasswordInput } from './passwordInput'

@InputType()
export class RegisterInput extends PasswordInput {
    @Field()
    @IsEmail()
    email: string
}
