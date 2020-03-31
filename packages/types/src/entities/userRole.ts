import { BaseEntity, Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
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

    @Column('timestamp', { name: 'granted_at', default: new Date() })
    grantedAt: Date

    @ManyToOne(
        () => User,
        (user) => user.roles,
    )
    @JoinColumn({ name: 'user_id' })
    user: User
}
