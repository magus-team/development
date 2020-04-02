import { BaseEntity, JoinColumn, ManyToOne, Column, Entity, PrimaryColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Client } from './client'
import { User } from './user'

@ObjectType('TrustedUserApp')
@Entity('trusted_user_app')
export class TrustedUserApp extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn('uuid', { generated: 'uuid' })
    id: string

    @Column({ unique: true, name: 'refresh_token' })
    refreshToken: string

    @Field({ name: 'lastTimeAccess' })
    @Column({ type: 'timestamp', name: 'token_refreshed_at' })
    tokenRefreshedAt: Date

    @Column({ type: 'timestamp', name: 'refresh_token_expire_at' })
    refreshTokenExpireAt: Date

    @Field(() => Client)
    @ManyToOne(
        () => Client,
        (client) => client.trustedUserApps,
    )
    @JoinColumn({ name: 'client_id' })
    client: Client

    @ManyToOne(
        () => User,
        (user) => user.trustedUserApps,
    )
    @JoinColumn({ name: 'user_id' })
    user: User
}
