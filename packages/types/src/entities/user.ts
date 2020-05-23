import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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
    @CreateDateColumn({ type: 'timestamptz', name: 'joined_at' })
    joinedAt?: Date

    @Field()
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt?: Date

    @Field({ nullable: true })
    @Column({ type: 'timestamptz', name: 'suspended_at', nullable: true })
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
        {
            onDelete: 'CASCADE',
        },
    )
    roles: UserRole[]

    @OneToMany(
        () => TrustedUserApp,
        (trustedUserApp) => trustedUserApp.user,
        {
            onDelete: 'CASCADE',
        },
    )
    trustedUserApps: TrustedUserApp[]
}
