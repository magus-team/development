import { BaseEntity, Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'

import { TrustedUserApp } from './trustedUserApp'

@ObjectType('Client')
@Entity('client')
export class Client extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn('uuid', { generated: 'uuid' })
    id: string

    @Field()
    @Column()
    key: string

    @Field()
    @Column({ name: 'is_web_app' })
    isWebApp: boolean

    @Field()
    @Column({ name: 'device_type' })
    deviceType: string

    @Field()
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date

    @Field()
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date

    @OneToMany(
        () => TrustedUserApp,
        (trustedUserApp) => trustedUserApp.client,
        {
            onDelete: 'CASCADE',
        },
    )
    trustedUserApps: TrustedUserApp[]
}
