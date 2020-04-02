import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm'

import { TrustedUserApp } from './trustedUserApp'
import { UserRole } from './userRole'
import { ActionToken } from '../utils/actionToken'

@ObjectType('User')
@Entity('user')
export class User {
    @Field((type) => ID)
    @PrimaryColumn('uuid', { generated: 'uuid' })
    id: string

    @Field()
    @Column('text', { unique: true })
    email: string

    @Column()
    password: string

    @Field()
    @Column({ name: 'display_name', nullable: true })
    displayName?: string

    @Field()
    @Column({ type: 'timestamp', name: 'joined_at', default: new Date() })
    joinedAt?: Date

    @Field()
    @Column({ type: 'timestamp', name: 'updated_at', default: new Date() })
    updatedAt?: Date

    @Field({ nullable: true })
    @Column({ type: 'timestamp', name: 'suspended_at', nullable: true })
    suspendedAt?: Date

    @Field()
    @Column('boolean', { name: 'is_suspended', default: false })
    isSuspended?: boolean

    @Column('boolean', { name: 'is_verified', default: false })
    isVerified: boolean

    @Column('jsonb', { default: {} })
    actionTokens: {
        verifyEmail?: ActionToken
        resetPassword?: ActionToken
    }

    @Field(() => [UserRole], { nullable: true })
    @OneToMany(
        () => UserRole,
        (userRole) => userRole.user,
    )
    roles: UserRole[]

    @OneToMany(
        () => TrustedUserApp,
        (trustedUserApp) => trustedUserApp.user,
    )
    trustedUserApps: TrustedUserApp[]
}
