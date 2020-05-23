import { BaseEntity, Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'

import { User } from './user'

export enum RoleType {
    USER = 'user',
    ADMINISTRATOR = 'administrator',
}

registerEnumType(RoleType, {
    name: 'RoleType',
})

@ObjectType('UserRole')
@Entity('user_role')
export class UserRole extends BaseEntity {
    constructor(userId: string, role = RoleType.USER) {
        super()
        this.userId = userId
        this.role = role
    }
    @Field()
    @Column({ type: 'uuid', name: 'user_id', primary: true })
    userId: string

    @Field()
    @PrimaryColumn({ type: 'text', default: RoleType.USER })
    role: RoleType

    @CreateDateColumn({ name: 'granted_at', type: 'timestamptz' })
    grantedAt: Date

    @ManyToOne(
        () => User,
        (user) => user.roles,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'user_id' })
    user: User
}
