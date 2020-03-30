import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('User')
export class User {
    constructor(id: string, name) {
        this.id = id;
        this.name = name;
    }
    @Field((type) => ID)
    id: string;

    @Field()
    name: string;
}
