import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class RefreshTokenInput {
    @Field()
    appId: string

    @Field()
    refreshToken: string
}
